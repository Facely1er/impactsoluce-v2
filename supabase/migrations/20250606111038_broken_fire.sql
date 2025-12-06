/*
  # File Attachments Schema Refinement

  1. New Structure
    - Add `attachments` column to replace separate `files` and `evidence` columns
    - Migrate existing data to new structure
    - Add proper validation through triggers (not CHECK constraints with subqueries)

  2. Security
    - File type validation through triggers
    - File size limits through triggers
    - Proper indexing for performance

  3. Data Migration
    - Preserve existing file and evidence data
    - Maintain backward compatibility during transition
*/

-- Add new attachments column with proper structure
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'assessment_responses' AND column_name = 'attachments'
  ) THEN
    ALTER TABLE assessment_responses ADD COLUMN attachments jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Migrate existing data from files and evidence columns to attachments
UPDATE assessment_responses 
SET attachments = (
  SELECT jsonb_agg(
    CASE 
      WHEN jsonb_typeof(item) = 'string' THEN
        jsonb_build_object(
          'name', item,
          'type', 'application/octet-stream',
          'size', 0,
          'url', '',
          'uploadedAt', COALESCE(updated_at, created_at, now()),
          'description', 'Migrated file'
        )
      WHEN jsonb_typeof(item) = 'object' THEN
        item || jsonb_build_object(
          'uploadedAt', COALESCE(item->>'uploadedAt', updated_at::text, created_at::text, now()::text)
        )
      ELSE
        jsonb_build_object(
          'name', 'unknown',
          'type', 'application/octet-stream',
          'size', 0,
          'url', '',
          'uploadedAt', COALESCE(updated_at, created_at, now()),
          'description', 'Migrated item'
        )
    END
  )
  FROM (
    SELECT jsonb_array_elements(COALESCE(files, '[]'::jsonb) || COALESCE(evidence, '[]'::jsonb)) AS item
  ) AS combined_items
)
WHERE attachments = '[]'::jsonb 
AND (files IS NOT NULL OR evidence IS NOT NULL);

-- Add basic constraint to ensure attachments is always an array
ALTER TABLE assessment_responses 
ADD CONSTRAINT attachments_is_array 
CHECK (jsonb_typeof(attachments) = 'array');

-- Create index for better query performance on attachments
CREATE INDEX IF NOT EXISTS idx_assessment_responses_attachments_gin 
ON assessment_responses USING gin (attachments);

-- Function to validate individual file attachment
CREATE OR REPLACE FUNCTION validate_file_attachment(attachment jsonb)
RETURNS boolean AS $$
DECLARE
  file_size bigint;
  file_type text;
  file_name text;
BEGIN
  -- Check required fields exist
  IF NOT (attachment ? 'name' AND attachment ? 'type' AND attachment ? 'size') THEN
    RETURN false;
  END IF;
  
  -- Extract values
  file_size := (attachment->>'size')::bigint;
  file_type := attachment->>'type';
  file_name := attachment->>'name';
  
  -- Check file size (max 50MB = 52428800 bytes)
  IF file_size > 52428800 THEN
    RETURN false;
  END IF;
  
  -- Check file name length (max 255 characters)
  IF length(file_name) > 255 THEN
    RETURN false;
  END IF;
  
  -- Check for valid file types
  IF file_type IS NOT NULL AND file_type !~ '^(application/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)|image/(jpeg|jpg|png|gif|webp)|text/(plain|csv))$' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to validate all attachments in an array
CREATE OR REPLACE FUNCTION validate_attachments_array(attachments_array jsonb)
RETURNS boolean AS $$
DECLARE
  attachment jsonb;
  attachment_count integer;
BEGIN
  -- Check if it's an array
  IF jsonb_typeof(attachments_array) != 'array' THEN
    RETURN false;
  END IF;
  
  -- Check array size (max 10 attachments per response)
  attachment_count := jsonb_array_length(attachments_array);
  IF attachment_count > 10 THEN
    RETURN false;
  END IF;
  
  -- Validate each attachment
  FOR attachment IN SELECT jsonb_array_elements(attachments_array)
  LOOP
    IF NOT validate_file_attachment(attachment) THEN
      RETURN false;
    END IF;
  END LOOP;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to validate attachments before insert/update
CREATE OR REPLACE FUNCTION validate_attachments_trigger()
RETURNS trigger AS $$
BEGIN
  -- Skip validation if attachments is null or empty
  IF NEW.attachments IS NULL OR NEW.attachments = '[]'::jsonb THEN
    RETURN NEW;
  END IF;
  
  -- Validate the attachments array
  IF NOT validate_attachments_array(NEW.attachments) THEN
    RAISE EXCEPTION 'Invalid file attachments. Check file types, sizes (max 50MB), and count (max 10 files).';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS validate_attachments_before_insert ON assessment_responses;
DROP TRIGGER IF EXISTS validate_attachments_before_update ON assessment_responses;

-- Create triggers for validation
CREATE TRIGGER validate_attachments_before_insert
  BEFORE INSERT ON assessment_responses
  FOR EACH ROW
  EXECUTE FUNCTION validate_attachments_trigger();

CREATE TRIGGER validate_attachments_before_update
  BEFORE UPDATE ON assessment_responses
  FOR EACH ROW
  EXECUTE FUNCTION validate_attachments_trigger();

-- Update RLS policies to handle the new attachments column
DROP POLICY IF EXISTS "Users can create responses" ON assessment_responses;
DROP POLICY IF EXISTS "Users can read own responses" ON assessment_responses;
DROP POLICY IF EXISTS "Users can update own responses" ON assessment_responses;

CREATE POLICY "Users can create responses"
  ON assessment_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = assessment_responses.assessment_id
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read own responses"
  ON assessment_responses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = assessment_responses.assessment_id
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own responses"
  ON assessment_responses
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = assessment_responses.assessment_id
      AND assessments.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = assessment_responses.assessment_id
      AND assessments.user_id = auth.uid()
    )
  );

-- Add helpful comments for future reference
COMMENT ON COLUMN assessment_responses.attachments IS 'JSONB array of file attachments with metadata including name, type, size, url, uploadedAt, and description';
COMMENT ON FUNCTION validate_file_attachment(jsonb) IS 'Validates individual file attachment object for type, size, and name constraints';
COMMENT ON FUNCTION validate_attachments_array(jsonb) IS 'Validates array of file attachments including count limits';
COMMENT ON FUNCTION validate_attachments_trigger() IS 'Trigger function to validate attachments before insert/update operations';
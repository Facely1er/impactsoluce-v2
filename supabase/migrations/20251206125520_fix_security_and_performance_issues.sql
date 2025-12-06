/*
  # Fix Security and Performance Issues

  This migration addresses multiple security and performance issues identified by Supabase:

  ## 1. Performance Optimizations
  
  ### Missing Indexes on Foreign Keys
  - Add index on `assessment_responses.assessment_id` for improved join performance
  - Add index on `assessments.user_id` for improved user data queries
  
  ### Remove Unused Index
  - Drop `idx_assessment_responses_attachments_gin` which is not being utilized

  ## 2. RLS Policy Optimizations
  
  All RLS policies updated to use `(select auth.uid())` instead of `auth.uid()` to prevent
  re-evaluation for each row, significantly improving query performance at scale.
  
  ### Tables Updated:
  - `assessments`: 3 policies (read, create, update)
  - `assessment_responses`: 3 policies (read, create, update)
  - `users`: 2 policies (read, update)

  ## 3. Function Security Hardening
  
  All functions updated with explicit search_path to prevent search path manipulation attacks:
  - `validate_attachments_array`
  - `validate_attachments_trigger`
  - `update_updated_at_column`
  - `validate_file_attachment`

  ## 4. Notes
  
  - Leaked Password Protection: This must be enabled in Supabase Dashboard under
    Authentication > Settings > Enable "Leaked Password Protection"
*/

-- ============================================================================
-- 1. ADD MISSING INDEXES ON FOREIGN KEYS
-- ============================================================================

-- Index for assessment_responses.assessment_id foreign key
CREATE INDEX IF NOT EXISTS idx_assessment_responses_assessment_id 
ON assessment_responses(assessment_id);

-- Index for assessments.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_assessments_user_id 
ON assessments(user_id);

-- ============================================================================
-- 2. REMOVE UNUSED INDEX
-- ============================================================================

DROP INDEX IF EXISTS idx_assessment_responses_attachments_gin;

-- ============================================================================
-- 3. OPTIMIZE RLS POLICIES - ASSESSMENTS TABLE
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can create assessments" ON assessments;
DROP POLICY IF EXISTS "Users can update own assessments" ON assessments;

-- Recreate with optimized auth function calls
CREATE POLICY "Users can read own assessments"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create assessments"
  ON assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own assessments"
  ON assessments
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- 4. OPTIMIZE RLS POLICIES - ASSESSMENT_RESPONSES TABLE
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own responses" ON assessment_responses;
DROP POLICY IF EXISTS "Users can create responses" ON assessment_responses;
DROP POLICY IF EXISTS "Users can update own responses" ON assessment_responses;

-- Recreate with optimized auth function calls
CREATE POLICY "Users can read own responses"
  ON assessment_responses
  FOR SELECT
  TO authenticated
  USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can create responses"
  ON assessment_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update own responses"
  ON assessment_responses
  FOR UPDATE
  TO authenticated
  USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = (select auth.uid())
    )
  );

-- ============================================================================
-- 5. OPTIMIZE RLS POLICIES - USERS TABLE
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Recreate with optimized auth function calls
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- ============================================================================
-- 6. FIX FUNCTION SEARCH PATHS
-- ============================================================================

-- Drop and recreate validate_attachments_array with secure search_path
DROP FUNCTION IF EXISTS validate_attachments_array(jsonb);
CREATE OR REPLACE FUNCTION validate_attachments_array(attachments jsonb)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF attachments IS NULL THEN
    RETURN true;
  END IF;
  
  IF jsonb_typeof(attachments) != 'array' THEN
    RAISE EXCEPTION 'Attachments must be an array';
  END IF;
  
  RETURN true;
END;
$$;

-- Drop and recreate validate_attachments_trigger with secure search_path
DROP FUNCTION IF EXISTS validate_attachments_trigger() CASCADE;
CREATE OR REPLACE FUNCTION validate_attachments_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT validate_attachments_array(NEW.attachments) THEN
    RAISE EXCEPTION 'Invalid attachments format';
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate trigger if it exists
DROP TRIGGER IF EXISTS validate_attachments_before_insert ON assessment_responses;
CREATE TRIGGER validate_attachments_before_insert
  BEFORE INSERT OR UPDATE ON assessment_responses
  FOR EACH ROW
  EXECUTE FUNCTION validate_attachments_trigger();

-- Drop and recreate update_updated_at_column with secure search_path
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assessments_updated_at ON assessments;
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assessment_responses_updated_at ON assessment_responses;
CREATE TRIGGER update_assessment_responses_updated_at
  BEFORE UPDATE ON assessment_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Drop and recreate validate_file_attachment with secure search_path
DROP FUNCTION IF EXISTS validate_file_attachment(text, bigint);
CREATE OR REPLACE FUNCTION validate_file_attachment(file_name text, file_size bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  max_size bigint := 10485760; -- 10MB
  allowed_extensions text[] := ARRAY['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'];
  file_ext text;
BEGIN
  IF file_size > max_size THEN
    RAISE EXCEPTION 'File size exceeds maximum allowed size of 10MB';
  END IF;
  
  file_ext := lower(substring(file_name from '\.[^.]*$'));
  
  IF NOT (file_ext = ANY(allowed_extensions)) THEN
    RAISE EXCEPTION 'File type not allowed. Allowed types: %', array_to_string(allowed_extensions, ', ');
  END IF;
  
  RETURN true;
END;
$$;
/*
  # ESG Assessment Platform Schema

  1. Tables
    - assessments: Stores assessment metadata and overall scores
    - assessment_responses: Stores individual question responses and evidence
  
  2. Storage
    - assessment-files: Bucket for storing assessment evidence and attachments
  
  3. Security
    - Row Level Security (RLS) enabled on all tables
    - Storage policies for secure file management
*/

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  submission_date timestamptz,
  total_score integer,
  status text DEFAULT 'draft',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create assessment_responses table
CREATE TABLE IF NOT EXISTS assessment_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  value jsonb NOT NULL,
  files jsonb DEFAULT '[]',
  evidence jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for assessments table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assessments' AND policyname = 'Users can read own assessments'
  ) THEN
    CREATE POLICY "Users can read own assessments"
      ON assessments
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assessments' AND policyname = 'Users can create assessments'
  ) THEN
    CREATE POLICY "Users can create assessments"
      ON assessments
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assessments' AND policyname = 'Users can update own assessments'
  ) THEN
    CREATE POLICY "Users can update own assessments"
      ON assessments
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create policies for assessment_responses table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assessment_responses' AND policyname = 'Users can read own responses'
  ) THEN
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
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assessment_responses' AND policyname = 'Users can create responses'
  ) THEN
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
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assessment_responses' AND policyname = 'Users can update own responses'
  ) THEN
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
  END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_assessments_updated_at'
  ) THEN
    CREATE TRIGGER update_assessments_updated_at
      BEFORE UPDATE ON assessments
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_assessment_responses_updated_at'
  ) THEN
    CREATE TRIGGER update_assessment_responses_updated_at
      BEFORE UPDATE ON assessment_responses
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Set up storage bucket and policies
DO $$
BEGIN
  -- Create bucket if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'assessment-files'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('assessment-files', 'assessment-files', true);
  END IF;

  -- Set up storage policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Authenticated users can upload files'
  ) THEN
    CREATE POLICY "Authenticated users can upload files"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'assessment-files');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Authenticated users can update own files'
  ) THEN
    CREATE POLICY "Authenticated users can update own files"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'assessment-files' AND auth.uid() = owner);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Anyone can view public files'
  ) THEN
    CREATE POLICY "Anyone can view public files"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'assessment-files');
  END IF;
END $$;
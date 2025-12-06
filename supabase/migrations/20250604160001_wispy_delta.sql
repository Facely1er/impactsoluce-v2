/*
  # Storage Setup for Assessment Files

  1. Changes
    - Creates 'assessment-files' storage bucket if it doesn't exist
    - Sets up storage policies for file access and management
    
  2. Security
    - Enables authenticated users to upload files
    - Allows authenticated users to update their own files
    - Permits public access to view files
    
  3. Implementation Details
    - Uses DO blocks for idempotent creation
    - Checks for existing objects before creation
    - Handles policy creation safely
*/

DO $$
BEGIN
  -- Create bucket if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'assessment-files'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('assessment-files', 'assessment-files', true);
  END IF;
END $$;

-- Set up storage policies (these will fail gracefully if they already exist)
DO $$
BEGIN
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
END $$;

DO $$
BEGIN
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
END $$;

DO $$
BEGIN
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
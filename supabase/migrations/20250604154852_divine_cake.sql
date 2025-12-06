/*
  # Storage setup for assessment files
  
  1. Changes
    - Create assessment files bucket if it doesn't exist
    - Set up storage policies for authenticated users
    - Configure public access policies
  
  2. Security
    - Enable RLS policies for file access
    - Restrict file uploads to authenticated users
    - Allow public read access
*/

DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('assessment-files', 'assessment-files', true)
  ON CONFLICT (id) DO NOTHING;
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
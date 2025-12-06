-- Enable storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('assessment-files', 'assessment-files', true);

-- Set up storage policies
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'assessment-files');

CREATE POLICY "Authenticated users can update own files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'assessment-files' AND auth.uid() = owner);

CREATE POLICY "Anyone can view public files"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'assessment-files');
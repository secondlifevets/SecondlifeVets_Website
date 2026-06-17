-- 1. Add image_url to the pets table
ALTER TABLE public.pets
ADD COLUMN image_url TEXT;

-- 2. Create the Storage Bucket for pet images
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-images', 'pet-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Storage RLS Policies
-- Allow public access to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'pet-images' );

-- Allow authenticated users to upload images
CREATE POLICY "Users can upload their own pet images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pet-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own pet images
CREATE POLICY "Users can update their own pet images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pet-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own pet images
CREATE POLICY "Users can delete their own pet images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'pet-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

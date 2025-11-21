-- Storage Bucket Setup for CodeOfMemory
-- Run this in your Supabase SQL Editor after creating the bucket in the dashboard

-- Step 1: Create the storage bucket (if not already created)
-- Note: You can also create this via Supabase Dashboard → Storage → New bucket
-- Bucket name: memorial-images
-- Public: Yes (so images can be accessed via public URLs)

-- Step 2: Set up Storage RLS Policies

-- Helper function to extract folder name from path
-- Example: "kristian/Main images/hero.jpg" -> "kristian"
CREATE OR REPLACE FUNCTION get_memorial_folder_from_path(path TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(SPLIT_PART(path, '/', 1));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Helper function to normalize memorial name to folder format
-- Example: "Kristian Kostov" -> "kristian-kostov"
CREATE OR REPLACE FUNCTION normalize_memorial_name(name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(REGEXP_REPLACE(TRIM(name), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Drop existing policies if they exist (allows script to be run multiple times)
DROP POLICY IF EXISTS "Users can upload to their own memorial folders" ON storage.objects;
DROP POLICY IF EXISTS "Users can update files in their own memorial folders" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete files from their own memorial folders" ON storage.objects;
DROP POLICY IF EXISTS "Public can view memorial images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view files in their own memorial folders" ON storage.objects;

-- Policy: Allow authenticated users to upload files to memorial-images bucket
-- Note: The application logic controls which folders users can access based on memorial names
-- This allows uploads before the memorial is saved to the database
CREATE POLICY "Users can upload to their own memorial folders"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'memorial-images');

-- Policy: Allow authenticated users to update files in memorial-images bucket
-- Users can only update files in folders matching their memorial names (enforced by app logic)
CREATE POLICY "Users can update files in their own memorial folders"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'memorial-images');

-- Policy: Allow authenticated users to delete files from memorial-images bucket
-- Users can only delete files in folders matching their memorial names (enforced by app logic)
CREATE POLICY "Users can delete files from their own memorial folders"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'memorial-images');

-- Policy: Allow public read access to all files in memorial-images bucket
-- This allows the public URLs to work for displaying images
CREATE POLICY "Public can view memorial images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'memorial-images');

-- Policy: Allow authenticated users to view files in their own memorial folders
CREATE POLICY "Users can view files in their own memorial folders"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'memorial-images' AND
  (
    -- Users can view files in their own memorial folders
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.user_id = auth.uid()
      AND normalize_memorial_name(memorials.name) = get_memorial_folder_from_path(name)
    )
    OR
    -- Users can also view files from published memorials
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.status = 'published'
      AND normalize_memorial_name(memorials.name) = get_memorial_folder_from_path(name)
    )
  )
);


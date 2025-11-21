# Storage Bucket Setup Guide

This guide will help you set up the Supabase Storage bucket for memorial images.

## The Error You're Seeing

If you're getting this error:
```
StorageApiError: new row violates row-level security policy
```

It means the storage bucket either doesn't exist or doesn't have the correct RLS policies configured.

## Step 1: Create the Storage Bucket

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `memorial-images`
   - **Public bucket**: ✅ **Yes** (check this box - this allows public URLs to work)
   - **File size limit**: Leave default or set to your preference (e.g., 5MB)
   - **Allowed MIME types**: Leave empty (allows all image types) or specify: `image/*,video/*`
5. Click **Create bucket**

## Step 2: Set Up Storage RLS Policies

1. Go to **SQL Editor** in your Supabase dashboard
2. Open the file `supabase/storage-setup.sql` from this project
3. Copy and paste the entire SQL into the SQL Editor
4. Click **Run** to execute

This will create RLS policies that:
- Allow authenticated users to upload files to their own memorial folders
- Allow authenticated users to update/delete files in their own memorial folders
- Allow public read access to all files (so public URLs work)
- Allow authenticated users to view files from their own memorials and published memorials

## How It Works

The storage structure is organized like this:
```
memorial-images/
  └── {memorial-name}/
      ├── Main images/
      │   ├── hero-1234567890.jpg
      │   └── portrait-1234567890.jpg
      ├── Commented Images/
      ├── Main Videos/
      └── Commented Videos/
```

Example:
```
memorial-images/
  └── kristian/
      └── Main images/
          ├── hero-1763743593814.jpg
          └── portrait-1763743598364.jpg
```

The RLS policies verify that:
1. The user is authenticated
2. The user owns a memorial with a name matching the folder name
3. The folder name is derived from the memorial name (lowercased, spaces replaced with hyphens)

## Troubleshooting

### "Bucket not found" error
- Make sure you created the bucket with the exact name: `memorial-images`
- Check that the bucket is visible in Storage → Buckets

### "new row violates row-level security policy" error
- Make sure you ran the `storage-setup.sql` script
- Verify the policies exist: Go to Storage → Policies → `memorial-images`
- Check that you're logged in (authenticated) when trying to upload

### "Permission denied" error
- Verify the bucket is set to **Public**
- Check that your user owns a memorial with a matching name
- Make sure the memorial name matches the folder structure (lowercase, hyphens instead of spaces)

### Files upload but URLs don't work
- Ensure the bucket is set to **Public**
- Check that the "Public can view memorial images" policy is active

## Testing

After setup, try uploading an image:
1. Go to the memorial creation page
2. Enter a memorial name (e.g., "Kristian Kostov")
3. Upload a hero image or portrait
4. The upload should succeed and you should see the image preview

If it still fails, check the browser console for detailed error messages.


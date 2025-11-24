-- Remove theme columns from memorials table
-- Run this in your Supabase SQL Editor if you previously added the theme columns

ALTER TABLE public.memorials 
DROP COLUMN IF EXISTS theme_primary,
DROP COLUMN IF EXISTS theme_accent,
DROP COLUMN IF EXISTS theme_background;


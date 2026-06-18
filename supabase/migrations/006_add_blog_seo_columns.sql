-- Migration: Add SEO Meta Tag Columns to Blogs Table
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS seo_title text;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS seo_description text;

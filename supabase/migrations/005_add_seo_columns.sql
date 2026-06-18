-- Migration: Add SEO Meta Tag Columns to Properties Table
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS seo_title text;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS seo_description text;

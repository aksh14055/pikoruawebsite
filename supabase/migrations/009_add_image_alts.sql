-- Migration: Add image_alts column to properties table
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS image_alts JSONB DEFAULT '{}'::jsonb;

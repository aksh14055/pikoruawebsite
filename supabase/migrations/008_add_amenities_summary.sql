-- Migration: Add Amenities Summary Column to Properties Table
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS amenities_summary text;

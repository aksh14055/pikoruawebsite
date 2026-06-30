-- Migration: Create general_faqs table and enable Row Level Security
CREATE TABLE IF NOT EXISTS public.general_faqs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question       TEXT NOT NULL,
  answer         TEXT NOT NULL,
  display_order  INTEGER NOT NULL DEFAULT 0,
  category       TEXT NOT NULL DEFAULT 'general',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.general_faqs ENABLE ROW LEVEL SECURITY;

-- Public read access policy
DROP POLICY IF EXISTS "Allow public read access to general_faqs" ON public.general_faqs;
CREATE POLICY "Allow public read access to general_faqs" ON public.general_faqs FOR SELECT USING (true);

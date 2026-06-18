-- Migration: Fix compute_is_hot trigger null violation
-- Run this in your Supabase SQL Editor to fix lead submissions.

create or replace function public.compute_is_hot()
returns trigger language plpgsql as $$
begin
  new.is_hot := (
    new.budget_band is not null and new.budget_band in ('5-10cr','10cr-plus')
    and new.timeline is not null and new.timeline in ('immediately','1-3months')
    and new.phone is not null
    and new.phone != ''
  );
  return new;
end;
$$;

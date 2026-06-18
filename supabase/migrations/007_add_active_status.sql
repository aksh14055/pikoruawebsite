-- Migration: Add is_active column to properties and blogs for activation/deactivation options.

-- Add is_active to public.properties
alter table public.properties add column if not exists is_active boolean not null default true;

-- Add is_active to public.blogs
alter table public.blogs add column if not exists is_active boolean not null default true;

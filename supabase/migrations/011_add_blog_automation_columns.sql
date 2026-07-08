-- Migration: Add automated blog drafting support to blogs table.
-- 'source' distinguishes admin-authored posts from AI-drafted ones.
-- 'pending_review' gates AI drafts out of the admin's normal Active/Inactive
-- list until approved; approval flips it to false and is_active to true.
-- 'source_url' is the originating news article, used to dedupe future runs.

alter table public.blogs add column if not exists source text not null default 'manual';
alter table public.blogs add column if not exists pending_review boolean not null default false;
alter table public.blogs add column if not exists source_url text;

create index if not exists blogs_source_url_idx on public.blogs (source_url);

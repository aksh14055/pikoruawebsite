-- Migration: Blogs Content Table & Policies

-- ─── blogs ─────────────────────────────────────────────────────────────────
create table if not exists public.blogs (
  id                     text primary key,
  slug                   text not null unique,
  title                  text not null,
  category               text not null,
  category_label         text not null,
  published_at           text not null,
  read_time              text not null,
  excerpt                text not null,
  cover_image            text not null,
  author_name            text not null default 'Jitendra',
  author_role            text not null default 'PIKORUA Realty',
  author_avatar          text not null default '/images/founder.jpg',
  is_featured            boolean not null default false,
  content                text[] not null default '{}',
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- ─── Row Level Security ────────────────────────────────────────────────────
alter table public.blogs enable row level security;

-- Read policies: public read is allowed.
drop policy if exists "Allow public read access to blogs" on public.blogs;
create policy "Allow public read access to blogs" on public.blogs for select using (true);

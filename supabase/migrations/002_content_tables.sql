-- Migration: Content Tables, Storage, and RLS policies for Properties, Testimonials, Locations, Categories, Site Settings, Pages, and Storage Media.

-- ─── 1. Content Tables ──────────────────────────────────────────────────────

-- properties
create table if not exists public.properties (
  id                     text primary key,
  slug                   text not null unique,
  name                   text not null,
  category               text not null check (category in ('apartment', 'penthouse', 'duplex', 'villa', 'bungalow', 'plot', 'commercial', 'investment', 'residential-investment')),
  location               text not null check (location in ('iskon-ambli', 'sindhu-bhavan', 'thaltej', 'shilaj', 'vaishno-devi', 'sg-highway', 'other')),
  location_label         text not null,
  configuration          text not null,
  size_range             text not null,
  status                 text not null check (status in ('ready-to-move', 'near-possession', 'under-construction', 'pre-launch')),
  cover_image            text not null,
  images                 text[] not null default '{}',
  is_featured            boolean not null default false,
  price                  text,
  price_on_request       boolean not null default false,
  description            text[] not null default '{}',
  highlights             text[] not null default '{}',
  built_up_area          text,
  plot_area              text,
  floor                  text,
  suitable_for           text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- testimonials
create table if not exists public.testimonials (
  id                     uuid primary key default gen_random_uuid(),
  client_name            text not null,
  quote                  text not null,
  context                text not null,
  source                 text not null default 'google' check (source in ('google', 'direct')),
  rating                 integer check (rating >= 1 and rating <= 5),
  is_featured            boolean not null default false,
  is_published           boolean not null default true,
  review_url             text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- locations
create table if not exists public.locations (
  slug                   text primary key,
  name                   text not null,
  corridor_description   text[] not null default '{}',
  hero_image             text,
  coordinates            jsonb,
  is_active              boolean not null default true,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- categories
create table if not exists public.categories (
  slug                   text primary key,
  name                   text not null,
  description            text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- site_settings
create table if not exists public.site_settings (
  id                     text primary key default 'default',
  email                  text,
  phone                  text,
  whatsapp_number        text,
  whatsapp_default_message text,
  address                text,
  response_time_copy     text,
  social_links           jsonb default '{}',
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- pages
create table if not exists public.pages (
  id                     text primary key, -- 'home', 'about', 'contact'
  title                  text not null,
  content                jsonb not null default '{}',
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- ─── 2. Row Level Security & Policies ───────────────────────────────────────

alter table public.properties enable row level security;
alter table public.testimonials enable row level security;
alter table public.locations enable row level security;
alter table public.categories enable row level security;
alter table public.site_settings enable row level security;
alter table public.pages enable row level security;

-- Public read access policies for all tables
drop policy if exists "Allow public read access to properties" on public.properties;
create policy "Allow public read access to properties" on public.properties for select using (true);

drop policy if exists "Allow public read access to testimonials" on public.testimonials;
create policy "Allow public read access to testimonials" on public.testimonials for select using (true);

drop policy if exists "Allow public read access to locations" on public.locations;
create policy "Allow public read access to locations" on public.locations for select using (true);

drop policy if exists "Allow public read access to categories" on public.categories;
create policy "Allow public read access to categories" on public.categories for select using (true);

drop policy if exists "Allow public read access to site_settings" on public.site_settings;
create policy "Allow public read access to site_settings" on public.site_settings for select using (true);

drop policy if exists "Allow public read access to pages" on public.pages;
create policy "Allow public read access to pages" on public.pages for select using (true);



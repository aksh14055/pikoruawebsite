-- PIKORUA Realty — Initial Supabase Schema
-- Run this in the Supabase SQL editor or via supabase db push

-- ─── leads ────────────────────────────────────────────────────────────────

create table public.leads (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  source                 text not null check (source in ('discovery','enquiry','callback','consultation','whatsapp','contact')),
  name                   text not null,
  phone                  text not null,
  whatsapp               text,
  email                  text,
  category               text check (category in ('apartment','penthouse','villa','bungalow','plot','residential-investment')),
  location               text check (location in ('iskon-ambli','sindhu-bhavan','thaltej','shilaj','vaishno-devi','sg-highway','other')),
  budget_band            text check (budget_band in ('1-2cr','3-5cr','5-10cr','10cr-plus','custom')),
  purpose                text check (purpose in ('self-use','investment','nri-purchase','selling','exploring')),
  timeline               text check (timeline in ('immediately','1-3months','3-6months','exploring')),
  preferred_callback_time text,
  property_ref           text,
  message                text,
  status                 text not null default 'new' check (status in ('new','contacted','qualified','won','lost')),
  is_hot                 boolean not null default false,
  crm_synced             boolean not null default false,
  utm                    jsonb,
  consent                boolean not null default false
);

-- is_hot: budget >= 5Cr AND timeline immediate/1-3months AND phone present
create or replace function public.compute_is_hot()
returns trigger language plpgsql as $$
begin
  new.is_hot := (
    new.budget_band in ('5-10cr','10cr-plus')
    and new.timeline in ('immediately','1-3months')
    and new.phone is not null
    and new.phone != ''
  );
  return new;
end;
$$;

create trigger set_is_hot
  before insert or update on public.leads
  for each row execute function public.compute_is_hot();

-- ─── consultation_bookings ─────────────────────────────────────────────────

create table public.consultation_bookings (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  lead_id           uuid references public.leads(id) on delete cascade,
  preferred_date    text,
  preferred_time    text,
  purpose           text check (purpose in ('buy','sell','invest','nri','explore')),
  notes             text,
  status            text not null default 'pending' check (status in ('pending','confirmed','cancelled'))
);

-- ─── property_enquiries ────────────────────────────────────────────────────

create table public.property_enquiries (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  lead_id       uuid references public.leads(id) on delete cascade,
  property_ref  text not null,
  message       text
);

-- ─── lead_events (audit trail) ────────────────────────────────────────────

create table public.lead_events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  lead_id     uuid references public.leads(id) on delete cascade,
  type        text not null check (type in ('created','contacted','note','crm_synced','status_changed')),
  payload     jsonb
);

-- ─── Row Level Security ────────────────────────────────────────────────────
-- The public anon key must never be able to read lead data.
-- Only the service role key (server-side only) can access these tables.

alter table public.leads enable row level security;
alter table public.consultation_bookings enable row level security;
alter table public.property_enquiries enable row level security;
alter table public.lead_events enable row level security;

-- No SELECT/INSERT/UPDATE/DELETE policies for anon role — deny all public access.
-- Service role bypasses RLS by default in Supabase.

-- ─── Indexes ──────────────────────────────────────────────────────────────

create index idx_leads_status on public.leads(status);
create index idx_leads_is_hot on public.leads(is_hot) where is_hot = true;
create index idx_leads_source on public.leads(source);
create index idx_leads_created_at on public.leads(created_at desc);
create index idx_lead_events_lead_id on public.lead_events(lead_id);

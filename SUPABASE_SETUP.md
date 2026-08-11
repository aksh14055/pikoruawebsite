# Supabase Setup Guide

## Account Migration (August 2026)

The project has been migrated to a new Supabase account. This document outlines the setup process for the new account.

### New Supabase Project
- **Project URL**: `https://rwtueiruyktjzvsgdcoh.supabase.co`
- **Status**: Database tables created via migrations

### Local Environment Setup

Create `.env.local` in the project root with the following Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rwtueiruyktjzvsgdcoh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

**Important**: 
- `.env.local` is in `.gitignore` — never commit credentials to GitHub
- The anon key is public-safe (RLS blocks lead reads)
- The service role key is **server-only** — never expose to client

### Database Migrations

Run all 12 migrations in Supabase SQL Editor (in order):

1. **001_initial_schema.sql** — Leads table, events audit trail, consultation bookings
2. **002_content_tables.sql** — Properties, testimonials, locations, categories, site settings
3. **003_blogs_table.sql** — Blog content table
4. **004_fix_trigger.sql** — Fix is_hot trigger for null safety
5. **005_add_seo_columns.sql** — SEO meta fields for properties/blogs
6. **006_add_blog_seo_columns.sql** — Blog-specific SEO fields
7. **007_add_active_status.sql** — is_active flag for soft-delete capability
8. **008_add_amenities_summary.sql** — Amenities array for properties
9. **009_add_image_alts.sql** — Alt text support for accessibility
10. **010_create_general_faqs.sql** — FAQ table for content
11. **011_add_blog_automation_columns.sql** — Blog scheduling/automation fields
12. **012_align_lead_budget_bands.sql** — Final budget band alignment

See the complete migration guide at: (artifact link)

### Row Level Security (RLS)

- **leads**, **lead_events**, **consultation_bookings**, **property_enquiries** → Public reads DENIED (service role only)
- **properties**, **testimonials**, **locations**, **categories**, **pages**, **site_settings**, **blogs**, **faqs** → Public reads ALLOWED
- Service role key bypasses all RLS automatically

### API Routes Using Supabase

- `POST /api/leads` — Lead submissions (writes to `leads` + `lead_events`)
- `GET /api/leads` — Not implemented (use Sanity for content)
- `POST /api/cron/auto-blog` — Automated blog creation
- `/app/admin/actions.ts` — Admin panel (About page singleton)

### Testing

After migrations are complete:

```bash
npm run dev
```

Test lead submission:
1. Fill out any form on the site
2. Verify lead is saved in Supabase (`leads` table)
3. Verify emails are sent:
   - Team notification to `connect@pikorua.in` (via Brevo)
   - Lead notification to `luxuryrealestateahmedabad@gmail.com` (via Brevo)

### Troubleshooting

**Error: "Could not save your enquiry"**
- Migrations not run yet — check Supabase SQL Editor for table creation
- Wrong Supabase credentials in `.env.local` — verify URL and keys

**Email not sending**
- `BREVO_API_KEY` missing — set in `.env.local`
- `TEAM_NOTIFICATION_EMAIL` not configured — should be in Vercel/production env

**401 Unauthorized**
- Wrong service role key — verify in Supabase Settings > API
- Key was regenerated — update `.env.local`

### Production Deployment (Vercel)

Set these environment variables in Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BREVO_API_KEY`
- `TEAM_NOTIFICATION_EMAIL`
- (all other existing vars)

**Never** expose the service role key to the client bundle.

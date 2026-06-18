# PIKORUA Realty — Website

Private luxury real estate advisory website for Ahmedabad. Built with Next.js, Supabase, and Sanity CMS.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| CMS | Sanity (blog & content) |
| Media / Videos | Supabase Storage |
| Deployment | Vercel |
| Language | TypeScript |

---

## Local Development

### Prerequisites
- Node.js 20+
- pnpm

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment variables
cp .env.local.example .env.local
# Fill in the actual values (Supabase URL, keys, etc.)

# 3. Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

See [`.env.local.example`](.env.local.example) for the full list. Key variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `BREVO_API_KEY` | Email notifications (Brevo/Sendinblue) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp FAB phone number |
| `NEXT_PUBLIC_SITE_LIVE` | `true` = full site, `false` = holding page |

---

## Media & Assets

All videos are hosted on **Supabase Storage** (`media` bucket) and referenced via [`src/lib/media.ts`](src/lib/media.ts).

```
Supabase Storage → media bucket
  └── videos/
        ├── hero.mp4          (hero background, 4.5 MB)
        ├── hero2.mp4         (hero variant, 10.7 MB)
        ├── bg.mp4            (section background, 21 MB)
        ├── bg_1.mp4          (section background, 47 MB)
        └── hero-poster.jpg   (poster frame)
```

To add/replace a video, upload it to the `media` bucket in your [Supabase dashboard](https://supabase.com/dashboard) under Storage → media → videos/, then update the filename reference in `media.ts`.

---

## Admin Panel

### Accessing the Admin

Once deployed, the admin console is at:

```
https://pikorua.in/admin
```

**Login credentials** are set via `.env.local`:
```
ADMIN_EMAIL=pikoruarealtymarketing@gmail.com
ADMIN_PASSWORD=@PIKORUA REALTY 21
```

> ⚠️ Change the password before going to production.

---

### Admin Tabs

#### 📥 Leads
All enquiries submitted via any form on the site (hero form, property enquiry, contact page, popup) land here.

- **View** — click any row to see full lead details (budget, location preference, timeline, UTM source, etc.)
- **Update status** — mark leads as `new`, `contacted`, `qualified`, `closed`, or `lost`
- **Hot lead flag** — toggle the 🔥 flag to prioritise urgent leads
- **Export CSV** — downloads all leads as a spreadsheet for offline use or CRM import

#### 🏢 Properties
Manage the property listings that appear on the Properties and Home pages.

- **Add property** — fill in name, slug, category (apartment / bungalow / commercial / plot), location, configuration, size range, price or "Price on Request", cover image, gallery, description paragraphs, and highlights
- **Upload images** — click the upload button next to cover or any gallery slot; images go directly to Supabase Storage
- **Toggle active** — inactive properties are hidden from the public site without being deleted
- **Featured flag** — featured properties appear in the "Featured Residences" section on the home page
- **SEO fields** — set a custom meta title and description per property

#### 💬 Testimonials
Client reviews shown on the home page and the Testimonials page.

- **Add / Edit** — client name, quote, context (e.g. "2 BHK Buyer, Sindhu Bhavan Road"), source (Google / direct / referral), rating (1–5 stars)
- **Featured flag** — featured testimonials appear in the home page carousel
- **Published toggle** — unpublish without deleting

#### 📝 Blog Posts
Articles displayed on the `/blog` page and individual post pages.

- **Add / Edit** — title, slug (auto-generated from title), category (Market Report / Private Advisory / NRI Insights / Corridor Spotlight), publish date, read time, cover image, author details, and rich content
- **Content format** — write in plain paragraphs separated by a blank line; use `**bold**` and `*italic*` for formatting
- **Excerpt** — auto-generated from the first 155 characters of the content
- **SEO fields** — custom title and description per post
- **Featured flag** — appears highlighted on the blog listing page

#### 🏠 Home Page
Edit the content of the home page hero without touching code.

- **Hero headline** — the 3 lines of text displayed over the background video
- **Hero subheadline** — the supporting sentence below
- **Positioning statement** — the brand statement shown in the positioning section
- **Stats strip** — the 4 numbers shown in the trust strip (e.g. "11+ Years of Trust")
- **Virtual tours** — add/remove YouTube video IDs and their labels shown in the Virtual Tours grid

#### 👤 About Page
Edit the About page content.

- **Hero title and description**
- **Founder quote, name, role, and story** — multi-paragraph story separated by blank lines
- **Principles** — the 3 core values shown in the advisory pillars section (label + body text)
- **Founder avatar** — upload a photo via the upload button

#### 🔍 SEO Settings
Set global meta title and description for each main page (Home, Properties, About, Testimonials, Contact).

---

## Deployment (Vercel)

1. Push to `main` on GitHub — Vercel auto-deploys
2. Set all environment variables in **Vercel → Project → Settings → Environment Variables**
3. Set `NEXT_PUBLIC_SITE_LIVE=true` in production env vars to enable the full site

```bash
# Manual production build check
pnpm build
```

---

## Database (Supabase)

Migrations are in [`supabase/migrations/`](supabase/migrations/). To apply them to a new Supabase project:

```bash
# Install Supabase CLI
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

---

## Key Files

| File | Purpose |
|---|---|
| [`src/lib/media.ts`](src/lib/media.ts) | All video/image CDN URLs |
| [`src/lib/data/properties.ts`](src/lib/data/properties.ts) | Property data (pulled from Supabase) |
| [`src/app/admin/page.tsx`](src/app/admin/page.tsx) | Admin login gate |
| [`src/app/admin/AdminDashboard.tsx`](src/app/admin/AdminDashboard.tsx) | Full admin UI |
| [`src/app/admin/actions.ts`](src/app/admin/actions.ts) | Server actions for all admin operations |
| [`src/app/api/leads/route.ts`](src/app/api/leads/route.ts) | Lead submission API endpoint |

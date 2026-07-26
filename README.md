# 🏰 PIKORUA Realty — Web Application & Advisory Platform

> Private luxury real estate advisory website for Ahmedabad. Built with Next.js 16 (App Router), Supabase (PostgreSQL), Sanity CMS, and Tailwind CSS v4.

---

## 📋 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Project Directory Structure](#-project-directory-structure)
- [Quick Start & Local Setup](#-quick-start--local-setup)
- [Environment Variables Guide](#-environment-variables-guide)
- [Database Setup & Seeding](#-database-setup--seeding)
- [Admin Console Guide](#-admin-console-guide)
- [Sanity CMS Integration](#-sanity-cms-integration)
- [AI Surface & GEO (Generative Engine Optimization)](#-ai-surface--geo-generative-engine-optimization)
- [Lead Processing & CRM Pipeline](#-lead-processing--crm-pipeline)
- [Media & Asset Management](#-media--asset-management)
- [Available npm Scripts](#-available-npm-scripts)
- [Deployment Guide](#-deployment-guide)
- [Design System & Engineering Guidelines](#-design-system--engineering-guidelines)

---

## 🌟 Overview & Architecture

PIKORUA Realty is a high-end luxury real estate web platform providing private client advisory, curated residential property listings, and strategic real estate market insights in Ahmedabad.

The project follows a hybrid architecture combining:
1. **Supabase (PostgreSQL)** for transactional data (leads, properties, testimonials, admin configurations, and media storage).
2. **Sanity CMS** for structured content, editorial blog posts, market reports, and singletons.
3. **Generative Engine Optimization (GEO)** with structured AI endpoints (`llms.txt`, `facts.json`, AI answer blocks) for AI agent discoverability.
4. **Custom Admin Panel (`/admin`)** allowing administrators to manage leads, properties, testimonials, content, and SEO metadata without writing code.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) | Server Components, Route Handlers, Server Actions |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict type checking and shared interface definitions |
| **UI & Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) | Theme-driven design system with smooth micro-animations |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) | Lead pipeline, property catalog, RLS security, and transactional state |
| **CMS** | [Sanity v3](https://www.sanity.io/) | Editorial blogs, market insights, and structured content management |
| **Storage** | Supabase Storage (`media` bucket) | High-definition property videos, hero clips, and gallery imagery |
| **Validation** | [Zod](https://zod.dev/) | End-to-end schema validation for lead submissions & forms |
| **Email** | [Resend](https://resend.com/) & [Brevo](https://www.brevo.com/) | Real-time lead alerts & customer notification emails |
| **Analytics** | Google Tag Manager, GA4, Microsoft Clarity | Client-side event tracking and user interaction heatmaps |
| **Deployment** | [Vercel](https://vercel.com/) | ISR revalidation, edge networking, and global deployment |

---

## 🔥 Key Features

- **Luxury-First Aesthetics**: Dark luxury theme featuring curated HSL gold accents (`#C8A45D`), glassmorphism, and responsive hero video integration.
- **Custom Admin Console (`/admin`)**: Password-protected dashboard to manage leads, hot lead tagging, property catalog, testimonials, and site content.
- **Lead Pipeline**: Multi-step discovery wizard and inquiry forms equipped with Zod validation, honeypot spam traps, rate-limiting, instant lead notification, and CRM sync.
- **Sanity Embedded Studio (`/studio`)**: Built-in content studio for blogging, market reports, and content revalidation via webhooks.
- **GEO / AI Agent Ready**: Exposes `/llms.txt`, `/llms-full.txt`, and `/ai/facts.json` for AI engines (ChatGPT, Claude, Gemini, Perplexity) to digest project data.
- **Programmatic Landing Pages**: Dynamic routing for location spotlights (`/locations/[slug]`), property types (`/property-types/[slug]`), NRI buyer guides (`/nri/[slug]`), and combination pages (`/p/[...combo]`).
- **Interactive Property Comparison**: Client-side property comparison matrix (`/compare`) allowing buyers to evaluate configurations, amenities, and price points.
- **Dynamic Site State (`NEXT_PUBLIC_SITE_LIVE`)**: Built-in holding page feature to keep the platform in teaser mode or switch live on demand.

---

## 📁 Project Directory Structure

```
pikoruawebsite/
├── .agents/                    # Agent instructions & skills
├── docs/                       # Project specifications & PRD documents
├── public/                     # Static assets (favicons, verification files)
├── scripts/                    # Utility, seed & validation scripts
│   ├── count-db.ts             # Verifies Supabase table row counts
│   ├── seed-sanity.ts          # Populates Sanity CMS initial datasets
│   ├── seed-supabase.ts        # Populates Supabase database tables
│   ├── upload-images.ts        # Helper script for Supabase media upload
│   └── validate-ai-surfaces.ts # Validates AI endpoints & JSON structures
├── src/
│   ├── app/                    # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── [slug]/             # Dynamic CMS pages
│   │   ├── about/              # Brand story & founder principles
│   │   ├── admin/              # Custom Admin Dashboard & authentication
│   │   ├── ai/                 # GEO & AI facts endpoints
│   │   ├── api/                # API Routes (leads submission, revalidation)
│   │   ├── blog/               # Blog index & post views
│   │   ├── compare/            # Property comparison tool
│   │   ├── contact/            # Advisory contact form
│   │   ├── locations/          # Corridor & location landing pages
│   │   ├── nri/                # NRI advisory pages
│   │   ├── p/[...combo]/       # Dynamic combo matrix generator
│   │   ├── properties/         # Property listings & filter views
│   │   ├── property-types/     # Property type landing pages
│   │   ├── studio/             # Embedded Sanity Studio
│   │   ├── testimonials/       # Client reviews & testimonials
│   │   ├── layout.tsx          # Root layout & global metadata
│   │   └── page.tsx            # Home page / Holding page logic
│   ├── components/             # Reusable UI components
│   │   ├── discovery/          # Guided discovery quiz flow
│   │   ├── home/               # Home page hero, grids, & sliders
│   │   ├── layout/             # Header, Footer, WhatsApp FAB
│   │   ├── property/           # Property Cards, Grids, & Detail view
│   │   └── ui/                 # Primitive UI buttons, dialogs, inputs
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Core utilities & database clients
│   │   ├── ai/                 # AI answer block generators & blog automation
│   │   ├── data/               # Static dataset definitions & GROQ helpers
│   │   ├── sanity/             # Sanity client & image URL builders
│   │   ├── supabase/           # Supabase server & public client wrappers
│   │   ├── validations/        # Zod validation schemas
│   │   ├── env.ts              # Strict Environment Variable parser
│   │   ├── media.ts            # Supabase Storage media CDN URLs
│   │   └── utils.ts            # Formatting helpers & empty-state guard
│   ├── sanity/                 # Sanity schema definitions & config
│   └── types/                  # TypeScript interface definitions
├── supabase/
│   └── migrations/             # PostgreSQL migrations (tables, RLS rules)
├── .env.local.example          # Environment variables template
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies & scripts
├── sanity.config.ts            # Sanity Studio setup
└── tsconfig.json               # TypeScript configuration
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v20.0.0` or higher
- **Package Manager**: `npm`, `pnpm` (recommended), or `bun`
- **Supabase Account**: For database & storage
- **Sanity Account**: For CMS content management

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/aksh14055/pikoruawebsite.git
   cd pikoruawebsite
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure Environment Variables**
   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Supabase credentials, Sanity project ID, email keys, and admin credentials in `.env.local`.

4. **Seed Database & Content (Optional for new setups)**
   ```bash
   # Seed Supabase tables with initial data
   npx tsx scripts/seed-supabase.ts

   # Seed Sanity CMS initial datasets
   npm run seed
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **View the Application**
   Open your browser and navigate to:
   - **Main Website**: [http://localhost:3000](http://localhost:3000)
   - **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
   - **Sanity Studio**: [http://localhost:3000/studio](http://localhost:3000/studio)

---

## 🔑 Environment Variables Guide

Here is a breakdown of all variables supported in `.env.local`:

| Category | Variable | Type | Description |
|---|---|---|---|
| **Sanity CMS** | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public | Your Sanity Project ID |
| | `NEXT_PUBLIC_SANITY_DATASET` | Public | Sanity dataset (e.g. `production`) |
| | `SANITY_API_READ_TOKEN` | Server | Read token for fetching drafts server-side |
| | `SANITY_WEBHOOK_SECRET` | Server | Webhook secret for ISR instant revalidation |
| **Supabase** | `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase Project API URL |
| | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase Anon Key (safe for client, RLS protected) |
| | `SUPABASE_SERVICE_ROLE_KEY` | Server | Service Role Key (bypasses RLS, **server-only**) |
| **Admin Console** | `ADMIN_EMAIL` | Server | Email address used to access `/admin` |
| | `ADMIN_PASSWORD` | Server | Password used to access `/admin` |
| **Email & CRM** | `RESEND_API_KEY` | Server | Resend API key for transaction notifications |
| | `RESEND_FROM_EMAIL` | Server | Verified sender address (e.g. `noreply@pikorua.in`) |
| | `TEAM_NOTIFICATION_EMAIL` | Server | Target inbox for new lead notifications |
| | `BREVO_API_KEY` | Server | Brevo API key for transactional mailing |
| **WhatsApp** | `NEXT_PUBLIC_WHATSAPP_NUMBER` | Public | WhatsApp phone number with country code (e.g., `916354359222`) |
| | `NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE` | Public | Default message text pre-filled in WhatsApp chat |
| **Site Config** | `NEXT_PUBLIC_SITE_URL` | Public | Canonical web URL (e.g. `https://www.pikorua.in`) |
| | `NEXT_PUBLIC_SITE_LIVE` | Public | `true` = Display full platform; `false` = Display holding page |

---

## 💾 Database Setup & Seeding

### 1. Supabase PostgreSQL Setup
Database schema SQL migrations are located in `supabase/migrations/`:
- `001_initial_schema.sql` — Core tables (`leads`, `properties`, `testimonials`, `pages`) & RLS rules.
- `002_content_tables.sql` – `011_add_blog_automation_columns.sql` — Schema enhancements & SEO extensions.

To apply migrations manually via Supabase CLI:
```bash
npx supabase link --project-ref <your-supabase-project-ref>
npx supabase db push
```

To run automated seeding:
```bash
npx tsx scripts/seed-supabase.ts
```

To check current record count:
```bash
npx tsx scripts/count-db.ts
```

---

## 🎛️ Admin Console Guide

Access the Admin Dashboard at:
```
http://localhost:3000/admin  (Local)
https://pikorua.in/admin      (Production)
```

### Authentication
Login credentials are read directly from your server environment variables (`ADMIN_EMAIL` and `ADMIN_PASSWORD`).

### Admin Capabilities

1. **📥 Lead Management**
   - View all incoming inquiries from forms across the site.
   - Filter leads by status: `new`, `contacted`, `qualified`, `closed`, `lost`.
   - Toggle **Hot Lead Flag (🔥)** to highlight high-priority buyer requests.
   - Export lead database to **CSV** format.

2. **🏢 Property Catalog**
   - Add/edit properties (title, category, location, configuration, price/on-request, description, highlights).
   - Direct image & gallery upload to Supabase Storage.
   - Toggle **Active Status** (hide without deleting) and **Featured Flag** (showcase on home page).
   - Customize property-level SEO meta titles and descriptions.

3. **💬 Testimonials**
   - Manage client feedback, star ratings (1–5), location tag, and source (Google, Direct, Referral).
   - Control featured carousel display on the homepage.

4. **🏠 Home & About Content Management**
   - Update hero headlines, brand positioning statements, and key metrics.
   - Manage YouTube virtual tours embed IDs.
   - Edit founder quote, principles, and team story.

5. **🔍 Global SEO Settings**
   - Configure global meta descriptions and titles for primary site sections.

---

## 📰 Sanity CMS Integration

Sanity manages rich blog posts, editorial articles, and structured market reports.

- **Access Studio**: Navigate to `/studio` in your browser.
- **Sanity Queries**: All GROQ queries live in [`src/lib/sanity/queries.ts`](src/lib/sanity/queries.ts).
- **ISR Webhook Revalidation**: Publishing content in Sanity automatically triggers `/api/revalidate?secret=<SANITY_WEBHOOK_SECRET>`, invalidating outdated cache tags instantly without requiring site redeploys.

---

## 🤖 AI Surface & GEO (Generative Engine Optimization)

This project features built-in support for AI Engine Crawlers (ChatGPT, Claude, Gemini, Perplexity) to understand PIKORUA Realty's business parameters:

- `/llms.txt` — Standard machine-readable AI system prompt & overview.
- `/llms-full.txt` — Complete contextual digest of services, locations, and properties.
- `/ai/facts.json` — Structured JSON endpoint detailing key company metrics, advisory scope, and location highlights.

### Validating AI Surfaces
Run the automated AI surface test suite to ensure structural integrity:
```bash
npm run validate:ai
```

---

## 📧 Lead Processing & CRM Pipeline

```
User Form Submission
       │
       ▼
POST /api/leads
       │
       ├── 1. Zod Schema Validation (src/lib/validations/lead.ts)
       ├── 2. Honeypot Anti-Spam Check
       ├── 3. In-Memory / IP Rate Limiter (src/lib/rate-limit.ts)
       ├── 4. Insert into Supabase 'leads' Table (Service Role Key)
       ├── 5. Send Team Email Notification (Resend / Brevo)
       └── 6. Optional CRM Push (Zoho CRM / HubSpot API)
       │
       ▼
Redirect to /thank-you?source=<X>&purpose=<Y>
```

---

## 🖼️ Media & Asset Management

All video backgrounds and high-resolution property imagery are hosted on **Supabase Storage** (`media` bucket).

Asset references are stored central in [`src/lib/media.ts`](src/lib/media.ts):

```
Supabase Storage -> media bucket
  └── videos/
        ├── hero.mp4          # Main homepage background video
        ├── hero2.mp4         # Alternate hero video
        ├── bg.mp4            # Section background video
        └── hero-poster.jpg   # Fallback poster frame
```

To update media assets, upload the file to Supabase Storage and update the URL string in [`src/lib/media.ts`](src/lib/media.ts).

---

## 📜 Available npm Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Starts local Next.js development server with Turbopack |
| `npm run build` | Builds optimized production bundle |
| `npm run start` | Starts Next.js production server |
| `npm run lint` | Runs ESLint check across codebase |
| `npm run lint:ai` | Validates AI surface-related routes & source files |
| `npm run typecheck` | Runs TypeScript compiler (`tsc --noEmit`) to verify types |
| `npm run validate:ai` | Executes script `scripts/validate-ai-surfaces.ts` |
| `npm run seed` | Runs Sanity CMS seeding script `scripts/seed-sanity.ts` |
| `npm run check` | Runs full verification suite (`validate:ai` + `lint:ai` + `typecheck`) |
| `npm run check:deploy` | Complete deployment pre-check (`check` + `build`) |

---

## 🚀 Deployment Guide

### Deploying to Vercel

1. Push your code repository to **GitHub**.
2. Connect your repository to **Vercel**.
3. In your Vercel Project Dashboard, navigate to **Settings ➔ Environment Variables** and add all variables listed in [.env.local.example](.env.local.example).
4. Set `NEXT_PUBLIC_SITE_LIVE=true` in production to activate the live website.
5. Deploy! Vercel will automatically handle Next.js App Router optimization, image optimization, and ISR revalidation.

---

## 🎨 Design System & Engineering Guidelines

### 1. Strict Brand Color Palette
Design tokens are registered in [`src/app/globals.css`](src/app/globals.css) via `@theme`. **Never hardcode hex values in components.**

| Token | Class Name | Hex | Usage |
|---|---|---|---|
| Lux Black | `bg-lux-black` | `#0B0B0B` | Primary surface background |
| Soft Black | `bg-soft-black` | `#151515` | Secondary card background |
| Ivory | `bg-ivory` / `text-ivory` | `#F7F3EA` | Light section surfaces & text |
| Champagne Gold | `text-champagne-gold` | `#C8A45D` | Primary accent color |
| Antique Gold | `text-antique-gold` | `#9B7A36` | Subtle gold text/borders |
| Muted Gold | `border-muted-gold` | `#D8C28A` | Hairline dividers |

> ⚠️ **Gold Discipline Rule**: Champagne Gold must occupy **≤ 5%** of any visible viewport. Use gold exclusively for hairlines, badges, active underlines, icon strokes, and outline buttons.

### 2. Architecture Constraints (PRD)
- **Residential-First Focus**: Core business is luxury residential. `office` and `showroom` are selective commercial-advisory categories. Do not add further commercial types without explicit product approval.
- **Five Main Navigation Pages**: Home, Properties, About, Testimonials, Contact. Keep the main navigation menu focused and premium.
- **Empty-State Guard**: Always wrap property & testimonial listings in `renderListGuard()` from [`src/lib/utils.ts`](src/lib/utils.ts). Never display a generic "No properties found" empty text.

---

## 📄 License & Ownership

© **PIKORUA Realty**. All rights reserved. Private and proprietary software.

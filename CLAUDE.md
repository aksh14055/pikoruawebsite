# PIKORUA Realty — Project Architecture

## Stack
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 — tokens defined in `src/app/globals.css` via `@theme`, never hardcode hex values
- **CMS**: Sanity v3 — Studio at `/studio`, schemas in `src/sanity/schemas/`
- **Database**: Supabase (Postgres) — leads + transactional data, plus the About page singleton (`pages` table, id `"about"`, managed via the custom `/admin` panel — `src/app/admin/actions.ts`). All other content lives in Sanity.
- **Hosting**: Vercel — ISR revalidated via Sanity webhook at `/api/revalidate`
- **Email**: Resend
- **Validation**: Zod v4 — shared schemas in `src/lib/validations/lead.ts` used on both client and server

## Two non-negotiable constraints (from PRD)
1. **Residential only** — `ResidentialCategory` type in `src/types/index.ts` is the single source of truth. Never add commercial types (office, showroom, retail). The union is closed.
2. **Five main pages only** — Home, Properties, About, Testimonials, Contact. No sixth nav item ever.

## Key patterns

### Empty-state guard
Use `renderListGuard()` from `src/lib/utils.ts` whenever rendering a list of properties or testimonials. This makes it structurally impossible to render an empty grid — the fallback must be an `EmptyStateRedirect` component. Never render "No Properties Found."

### Lead pipeline
All form submissions → `POST /api/leads` → Zod validate → honeypot check → rate limit → Supabase write → team email (Resend) → CRM push (Zoho/HubSpot) → client redirected to `/thank-you?source=X&purpose=Y`.

### ISR revalidation
Sanity publishes content → POST to `/api/revalidate?secret=<SANITY_WEBHOOK_SECRET>` → `revalidateTag()` for the relevant data type. Queries in `src/lib/sanity/queries.ts` use `{ next: { tags: [...] } }` to opt into this.

### Sanity queries
All in `src/lib/sanity/queries.ts`. Always filter `isPublished == true`. Never fetch unpublished documents on the public site.

### Images
Always use `next/image` with explicit `width` + `height` to avoid CLS. Use `sanityImageProps()` from `src/lib/sanity/image.ts` to get `src`, `blurDataURL`, and `placeholder="blur"`.

### Environment variables
- Public vars (`NEXT_PUBLIC_*`): accessed via `env` export from `src/lib/env.ts`
- Server-only vars: accessed via `getServerEnv()` from `src/lib/env.ts` — only call inside Route Handlers, Server Actions, or Server Components
- `SUPABASE_SERVICE_ROLE_KEY` is **never** exposed to the client. Supabase RLS denies all public access to the `leads` table.

### Supabase client
- `createServerSupabaseClient()` — server-side, uses service role key, bypasses RLS. Use in API routes only.
- `supabasePublic` — anon key, for any future public reads (CMS content is in Sanity, not Supabase).

## Folder structure
```
src/
  app/                    # Next.js App Router pages and API routes
    api/
      leads/route.ts      # Lead submission handler
      revalidate/route.ts # Sanity ISR webhook
    studio/[[...tool]]/   # Sanity Studio
    thank-you/            # Post-submission confirmation
    not-found.tsx         # Custom 404
    globals.css           # Design tokens + base styles
    layout.tsx            # Root layout with fonts and metadata
    page.tsx              # Home page (placeholder → full build in Phase 4)
  components/
    ui/                   # Primitive components (Button, Input, etc.)
    layout/               # Header, Footer, WhatsAppFAB
    property/             # PropertyCard, PropertyGrid, PropertyDetailDrawer
    discovery/            # GuidedDiscovery multi-step flow
  lib/
    env.ts                # Env var validation
    utils.ts              # cn, formatPrice, buildWhatsAppUrl, renderListGuard
    rate-limit.ts         # In-memory rate limiter (upgrade to Upstash for scale)
    sanity/
      client.ts           # Sanity client + draft client
      queries.ts          # All GROQ queries
      image.ts            # imageUrlFor + sanityImageProps helpers
    supabase/
      client.ts           # Server + public Supabase clients
    validations/
      lead.ts             # Zod schemas for all 5 form types
  sanity/
    schemas/              # Sanity schema definitions
    schemaTypes/index.ts  # Schema registry
  types/
    index.ts              # All shared TypeScript types
supabase/
  migrations/
    001_initial_schema.sql  # Run in Supabase SQL editor to create tables
```

## Commands
```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint
npx tsc --noEmit # Type check only
```

## Sanity Studio
Access at `/studio` in development and production. Singletons (homePage, aboutPage, contactPage, siteSettings) cannot be deleted or duplicated — enforced in `sanity.config.ts`.

## Design tokens (never hardcode these)
| Token | Tailwind class | Hex |
|---|---|---|
| Lux Black | `bg-lux-black` | `#0B0B0B` |
| Soft Black | `bg-soft-black` | `#151515` |
| White | `text-white` | `#FFFFFF` |
| Ivory | `bg-ivory` | `#F7F3EA` |
| Champagne Gold | `text-champagne-gold` | `#C8A45D` |
| Antique Gold | `text-antique-gold` | `#9B7A36` |
| Muted Gold | `border-muted-gold` | `#D8C28A` |

Gold discipline: gold occupies ≤ ~5% of any viewport. Use only for hairlines, labels, active underlines, icon strokes, and outline buttons — never large fills.

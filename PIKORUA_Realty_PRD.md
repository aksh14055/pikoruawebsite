# PIKORUA Realty — Website Rebuild
## Product Requirements Document (PRD)

**Document version:** 1.0
**Prepared for:** PIKORUA Realty (Founder: Jitendra)
**Product:** pikorua.in — full rebuild
**Positioning line:** *“A private gateway to Ahmedabad’s finest luxury residences.”*
**Scope discipline:** Luxury **residential** advisory only. No commercial. Five main pages only.
**Audience for this document:** Founder, Product, Brand/UX, Frontend, Backend.

> **Two non-negotiable constraints govern this entire document:**
> 1. **Residential only.** PIKORUA deals exclusively in luxury *residential* real estate — apartments, penthouses, villas, bungalows, premium plots, and residential investment property. No offices, showrooms, retail, warehouses, or Grade-A commercial anywhere.
> 2. **Five main pages only.** The public navigation stays at Home, Properties, About, Testimonials, Contact. Every additional idea (NRI advisory, seller representation, developer trust, location expertise, investment guidance) lives as a *section inside one of these five pages* — never as a new page. “Get In Touch” remains a CTA, not a page.

---

## 1. Executive Summary

PIKORUA Realty is a founder-led, trust-first luxury residential advisory based in Ahmedabad, serving HNIs, NRIs, investors, celebrities, and high-value property owners. The current website (a single-page anchor-scroll build) undermines that positioning: it shows broken zero-counters, a prominent “No Properties Found” empty state, commercial categories (“Office”, “Showroom”) inside its intake popup, loud double-exclamation hero copy, and a generic filter bar instead of a curated discovery experience.

This PRD specifies a complete rebuild that reads as a **private, cinematic, advisory-first platform** rather than a listing portal. The experience borrows *principles* — not visuals — from Porsche (luxury restraint, cinematic product cards, strong hierarchy, minimal copy, premium micro-interactions) and Lodha (premium storytelling, location-led discovery, conversion-focused enquiry flow), and translates them into PIKORUA’s black / ivory / restrained-gold identity.

The centerpiece is a **Guided Discovery flow** — a six-step, configurator-style intake that replaces the basic filter and ends with the CTA *“Receive Curated Residential Options.”* Around it sits a CMS-backed residential catalogue, founder-led trust storytelling, real social proof (Google Reviews), and a CRM-ready lead pipeline with WhatsApp, callback, and private-consultation paths.

The build target is **Next.js + TypeScript + Tailwind CSS**, content managed in **Sanity**, leads stored in **Supabase (Postgres)** and pushed to a CRM, hosted on **Vercel**, with GA4/GTM and Meta Pixel instrumentation. The result must load fast, behave flawlessly on mobile, never display empty or fake data, and feel discreet rather than loud.

---

## 2. Product Vision

To build the most trusted digital front door to Ahmedabad’s luxury residential market — a quiet, confident space where discerning buyers, sellers, NRIs, and investors feel personally advised, not marketed to.

The website is not a catalogue to browse; it is the **beginning of a private relationship**. Every screen should imply: *fewer, better, curated, discreet.* Success is measured less in traffic and more in the quality of conversations it starts.

**Guiding product beliefs**
- Curation over volume. Three perfect residences beat three hundred listings.
- Trust is the product. The site sells the advisor, then the property.
- Restraint signals luxury. White space, slow motion, and silence do the heavy lifting.
- Never show emptiness or fakery. No “0” counters, no “No Properties Found,” ever.
- Mobile is the primary surface. Most HNI/NRI enquiries arrive on a phone.

---

## 3. Brand Positioning

**Core positioning statement**
> “A private gateway to Ahmedabad’s finest luxury residences.”

**What PIKORUA is**
- A private, founder-led luxury **residential** advisory.
- A curator of a small, handpicked collection — not a mass listing portal.
- A relationship built on trust, discretion, and refined taste.
- A specialist in Ahmedabad’s premium residential corridors, with selective reach to Mumbai and Dubai for existing relationships.

**What PIKORUA is not**
- Not a broker spamming inventory.
- Not a commercial real-estate firm (no offices/retail/showrooms).
- Not a loud, gold-drenched, “world-class luxury” cliché.

**Brand essence (the Māori *Pikorua* / double-twist):** endless trust, lasting relationships, and the journey of growth — two strands intertwined. This idea should quietly inform the visual language (the twist motif, infinity, intertwined paths) without becoming a heavy-handed logo gimmick.

**Brand personality:** Premium · Minimal · Private · Elegant · High-trust · Modern luxury · Founder-led · Advisory-first · Cinematic but not flashy.

---

## 4. Target Audience

| Segment | Who they are | What they want from the site | Primary journey |
|---|---|---|---|
| **HNI buyers** | Affluent Ahmedabad families & professionals seeking a primary or upgrade home | Discreet curation, refined options, a trusted advisor | Guided Discovery → consultation |
| **NRIs** | Indian-origin buyers abroad (US, UK, Gulf, etc.) buying remotely | Trust, remote support, virtual tours, time-zone-aware callbacks | NRI advisory section → WhatsApp/callback |
| **Investors** | Buyers seeking residential capital appreciation / yield | Location intelligence, appreciation context, residential-investment options | Discovery (Purpose = Investment) → consultation |
| **Sellers / owners** | Owners of premium residences wanting discreet representation | Confidential valuation & representation, qualified buyers | Seller representation section → enquiry |
| **Developers** | Premium residential developers seeking a trusted sales partner | Credibility, reach to HNI/NRI demand, professionalism | About → developer trust section → contact |
| **Celebrities / VIPs** | High-privacy clients | Absolute discretion, off-market access, no public exposure | Private consultation → off-record |

**Cross-cutting traits:** time-poor, privacy-sensitive, mobile-first, skeptical of hype, persuaded by trust signals (founder reputation, Google Reviews, refined presentation) rather than discounts or urgency tactics.

---

## 5. Business Goals

1. **Generate qualified residential leads** — quality over quantity; every lead pre-segmented by intent, budget, location, timeline.
2. **Establish premium brand perception** — the site itself becomes a trust asset Jitendra can share with VIP prospects.
3. **Increase consultation bookings & WhatsApp conversations** — move visitors into a private, human conversation quickly.
4. **Position PIKORUA as the Ahmedabad luxury-residential authority** — own the prime corridors (Iskon-Ambli, Sindhu Bhavan, Thaltej, Shilaj, Vaishno Devi, SG Highway).
5. **Build a clean, CRM-ready pipeline** — structured lead data the team can act on within minutes.
6. **Support all relationship types** — buyer, seller, NRI, investor, and developer journeys without page sprawl.

---

## 6. User Goals

- Quickly understand *who PIKORUA is* and *why they are trustworthy*.
- Express what they’re looking for **without filling a long form upfront** — guided, low-friction, configurator-style.
- See a *curated, credible* set of residences — never an empty grid.
- Reach a human fast (WhatsApp, callback, consultation) on their terms.
- Feel their privacy is respected (no spam, discreet handling, price-on-request where appropriate).
- Get a great experience on mobile, even on slower NRI connections.

---

## 7. Problems With the Current Website

Observed directly from the live site (pikorua.in):

1. **Fake / broken counters.** The stats block renders “**0** Years of Trust / **0** Select Properties Curated / **0** Presence in Cities / **0** Happy Clients.” This actively destroys trust — the single worst issue on the page.
2. **Prominent empty state.** A large **“No Properties Found — Try adjusting your filters”** block sits in the primary content area. A luxury advisory must never show emptiness where its inventory should be.
3. **Commercial categories present.** The intake popup offers **“Office”** and **“Showroom”** — a direct violation of the residential-only mandate.
4. **Loud, off-brand hero copy.** “TRUST WHAT / MOST LUXURY BUYERS / HAVE TRUSTED**!!**” is grammatically awkward and shouts. Luxury whispers.
5. **Generic portal mechanics.** A standard filter bar (All / Location / Properties / Size / Relevance) frames PIKORUA as a listings portal, not a curator.
6. **Overclaiming copy.** Footer promises “premium properties **worldwide**” while the business is Ahmedabad-led — erodes credibility.
7. **Empty “Explore Our Properties / virtual tour” section** with no apparent content behind it.
8. **No structured lead qualification.** The popup captures only category + budget; no intent, timeline, or contact-preference segmentation; no clear CRM pipeline.
9. **Single-page anchor build with weak SEO surface.** Limited unique metadata, structured data, or per-topic content depth.
10. **No discernible performance/accessibility discipline** (heavy background video without an evident optimization/fallback strategy; no visible focus states or reduced-motion handling).
11. **Inconsistent narrative** between “Ahmedabad, Mumbai, Dubai” and the actual Ahmedabad focus, with no clear hierarchy of where PIKORUA truly operates.

---

## 8. Proposed Solution

A complete rebuild that keeps the **five-page** structure but replaces portal mechanics with a **curated advisory experience**:

- **Cinematic, restrained Home** that sells trust and the founder, introduces residential categories, and funnels into Guided Discovery.
- **Guided Discovery (6-step configurator)** as the primary engagement engine, ending in *“Receive Curated Residential Options.”*
- **Properties page** as a curated collection with location-led discovery and a **detail drawer/modal** (and optional non-nav dynamic detail routes for SEO) — never a generic infinite grid, never an empty state.
- **About** that foregrounds Jitendra, the Pikorua meaning, advisory philosophy, seller representation, and developer trust.
- **Testimonials** anchored to real Google Reviews (no fabricated numbers).
- **Contact** as a multi-path conversion hub: private consultation, callback, WhatsApp, NRI advisory, and a qualified enquiry form.
- **Embedded specialist sections** (NRI advisory, seller representation, location expertise, investment guidance, developer trust) distributed across the five pages.
- **Strict anti-patterns enforced**: no fake counters, no empty grids, no commercial categories, no loud copy, no gold overload.
- **CMS-backed content + CRM-ready leads + full analytics instrumentation.**

---

## 9. Website Information Architecture (IA)

**Public surface — exactly five main pages:**

```
PIKORUA Realty
│
├── 1. Home (/)
│     ├─ Hero (cinematic)
│     ├─ Positioning statement
│     ├─ Residential category cards
│     ├─ Guided Discovery entry
│     ├─ Featured Residences
│     ├─ Location expertise (Ahmedabad corridors)
│     ├─ Advisory pillars (Buyer / Seller / NRI / Investor)
│     ├─ NRI advisory section
│     ├─ Seller representation section
│     ├─ Founder-led trust (About teaser)
│     ├─ Testimonials teaser (Google Reviews proof)
│     └─ Final CTA band (Consultation / WhatsApp / Callback)
│
├── 2. Properties (/properties)
│     ├─ Intro + curated philosophy
│     ├─ Location-led discovery (corridor entry points)
│     ├─ Guided Discovery entry (repeat)
│     ├─ Curated collection grid (real cards only)
│     ├─ Property Detail Drawer/Modal (overlay, not a main page)
│     └─ [optional] /properties/[slug] detail routes — NOT in nav (SEO only)
│
├── 3. About (/about)
│     ├─ Founder story (Jitendra)
│     ├─ Pikorua meaning & philosophy
│     ├─ Advisory approach & discretion
│     ├─ Seller representation
│     ├─ Developer trust / partnerships
│     └─ Reach: Ahmedabad (primary), selective Mumbai & Dubai
│
├── 4. Testimonials (/testimonials)
│     ├─ Featured client voices (real)
│     ├─ Google Reviews integration / link
│     └─ Trust proof (logos/associations if real)
│
└── 5. Contact (/contact)
      ├─ Private consultation booking
      ├─ Callback request
      ├─ WhatsApp CTA
      ├─ NRI advisory (time-zone aware)
      ├─ Qualified enquiry form
      └─ Office location & details
```

**Persistent UI (all pages):** sticky header with logo + nav + “Get In Touch” button; floating WhatsApp button; Guided Discovery accessible from a persistent CTA; footer.

**Non-nav routes that do NOT count as “main pages”:** `/properties/[slug]` (optional SEO detail pages), `/privacy`, `/terms`, `/thank-you`, plus the headless CMS studio at `/studio`. These are utility/SEO/legal surfaces, intentionally excluded from primary navigation.

---

## 10. Main Navigation Structure

**Header (sticky, transparent over hero → solid `#0B0B0B` on scroll):**

```
[ PIKORUA logo ]        Home   Properties   About   Testimonials   Contact        [ Get In Touch ]
```

- **Logo** (left): ivory/gold wordmark; links to Home.
- **Nav items** (center/right): Home · Properties · About · Testimonials · Contact. Active item carries a thin champagne-gold underline; hover reveals the underline with a 200ms ease.
- **“Get In Touch”** (far right): primary CTA button — opens the Contact options sheet / scrolls to Contact / triggers consultation. It is a **CTA, never a route**.
- **Mobile:** logo + hamburger. Drawer slides from the right with the five items stacked, “Get In Touch” pinned at the bottom, and a WhatsApp shortcut.
- **Floating WhatsApp button:** bottom-right on all pages (respects safe-area on mobile), labeled “Speak on WhatsApp” on hover/tap.
- **Persistent Discovery entry:** a subtle “Begin Curated Discovery” affordance reachable from Home and Properties (and the mobile drawer).

**Footer:** brand line (honest — Ahmedabad-led, selective Mumbai/Dubai), contact info (connect@pikorua.in, +91 6354 359 222, Iskon-Ambli address), quick links (the same five), real social links (FB/IG/LinkedIn/YouTube), Privacy/Terms, copyright. **No “worldwide” overclaim.**

---

## 11. Detailed Page-by-Page Requirements (overview)

The five pages are specified in detail in sections 12–16. Shared rules:

- Every page has unique `<title>`, meta description, canonical, and Open Graph image.
- Every page renders **only real, populated content**. If a CMS section has no data, the section is hidden — never shown empty.
- Every page offers at least one path to a human (WhatsApp, callback, or consultation) within one scroll.
- Section reveals use subtle scroll-triggered fade/slide (respecting `prefers-reduced-motion`).
- Gold is an accent only (dividers, underlines, small labels, button borders) — never large fills.

---

## 12. Homepage Requirements

**Goal:** In one cinematic scroll, establish trust, communicate “private curated residential advisory,” introduce categories, and funnel into Guided Discovery or a human conversation.

### Suggested homepage section order
1. **Hero** — full-viewport, cinematic still or optimized muted-loop video of an Ahmedabad luxury residence at golden hour. Restrained headline, one-line subhead, single primary CTA, and a subtle scroll cue. No double exclamations.
2. **Positioning statement** — the brand promise, large and quiet, on ivory or soft-black.
3. **Residential category cards** — Apartments · Penthouses · Villas · Bungalows · Premium Plots · Residential Investment. Porsche-style product cards.
4. **Guided Discovery entry** — an invitation panel: “Tell us what you’re looking for. We’ll curate, privately.” CTA: **Begin Curated Discovery** → opens the 6-step flow.
5. **Featured Residences** — 3–6 curated cards from CMS (hidden entirely if fewer than 3 exist). Each opens the detail drawer.
6. **Location expertise** — Ahmedabad corridors as elegant cards/map: Iskon-Ambli, Sindhu Bhavan, Thaltej, Shilaj, Vaishno Devi, SG Highway. Each links into Properties pre-filtered by location.
7. **Advisory pillars** — four quiet tiles: Buyer Advisory · Seller Representation · NRI Advisory · Investment Guidance.
8. **NRI advisory section** — discreet block addressing remote buyers (virtual tours, time-zone callbacks, end-to-end handling). CTA: Request a Callback.
9. **Seller representation section** — confidential valuation & representation for owners. CTA: Enquire Privately.
10. **Founder-led trust (About teaser)** — Jitendra’s portrait, 2–3 lines on reputation + the Pikorua meaning, link to About.
11. **Testimonials teaser** — 2–3 real client voices + “View All Google Reviews.” **No numeric counters unless real and verifiable.**
12. **Final CTA band** — soft-black band: “Begin a private conversation.” Three paths: Request a Private Consultation · Speak on WhatsApp · Request a Callback.
13. **Footer.**

### Homepage rules
- The hero video must be **≤ 2–3 MB**, poster-image first paint, `autoplay muted loop playsinline`, with a static fallback on mobile/slow connections (or serve poster-only below a connection/size threshold).
- The stats/counter pattern from the old site is **removed** unless every number is real, current, and CMS-driven. If used, animate on view but seed from real values only.
- Maximum one primary CTA per section; secondary actions are text links.

---

## 13. Properties Page Requirements

**Goal:** Present a curated residential collection with location-led discovery and rich detail — without ever feeling like a portal or showing an empty grid.

### Structure
1. **Intro** — one paragraph on the curated philosophy (“A small, deliberate collection…”).
2. **Location-led discovery** — corridor entry chips/cards (Iskon-Ambli, Sindhu Bhavan, Thaltej, Shilaj, Vaishno Devi, SG Highway, Other). Selecting one filters the collection in place.
3. **Guided Discovery entry (repeat)** — “Not sure where to start? Let us curate.” → opens the 6-step flow.
4. **Refinement (light, optional)** — category + configuration + status as quiet toggles, *not* a heavy filter bar. Defaults to “All curated.”
5. **Curated collection grid** — residential property cards (structure in §21). Responsive 1/2/3 columns.
6. **Property Detail Drawer/Modal** — opens over the grid; URL updates to `/properties/[slug]` for shareability and SEO while remaining an overlay (not a nav page).

### Empty-state discipline (critical)
- **Never render “No Properties Found.”** If a location/filter combination returns nothing, the UI must instead show a graceful **“Request curated options for [Location]”** panel that opens Guided Discovery prefilled — turning a dead end into a lead.
- The page must never load fully empty; if the CMS has zero published properties, show a curated **“By invitation — request access to current residences”** panel with a contact path instead of a grid.

### Property Detail Drawer/Modal — content order
- Hero image / gallery (swipe on mobile, keyboard-navigable).
- Title + location + category + status tag.
- Configuration (e.g., 4BHK / 5BHK / Penthouse / Duplex), built-up & plot area, key facts.
- Price or **“Price on Request”** (never blank).
- 2–3 paragraph descriptor (advisory tone, no hype).
- Highlights (amenities, views, floor, possession) as a short list.
- Location context (corridor, connectivity) — text, optional embedded map.
- **CTAs:** Enquire Privately (opens enquiry form prefilled with property ref) · Speak on WhatsApp (prefilled message) · Request a Callback.
- Optional: 2–3 “Similar curated residences.”

---

## 14. About Page Requirements

**Goal:** Convert trust. Make the founder and philosophy the hero.

### Sections
1. **Founder story — Jitendra.** Portrait, the reputation for honest guidance, refined taste, and discretion. First-person-singular or measured third-person.
2. **The Pikorua meaning.** The Māori double-twist as endless trust, lasting relationships, growth — tied to how the firm works.
3. **Advisory approach & discretion.** How PIKORUA curates, represents, and protects client privacy (off-market access, confidentiality).
4. **Seller representation.** Confidential valuation, qualified-buyer access, discreet marketing for owners of premium residences.
5. **Developer trust / partnerships.** Why premium residential developers partner with PIKORUA: HNI/NRI reach, professionalism, trust.
6. **Reach.** Ahmedabad as home market (with the named corridors), selective Mumbai & Dubai for existing relationships — stated honestly, no “worldwide.”
7. **Soft CTA** — Request a Private Consultation.

---

## 15. Testimonials Page Requirements

**Goal:** Provide authentic, verifiable social proof.

### Rules
- Only **real** testimonials, ideally mirroring/linking to **Google Reviews**. No invented quotes, no fake star counts.
- Each testimonial card: client first name / initial (privacy-aware), short quote, context (e.g., “NRI buyer · Sindhu Bhavan”), and optional source tag (Google).
- Prominent **“View All Google Reviews”** button linking to the verified Google Maps profile.
- Optional aggregate rating **only if pulled live or verifiably accurate** (e.g., “4.9 on Google”) — otherwise omit.
- If real testimonials are few, present 3–5 strong ones with generous spacing rather than padding with weak or fabricated ones.
- CTA at the end: Begin Curated Discovery / Request a Consultation.

---

## 16. Contact Page Requirements

**Goal:** Make starting a private conversation effortless across every preferred channel.

### Sections
1. **Lead-in line** — “Begin a private conversation.” Discreet, reassuring on privacy.
2. **Conversion paths (cards/tabs):**
   - **Request a Private Consultation** — booking form (name, phone, email, preferred date/time, purpose).
   - **Request a Callback** — name, phone, preferred callback time.
   - **Speak on WhatsApp** — deep link with a prefilled message.
   - **Qualified Enquiry** — the fuller enquiry form (§18).
3. **NRI advisory section** — time-zone-aware messaging, “tell us your country/time zone,” virtual-tour mention, WhatsApp-first.
4. **Office & details** — Iskon-Ambli, Ahmedabad; connect@pikorua.in; +91 6354 359 222; map link; hours.
5. **Reassurance microcopy** — “Your enquiry is private. We respond personally, never with spam.”

---

## 17. Lead Generation & Conversion Flow

**Primary engine: Guided Discovery (configurator).** Replaces the basic filter. Low-friction, multi-step, contact captured last.

### Guided Discovery — 6 steps
- **Step 1 — What are you looking for?** Apartment · Penthouse · Villa · Bungalow · Plot · Residential Investment Property
- **Step 2 — Preferred location.** Iskon-Ambli · Sindhu Bhavan · Thaltej · Shilaj · Vaishno Devi · SG Highway · Other
- **Step 3 — Budget range.** ₹1–2 Cr · ₹3–5 Cr · ₹5–10 Cr · ₹10 Cr+ · Custom
- **Step 4 — Purpose.** Self-use · Investment · NRI purchase · Selling property · Exploring options
- **Step 5 — Timeline.** Immediately · 1–3 months · 3–6 months · Exploring
- **Step 6 — Contact details.** Name · Phone · WhatsApp number · Email · Preferred callback time
- **Final CTA:** **“Receive Curated Residential Options”**

### Flow behavior
- One question per screen; large tap targets; progress indicator (Step n of 6); Back always available.
- Smooth horizontal slide between steps; selection auto-advances (with a brief confirm) on single-select steps; multi-select where natural (e.g., locations).
- Contact step is the only one requiring typing; everything prior is tap-only.
- On submit: create a **Lead** record, fire analytics events, send the team a notification (email + optional WhatsApp), and route the user to a **/thank-you** confirmation with WhatsApp + expected response time.
- If **Purpose = Selling property**, branch the confirmation toward seller representation messaging; if **NRI purchase**, surface NRI/time-zone messaging.
- **Abandonment capture:** if the user reaches the contact step and drops, optionally persist a partial lead (anonymous, no PII) for funnel analytics only.

### Secondary conversion paths
WhatsApp (prefilled), Callback request, Private consultation booking, per-property Enquire Privately. All paths write to the same Lead pipeline with a `source` field.

### Conversion logic & qualification
- Each lead is auto-tagged: `intent` (buy/sell/invest/nri/explore), `budgetBand`, `location`, `timeline`, `source`, `propertyRef` (if any).
- “Hot” = budget ≥ ₹5 Cr **and** timeline ≤ 3 months **and** valid phone → flag for priority callback.
- All leads pushed to CRM; team SLA target surfaced in confirmation copy (e.g., “We respond within a few hours.”) — only if operationally true.

---

## 18. Forms and User Input Requirements

### Suggested form fields

**A. Guided Discovery** — as in §17 (6 steps; contact = Name, Phone, WhatsApp, Email, Preferred callback time).

**B. Property Enquiry (from detail drawer)**
- Name* · Phone* · WhatsApp number · Email* · Property reference (auto-filled, read-only) · Message (optional) · Preferred callback time.

**C. Callback Request**
- Name* · Phone* · Preferred callback time* · (hidden: source/page).

**D. Private Consultation Booking**
- Name* · Phone* · Email* · Preferred date · Preferred time slot · Purpose (Buy / Sell / Invest / NRI / Explore) · Notes (optional).

**E. Contact / Qualified Enquiry**
- Name* · Phone* · WhatsApp number · Email* · Interest (category/location, optional) · Message · Preferred callback time · Consent checkbox.

### Form rules
- Mark required fields; validate inline (phone format with country code support for NRIs, email pattern).
- **Phone field supports international dialing codes** (NRI-friendly) with India default.
- WhatsApp number optional but encouraged; offer “Same as phone” toggle.
- Honeypot + lightweight rate-limiting/captcha (invisible) for spam — never an intrusive challenge for genuine users.
- Explicit, plain-language **consent checkbox** for contact + privacy link.
- On success: inline confirmation + redirect/animation to thank-you; on error: non-destructive retry preserving inputs.
- All submissions: store in DB, push to CRM, notify team, fire analytics + Meta Pixel `Lead` event.
- Accessibility: every field has a visible label, `aria` attributes, and keyboard support (no placeholder-only labels).

---

## 19. Content Strategy

**Principle:** *Say less, mean more.* Copy is advisory, calm, and specific. The site sells trust and curation, not adjectives.

- **Voice:** confident, understated, personal. Speaks as a trusted advisor, occasionally first-person plural (“we curate”), never salesy.
- **Forbidden register:** exclamation stacking, “world-class,” “best in class,” “luxury redefined,” “unparalleled,” “worldwide,” fake scarcity/urgency.
- **Specificity over hype:** name corridors, configurations, and real value (“a 5BHK on Sindhu Bhavan Road with skyline views”) rather than empty superlatives.
- **Discretion language:** reassure on privacy throughout (“private,” “discreet,” “by invitation,” “personally”).
- **Residential-only lexicon:** apartments, penthouses, villas, bungalows, plots, residences, homes. Never offices/retail/commercial.
- **NRI-aware:** acknowledge remote buying, time zones, virtual tours, end-to-end handling.
- **SEO content lives inside the 5 pages:** location expertise (Properties/Home), advisory explainers (About/Contact) — depth without new pages.
- **No blog/insights page in MVP.** If thought-leadership is wanted later, surface 2–3 evergreen blocks within Home/About — not a separate page.

---

## 20. Visual Design System

### Color tokens
| Token | Hex | Use |
|---|---|---|
| `--lux-black` | `#0B0B0B` | Primary background, hero, footer |
| `--soft-black` | `#151515` | Secondary surfaces, cards, bands |
| `--white` | `#FFFFFF` | Text on dark, clean surfaces |
| `--ivory` | `#F7F3EA` | Light sections, alternating background |
| `--champagne-gold` | `#C8A45D` | Primary accent: underlines, labels, button borders |
| `--antique-gold` | `#9B7A36` | Deeper accent: hover states, icons |
| `--muted-gold` | `#D8C28A` | Subtle dividers, fine lines, disabled gold |

**Gold discipline:** gold occupies **≤ ~5% of any viewport**. Use it for hairlines, small labels, active underlines, icon strokes, and outline buttons — **never** large fills, never gradients across big areas, never gold text blocks.

### Typography
- **Display/Headings:** an elegant high-contrast serif or refined modern serif (e.g., *Canela, Ogg, Playfair Display* alternative) — used sparingly, generous letter-spacing on labels.
- **Body/UI:** a clean geometric/neo-grotesque sans (e.g., *Inter, Söhne, Neue Haas* alternative) for readability.
- **Scale (suggested):** Hero 56–72px desktop / 32–40px mobile · H2 36–44px · H3 24–28px · Body 16–18px · Label/eyebrow 12–13px uppercase, letter-spaced, gold.
- Line length 60–75 chars; generous line-height (1.5–1.7 body).

### Spacing, grid, motion
- 12-column grid, max content width ~1280–1440px, generous gutters; section vertical rhythm 96–160px desktop.
- Border radius: small (4–8px) — luxury reads crisp, not bubbly.
- Imagery: cinematic, golden-hour, real residences; consistent grading (warm, slightly desaturated). No stock clichés, no people-with-keys tropes.
- Motion: slow, eased (250–600ms), purposeful. Honor `prefers-reduced-motion`.

### Logo & motif
- Ivory/gold wordmark; the Pikorua double-twist can appear as a subtle hairline motif in dividers or the favicon — never loud.

---

## 21. UI Component Requirements

### Suggested residential property card structure
```
┌────────────────────────────────────┐
│  [ optimized image, 4:3 / 3:2 ]     │  ← subtle hover zoom (scale 1.03)
│  ◦ status tag (top-left, gold rule) │  ← Ready to Move / Near Possession /
│                                     │     Under Construction / Pre-Launch
├────────────────────────────────────┤
│  EYEBROW: Category · Location       │  ← e.g., "PENTHOUSE · SINDHU BHAVAN"
│  Title (serif)                      │  ← e.g., "Skyline Penthouse"
│  4BHK · 4,200 sq.ft · Floor 22      │  ← key facts row
│  ₹ 8.5 Cr  (or "Price on Request")  │  ← never blank
│  ────────── (gold hairline) ──────  │
│  [ View Details ]   Enquire Privately│  ← primary + text link
└────────────────────────────────────┘
```

### Core components
- **Header / Nav** (sticky, scroll-state); **Mobile drawer**.
- **Hero** (video/poster with fallback, headline, CTA, scroll cue).
- **CategoryCard** (icon/illustration, label, link).
- **PropertyCard** (above) + **PropertyGrid** (responsive, skeleton loading).
- **PropertyDetailDrawer/Modal** (gallery, facts, CTAs; URL-syncing).
- **GuidedDiscovery** (multi-step, progress, slide transitions, prefill support).
- **LocationCard / CorridorSelector**.
- **AdvisoryTile** (Buyer/Seller/NRI/Investor).
- **TestimonialCard** + **ReviewsCTA**.
- **Forms** (consultation, callback, enquiry, contact) with shared validated field primitives.
- **WhatsAppFAB** (floating).
- **CTA band**, **Footer**.
- **Toast/Confirmation**, **Skeletons**, **EmptyStateRedirect** (the “request curated options” panel that replaces any empty grid).

All interactive components: keyboard-navigable, visible focus ring (gold), `aria` labelled, 44px min tap target.

---

## 22. UX Principles

1. **Curation, not search.** Lead with Guided Discovery and curated sets; relegate filtering to a quiet, optional refinement.
2. **Never a dead end.** Any empty result becomes a lead-capture invitation.
3. **Human within one scroll.** WhatsApp/callback/consultation always reachable.
4. **Progressive disclosure.** Ask for taps before typing; capture contact last.
5. **Restraint as luxury.** White space, slow motion, minimal copy, one CTA per section.
6. **Discretion by default.** Price-on-request supported; privacy reassurance present; no aggressive popups (the intake is invited, not forced).
7. **Trust scaffolding.** Founder, Pikorua meaning, and real Google Reviews repeated tastefully across pages.
8. **Mobile-first reality.** Design every flow for one-thumb use on a phone first.
9. **Honesty.** No fake numbers, no overclaims, no empty sections — ever.

---

## 23. Mobile Responsiveness Requirements

- **Mobile-first** implementation; breakpoints ~ `sm 640 / md 768 / lg 1024 / xl 1280`.
- Hero: poster-image-first on mobile; video only on capable/fast connections; text never overlaps unsafely with notches (respect safe-area insets).
- Property grid: 1 column (mobile) → 2 (tablet) → 3 (desktop).
- Guided Discovery: full-screen steps, large tap targets, sticky progress + Back/Next; keyboard pushes content (no obscured inputs).
- Detail drawer: full-screen sheet on mobile with swipeable gallery and a sticky CTA bar (Enquire / WhatsApp).
- Sticky “Get In Touch” + WhatsApp FAB positioned clear of the thumb’s accidental zone; honor safe areas.
- Tap targets ≥ 44×44px; font ≥ 16px to prevent iOS zoom on focus.
- Test on real low/mid Android + iOS Safari, and on throttled 3G/4G (NRI connections).

---

## 24. SEO Requirements Within Existing Page Structure

**Constraint:** Depth, not page count. Win long-tail through rich sections + optional non-nav property detail routes.

- **Per-page metadata:** unique title, description, canonical, OG/Twitter image for Home, Properties, About, Testimonials, Contact.
- **Location depth inside Properties/Home:** genuine descriptive content for Iskon-Ambli, Sindhu Bhavan, Thaltej, Shilaj, Vaishno Devi, SG Highway (corridor character, lifestyle, connectivity) — targets “luxury apartments Sindhu Bhavan Road,” “penthouses Iskon-Ambli,” etc.
- **Structured data (JSON-LD):** `RealEstateAgent`/`LocalBusiness` (NAP, geo, hours), `Organization`, `Residence`/`Product` per property, `AggregateRating`/`Review` (only if real), `BreadcrumbList`, `FAQPage` (if an FAQ block exists).
- **Optional `/properties/[slug]` detail pages** (NOT in nav): server-rendered, indexable, schema-marked — capture per-property and long-tail queries without expanding the main nav.
- **Semantic HTML & headings:** one `<h1>` per page, logical `<h2>/<h3>`, descriptive `alt` text on every image.
- **Technical SEO:** `sitemap.xml` (incl. property routes), `robots.txt`, clean URLs, fast LCP, mobile-friendly, HTTPS, 301s from old anchors.
- **Local SEO:** consistent NAP matching the Google Business Profile; embed/ link the verified Google Maps profile (the one in the current footer).
- **Honest signals only:** no keyword stuffing, no fake reviews/ratings, no doorway pages.

---

## 25. Performance Requirements

- **Targets (mobile, field/lab):** LCP < 2.5s, CLS < 0.1, INP < 200ms; Lighthouse Performance ≥ 90 on a mid-tier mobile profile.
- **Images:** `next/image` + Sanity CDN; responsive `srcset`, AVIF/WebP, lazy-load below the fold, explicit dimensions (no CLS), blur-up placeholders.
- **Hero video:** ≤ 2–3 MB, compressed (H.264/H.265 + WebM), poster-first, `preload="none"`/metadata, static fallback on slow/low-data; never block first paint.
- **JS discipline:** route-level code splitting; minimal client JS; defer non-critical scripts (analytics) via GTM; avoid heavy animation libraries — prefer CSS/transform-based motion.
- **Fonts:** `font-display: swap`, preload primary weights, self-host or use a performant provider; limit weights.
- **Caching/CDN:** Vercel edge caching, ISR for property/content pages, immutable asset hashing.
- **Budget:** initial JS < ~150KB gzipped where feasible; audit per release.

---

## 26. Accessibility Requirements

- Target **WCAG 2.1 AA**.
- Color contrast: verify gold-on-dark and text-on-ivory meet AA (note: champagne gold on black for *small* text may fail — reserve gold for large text, lines, and UI accents; use ivory/white for body copy).
- Full keyboard operability (nav, drawer, Guided Discovery, modal, forms); logical focus order; visible gold focus ring.
- Modal/drawer: focus trap, `Esc` to close, return focus to trigger, `aria-modal`.
- Forms: programmatic labels, error messaging tied via `aria-describedby`, no placeholder-only labels.
- Images: meaningful `alt`; decorative images `alt=""`.
- Motion: honor `prefers-reduced-motion` (disable parallax/auto-video/large transitions).
- Semantic landmarks (`header/nav/main/footer`), skip-to-content link.
- Screen-reader pass on the Guided Discovery flow and the property detail drawer specifically.

---

## 27. Technical Architecture

**Pattern:** Headless, JAMstack-leaning. Next.js (App Router) front end → Sanity (content) + Supabase/Postgres (leads/transactional) → serverless API routes for form handling, CRM push, email, and WhatsApp deep links → Vercel hosting.

```
                         ┌──────────────────────────┐
                         │   Sanity Studio (/studio) │  ← admins manage content
                         └─────────────┬─────────────┘
                                       │ GROQ / CDN
        Browser  ◄──────────────►  Next.js (App Router, SSR/ISR on Vercel)
           │  forms (fetch)              │  next/image, JSON-LD, GA4/GTM/Pixel
           ▼                             ▼
   /api/* (route handlers)        Sanity content (properties, locations,
           │                       testimonials, pages, settings)
           ├── validate + spam check
           ├── write Lead → Supabase (Postgres)
           ├── push Lead → CRM (Zoho/HubSpot) via API/webhook
           ├── notify team → email (Resend) + optional WhatsApp
           └── return → /thank-you + fire analytics events
```

- **Rendering:** SSG/ISR for content pages (Home, About, Testimonials, Properties, property detail routes); client interactivity for Guided Discovery, drawer, forms. Revalidate property/content on Sanity webhook publish.
- **Separation of concerns:** content in Sanity; lead/PII + CRM sync in Supabase + API layer; secrets server-side only.
- **Property detail routes** `/properties/[slug]` are server-rendered and indexable but excluded from main nav.

---

## 28. Recommended Tech Stack

| Layer | Recommendation | Why |
|---|---|---|
| Framework | **Next.js (App Router, latest stable)** | SSR/ISR, image optimization, SEO, Vercel-native |
| Language | **TypeScript** | Type safety across data models & forms |
| Styling | **Tailwind CSS** + CSS variables for the color tokens | Fast, consistent, themeable design system |
| Content CMS | **Sanity** | Best-in-class editing UX, real-time, GROQ, image pipeline, structured content, embeddable Studio |
| Leads/Transactional DB | **Supabase (Postgres)** | Reliable relational store for leads, RLS, easy API, auth if needed |
| Hosting/CDN | **Vercel** | Edge network, ISR, preview deploys, analytics |
| Email | **Resend** (or Postmark) | Transactional team notifications & confirmations |
| Forms handling | **Next.js Route Handlers** + Zod validation | Server-side validation, spam control, CRM push |
| CRM | **Zoho CRM / HubSpot** (founder’s choice) | Pipeline, follow-up, ownership |
| Messaging | **WhatsApp click-to-chat / WhatsApp Business API** | Primary HNI/NRI channel |
| Analytics | **GA4 + Google Tag Manager + Meta Pixel** | Behavior + conversion + ad attribution |
| Maps | **Google Maps embed / Places** (optional) | Location context, verified profile |
| Animation | **Framer Motion (sparingly) / CSS transforms** | Premium micro-interactions without bloat |

> **Alternatives noted:** Payload or Strapi could replace Sanity if self-hosting/full control is preferred; Payload (Postgres) can also unify content + leads in one DB. Recommendation remains **Sanity + Supabase** for fastest, lowest-maintenance premium result.

---

## 29. CMS Requirements

Admins (non-technical) must manage all dynamic content without code, including the ability to **publish/unpublish** so the site never shows empty sections.

### Suggested CMS collections (Sanity schemas)
- **`property`** — title, slug, category (ref), location (ref), configuration (4BHK/5BHK/Penthouse/Duplex/etc.), builtUpArea, plotArea, floor, price (number) **or** priceOnRequest (bool), status (Pre-Launch/Under Construction/Near Possession/Ready to Move), shortDescriptor, description (rich text), highlights[], gallery[] (images), heroImage, isFeatured (bool), isPublished (bool), seo (title/desc/ogImage), order.
- **`location`** — name, slug, corridor description (rich text), heroImage, coordinates, isActive. (Iskon-Ambli, Sindhu Bhavan, Thaltej, Shilaj, Vaishno Devi, SG Highway, Other.)
- **`category`** — name, slug, icon/illustration, description. (Apartment, Penthouse, Villa, Bungalow, Plot, Residential Investment.)
- **`testimonial`** — clientName/initial, quote, context (segment + corridor), source (Google/Direct), rating (optional), isFeatured, isPublished.
- **`page` singletons** — `homePage`, `aboutPage`, `contactPage` (section-by-section editable copy, hero media, CTA labels, NRI/seller blocks).
- **`siteSettings` singleton** — logo, contact (email/phone/WhatsApp/address), social links, Google Maps profile URL, GA4/GTM/Pixel IDs, default SEO/OG, WhatsApp default message, response-time copy.
- **`faq`** (optional) — question, answer (powers FAQ schema inside a page).
- **`founder`/`teamMember`** (optional) — name, role, portrait, bio.

### CMS rules
- Every list-driven section reads `isPublished` and hides itself if empty — enforced in code so **no empty UI** is possible.
- Counters/stat values, if used, are CMS fields with real numbers; if blank, the stats block is hidden.
- Image fields use Sanity’s pipeline (hotspot/crop) feeding `next/image`.
- Editorial preview via Sanity → Next.js draft mode.

---

## 30. Database / Data Model Suggestions

Content lives in Sanity; **leads & transactional data live in Supabase (Postgres).**

### Suggested database entities (Supabase)
**`leads`**
| field | type | notes |
|---|---|---|
| id | uuid (pk) | |
| created_at | timestamptz | default now() |
| source | text | discovery / enquiry / callback / consultation / whatsapp / contact |
| name | text | |
| phone | text | with country code |
| whatsapp | text | nullable |
| email | text | nullable |
| category | text | nullable (Step 1) |
| location | text | nullable (Step 2) |
| budget_band | text | nullable (Step 3) |
| purpose | text | nullable (Step 4) |
| timeline | text | nullable (Step 5) |
| preferred_callback_time | text | nullable |
| property_ref | text | nullable (slug/id) |
| message | text | nullable |
| status | text | new / contacted / qualified / won / lost |
| is_hot | boolean | computed flag |
| crm_synced | boolean | default false |
| utm | jsonb | utm_source/medium/campaign etc. |
| consent | boolean | |

**`consultation_bookings`** — id, lead_id (fk), preferred_date, preferred_time, purpose, notes, status.
**`property_enquiries`** — (optional, or fold into leads) id, lead_id, property_ref, message.
**`lead_events`** — id, lead_id, type (created/contacted/note), payload jsonb, created_at (audit trail).

> Properties, locations, categories, testimonials, and page content are **owned by Sanity** (not duplicated in Postgres). Postgres references them by slug/id only.

---

## 31. Third-party Integrations

- **WhatsApp** — click-to-chat deep links (`https://wa.me/<number>?text=<prefilled>`) site-wide; optional WhatsApp Business API for automated lead acknowledgements.
- **CRM (Zoho/HubSpot)** — every lead pushed via API/webhook with full segmentation; bi-directional status optional.
- **Email (Resend/Postmark)** — instant team notification on every lead + branded confirmation to the user.
- **Google Maps / Places** — office location, corridor context, verified business profile link.
- **Google Reviews** — Testimonials reference real reviews; “View All Google Reviews” to the verified profile; optional Places API rating pull.
- **GA4 + GTM** — tag management & behavioral analytics.
- **Meta Pixel** — `PageView`, `Lead`, `Contact`, `CompleteRegistration` (discovery submit) events.
- **Calendar (optional, Phase 2)** — Calendly/Google Calendar for self-serve consultation slots.

---

## 32. Analytics and Tracking

**Setup:** GTM container loads GA4 + Meta Pixel; IDs stored in `siteSettings`/env, injected via GTM (deferred for performance). Cookie consent banner if required by jurisdiction.

**Key events**
- `discovery_start`, `discovery_step` (with step index + selection), `discovery_submit` → GA4 + Pixel `Lead`/`CompleteRegistration`.
- `property_view` (card open), `property_enquiry_submit`.
- `callback_request`, `consultation_book`, `whatsapp_click`, `contact_submit`.
- `category_click`, `location_select`, `featured_card_click`.
- Funnel report: Hero → Discovery start → step completion → submit; and Property view → enquiry.

**KPIs surfaced:** lead volume by source, discovery completion rate, cost-per-lead (ads), corridor/category demand, mobile vs desktop conversion.

> Use real data only. No vanity counters wired to analytics for public display unless verifiably accurate.

---

## 33. Admin Panel Requirements

- **Sanity Studio at `/studio`** (or separate deploy) is the admin surface — no custom CMS to build.
- Roles: Admin (full), Editor (content only).
- Admins can: add/edit/publish/unpublish properties, set Featured, manage locations/categories/testimonials, edit page copy/hero media/CTA labels, update site settings (contact, socials, analytics IDs, WhatsApp message), manage FAQ.
- **Lead visibility:** primary lead workflow lives in the CRM; optionally a lightweight Supabase-backed “Leads” view (or Retool/Supabase Studio) for the team to see/export leads and update status. (Building a custom lead dashboard is Phase 2, not MVP.)
- Guardrails in schemas (validation, required fields, image requirements) so editors can’t publish broken/empty content.

---

## 34. Security and Privacy Considerations

- **HTTPS everywhere**; HSTS; secure headers (CSP, X-Frame-Options, Referrer-Policy) via Next config/Vercel.
- **PII handling:** lead data encrypted in transit and at rest (Supabase); least-privilege access; Supabase **RLS** so the public anon key cannot read leads.
- **Secrets** (CRM keys, email keys, service tokens) server-side only (env vars), never in client bundles.
- **Form protection:** server-side validation (Zod), honeypot, invisible rate-limiting/captcha, input sanitization.
- **Consent & privacy:** explicit consent checkbox, Privacy Policy + Terms pages (non-nav), cookie/consent banner if required, clear data-use statement.
- **Discretion:** support price-on-request and private/off-market handling; avoid exposing client identities in testimonials without permission.
- **Backups & monitoring:** Supabase backups; error monitoring (Sentry) and uptime checks.
- **Compliance:** align with Indian DPDP Act expectations and basic GDPR practices for NRI/EU visitors.

---

## 35. Non-functional Requirements

- **Performance:** per §25 (LCP < 2.5s, CLS < 0.1, INP < 200ms, Lighthouse ≥ 90 mobile).
- **Availability:** ≥ 99.9% (Vercel + Sanity SLAs); graceful degradation if CMS/API slow.
- **Scalability:** static/ISR scales on CDN; lead API stateless & horizontally scalable.
- **Maintainability:** typed schemas shared between Sanity and front end; documented components; design tokens centralized.
- **Browser support:** latest 2 versions of Chrome, Safari, Edge, Firefox; iOS Safari + Android Chrome.
- **Localization-ready:** copy externalized in CMS to allow future EN/regional variants without re-architecture.
- **Observability:** analytics + error tracking + uptime monitoring from day one.

---

## 36. Success Metrics / KPIs

| Metric | Target (initial) |
|---|---|
| Qualified leads / month | Establish baseline month 1, then +20–30% QoQ |
| Guided Discovery completion rate | ≥ 35% of starts reach submit |
| Lead → conversation (WhatsApp/callback/consult) | ≥ 60% of leads engaged within SLA |
| Mobile conversion parity | Mobile conv. ≥ 80% of desktop rate |
| Lighthouse Performance (mobile) | ≥ 90 |
| Core Web Vitals | All “Good” (field data) |
| Bounce on Home | Trending down vs old site |
| “Hot” lead share (≥₹5Cr, ≤3mo) | Track & grow |
| Google Reviews referral clicks | Track engagement with social proof |

> Brand/perception is also a success axis: the site should be shareable by the founder to VIP prospects with pride. Track qualitative founder/client feedback.

---

## 37. MVP Scope

**In:**
- Five pages (Home, Properties, About, Testimonials, Contact) fully built per §12–16.
- Cinematic hero (optimized video + fallback).
- Residential category cards; featured + curated property grid (real data only; empty-state redirect).
- **Guided Discovery (6 steps)** → “Receive Curated Residential Options” → lead pipeline.
- Property Detail Drawer/Modal (+ optional `/properties/[slug]` SEO routes).
- Embedded NRI advisory, seller representation, location expertise, developer trust, investment guidance sections.
- Forms: discovery, enquiry, callback, consultation, contact — validated, spam-protected, consent-gated.
- WhatsApp FAB + deep links; team email notifications; CRM push; thank-you flow.
- Sanity CMS (all collections) + Supabase leads; Studio admin.
- GA4 + GTM + Meta Pixel; JSON-LD; per-page SEO; sitemap/robots; 301s from old anchors.
- Mobile-first responsive; accessibility AA pass; performance budget met.

**Out (deferred):**
- Custom lead dashboard, self-serve calendar booking, multi-language, blog/insights page, advanced map search, login/accounts, automated WhatsApp bot.

---

## 38. Phase 2 Scope

- **Self-serve consultation scheduling** (Calendly/Google Calendar) with time-zone detection for NRIs.
- **Lightweight internal Leads dashboard** (Supabase view / Retool) with status, export, assignment.
- **WhatsApp Business API** auto-acknowledgement + templated follow-ups.
- **Saved/shortlisted residences** (session-based, no login) the visitor can send to the advisor.
- **Richer location intelligence** inside Properties (corridor guides, lifestyle/connectivity) — still within the 5 pages.
- **A/B testing** on hero copy, CTA labels, and discovery entry.
- **Virtual tour embeds** (Matterport/video) inside the property drawer for NRI buyers.
- **Live Google rating pull** for Testimonials.

---

## 39. Future Enhancements Without Increasing Main Page Count

All future ideas must remain within the five-page nav, expressed as sections, overlays, or non-nav utility/SEO routes:

- **Insights/thought leadership:** 2–3 evergreen blocks inside Home/About — never a blog page in nav. If volume grows, an *overlay* reading view or non-nav `/insights/[slug]` SEO routes (excluded from nav).
- **More locations / cities (Mumbai, Dubai):** add as locations within Properties + corridor content within existing pages; expansion *mentioned* in About, not a new page.
- **NRI hub:** deepen the NRI sections on Home/Contact and add NRI FAQ to the FAQ block — not a separate page.
- **Property detail depth:** enrich the drawer + optional non-nav `/properties/[slug]` routes.
- **Seller/developer portals:** if ever needed, gated overlays or non-nav authenticated routes — never added to public nav.
- **Multi-language:** locale variants of the same five pages.

> Rule of thumb: *new value → new section or overlay or non-nav route; never a new nav item.*

---

## 40. Acceptance Criteria

**Brand & content**
- [ ] No commercial categories appear anywhere (no Office/Showroom/Retail/Commercial in copy, forms, or CMS options).
- [ ] No fake or zero counters; any stat shown is real and CMS-driven, else hidden.
- [ ] No empty sections; any empty list hides or shows a lead-capture redirect (never “No Properties Found”).
- [ ] Hero copy is restrained (no exclamation stacking); no “worldwide”/overclaim copy.
- [ ] Gold occupies ≤ ~5% of any viewport; color tokens match the defined palette.

**Structure**
- [ ] Exactly five nav items: Home, Properties, About, Testimonials, Contact.
- [ ] “Get In Touch” is a CTA, not a route.
- [ ] NRI advisory, seller representation, location expertise, developer trust, investment guidance exist only as sections within the five pages.

**Functionality**
- [ ] Guided Discovery runs all 6 steps, validates, submits, and creates a Lead with full segmentation; final CTA reads “Receive Curated Residential Options.”
- [ ] All five forms validate inline, block spam, require consent, store to Supabase, push to CRM, notify the team, and route to /thank-you.
- [ ] WhatsApp FAB + deep links work with prefilled messages on mobile and desktop.
- [ ] Property detail drawer opens with gallery + facts + CTAs; URL is shareable; closing returns focus.

**Quality**
- [ ] Lighthouse mobile Performance ≥ 90; CWV all “Good”; LCP < 2.5s.
- [ ] WCAG 2.1 AA: keyboard, focus, contrast, reduced-motion verified.
- [ ] GA4/GTM/Meta Pixel events fire correctly (verified in tag assistant/Pixel helper).
- [ ] Per-page metadata, JSON-LD, sitemap/robots present; 301s from old anchors live.
- [ ] Flawless on iOS Safari + Android Chrome incl. throttled connections.
- [ ] Admin can publish/unpublish all content; broken/empty publish is prevented by schema validation.

---

## 41. Development Roadmap

| Phase | Duration (indicative) | Deliverables |
|---|---|---|
| **0. Discovery & Brand** | Week 1 | Finalize positioning, copy tone, real content/photography audit, sitemap sign-off, design tokens |
| **1. Design** | Weeks 2–3 | Wireframes (5 pages + discovery + drawer), hi-fi UI in the design system, mobile + desktop, prototype of Guided Discovery |
| **2. Foundation** | Week 4 | Next.js + TS + Tailwind setup, design tokens, component library scaffolding, Sanity schemas, Supabase tables, CI/CD on Vercel |
| **3. Content & CMS** | Week 5 | Sanity Studio live, real properties/locations/testimonials entered, page singletons wired, image pipeline |
| **4. Core Build** | Weeks 6–8 | Five pages, property cards/grid/drawer, Guided Discovery, all forms, WhatsApp, CRM push, email, analytics, JSON-LD |
| **5. Hardening** | Week 9 | Performance, accessibility, SEO, security, cross-device QA, empty-state/anti-fake audits against §40 |
| **6. Launch** | Week 10 | 301 redirects, GA4/GTM/Pixel verification, soft launch, founder review, go-live |
| **7. Post-launch** | Ongoing | Monitor KPIs, iterate copy/CTAs, begin Phase 2 |

> Timeline is indicative for a small senior team (1 designer, 1–2 engineers) and compresses with parallelization.

---

## A1. Suggested CTA Labels (reference)

| Context | Label |
|---|---|
| Nav button | **Get In Touch** |
| Start guided flow | **Begin Curated Discovery** |
| Guided flow final submit | **Receive Curated Residential Options** |
| Primary consultation | **Request a Private Consultation** |
| Callback | **Request a Callback** |
| WhatsApp | **Speak on WhatsApp** |
| Property card / drawer | **View Details** · **Enquire Privately** |
| Empty-result redirect | **Request Curated Options for [Location]** |
| Testimonials | **View All Google Reviews** |
| Seller block | **Discuss Selling, Privately** |
| NRI block | **Talk to Us from Anywhere** |

> Avoid: “Submit,” “Buy Now,” “Search Properties,” “Browse Listings,” “Click Here.”

---

## A2. Suggested Micro-interactions

- **Nav:** gold underline grows under hover/active item (200ms ease); header background fades from transparent to `#0B0B0B` on scroll.
- **Hero:** poster fades to playing video; subtle scroll-cue bounce; optional very slight parallax (disabled on reduced-motion).
- **Cards:** image scale 1.03 + soft shadow lift on hover; gold hairline draws in; on mobile, press-state depress.
- **Scroll reveals:** sections fade-up 12–16px over ~400ms with slight stagger.
- **Guided Discovery:** horizontal slide between steps; selected option fills with a quiet gold ring + checkmark, then auto-advances after ~250ms; progress bar animates.
- **Buttons:** subtle magnetic/hover lift; gold outline → fill on primary; loading spinner on submit.
- **Drawer:** slides/sheets in with backdrop blur; gallery swipe with momentum; sticky CTA bar.
- **Forms:** inline validation check turns gold on valid; success toast.
- **WhatsApp FAB:** gentle one-time pulse on first scroll past hero; label reveals on hover.

> All motion is slow, eased, and optional. Restraint > spectacle.

---

## A3. Suggested Content Tone & Sample Copy

**Tone:** calm, confident, advisory, specific, discreet. Short sentences. No exclamation stacking, no superlative spam, no “worldwide.”

**Hero**
- Headline: *“Ahmedabad’s finest residences — found quietly.”*
- Subhead: *“A private advisory for those who value discretion as much as address.”*
- CTA: **Begin Curated Discovery**

**Positioning statement**
> *“PIKORUA is a private gateway to Ahmedabad’s finest luxury residences — curated, never listed.”*

**Category intro**
> *“A deliberately small collection. Apartments, penthouses, villas, bungalows, and premium plots — chosen the way we’d choose for ourselves.”*

**Guided Discovery invite**
> *“Tell us what home should feel like. We’ll return a short, curated set — privately.”*

**NRI advisory**
> *“Buying from abroad shouldn’t mean buying blind. We handle viewings, diligence, and decisions across time zones — so distance is never a disadvantage.”*
> CTA: **Talk to Us from Anywhere**

**Seller representation**
> *“For owners of exceptional homes: discreet valuation and representation, and access to buyers who appreciate what you’ve built.”*
> CTA: **Discuss Selling, Privately**

**Founder (About teaser)**
> *“PIKORUA was built on a simple idea — that trust outlasts every transaction. Founded by Jitendra, the name draws from the Māori* pikorua *— two strands intertwined: enduring trust, and the relationships that grow from it.”*

**Final CTA band**
> *“Begin a private conversation.”*
> **Request a Private Consultation** · **Speak on WhatsApp** · **Request a Callback**

**Privacy reassurance (forms)**
> *“Your enquiry stays private. We respond personally — never with spam.”*

**Empty-result redirect**
> *“We curate beyond what’s shown here. Tell us what you’re after in [Location], and we’ll bring options to you.”*

---

## A4. Design Do’s and Don’ts

**Do**
- Lead with white space, restraint, and one clear action per section.
- Use gold as a thin accent (lines, labels, active states, outlines).
- Show only real residences, real reviews, real numbers.
- Make WhatsApp/callback/consultation reachable within one scroll.
- Optimize every image/video; design mobile-first.
- Write specific, quiet, advisory copy.
- Replace any empty result with a lead-capture invitation.

**Don’t**
- Don’t show fake/zero counters or “No Properties Found.”
- Don’t reference any commercial space (offices, showrooms, retail, warehouses, commercial).
- Don’t overuse gold, gradients, or glow.
- Don’t shout (no “!!”, no “world-class,” no “worldwide”).
- Don’t build a portal-style filter bar as the primary interaction.
- Don’t add nav pages beyond the five.
- Don’t ship heavy unoptimized hero video or layout-shifting images.
- Don’t fabricate testimonials, ratings, or reach.

---

## A5. Developer Implementation Notes

- **Design tokens first.** Define the seven color tokens + type scale as CSS variables and a Tailwind theme extension before building components; never hardcode hex values in components.
- **Component-driven.** Build the component library (§21) in isolation; compose pages from CMS data.
- **Empty-state guard is a code-level invariant.** Write a single `renderListOrRedirect()` pattern so it’s structurally impossible to render an empty grid; unit-test it.
- **No commercial options anywhere.** Category enums (CMS + forms + types) are restricted to the six residential categories; add a type-level union so a commercial value won’t compile.
- **Guided Discovery state.** Keep step state in a typed reducer; allow deep-link prefill (e.g., from a location card or empty-state redirect) via query params; persist nothing sensitive client-side.
- **Forms.** Shared Zod schemas validate on client and server (route handlers). Phone uses an intl input; success → `/thank-you`; all submissions write Supabase + CRM + email; fire analytics + Pixel `Lead`.
- **Property URLs.** Drawer opens at `/properties/[slug]` (shallow routing) and also renders as a full SSR page for direct hits/SEO — one source of truth for the data.
- **Images.** Always `next/image` with width/height (no CLS), Sanity hotspot/crop, AVIF/WebP, blur placeholders, lazy below the fold.
- **Video.** Poster-first, `playsinline muted loop`, capped size, static fallback under a connection/size threshold; never block LCP.
- **Analytics via GTM**, deferred; respect consent; don’t add render-blocking scripts.
- **Accessibility is a definition-of-done**, not a phase: focus management for drawer/discovery, AA contrast (reserve gold for large/UI, not small body text), reduced-motion handling.
- **SEO.** Per-page metadata via the Metadata API; JSON-LD components for `RealEstateAgent`, `Residence`, `Review` (real only), `FAQPage`; sitemap includes property routes; add 301s from old `#anchor` URLs.
- **Secrets server-side only**; Supabase RLS denies public reads on `leads`.
- **Performance budget enforced in CI** (Lighthouse CI / bundle-size check) per release.

---

*End of PRD v1.0 — execution-ready. Two constraints hold throughout: luxury residential only, and five main pages only.*

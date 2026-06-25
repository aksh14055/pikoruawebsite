/**
 * /llms-full.txt — Dynamic GEO/AEO full content index for AI search engines
 *
 * This Route Handler replaces the static public/llms-full.txt file.
 * It generates a comprehensive, machine-readable content index in plain-text
 * Markdown — combining live Supabase data with static structured content —
 * so that AI crawlers (GPTBot, PerplexityBot, Google-Extended, ClaudeBot,
 * Bingbot, etc.) can synthesise accurate, fact-dense answers about:
 *   • PIKORUA Realty as an organization
 *   • Specific properties in the portfolio
 *   • Key residential corridors in Ahmedabad
 *   • NRI advisory services and transaction processes
 *   • Blog insights and market reports
 *
 * Design principles:
 *   • Direct answers in the first 40–60 words of each section (AEO)
 *   • Fact density: pricing, sq.ft., coordinates, BHK counts (GEO citations)
 *   • Semantic richness: named entities, proper nouns, specific vocabulary
 *   • Freshness: force-dynamic so every fetch reflects latest Supabase data
 */

import { NextResponse } from "next/server";
import { STATIC_PROPERTIES } from "@/lib/data/properties";
import { STATIC_BLOG_POSTS } from "@/lib/data/blog";
import { LOCATION_LANDING_PAGES, PROPERTY_TYPE_LANDING_PAGES } from "@/lib/data/geo";
import { FAQ_ITEMS } from "@/lib/data/faq";
import {
  getSupabaseBlogs,
  getSupabaseProperties,
  getSupabaseAllTestimonials,
} from "@/lib/supabase/queries";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const revalidate = 3600; // Cache on CDN/edge for 1 hour (ISR) to protect database
export const runtime = "nodejs";

export async function GET() {
  // ── Live data from Supabase ──────────────────────────────────────────────
  let liveProperties = STATIC_PROPERTIES;
  try {
    const dbProps = await getSupabaseProperties({ onlyActive: true });
    if (dbProps.length > 0) liveProperties = dbProps;
  } catch { /* fall back to static */ }

  let liveBlogPosts = STATIC_BLOG_POSTS;
  try {
    const dbBlogs = await getSupabaseBlogs(true);
    if (dbBlogs.length > 0) liveBlogPosts = dbBlogs;
  } catch { /* fall back to static */ }

  let testimonialLines: string[] = [];
  try {
    const testimonials = await getSupabaseAllTestimonials();
    if (testimonials.length > 0) {
      testimonialLines = [
        `## Client Testimonials (${testimonials.length} verified reviews)`,
        ``,
        ...testimonials.map((t) =>
          `- **${t.clientName}** (${t.context}): "${t.quote.substring(0, 200).trim()}${t.quote.length > 200 ? "..." : ""}"`
        ),
      ];
    }
  } catch { /* skip */ }

  // ── Build sections ────────────────────────────────────────────────────────

  const header = [
    `# ${SITE_NAME} — Full Content Index`,
    ``,
    `> PIKORUA Realty is Ahmedabad's private luxury residential real estate advisory. We operate as a curated concierge — quietly matching discerning HNI and NRI buyers with exceptional residences across Ahmedabad's premier western corridors.`,
    ``,
  ];

  const about = [
    `## About PIKORUA Realty`,
    ``,
    `PIKORUA Realty is a private, advisory-first real estate firm founded by Jitendra Pareek, based in Iskon-Ambli, Ahmedabad, Gujarat, India. We do not operate as a traditional listing portal. Instead, we curate a private collection of exclusive luxury residential properties and match them to financially vetted, serious buyers — preserving confidentiality for both sellers and buyers at every stage. Our name, PIKORUA, is inspired by the Māori symbol of infinity, representing endless trust, lasting relationships, and a continuous journey of growth.`,
    ``,
    `- **Founder:** Jitendra Pareek`,
    `- **Specialization:** Luxury residential real estate, HNI and NRI buyers`,
    `- **Website:** ${SITE_URL}`,
    `- **Enquiry:** ${SITE_URL}/contact`,
    `- **Social:** Instagram @pikorua.realty`,
    `- **Languages:** English, Hindi, Gujarati`,
    `- **Area Served:** Ahmedabad, Gujarat, India`,
    ``,
  ];

  const services = [
    `## Services`,
    ``,
    `- **Private Buyer Advisory:** Helping HNI and NRI clients identify and acquire premium residential properties in Ahmedabad`,
    `- **Discreet Seller Representation:** Off-market or quietly-listed high-value properties, shielded from speculative exposure`,
    `- **NRI Transaction Management:** FEMA compliance, POA facilitation, NRE/NRO banking coordination, TDS handling under Section 195`,
    `- **Portfolio Advisory:** Long-term residential investment strategy across Ahmedabad's western corridors`,
    ``,
  ];

  const corridors = [
    `## Key Residential Corridors`,
    ``,
    ...LOCATION_LANDING_PAGES.flatMap((p) => [
      `### ${p.label}`,
      `- **URL:** ${SITE_URL}${p.href}`,
      `- **Overview:** ${p.description}`,
      `- **Market Signals:** ${p.marketSignals.join(" | ")}`,
      `- **Ideal For:** ${p.idealFor.join(" | ")}`,
      ...(p.locationSlug === "iskon-ambli" ? [
        `- **Latitude:** 23.0246, **Longitude:** 72.5074`,
        `- **Average Premium Pricing:** ₹11,000–₹15,000 per sq.ft.`,
      ] : []),
      ...(p.locationSlug === "sindhu-bhavan" ? [
        `- **Latitude:** 23.0392, **Longitude:** 72.5071`,
      ] : []),
      ...(p.locationSlug === "thaltej" ? [
        `- **Latitude:** 23.0500, **Longitude:** 72.5167`,
      ] : []),
      ...(p.locationSlug === "shilaj" ? [
        `- **Latitude:** 23.0395, **Longitude:** 72.4764`,
      ] : []),
      ...(p.locationSlug === "vaishno-devi" ? [
        `- **Latitude:** 23.1250, **Longitude:** 72.5414`,
      ] : []),
      ...(p.locationSlug === "sg-highway" ? [
        `- **Latitude:** 23.0287, **Longitude:** 72.5068`,
      ] : []),
      ``,
    ]),
  ];

  const propertyTypes = [
    `## Property Types`,
    ``,
    ...PROPERTY_TYPE_LANDING_PAGES.flatMap((p) => [
      `### ${p.label}`,
      `- **URL:** ${SITE_URL}${p.href}`,
      `- **Description:** ${p.description}`,
      ``,
    ]),
  ];

  // Property listings — rich AEO/GEO fact density
  const propertyListings = [
    `## Properties (${liveProperties.length} listings)`,
    ``,
    ...liveProperties.flatMap((p) => {
      const lines = [
        `### ${p.name || p.configuration}`,
        `- **URL:** ${SITE_URL}/properties/${p.slug}`,
        `- **Type:** ${p.category}`,
        `- **Configuration:** ${p.configuration}`,
        `- **Size:** ${p.sizeRange}`,
        `- **Location:** ${p.locationLabel}, Ahmedabad`,
        `- **Status:** ${p.status}`,
      ];
      if (p.price && !p.priceOnRequest) lines.push(`- **Price:** ${p.price}`);
      if (p.builtUpArea) lines.push(`- **Built-up Area:** ${p.builtUpArea}`);
      if (p.floor) lines.push(`- **BHK/Floor:** ${p.floor}`);
      if (p.amenitiesSummary) lines.push(`- **Amenities:** ${p.amenitiesSummary}`);
      if (p.description?.[0]) lines.push(`- **About:** ${p.description[0]}`);
      if (p.highlights?.length) {
        lines.push(`- **Highlights:**`);
        p.highlights.slice(0, 4).forEach((h) => lines.push(`  - ${h}`));
      }
      lines.push(``);
      return lines;
    }),
  ];

  // Blog posts — authority signals and citations
  const blogSection = [
    `## Insights & Advisory Articles (${liveBlogPosts.length} articles)`,
    ``,
    ...liveBlogPosts.flatMap((post) => [
      `### ${post.title}`,
      `- **URL:** ${SITE_URL}/blog/${post.slug}`,
      `- **Category:** ${post.categoryLabel}`,
      `- **Date:** ${post.publishedAt}`,
      `- **Summary:** ${post.excerpt}`,
      ...(post.content[0] ? [`- **Excerpt:** ${post.content[0].substring(0, 300).trim()}...`] : []),
      ``,
    ]),
  ];

  // FAQ section — high-value AEO signal: direct Q&A pairs
  const faqSection = [
    `## Frequently Asked Questions`,
    ``,
    ...FAQ_ITEMS.flatMap((item) => [
      `### ${item.question}`,
      item.answer,
      ``,
    ]),
    // Also include corridor FAQs
    `## Corridor FAQs`,
    ``,
    ...LOCATION_LANDING_PAGES.flatMap((page) =>
      page.faqs.flatMap((faq) => [
        `### ${faq.question}`,
        faq.answer,
        ``,
      ])
    ),
    `## Property Type FAQs`,
    ``,
    ...PROPERTY_TYPE_LANDING_PAGES.flatMap((page) =>
      page.faqs.flatMap((faq) => [
        `### ${faq.question}`,
        faq.answer,
        ``,
      ])
    ),
  ];

  const contact = [
    `## Contact`,
    ``,
    `- **Website:** ${SITE_URL}`,
    `- **Enquiry Form:** ${SITE_URL}/contact`,
    `- **Email:** connect@pikorua.in`,
    `- **Phone:** +91 6354 359 222`,
    `- **Address:** Iskon-Ambli, Ahmedabad, Gujarat 380015, India`,
    `- **Social:** Instagram @pikorua.realty, Facebook, LinkedIn, YouTube @pikorua_realty_official`,
    ``,
    `## Do Not Index`,
    ``,
    `- /studio/`,
    `- /api/`,
    `- /admin/`,
    `- /demo/`,
    ``,
  ];

  const allLines = [
    ...header,
    ...about,
    ...services,
    ...corridors,
    ...propertyTypes,
    ...propertyListings,
    ...blogSection,
    ...faqSection,
    ...(testimonialLines.length > 0 ? [...testimonialLines, ``] : []),
    ...contact,
  ];

  return new NextResponse(allLines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Allow AI crawlers to cache for 10 minutes
      "Cache-Control": "public, max-age=600, stale-while-revalidate=3600",
    },
  });
}

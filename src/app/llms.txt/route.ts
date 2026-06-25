/**
 * /llms.txt — Dynamic GEO/AEO index for AI search engines
 *
 * This Route Handler replaces the static public/llms.txt file.
 * It generates a live, machine-readable site overview in plain-text Markdown
 * that AI crawlers (GPTBot, PerplexityBot, Google-Extended, ClaudeBot, etc.)
 * can ingest to understand PIKORUA Realty's site structure and key pages.
 *
 * Re-generated on every request (force-dynamic) so it reflects the latest
 * Supabase property and blog data without a deploy.
 */

import { NextResponse } from "next/server";
import { STATIC_PROPERTIES } from "@/lib/data/properties";
import { STATIC_BLOG_POSTS } from "@/lib/data/blog";
import { LOCATION_LANDING_PAGES, PROPERTY_TYPE_LANDING_PAGES } from "@/lib/data/geo";
import { getSupabaseBlogs, getSupabaseAllPropertySlugsWithDates } from "@/lib/supabase/queries";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600; // Cache on CDN/edge for 1 hour (ISR) to protect database
export const runtime = "nodejs";

export async function GET() {
  // Attempt to fetch live slugs from Supabase; fall back to static list
  let dbPropertySlugs: string[] = [];
  try {
    const rows = await getSupabaseAllPropertySlugsWithDates();
    dbPropertySlugs = rows.map((r) => r.slug);
  } catch {
    // Supabase unavailable — use static fallback
  }
  const staticPropertySlugs = STATIC_PROPERTIES.map((p) => p.slug);
  const allPropertySlugs = Array.from(new Set([...dbPropertySlugs, ...staticPropertySlugs]));

  // Attempt to fetch live blog posts; fall back to static list
  let blogSlugs: string[] = [];
  try {
    const dbBlogs = await getSupabaseBlogs(true);
    blogSlugs = dbBlogs.length > 0 ? dbBlogs.map((p) => p.slug) : STATIC_BLOG_POSTS.map((p) => p.slug);
  } catch {
    blogSlugs = STATIC_BLOG_POSTS.map((p) => p.slug);
  }

  const lines: string[] = [
    `# PIKORUA Realty`,
    ``,
    `> PIKORUA Realty is Ahmedabad's private luxury residential real estate advisory. We curate exclusive apartments, penthouses, duplexes, villas, bungalows, and residential plots for HNI and NRI buyers across Ahmedabad's premier western corridors.`,
    ``,
    `## Site Overview`,
    ``,
    `- [Full content index](${SITE_URL}/llms-full.txt)`,
    ``,
    `## Key Pages`,
    ``,
    `- [Properties](${SITE_URL}/properties): Curated luxury property listings — 4 BHK & 5 BHK apartments, penthouses, villas, duplexes, and residential plots`,
    `- [Insights](${SITE_URL}/blog): Market reports, NRI advisory guides, and corridor analysis`,
    `- [About](${SITE_URL}/about): About PIKORUA Realty and founder Jitendra`,
    `- [Testimonials](${SITE_URL}/testimonials): Client reviews from HNI buyers, NRI investors, and sellers`,
    `- [Contact](${SITE_URL}/contact): Private enquiry and advisory request`,
    ``,
    `## Location Corridors`,
    ``,
    ...LOCATION_LANDING_PAGES.map((p) => `- [${p.label}](${SITE_URL}${p.href}): ${p.description}`),
    ``,
    `## Property Types`,
    ``,
    ...PROPERTY_TYPE_LANDING_PAGES.map((p) => `- [${p.label}](${SITE_URL}${p.href}): ${p.description}`),
    ``,
    `## Properties (${allPropertySlugs.length} listings)`,
    ``,
    ...allPropertySlugs.map((slug) => `- [/properties/${slug}](${SITE_URL}/properties/${slug})`),
    ``,
    `## Insights (${blogSlugs.length} articles)`,
    ``,
    ...blogSlugs.map((slug) => `- [/blog/${slug}](${SITE_URL}/blog/${slug})`),
    ``,
    `## Do Not Index`,
    ``,
    `- /studio/`,
    `- /api/`,
    `- /admin/`,
    `- /demo/`,
    ``,
  ];

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Allow AI crawlers to cache for 10 minutes
      "Cache-Control": "public, max-age=600, stale-while-revalidate=3600",
    },
  });
}

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
import { getSupabaseBlogs, getSupabaseProperties } from "@/lib/supabase/queries";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600; // Cache on CDN/edge for 1 hour (ISR) to protect database
export const runtime = "nodejs";

export async function GET() {
  // Fetch live properties from Supabase; fall back to static list
  let liveProperties = STATIC_PROPERTIES;
  try {
    const dbProps = await getSupabaseProperties({ onlyActive: true });
    if (dbProps.length > 0) liveProperties = dbProps;
  } catch {
    // Supabase unavailable — use static fallback
  }

  // Fetch live blog posts; fall back to static list
  let liveBlogPosts = STATIC_BLOG_POSTS;
  try {
    const dbBlogs = await getSupabaseBlogs(true);
    if (dbBlogs.length > 0) liveBlogPosts = dbBlogs;
  } catch {
    // Supabase unavailable — use static fallback
  }

  const propertyLines = liveProperties.map((p) => {
    const priceInfo = p.price && !p.priceOnRequest ? ` (Price: ${p.price})` : " (Price on Request)";
    const sizeInfo = p.sizeRange ? `, Size: ${p.sizeRange}` : "";
    const locInfo = p.locationLabel ? ` in ${p.locationLabel}` : "";
    const desc = p.description?.[0] ? ` - ${p.description[0].substring(0, 160).trim()}...` : "";
    return `- [${p.name || p.configuration}](${SITE_URL}/properties/${p.slug}): ${p.configuration}${sizeInfo}${locInfo}${priceInfo}${desc}`;
  });

  const blogLines = liveBlogPosts.map((post) => {
    const category = post.categoryLabel ? ` [Category: ${post.categoryLabel}]` : "";
    return `- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.excerpt}${category}`;
  });

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
    `## Properties (${liveProperties.length} listings)`,
    ``,
    ...propertyLines,
    ``,
    `## Insights (${liveBlogPosts.length} articles)`,
    ``,
    ...blogLines,
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

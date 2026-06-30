/**
 * Weekly cron job: submit all live site URLs to IndexNow.
 *
 * Vercel calls this route on the schedule defined in vercel.json.
 * Secured by CRON_SECRET which Vercel sets automatically and sends
 * as "Authorization: Bearer <secret>" on every cron invocation.
 *
 * This is a safety net — the revalidate webhook already handles
 * per-URL submissions on content publish. This catches anything missed
 * and keeps the full sitemap fresh in Bing's index weekly.
 */

import { NextRequest, NextResponse } from "next/server";
import { submitToIndexNow } from "@/lib/index-now";
import { pingSitemaps } from "@/lib/sitemap-ping";
import { SITE_URL } from "@/lib/seo";
import { ALL_GEO_LANDING_PAGES } from "@/lib/data/geo";
import { STATIC_PROPERTIES } from "@/lib/data/properties";
import { STATIC_BLOG_POSTS } from "@/lib/data/blog";
import { getSupabaseAllPropertySlugsWithDates, getSupabaseBlogs } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  // Verify this is a legitimate Vercel cron invocation
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Collect all URLs ─────────────────────────────────────────────────────

  // Core static pages
  const coreUrls = [
    "",
    "/properties",
    "/about",
    "/testimonials",
    "/blog",
    "/contact",
  ].map((path) => `${SITE_URL}${path}`);

  // Geo landing pages
  const geoUrls = ALL_GEO_LANDING_PAGES.map((page) => `${SITE_URL}${page.href}`);

  // Property pages — live DB first, fall back to static
  let dbSlugs: { slug: string }[] = [];
  try {
    dbSlugs = await getSupabaseAllPropertySlugsWithDates();
  } catch {
    // non-fatal — static fallback below
  }
  const propertySlugs = Array.from(
    new Set([...dbSlugs.map((p) => p.slug), ...STATIC_PROPERTIES.map((p) => p.slug)])
  );
  const propertyUrls = propertySlugs.map((slug) => `${SITE_URL}/properties/${slug}`);

  // Blog pages — live DB first, fall back to static
  let dbPosts: { slug: string }[] = [];
  try {
    dbPosts = await getSupabaseBlogs(true);
  } catch {
    // non-fatal
  }
  const blogSlugs = Array.from(
    new Set([...dbPosts.map((p) => p.slug), ...STATIC_BLOG_POSTS.map((p) => p.slug)])
  );
  const blogUrls = blogSlugs.map((slug) => `${SITE_URL}/blog/${slug}`);

  const allUrls = [...coreUrls, ...geoUrls, ...propertyUrls, ...blogUrls];

  // ── Submit to IndexNow + ping sitemaps ──────────────────────────────────
  const [indexNowResult, sitemapResults] = await Promise.all([
    submitToIndexNow(allUrls),
    pingSitemaps(),
  ]);

  return NextResponse.json({
    submitted: allUrls.length,
    urls: allUrls,
    indexNow: indexNowResult,
    sitemaps: sitemapResults,
  });
}

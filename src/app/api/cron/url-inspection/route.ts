/**
 * Weekly cron job: inspect a rotating sample of live URLs via Google Search
 * Console's URL Inspection API and email an alert only if something's
 * actually wrong (not indexed, blocked, canonical mismatch, fetch failure).
 *
 * This is distinct from /api/cron/index-now (which only PUSHES "please
 * crawl this" notifications) — this QUERIES Google's current indexing
 * verdict for each URL.
 *
 * Vercel calls this route on the schedule defined in vercel.json.
 * Secured by CRON_SECRET, same as the other cron routes.
 */

import { NextRequest, NextResponse } from "next/server";
import { inspectUrls } from "@/lib/google-url-inspection";
import { sendNotificationEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/seo";
import { ALL_GEO_LANDING_PAGES } from "@/lib/data/geo";
import { STATIC_PROPERTIES } from "@/lib/data/properties";
import { STATIC_BLOG_POSTS } from "@/lib/data/blog";
import { getSupabaseAllPropertySlugsWithDates, getSupabaseBlogs } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const KEY_PAGES = ["", "/properties", "/about", "/testimonials", "/blog", "/contact"];
const ROTATING_BATCH_SIZE = 25;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keyUrls = KEY_PAGES.map((path) => `${SITE_URL}${path}`);

  // Build the full rotating pool (geo landing pages + property + blog URLs)
  const geoUrls = ALL_GEO_LANDING_PAGES.map((page) => `${SITE_URL}${page.href}`);

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

  const rotatingPool = [...geoUrls, ...propertyUrls, ...blogUrls];

  // Deterministic weekly rotation — cycles through the whole pool over
  // successive runs instead of re-checking the same URLs every time.
  const totalBatches = Math.max(1, Math.ceil(rotatingPool.length / ROTATING_BATCH_SIZE));
  const weekIndex = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const batchIndex = weekIndex % totalBatches;
  const rotatingBatch = rotatingPool.slice(
    batchIndex * ROTATING_BATCH_SIZE,
    batchIndex * ROTATING_BATCH_SIZE + ROTATING_BATCH_SIZE
  );

  const urlsToInspect = [...keyUrls, ...rotatingBatch];
  const results = await inspectUrls(urlsToInspect);

  const problems = results.filter((r) => !r.ok);

  if (problems.length > 0) {
    const rows = problems
      .map(
        (p) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:12px;"><a href="${p.url}">${p.url}</a></td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:12px;color:#c0392b;">${
            (p.issues.length ? p.issues.join("; ") : p.error) || "Unknown issue"
          }</td>
        </tr>`
      )
      .join("");

    await sendNotificationEmail({
      subject: `⚠️ URL Inspection: ${problems.length} page${problems.length > 1 ? "s" : ""} with indexing issues`,
      html: `
        <div style="font-family: sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
          <h2 style="color:#c0392b;">Google Search Console — Indexing Issues Found</h2>
          <p style="font-size:13px;color:#555;">${problems.length} of ${results.length} inspected URLs have a potential indexing problem.</p>
          <table style="width:100%;border-collapse:collapse;margin-top:12px;">
            <thead>
              <tr>
                <th style="text-align:left;padding:8px 12px;font-size:11px;text-transform:uppercase;">URL</th>
                <th style="text-align:left;padding:8px 12px;font-size:11px;text-transform:uppercase;">Issue</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `,
    });
  }

  return NextResponse.json({
    inspected: results.length,
    healthy: results.length - problems.length,
    problems: problems.length,
    batchIndex,
    totalBatches,
    results,
  });
}

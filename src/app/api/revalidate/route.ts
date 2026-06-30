import { NextRequest, NextResponse } from "next/server";
import { revalidateTag as _revalidateTag } from "next/cache";
import { getClientIdentifier, revalidateRateLimit } from "@/lib/rate-limit";
import { notifyGoogleIndexing, buildIndexingUrls } from "@/lib/google-indexing";
import { submitToIndexNow } from "@/lib/index-now";
import { pingSitemaps } from "@/lib/sitemap-ping";

// Next.js 16 added a second `profile` arg to revalidateTag for `use cache` support.
// For traditional ISR tag invalidation the runtime only needs the tag string.
const revalidateTag = _revalidateTag as (tag: string) => void;

/**
 * Sanity webhook handler for ISR revalidation.
 * Sanity calls this endpoint on every content publish/unpublish.
 * Secured via a shared secret in the SANITY_WEBHOOK_SECRET env var.
 */
export async function POST(req: NextRequest) {
  // ── Rate limit ─────────────────────────────────────────────────────────
  const ip = getClientIdentifier(req);
  if (!revalidateRateLimit(ip).allowed) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  // ── Secret validation ──────────────────────────────────────────────────
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  const incoming = req.nextUrl.searchParams.get("secret");
  if (!secret || incoming !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse the Sanity webhook payload ──────────────────────────────────
  let payload: { _type?: string; slug?: { current?: string } };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = payload._type;
  const slug = payload.slug?.current;

  // ── Revalidate the relevant tags ───────────────────────────────────────
  const tagsToRevalidate: string[] = [];

  switch (type) {
    case "property":
      tagsToRevalidate.push("properties");
      if (slug) tagsToRevalidate.push(`property-${slug}`);
      break;
    case "location":
      tagsToRevalidate.push("locations");
      break;
    case "testimonial":
      tagsToRevalidate.push("testimonials");
      break;
    case "homePage":
    case "aboutPage":
    case "contactPage":
    case "siteSettings":
      tagsToRevalidate.push("settings", type);
      break;
    default:
      // Unknown type — revalidate everything
      tagsToRevalidate.push("properties", "locations", "testimonials", "settings");
  }

  tagsToRevalidate.forEach((tag) => revalidateTag(tag));

  // ── Submit updated URLs to search engines ──────────────────────────────
  // Fire-and-forget: indexing failures must never block the revalidation response.
  const urlsToIndex = buildIndexingUrls(type ?? "", slug);
  Promise.all([
    notifyGoogleIndexing(urlsToIndex),
    submitToIndexNow(urlsToIndex),
    pingSitemaps(),
  ]).catch((err) => console.error("[indexing] submission error:", err));

  return NextResponse.json({
    revalidated: true,
    tags: tagsToRevalidate,
    type,
    slug,
    indexing: { urls: urlsToIndex },
  });
}

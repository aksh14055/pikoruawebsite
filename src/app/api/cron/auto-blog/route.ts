/**
 * Scheduled cron job: pick an un-covered real-estate headline, draft a full
 * blog post with AI, and save it as a pending-review draft for admin
 * approval. Nothing here ever publishes on its own — the draft is created
 * with is_active=false, pending_review=true, and only becomes public once
 * an admin clicks "Approve & Publish" in /admin (see approveBlogDraft in
 * src/app/admin/actions.ts).
 *
 * Vercel calls this route on the schedule defined in vercel.json.
 * Secured by CRON_SECRET which Vercel sends as "Authorization: Bearer <secret>".
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchRealEstateNews, generateBlogDraftFromNews } from "@/lib/ai/blogAutomation";
import { sendNotificationEmail } from "@/lib/email";
import { pickPlaceholderCover } from "@/lib/data/blogPlaceholders";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();

  // 1. Fetch candidate headlines
  const newsResult = await fetchRealEstateNews();
  if (!newsResult.success || newsResult.items.length === 0) {
    return NextResponse.json({ skipped: true, reason: "No news items available" });
  }

  // 2. Skip headlines already drafted/published (dedupe by source article URL)
  const { data: existing } = await supabase
    .from("blogs")
    .select("source_url")
    .not("source_url", "is", null);
  const usedUrls = new Set((existing || []).map((row: { source_url: string }) => row.source_url));
  const candidate = newsResult.items.find((item) => !usedUrls.has(item.link));

  if (!candidate) {
    return NextResponse.json({ skipped: true, reason: "All fetched headlines already covered" });
  }

  // 3. Draft the post
  const draftResult = await generateBlogDraftFromNews(candidate.title, candidate.link);
  if (!draftResult.success) {
    console.error("[cron/auto-blog] Draft generation failed:", draftResult.error);
    return NextResponse.json({ skipped: true, reason: draftResult.error });
  }
  const { draft } = draftResult;

  const id = "blog-auto-" + Date.now().toString(36);
  const coverImage = draft.coverImage || pickPlaceholderCover(draft.slug || draft.title);

  const dbBlog = {
    id,
    slug: draft.slug,
    title: draft.title,
    category: "market-report",
    category_label: "Market Report",
    published_at: new Date().toISOString().split("T")[0],
    read_time: "4 min read",
    excerpt: draft.excerpt || "",
    cover_image: coverImage,
    author_name: "Jitendra",
    author_role: "PIKORUA Realty",
    author_avatar: "/images/founder.jpg",
    is_featured: false,
    content: [],
    html_content: draft.htmlContent || "",
    faqs: draft.faqs || [],
    seo_title: draft.seoTitle || null,
    seo_description: draft.seoDescription || null,
    is_active: false,
    pending_review: true,
    source: "ai_auto",
    source_url: candidate.link,
  };

  let { error: insertError } = await supabase.from("blogs").insert(dbBlog);

  // Slug collided with an existing post — retry once with a disambiguating suffix.
  if (insertError?.code === "23505") {
    dbBlog.slug = `${dbBlog.slug}-${Date.now().toString(36).slice(-4)}`;
    ({ error: insertError } = await supabase.from("blogs").insert(dbBlog));
  }

  if (insertError) {
    console.error("[cron/auto-blog] Failed to insert draft:", insertError);
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
  }

  // 4. Notify admin for review
  await sendNotificationEmail({
    subject: `New AI blog draft ready for review: ${draft.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; background-color: #fafafa;">
        <h2 style="color: #c5a880; border-bottom: 2px solid #c5a880; padding-bottom: 10px; margin-top: 0;">New AI Blog Draft — Ready for Review</h2>
        <p style="font-size: 15px; color: #111;"><strong>${draft.title}</strong></p>
        <p style="font-size: 13px; color: #555;">${draft.excerpt || ""}</p>
        <p style="font-size: 12px; color: #888;">Based on: <a href="${candidate.link}" style="color:#888;">${candidate.title}</a></p>
        <a href="${SITE_URL}/admin?reviewBlog=${dbBlog.id}" style="display:inline-block; margin-top:20px; padding:12px 24px; background:#c5a880; color:#111; text-decoration:none; font-weight:bold; border-radius:4px; font-size:13px;">Review &amp; Approve</a>
      </div>
    `,
  });

  return NextResponse.json({ success: true, id: dbBlog.id, title: draft.title });
}

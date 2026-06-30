/**
 * Sitemap ping utility.
 *
 * Notifies search engines that the sitemap has been updated.
 * Bing still supports the ping endpoint — Google deprecated theirs in 2023
 * (they now discover sitemap changes via robots.txt and direct GSC submission).
 *
 * Call this whenever content changes so search engines re-fetch the sitemap
 * and discover any newly added or removed URLs beyond the ones explicitly
 * submitted via Google Indexing API / IndexNow.
 */

import { SITE_URL } from "@/lib/seo";

const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

export interface SitemapPingResult {
  engine: string;
  success: boolean;
  status?: number;
  error?: string;
}

async function ping(engine: string, url: string): Promise<SitemapPingResult> {
  try {
    const res = await fetch(url, { method: "GET" });
    return { engine, success: res.ok, status: res.status };
  } catch (err) {
    return { engine, success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Ping all supported search engine sitemap endpoints.
 * Returns results for each engine — failures are logged but never thrown.
 */
export async function pingSitemaps(): Promise<SitemapPingResult[]> {
  const encoded = encodeURIComponent(SITEMAP_URL);

  const results = await Promise.allSettled([
    ping("bing", `https://www.bing.com/ping?sitemap=${encoded}`),
    // IndexNow-supporting engines also pick up sitemap changes via the
    // weekly bulk URL submission, so no separate ping is needed for them.
  ]);

  return results.map((r) =>
    r.status === "fulfilled" ? r.value : { engine: "unknown", success: false, error: "Promise rejected" }
  );
}

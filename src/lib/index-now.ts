/**
 * IndexNow protocol client.
 *
 * IndexNow lets you push URL changes to Bing, Yandex, and other
 * participating search engines instantly — no crawl wait. Microsoft
 * Copilot uses Bing's index, so this directly improves AI search
 * citations on Copilot.
 *
 * Setup required (one-time):
 *   1. Generate a key: any random string of 8–128 hex characters, e.g.
 *      openssl rand -hex 32
 *   2. Set INDEX_NOW_KEY env var to that string
 *   3. Create a file at /public/<your-key>.txt containing only that key string
 *      (already handled by the route handler at /api/index-now/key)
 *
 * Bing docs: https://www.bing.com/indexnow
 */

import { SITE_URL } from "@/lib/seo";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export interface IndexNowResult {
  success: boolean;
  status?: number;
  error?: string;
}

/**
 * Submit a batch of URLs to IndexNow.
 * Silently no-ops if INDEX_NOW_KEY is not configured.
 */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  const key = process.env.INDEX_NOW_KEY;
  if (!key) return { success: false, error: "INDEX_NOW_KEY not set" };
  if (urls.length === 0) return { success: true };

  const host = new URL(SITE_URL).host;

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: urls,
      }),
    });

    // 200 = accepted, 202 = accepted (queued) — both are success
    if (res.ok || res.status === 202) return { success: true, status: res.status };
    return { success: false, status: res.status, error: await res.text() };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

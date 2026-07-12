/**
 * Google Search Console URL Inspection API.
 *
 * Distinct from google-indexing.ts, which only PUSHES "please crawl this"
 * notifications. This QUERIES Google's actual current verdict for a URL —
 * whether it's indexed, its coverage state, canonical, robots.txt state,
 * and fetch result. Reuses the same GOOGLE_SERVICE_ACCOUNT_JSON service
 * account; it must be added as at least a verified user (Owner works too)
 * in Search Console for this property.
 */

import { getGoogleAuthToken } from "@/lib/google-indexing";
import { SITE_URL } from "@/lib/seo";

const INSPECTION_ENDPOINT = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
const INSPECTION_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

export interface UrlInspectionResult {
  url: string;
  ok: boolean;
  verdict?: string;
  coverageState?: string;
  indexingState?: string;
  robotsTxtState?: string;
  pageFetchState?: string;
  lastCrawlTime?: string;
  googleCanonical?: string;
  userCanonical?: string;
  issues: string[];
  error?: string;
}

// Strips a trailing slash so "https://x.com" and "https://x.com/" compare equal.
function normalizeUrl(url: string): string {
  return url.replace(/\/$/, "");
}

function deriveIssues(indexResult: any): string[] {
  const issues: string[] = [];
  if (!indexResult) return ["No index status returned"];

  if (indexResult.verdict === "FAIL") issues.push("Inspection verdict: FAIL");
  if (indexResult.coverageState && !/submitted and indexed/i.test(indexResult.coverageState)) {
    issues.push(`Coverage: ${indexResult.coverageState}`);
  }

  // These three fields come back as *_UNSPECIFIED — a real Google sentinel
  // meaning "not determined," not a block — whenever the page wasn't fully
  // crawled (e.g. "Discovered - currently not indexed"). Only treat them as
  // real problems when they carry an actual failure value, otherwise a
  // single "not indexed" page reports as four redundant issues.
  if (
    indexResult.robotsTxtState &&
    indexResult.robotsTxtState !== "ALLOWED" &&
    !indexResult.robotsTxtState.endsWith("_UNSPECIFIED")
  ) {
    issues.push(`Blocked by robots.txt (${indexResult.robotsTxtState})`);
  }
  if (
    indexResult.indexingState &&
    indexResult.indexingState !== "INDEXING_ALLOWED" &&
    !indexResult.indexingState.endsWith("_UNSPECIFIED")
  ) {
    issues.push(`Indexing not allowed (${indexResult.indexingState})`);
  }
  if (
    indexResult.pageFetchState &&
    indexResult.pageFetchState !== "SUCCESSFUL" &&
    !indexResult.pageFetchState.endsWith("_UNSPECIFIED")
  ) {
    issues.push(`Fetch failed (${indexResult.pageFetchState})`);
  }

  if (
    indexResult.googleCanonical &&
    indexResult.userCanonical &&
    normalizeUrl(indexResult.googleCanonical) !== normalizeUrl(indexResult.userCanonical)
  ) {
    issues.push(
      `Canonical mismatch: Google picked "${indexResult.googleCanonical}" over declared "${indexResult.userCanonical}"`
    );
  }
  return issues;
}

export async function inspectUrl(url: string): Promise<UrlInspectionResult> {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    return { url, ok: false, issues: [], error: "GOOGLE_SERVICE_ACCOUNT_JSON not set" };
  }

  try {
    const token = await getGoogleAuthToken(serviceAccountJson, INSPECTION_SCOPE);
    const res = await fetch(INSPECTION_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inspectionUrl: url, siteUrl: `${SITE_URL}/` }),
    });

    if (!res.ok) {
      return { url, ok: false, issues: [], error: `${res.status}: ${await res.text()}` };
    }

    const data = await res.json();
    const indexResult = data?.inspectionResult?.indexStatusResult;
    const issues = deriveIssues(indexResult);

    return {
      url,
      ok: issues.length === 0,
      verdict: indexResult?.verdict,
      coverageState: indexResult?.coverageState,
      indexingState: indexResult?.indexingState,
      robotsTxtState: indexResult?.robotsTxtState,
      pageFetchState: indexResult?.pageFetchState,
      lastCrawlTime: indexResult?.lastCrawlTime,
      googleCanonical: indexResult?.googleCanonical,
      userCanonical: indexResult?.userCanonical,
      issues,
    };
  } catch (err) {
    return { url, ok: false, issues: [], error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Inspects URLs sequentially rather than in parallel — the Search Console
 * API has tighter per-second rate limits than the Indexing API, and this
 * only ever runs from a cron job, so there's no latency pressure here.
 */
export async function inspectUrls(urls: string[]): Promise<UrlInspectionResult[]> {
  const results: UrlInspectionResult[] = [];
  for (const url of urls) {
    results.push(await inspectUrl(url));
  }
  return results;
}

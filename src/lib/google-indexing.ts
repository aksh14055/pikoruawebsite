/**
 * Google Indexing API shared utility.
 *
 * Uses the same GOOGLE_SERVICE_ACCOUNT_JSON env var and JWT signing approach
 * as the admin/actions.ts implementation. Extracted here so both the admin
 * server actions and the Sanity revalidate webhook can share the same logic.
 *
 * The service account email must be added as an Owner in Google Search Console.
 */

import crypto from "crypto";
import { SITE_URL } from "@/lib/seo";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const INDEXING_ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish";

function base64url(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getGoogleAuthToken(serviceAccountJson: string): Promise<string> {
  const account = JSON.parse(serviceAccountJson);
  const privateKey = (account.private_key as string).replace(/\\n/g, "\n");
  const clientEmail = account.client_email as string;

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/indexing",
      aud: TOKEN_ENDPOINT,
      exp: now + 3600,
      iat: now,
    }),
  );

  const signingInput = `${header}.${payload}`;
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(signingInput);
  const signature = sign
    .sign(privateKey, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${signingInput}.${signature}`;

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${await res.text()}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export type IndexingType = "URL_UPDATED" | "URL_DELETED";

export interface IndexingResult {
  url: string;
  success: boolean;
  error?: string;
}

/**
 * Notify Google that one or more URLs have been updated or deleted.
 * Silently no-ops if GOOGLE_SERVICE_ACCOUNT_JSON is not configured.
 */
export async function notifyGoogleIndexing(
  urls: string[],
  type: IndexingType = "URL_UPDATED",
): Promise<IndexingResult[]> {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    return urls.map((url) => ({ url, success: false, error: "GOOGLE_SERVICE_ACCOUNT_JSON not set" }));
  }

  let token: string;
  try {
    token = await getGoogleAuthToken(serviceAccountJson);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return urls.map((url) => ({ url, success: false, error: `Auth failed: ${msg}` }));
  }

  return Promise.all(
    urls.map(async (url): Promise<IndexingResult> => {
      try {
        const res = await fetch(INDEXING_ENDPOINT, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ url, type }),
        });
        if (!res.ok) return { url, success: false, error: await res.text() };
        return { url, success: true };
      } catch (err) {
        return { url, success: false, error: err instanceof Error ? err.message : String(err) };
      }
    }),
  );
}

/**
 * Derive the set of URLs to submit based on Sanity content type and slug.
 */
export function buildIndexingUrls(type: string, slug?: string): string[] {
  switch (type) {
    case "property":
      return slug
        ? [`${SITE_URL}/properties/${slug}`, `${SITE_URL}/properties`]
        : [`${SITE_URL}/properties`];
    case "blog":
    case "blogPost":
      return slug
        ? [`${SITE_URL}/blog/${slug}`, `${SITE_URL}/blog`]
        : [`${SITE_URL}/blog`];
    case "testimonial":
      return [`${SITE_URL}/testimonials`];
    case "homePage":
      return [`${SITE_URL}/`];
    case "aboutPage":
      return [`${SITE_URL}/about`];
    case "contactPage":
      return [`${SITE_URL}/contact`];
    default:
      return [`${SITE_URL}/`];
  }
}

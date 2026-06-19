import type { Metadata } from "next";

export const SITE_URL = "https://pikorua.in";
export const SITE_NAME = "PIKORUA Realty";
export const DEFAULT_OG_IMAGE = "/logo.png";

type OpenGraphType = "website" | "article";
const BRAND_TITLE_PATTERN = /\s*(?:\||-|\u2014)\s*PIKORUA\s+Realty(?:\s+Insights)?\s*$/i;

export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: OpenGraphType;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const pageTitle = title.replace(BRAND_TITLE_PATTERN, "").trim() || title;

  return {
    title: pageTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description,
      type,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

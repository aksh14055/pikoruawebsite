import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

const PROTECTED_PATHS = ["/studio/", "/api/", "/admin/", "/demo/"];

// Public pages that are most valuable for AI indexing.
// /llms.txt and /llms-full.txt are dynamic Route Handlers (not static files)
// that generate live, machine-readable Markdown indexes of all properties,
// corridors, services, FAQs, and blog articles — the highest-signal GEO/AEO
// endpoints on the site. Explicitly allow all AI bots to access them.
const AI_ALLOW_PATHS = [
  "/",
  "/properties",
  "/locations",
  "/property-types",
  "/blog",
  "/about",
  "/testimonials",
  "/contact",
  "/llms.txt",
  "/llms-full.txt",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule: allow all crawlers on public pages
      {
        userAgent: "*",
        allow: "/",
        disallow: PROTECTED_PATHS,
      },
      // Explicitly welcome AI search crawlers and grant them priority access
      // to the pages most valuable for synthesised answer citations
      {
        userAgent: [
          "GPTBot",            // ChatGPT / OpenAI Search
          "ChatGPT-User",      // ChatGPT browsing plugin
          "PerplexityBot",     // Perplexity AI
          "Google-Extended",   // Google Gemini / Bard training & search
          "ClaudeBot",         // Anthropic Claude search
          "Applebot",          // Apple Siri / Spotlight AI
          "Bingbot",           // Bing / Microsoft Copilot
          "anthropic-ai",      // Anthropic general crawler
          "cohere-ai",         // Cohere AI platform
        ],
        allow: AI_ALLOW_PATHS,
        disallow: PROTECTED_PATHS,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl(),
  };
}

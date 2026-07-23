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
  "/ai/",
  "/ai/facts.json",
  "/properties",
  "/locations",
  "/property-types",
  "/nri",
  "/blog",
  "/blog/feed.xml",
  "/about",
  "/testimonials",
  "/contact",
  "/llms.txt",
  "/llms-full.txt",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule: public pages remain available to conventional crawlers.
      {
        userAgent: "*",
        allow: "/",
        disallow: PROTECTED_PATHS,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: PROTECTED_PATHS,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: PROTECTED_PATHS,
      },
      // Search and user-requested retrieval crawlers are distinct from
      // training-focused crawlers and are explicitly allowed.
      {
        userAgent: ["OAI-SearchBot", "ChatGPT-User"],
        allow: AI_ALLOW_PATHS,
        disallow: PROTECTED_PATHS,
      },
      {
        userAgent: [
          "Claude-SearchBot",  // Claude search indexing
          "Claude-User",       // Claude user-triggered retrieval
          "PerplexityBot",     // Perplexity AI
          "Google-Extended",   // Google Gemini / Bard training & search
          "ClaudeBot",         // Anthropic Claude search
          "Applebot",          // Apple Siri / Spotlight AI
          "anthropic-ai",      // Anthropic general crawler
          "cohere-ai",         // Cohere AI platform
        ],
        allow: AI_ALLOW_PATHS,
        disallow: PROTECTED_PATHS,
      },
      // GPTBot is a training-focused crawler. It is currently permitted as an
      // explicit business setting and can be changed independently of
      // OAI-SearchBot without affecting ChatGPT search eligibility.
      {
        userAgent: "GPTBot",
        allow: AI_ALLOW_PATHS,
        disallow: PROTECTED_PATHS,
      },
    ],
    sitemap: [
      absoluteUrl("/sitemap.xml"),        // core pages (home, properties, blog…)
      absoluteUrl("/sitemap/index.xml"),  // programmatic index → geo + combo + properties
    ],
    host: absoluteUrl(),
  };
}

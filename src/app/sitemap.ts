import type { MetadataRoute } from "next";
import { STATIC_PROPERTIES } from "@/lib/data/properties";
import { getSupabaseAllPropertySlugs } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pikorua.in";

  // Core static pages
  const coreRoutes = ["", "/properties", "/about", "/testimonials", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic property details from Supabase & fallback static
  let dbSlugs: string[] = [];
  try {
    dbSlugs = await getSupabaseAllPropertySlugs();
  } catch (err) {
    console.error("Error fetching slugs for sitemap:", err);
  }

  const staticSlugs = STATIC_PROPERTIES.map((p) => p.slug);
  const allSlugs = Array.from(new Set([...dbSlugs, ...staticSlugs]));

  const propertyRoutes = allSlugs.map((slug) => ({
    url: `${baseUrl}/properties/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...coreRoutes, ...propertyRoutes];
}


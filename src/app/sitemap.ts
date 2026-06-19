import type { MetadataRoute } from "next";
import { STATIC_BLOG_POSTS } from "@/lib/data/blog";
import { ALL_GEO_LANDING_PAGES } from "@/lib/data/geo";
import { STATIC_PROPERTIES } from "@/lib/data/properties";
import { absoluteUrl } from "@/lib/seo";
import { getSupabaseAllPropertySlugsWithDates, getSupabaseBlogs } from "@/lib/supabase/queries";
import type { BlogPost } from "@/types/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // Core static pages
  const coreRoutes = ["", "/properties", "/about", "/testimonials", "/blog", "/contact", "/privacy", "/terms"].map((route) => ({
    url: absoluteUrl(route),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const geoRoutes = ALL_GEO_LANDING_PAGES.map((page) => ({
    url: absoluteUrl(page.href),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }));

  // Dynamic property details from Supabase & fallback static
  let dbSlugsWithDates: { slug: string; updatedAt: string }[] = [];
  try {
    dbSlugsWithDates = await getSupabaseAllPropertySlugsWithDates();
  } catch (err) {
    console.error("Error fetching slugs for sitemap:", err);
  }

  const dateBySlug = new Map(dbSlugsWithDates.map((p) => [p.slug, p.updatedAt]));
  const staticSlugs = STATIC_PROPERTIES.map((p) => p.slug);
  const propertySlugs = dbSlugsWithDates.length > 0 ? dbSlugsWithDates.map((p) => p.slug) : staticSlugs;

  const propertyRoutes = Array.from(new Set(propertySlugs)).map((slug) => {
    const updatedAt = dateBySlug.get(slug);
    return {
      url: absoluteUrl(`/properties/${slug}`),
      lastModified: updatedAt ? new Date(updatedAt) : lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  let dbPosts: BlogPost[] = [];
  try {
    dbPosts = await getSupabaseBlogs(true);
  } catch (err) {
    console.error("Error fetching blog slugs for sitemap:", err);
  }

  const blogPosts = dbPosts.length > 0 ? dbPosts : STATIC_BLOG_POSTS;
  const blogRoutes = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.publishedAt ? new Date(post.publishedAt) : lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));

  return [...coreRoutes, ...geoRoutes, ...propertyRoutes, ...blogRoutes];
}

import { getSupabasePublicClient } from "./client";
import { STATIC_PROPERTIES, type StaticProperty } from "@/lib/data/properties";
import type { Testimonial, AboutPageContent } from "@/types";
import type { BlogPost } from "@/types/blog";

// Helper to convert local image paths to absolute Supabase storage URLs if needed.
// (In db-seeding we keep relative paths; this function ensures they render correctly)
const SUPABASE_BASE = "https://rwtueiruyktjzvsgdcoh.supabase.co/storage/v1/object/public/media";

export function getSupabaseUrl(localPath: string): string {
  if (!localPath) return "";
  if (localPath.startsWith("http")) return localPath;
  if (localPath.startsWith("/properties/") || localPath.startsWith("/images/")) {
    return `${SUPABASE_BASE}${localPath}`;
  }
  return localPath;
}

function sanitizeTextArray(arr: string[]): string[] {
  if (!arr) return [];
  const replacements: { pattern: RegExp; replacement: string }[] = [
    { pattern: /\bMaruti 360\b/gi, replacement: "this development" },
    { pattern: /\bIkebana\b/gi, replacement: "this residence" },
    { pattern: /\bPashmina\b/gi, replacement: "this residence" },
    { pattern: /\bSwati Senor\b/gi, replacement: "this development" },
    { pattern: /\bAnurita\b/gi, replacement: "this bungalow estate" },
    { pattern: /\bBelagio\b/gi, replacement: "this design" },
    { pattern: /\bAnamika\b/gi, replacement: "this project" },
    { pattern: /\bTriveni 84\b/gi, replacement: "this development" },
    { pattern: /\bAvant\b/gi, replacement: "this development" },
    { pattern: /\bCapstone\b/gi, replacement: "this development" },
    { pattern: /\bEminence 96\b/gi, replacement: "this development" },
    { pattern: /\bBelrosa\b/gi, replacement: "this project" },
    { pattern: /\bRashmi\b/gi, replacement: "this project" },
    { pattern: /\bVaikunth\b/gi, replacement: "this estate" },
    { pattern: /\bNorthpark\b/gi, replacement: "this villa project" },
    { pattern: /\bKalrav Alpines\b/gi, replacement: "this plot development" },
    { pattern: /\bWestpark\b/gi, replacement: "this development" },
    { pattern: /\bAtman\b/gi, replacement: "this development" },
    { pattern: /\bShaligram Luxuria\b/gi, replacement: "this development" },
    { pattern: /\bKimana\b/gi, replacement: "this project" },
  ];

  return arr.map(text => {
    let cleaned = text;
    replacements.forEach(({ pattern, replacement }) => {
      cleaned = cleaned.replace(pattern, replacement);
    });
    // Capitalize first letter of each sentence
    cleaned = cleaned.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, prefix, char) => prefix + char.toUpperCase());
    return cleaned;
  });
}

function mapDbPropertyToStatic(db: any): StaticProperty {
  const staticProp = STATIC_PROPERTIES.find(p => p.id === db.id || p.slug === db.slug);

  const price = db.price || staticProp?.price;
  const description = db.description && db.description.length > 0
    ? db.description
    : (staticProp?.description || []);
  const highlights = db.highlights && db.highlights.length > 0
    ? db.highlights
    : (staticProp?.highlights || []);

  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    category: db.category,
    location: db.location,
    locationLabel: db.location_label,
    configuration: db.configuration,
    sizeRange: db.size_range,
    status: db.status,
    coverImage: getSupabaseUrl(db.cover_image),
    images: (db.images || []).map(getSupabaseUrl),
    isFeatured: db.is_featured,
    price: price,
    priceOnRequest: db.price_on_request ?? staticProp?.priceOnRequest,
    description: sanitizeTextArray(description),
    highlights: sanitizeTextArray(highlights),
    builtUpArea: db.built_up_area || staticProp?.builtUpArea || undefined,
    plotArea: db.plot_area || staticProp?.plotArea || undefined,
    floor: db.floor || staticProp?.floor || undefined,
    suitableFor: db.suitable_for || staticProp?.suitableFor || undefined,
    amenitiesSummary: db.amenities_summary || staticProp?.amenitiesSummary || undefined,
    seoTitle: db.seo_title || staticProp?.seoTitle || undefined,
    seoDescription: db.seo_description || staticProp?.seoDescription || undefined,
    isActive: db.is_active !== undefined ? db.is_active : true,
  };
}

function mapDbTestimonialToTypes(db: any): Testimonial {
  return {
    _id: db.id,
    clientName: db.client_name,
    quote: db.quote,
    context: db.context,
    source: db.source,
    rating: db.rating || undefined,
    isFeatured: db.is_featured,
    isPublished: db.is_published,
    reviewUrl: db.review_url || undefined,
  };
}

export async function getSupabaseProperties(filters?: {
  location?: string;
  category?: string;
  onlyActive?: boolean;
}): Promise<StaticProperty[]> {
  try {
    const supabase = getSupabasePublicClient();
    let query = supabase.from("properties").select("*");

    if (filters?.location) {
      query = query.eq("location", filters.location);
    }
    if (filters?.category) {
      query = query.eq("category", filters.category);
    }
    if (filters?.onlyActive) {
      query = query.eq("is_active", true);
    }

    query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching properties from Supabase:", error);
      return [];
    }

    return (data || []).map(mapDbPropertyToStatic);
  } catch (err) {
    console.error("Unhandled error in getSupabaseProperties:", err);
    return [];
  }
}

export async function getSupabaseFeaturedProperties(): Promise<StaticProperty[]> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching featured properties from Supabase:", error);
      return [];
    }

    return (data || []).map(mapDbPropertyToStatic);
  } catch (err) {
    console.error("Unhandled error in getSupabaseFeaturedProperties:", err);
    return [];
  }
}

export async function getSupabasePropertyBySlug(slug: string): Promise<StaticProperty | null> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching property by slug (${slug}) from Supabase:`, error);
      return null;
    }

    return data ? mapDbPropertyToStatic(data) : null;
  } catch (err) {
    console.error("Unhandled error in getSupabasePropertyBySlug:", err);
    return null;
  }
}

export async function getSupabaseAllPropertySlugs(): Promise<string[]> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("properties")
      .select("slug")
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching property slugs from Supabase:", error);
      return [];
    }

    return (data || []).map((r) => r.slug);
  } catch (err) {
    console.error("Unhandled error in getSupabaseAllPropertySlugs:", err);
    return [];
  }
}

export async function getSupabaseAllPropertySlugsWithDates(): Promise<
  { slug: string; updatedAt: string }[]
> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("properties")
      .select("slug, updated_at")
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching property slugs/dates from Supabase:", error);
      return [];
    }

    return (data || []).map((r) => ({ slug: r.slug, updatedAt: r.updated_at }));
  } catch (err) {
    console.error("Unhandled error in getSupabaseAllPropertySlugsWithDates:", err);
    return [];
  }
}

export async function getSupabaseFeaturedTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_featured", true)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error fetching featured testimonials from Supabase:", error);
      return [];
    }

    return (data || []).map(mapDbTestimonialToTypes);
  } catch (err) {
    console.error("Unhandled error in getSupabaseFeaturedTestimonials:", err);
    return [];
  }
}

export async function getSupabaseAllTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching testimonials from Supabase:", error);
      return [];
    }

    return (data || []).map(mapDbTestimonialToTypes);
  } catch (err) {
    console.error("Unhandled error in getSupabaseAllTestimonials:", err);
    return [];
  }
}

function mapDbBlogToBlogPost(db: any): BlogPost {
  return {
    id: db.id,
    slug: db.slug ? db.slug.replace(/^\//, "") : "",
    title: db.title,
    category: db.category,
    categoryLabel: db.category_label,
    publishedAt: db.published_at,
    readTime: db.read_time,
    excerpt: db.excerpt,
    coverImage: getSupabaseUrl(db.cover_image),
    author: {
      name: db.author_name,
      role: db.author_role,
      avatar: getSupabaseUrl(db.author_avatar),
    },
    isFeatured: db.is_featured,
    content: db.content || [],
    seoTitle: db.seo_title || undefined,
    seoDescription: db.seo_description || undefined,
    isActive: db.is_active !== undefined ? db.is_active : true,
    updatedAt: db.updated_at || db.published_at,
  };
}

export async function getSupabaseBlogs(onlyActive = false): Promise<BlogPost[]> {
  try {
    const supabase = getSupabasePublicClient();
    let query = supabase.from("blogs").select("*");

    if (onlyActive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blogs from Supabase:", error);
      return [];
    }

    return (data || []).map(mapDbBlogToBlogPost);
  } catch (err) {
    console.error("Unhandled error in getSupabaseBlogs:", err);
    return [];
  }
}

export async function getSupabaseBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .or(`slug.eq.${slug},slug.eq./${slug}`)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching blog by slug (${slug}) from Supabase:`, error);
      return null;
    }

    return data ? mapDbBlogToBlogPost(data) : null;
  } catch (err) {
    console.error("Unhandled error in getSupabaseBlogBySlug:", err);
    return null;
  }
}

export async function getSupabaseAboutPageContent(): Promise<AboutPageContent | null> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("pages")
      .select("content")
      .eq("id", "about")
      .single();

    if (error) {
      console.error("Error fetching About page content from Supabase:", error);
      return null;
    }

    const content = data?.content as AboutPageContent | undefined;
    if (!content) return null;

    return {
      ...content,
      founderAvatar: content.founderAvatar ? getSupabaseUrl(content.founderAvatar) : undefined,
    };
  } catch (err) {
    console.error("Unhandled error in getSupabaseAboutPageContent:", err);
    return null;
  }
}

export async function getPageSeoData(id: string): Promise<{ seoTitle?: string; seoDescription?: string } | null> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("pages")
      .select("content")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching page SEO for ${id} from Supabase:`, error);
      return null;
    }

    if (!data || !data.content) return null;
    const content = data.content as any;
    return {
      seoTitle: content.seoTitle || undefined,
      seoDescription: content.seoDescription || undefined,
    };
  } catch (err) {
    console.error(`Unhandled error in getPageSeoData for ${id}:`, err);
    return null;
  }
}

export async function getSupabaseHomePageContent(): Promise<any | null> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("pages")
      .select("content")
      .eq("id", "home")
      .maybeSingle();

    if (error) {
      console.error("Error fetching Home page content from Supabase:", error);
      return null;
    }

    return data?.content || null;
  } catch (err) {
    console.error("Unhandled error in getSupabaseHomePageContent:", err);
    return null;
  }
}

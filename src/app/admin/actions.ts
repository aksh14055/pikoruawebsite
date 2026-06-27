"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/client";

import { createHash } from "crypto";

// Get admin email and password from environment variables
const getAdminEmail = () => process.env.ADMIN_EMAIL || "pikoruarealtymarketing@gmail.com";
const getAdminPassword = () => process.env.ADMIN_PASSWORD || "@PIKORUA REALTY 21";

// Generate a stable session token from credentials
const getSessionToken = () => {
  const email = getAdminEmail();
  const password = getAdminPassword();
  return createHash("sha256").update(`${email}:${password}`).digest("hex");
};

/**
 * Validates credentials and sets the session cookie.
 */
export async function loginAction(email: string, password: string) {
  const adminEmail = getAdminEmail();
  const adminPassword = getAdminPassword();
  
  if (email === adminEmail && password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", getSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return { success: true };
  }
  return { success: false, error: "Invalid email or password. Please try again." };
}

/**
 * Removes session cookie to log out.
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  revalidatePath("/admin");
  return { success: true };
}

/**
 * Checks if the user is authenticated on the server side.
 */
export async function checkSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === getSessionToken();
}

/**
 * Guard utility for checking authentication inside actions.
 */
async function requireAuth() {
  const isAuthed = await checkSession();
  if (!isAuthed) {
    throw new Error("Unauthorized access. Please log in.");
  }
}

/**
 * Fetches all leads along with their consultation bookings and property enquiries.
 */
export async function getLeads() {
  await requireAuth();
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("leads")
    .select(`
      *,
      consultation_bookings (*),
      property_enquiries (*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Updates a lead's status and logs an event in the audit trail.
 */
export async function updateLeadStatus(leadId: string, status: string) {
  await requireAuth();
  const supabase = createServerSupabaseClient();

  // Update status
  const { error: statusError } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", leadId);

  if (statusError) {
    console.error("Error updating lead status:", statusError);
    throw new Error(statusError.message);
  }

  // Create audit event
  const { error: eventError } = await supabase
    .from("lead_events")
    .insert({
      lead_id: leadId,
      type: "status_changed",
      payload: { status },
    });

  if (eventError) {
    console.error("Error logging lead event:", eventError);
  }

  return { success: true };
}

/**
 * Creates or updates a property in the Supabase database.
 */
export async function createOrUpdateProperty(property: any) {
  await requireAuth();
  const supabase = createServerSupabaseClient();

  const dbProperty = {
    id: property.id,
    slug: property.slug,
    name: property.name,
    category: property.category,
    location: property.location,
    location_label: property.locationLabel || property.location_label,
    configuration: property.configuration,
    size_range: property.sizeRange || property.size_range,
    status: property.status,
    cover_image: property.coverImage || property.cover_image,
    images: property.images || [],
    is_featured: property.isFeatured !== undefined ? property.isFeatured : property.is_featured,
    price: property.price || "Price on Request",
    price_on_request: property.priceOnRequest !== undefined ? property.priceOnRequest : property.price_on_request,
    description: property.description || [],
    highlights: property.highlights || [],
    built_up_area: property.builtUpArea || property.built_up_area || null,
    plot_area: property.plotArea || property.plot_area || null,
    floor: property.floor || null,
    suitable_for: property.suitableFor || property.suitable_for || null,
    seo_title: property.seoTitle || property.seo_title || null,
    seo_description: property.seoDescription || property.seo_description || null,
    is_active: property.isActive !== undefined ? property.isActive : (property.is_active !== undefined ? property.is_active : true),
  };

  const { error } = await supabase
    .from("properties")
    .upsert(dbProperty, { onConflict: "id" });

  if (error) {
    console.error("Error upserting property:", error);
    throw new Error(error.message);
  }

  // Revalidate frontend caches
  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath(`/properties/${property.slug}`);

  return { success: true };
}

/**
 * Deletes a property from the database.
 */
export async function deleteProperty(id: string, slug: string) {
  await requireAuth();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting property:", error);
    throw new Error(error.message);
  }

  // Revalidate frontend caches
  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath(`/properties/${slug}`);

  return { success: true };
}

/**
 * Creates or updates a testimonial in the database.
 */
export async function createOrUpdateTestimonial(testimonial: any) {
  await requireAuth();
  const supabase = createServerSupabaseClient();

  const dbTestimonial = {
    id: testimonial.id || undefined, // undefined lets Supabase auto-generate UUID on insert
    client_name: testimonial.clientName || testimonial.client_name,
    quote: testimonial.quote,
    context: testimonial.context,
    source: testimonial.source || "google",
    rating: testimonial.rating || null,
    is_featured: testimonial.isFeatured !== undefined ? testimonial.isFeatured : testimonial.is_featured,
    is_published: testimonial.isPublished !== undefined ? testimonial.isPublished : testimonial.is_published,
  };

  const { error } = await supabase
    .from("testimonials")
    .upsert(dbTestimonial);

  if (error) {
    console.error("Error upserting testimonial:", error);
    throw new Error(error.message);
  }

  revalidatePath("/testimonials");
  revalidatePath("/");

  return { success: true };
}

/**
 * Deletes a testimonial from the database.
 */
export async function deleteTestimonial(id: string) {
  await requireAuth();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting testimonial:", error);
    throw new Error(error.message);
  }

  revalidatePath("/testimonials");
  revalidatePath("/");

  return { success: true };
}

/**
 * Uploads an image directly to Supabase Storage inside the "media" bucket.
 */
export async function uploadImageAction(formData: FormData) {
  try {
    await requireAuth();
  } catch {
    return { success: false, error: "Unauthorized. Please log in again." };
  }

  const supabase = createServerSupabaseClient();

  const file = formData.get("file") as File;
  if (!file || !file.name) {
    return { success: false, error: "No file provided." };
  }

  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${Math.random().toString(36).substring(2, 10)}-${Date.now()}.${fileExt}`;
  const filePath = `properties/${fileName}`;

  let buffer: Buffer;
  try {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } catch (e: any) {
    return { success: false, error: "Failed to read file: " + e.message };
  }

  const { data, error } = await supabase.storage
    .from("media")
    .upload(filePath, buffer, {
      contentType: file.type || "application/octet-stream",
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Supabase storage upload error:", error);
    return { success: false, error: error.message };
  }

  if (!data?.path) {
    return { success: false, error: "Upload succeeded but no path returned." };
  }

  const { data: { publicUrl } } = supabase.storage
    .from("media")
    .getPublicUrl(filePath);

  return { success: true, url: publicUrl };
}

/**
 * Creates or updates a blog post in the Supabase database.
 */
export async function createOrUpdateBlogPost(blog: any) {
  await requireAuth();
  const supabase = createServerSupabaseClient();

  const cleanSlug = blog.slug ? blog.slug.replace(/^\//, "") : "";

  const dbBlog = {
    id: blog.id,
    slug: cleanSlug,
    title: blog.title,
    category: blog.category,
    category_label: blog.categoryLabel || blog.category_label,
    published_at: blog.publishedAt || blog.published_at || new Date().toISOString().split("T")[0],
    read_time: blog.readTime || blog.read_time || "5 min read",
    excerpt: blog.excerpt,
    cover_image: blog.coverImage || blog.cover_image,
    author_name: blog.authorName || blog.author_name || "Jitendra",
    author_role: blog.authorRole || blog.author_role || "PIKORUA Realty",
    author_avatar: blog.authorAvatar || blog.author_avatar || "/images/founder.jpg",
    is_featured: blog.isFeatured !== undefined ? blog.isFeatured : blog.is_featured,
    content: blog.content || [],
    seo_title: blog.seoTitle || blog.seo_title || null,
    seo_description: blog.seoDescription || blog.seo_description || null,
    is_active: blog.isActive !== undefined ? blog.isActive : (blog.is_active !== undefined ? blog.is_active : true),
    html_content: blog.htmlContent || blog.html_content || null,
    faqs: blog.faqs || [],
  };

  const { error } = await supabase
    .from("blogs")
    .upsert(dbBlog, { onConflict: "id" });

  if (error) {
    console.error("Error upserting blog post:", error);
    throw new Error(error.message);
  }

  // Revalidate frontend caches
  revalidatePath("/blog");
  revalidatePath(`/blog/${blog.slug}`);
  revalidatePath("/");

  return { success: true };
}

/**
 * Deletes a blog post from the database.
 */
export async function deleteBlogPost(id: string, slug: string) {
  await requireAuth();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting blog post:", error);
    throw new Error(error.message);
  }

  // Revalidate frontend caches
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");

  return { success: true };
}

/**
 * Updates About page content singleton in the pages table.
 */
export async function createOrUpdateAboutPage(aboutContent: any) {
  await requireAuth();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("pages")
    .upsert({
      id: "about",
      title: "About Page",
      content: aboutContent,
      updated_at: new Date().toISOString()
    }, { onConflict: "id" });

  if (error) {
    console.error("Error upserting About page:", error);
    throw new Error(error.message);
  }

  revalidatePath("/about");

  return { success: true };
}

/**
 * General helper to get page content (like SEO details) from the pages table.
 */
export async function getPageSeo(id: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching page SEO for ${id}:`, error);
    return null;
  }

  return data;
}

/**
 * General helper to fetch all page records for page-level SEO management.
 */
export async function getAllPagesSeo() {
  await requireAuth();
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("pages")
    .select("id, title, content");

  if (error) {
    console.error("Error fetching all pages SEO:", error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function createOrUpdatePageSeo(id: string, title: string, content: any) {
  await requireAuth();
  const supabase = createServerSupabaseClient();

  // Fetch existing content to prevent overwriting other fields (e.g. on About page)
  const { data: existingPage } = await supabase
    .from("pages")
    .select("content")
    .eq("id", id)
    .maybeSingle();

  const existingContent = existingPage?.content && typeof existingPage.content === "object" ? existingPage.content : {};
  const mergedContent = {
    ...existingContent,
    ...content,
  };

  const { error } = await supabase
    .from("pages")
    .upsert({
      id,
      title,
      content: mergedContent,
      updated_at: new Date().toISOString()
    }, { onConflict: "id" });

  if (error) {
    console.error(`Error upserting page SEO for ${id}:`, error);
    throw new Error(error.message);
  }

  // Revalidate cache
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/properties");
  revalidatePath("/testimonials");
  revalidatePath("/contact");

  return { success: true };
}

export async function createOrUpdateHomePage(homeContent: any) {
  await requireAuth();
  const supabase = createServerSupabaseClient();

  // Load existing page settings (like SEO) to avoid overwriting them
  const { data: existingPage } = await supabase
    .from("pages")
    .select("content")
    .eq("id", "home")
    .maybeSingle();

  const existingContent = existingPage?.content && typeof existingPage.content === "object" ? existingPage.content : {};
  const mergedContent = {
    ...existingContent,
    ...homeContent,
  };

  const { error } = await supabase
    .from("pages")
    .upsert({
      id: "home",
      title: "Home Page",
      content: mergedContent,
      updated_at: new Date().toISOString()
    }, { onConflict: "id" });

  if (error) {
    console.error("Error upserting Home page:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");

  return { success: true };
}

/**
 * Creates or updates a general FAQ in the database.
 */
export async function createOrUpdateGeneralFaq(faq: any) {
  await requireAuth();
  const supabase = createServerSupabaseClient();

  const dbFaq = {
    id: faq.id || undefined, // auto-generate UUID if not present
    question: faq.question,
    answer: faq.answer,
    display_order: faq.display_order !== undefined ? faq.display_order : (faq.displayOrder || 0),
    category: faq.category || "general",
  };

  const { error } = await supabase
    .from("general_faqs")
    .upsert(dbFaq);

  if (error) {
    console.error("Error upserting general FAQ:", error);
    throw new Error(error.message);
  }

  // Revalidate public pages where FAQs are displayed
  revalidatePath("/contact");
  revalidatePath("/properties");

  return { success: true };
}

/**
 * Deletes a general FAQ from the database.
 */
export async function deleteGeneralFaq(id: string) {
  await requireAuth();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("general_faqs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting general FAQ:", error);
    throw new Error(error.message);
  }

  // Revalidate public pages
  revalidatePath("/contact");
  revalidatePath("/properties");

  return { success: true };
}

/**
 * Call OpenRouter to automatically generate SEO title, description, excerpt, and FAQs.
 */
export async function generateBlogMetadataAction(title: string, contentText: string, htmlContent?: string) {
  try {
    await requireAuth();
  } catch {
    return { success: false, error: "Unauthorized. Please log in again." };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { success: false, error: "OPENROUTER_API_KEY is not configured in .env.local" };
  }

  // Use the HTML content if plain text is empty
  const sourceContent = contentText || htmlContent || "";
  if (!title || !sourceContent) {
    return { success: false, error: "Title and content are required to generate metadata." };
  }

  // Strip HTML tags for processing if htmlContent was used
  const cleanText = sourceContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const sampleContent = cleanText.substring(0, 8000); // Send first 8k chars to prevent hitting token limits

  const systemPrompt = `You are an expert SEO, GEO, and AEO optimization assistant for PIKORUA Realty, a private luxury real estate advisory in Ahmedabad.
Analyze the provided blog article's title and content. Your analysis and outputs must be STRICTLY focused on real estate, property details, valuations, local corridors, and real estate market dynamics. Filter out and ignore any non-real-estate themes or off-topic generic details.

Generate:
1. An SEO-optimized meta title (maximum 60 characters, include location "Ahmedabad" and key real estate keywords).
2. A high-converting meta description (maximum 150 characters, summarize the post's real estate value with a clear benefit and call to action).
3. A concise excerpt (maximum 160 characters, summarizing the core real estate subject).
4. An array of 3 to 5 high-value FAQ entries (Question & Answer pairs) under Answer Engine Optimization (AEO) rules:
   - Questions must reflect real queries real estate buyers, sellers, or investors would ask about this topic/property.
   - Answers must be direct, clear, specifying property details (like pricing, layouts, built-up areas, corridors), and be 1-2 sentences long.

You must respond with ONLY a single, valid JSON object matching the following structure:
{
  "seoTitle": "string",
  "seoDescription": "string",
  "excerpt": "string",
  "faqs": [
    {
      "question": "string",
      "answer": "string"
    }
  ]
}
Do not include any introductory text, explaining paragraphs, or markdown code blocks (e.g. do not wrap the JSON in \`\`\`json). Return only the raw JSON.`;

  const userPrompt = `Title: ${title}
Content snippet:
${sampleContent}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://pikorua.in", // Optional, for OpenRouter analytics
        "X-Title": "PIKORUA Realty Console",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, error: `OpenRouter API error: ${response.status} - ${errText}` };
    }

    const result = await response.json();
    const responseText = result.choices?.[0]?.message?.content;
    if (!responseText) {
      return { success: false, error: "OpenRouter returned an empty response." };
    }

    // Clean markdown code blocks if the model returned them
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }

    const metadata = JSON.parse(cleanJson);
    return { success: true, metadata };
  } catch (error: any) {
    console.error("Error in generateBlogMetadataAction:", error);
    return { success: false, error: error.message || "Failed to generate metadata." };
  }
}





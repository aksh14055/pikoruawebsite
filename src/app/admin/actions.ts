"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/client";
// @ts-ignore
import { GoogleDecoder } from "google-news-url-decoder";

import crypto, { createHash } from "crypto";

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
 * Automatically generates property SEO tags in the background.
 */
async function autoGeneratePropertySeo(property: any) {
  const title = property.name || "";
  const config = property.configuration || "";
  const loc = property.locationLabel || property.location_label || "";
  const desc = Array.isArray(property.description) ? property.description.join(" ") : (property.description || "");
  const highlights = Array.isArray(property.highlights) ? property.highlights.join(", ") : (property.highlights || "");

  try {
    const res = await generatePropertySeoAction(title, config, loc, desc, highlights);
    if (res.success && res.metadata) {
      return {
        seoTitle: res.metadata.seoTitle,
        seoDescription: res.metadata.seoDescription
      };
    }
  } catch (err) {
    console.error("Error generating automatic property SEO:", err);
  }
  return null;
}

/**
 * Creates or updates a property in the Supabase database.
 */
export async function createOrUpdateProperty(property: any) {
  await requireAuth();
  const supabase = createServerSupabaseClient();

  let seoTitle = property.seoTitle || property.seo_title || null;
  let seoDescription = property.seoDescription || property.seo_description || null;

  if (!seoTitle || !seoDescription) {
    const seoResult = await autoGeneratePropertySeo(property);
    if (seoResult) {
      if (!seoTitle) seoTitle = seoResult.seoTitle;
      if (!seoDescription) seoDescription = seoResult.seoDescription;
    }
  }

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
    seo_title: seoTitle,
    seo_description: seoDescription,
    is_active: property.isActive !== undefined ? property.isActive : (property.is_active !== undefined ? property.is_active : true),
    image_alts: property.imageAlts || property.image_alts || {},
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

  // Trigger Google Indexing API ping in background
  const absoluteUrl = `https://pikorua.in/properties/${property.slug}`;
  triggerGoogleIndexing(absoluteUrl, "URL_UPDATED");

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

  // Trigger Google Indexing API deletion in background
  const absoluteUrl = `https://pikorua.in/properties/${slug}`;
  triggerGoogleIndexing(absoluteUrl, "URL_DELETED");

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
 * Automatically generates blog SEO tags, excerpt, and FAQs in the background.
 */
async function autoGenerateBlogSeo(blog: any) {
  const title = blog.title || "";
  const excerpt = blog.excerpt || "";
  const contentText = Array.isArray(blog.content) ? blog.content.join(" ") : (blog.content || "");
  const htmlContent = blog.htmlContent || blog.html_content || "";

  try {
    const res = await generateBlogMetadataAction(title, contentText || excerpt, htmlContent);
    if (res.success && res.metadata) {
      return {
        seoTitle: res.metadata.seoTitle,
        seoDescription: res.metadata.seoDescription,
        excerpt: res.metadata.excerpt,
        faqs: res.metadata.faqs
      };
    }
  } catch (err) {
    console.error("Error generating automatic blog SEO:", err);
  }
  return null;
}

/**
 * Creates or updates a blog post in the Supabase database.
 */
export async function createOrUpdateBlogPost(blog: any) {
  await requireAuth();
  const supabase = createServerSupabaseClient();

  const cleanSlug = blog.slug ? blog.slug.replace(/^\//, "") : "";

  let seoTitle = blog.seoTitle || blog.seo_title || null;
  let seoDescription = blog.seoDescription || blog.seo_description || null;
  let excerpt = blog.excerpt || null;
  let faqs = blog.faqs || [];

  if (!seoTitle || !seoDescription) {
    const seoResult = await autoGenerateBlogSeo(blog);
    if (seoResult) {
      if (!seoTitle) seoTitle = seoResult.seoTitle;
      if (!seoDescription) seoDescription = seoResult.seoDescription;
      if (!excerpt) excerpt = seoResult.excerpt;
      if (!faqs || faqs.length === 0) faqs = seoResult.faqs;
    }
  }

  const dbBlog = {
    id: blog.id,
    slug: cleanSlug,
    title: blog.title,
    category: blog.category,
    category_label: blog.categoryLabel || blog.category_label,
    published_at: blog.publishedAt || blog.published_at || new Date().toISOString().split("T")[0],
    read_time: blog.readTime || blog.read_time || "5 min read",
    excerpt: excerpt,
    cover_image: blog.coverImage || blog.cover_image,
    author_name: blog.authorName || blog.author_name || "Jitendra",
    author_role: blog.authorRole || blog.author_role || "PIKORUA Realty",
    author_avatar: blog.authorAvatar || blog.author_avatar || "/images/founder.jpg",
    is_featured: blog.isFeatured !== undefined ? blog.isFeatured : blog.is_featured,
    content: blog.content || [],
    seo_title: seoTitle,
    seo_description: seoDescription,
    is_active: blog.isActive !== undefined ? blog.isActive : (blog.is_active !== undefined ? blog.is_active : true),
    html_content: blog.htmlContent || blog.html_content || null,
    faqs: faqs,
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

  // Trigger Google Indexing API ping in background
  const absoluteUrl = `https://pikorua.in/blog/${cleanSlug}`;
  triggerGoogleIndexing(absoluteUrl, "URL_UPDATED");

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

  // Trigger Google Indexing API deletion in background
  const absoluteUrl = `https://pikorua.in/blog/${slug}`;
  triggerGoogleIndexing(absoluteUrl, "URL_DELETED");

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
    return { success: false, error: "OPENROUTER_API_KEY is not configured (add it to Vercel/hosting environment variables)" };
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

You MUST adhere to the following best practices for meta tags and content generation:
1. Meta Title:
   - Must be between 50 and 60 characters (max 60 characters).
   - Start with primary keywords from the post (e.g. "Sindhu Bhavan Road Penthouses", "Ahmedabad Real Estate Market").
   - Include the location "Ahmedabad".
   - Conclude with the brand suffix: " | PIKORUA Realty".
2. Meta Description:
   - Must be between 120 and 150 characters (max 150 characters).
   - Provide a clear value/benefit statement summarizing the article's real estate insight.
   - Use high-intent action words (e.g. "Read our analysis", "Explore the corridors", "Get private insights").
   - Must end with a compelling call to action.
3. Excerpt:
   - A concise, high-impact summary in under 155 characters.
4. FAQs (3 to 5 pairs):
   - Questions must match real, searcher-intent queries (e.g. "What is the average price of 4 BHK on Ambli Road?").
   - Answers must be direct, clear, and specify real estate details (pricing figures, built-up areas, specific corridors), using under 2 sentences.

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
        max_tokens: 1500,
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

/**
 * Call OpenRouter to automatically generate Property SEO tags.
 */
export async function generatePropertySeoAction(
  title: string,
  configuration: string,
  locationLabel: string,
  description: string,
  highlightsText: string
) {
  try {
    await requireAuth();
  } catch {
    return { success: false, error: "Unauthorized. Please log in again." };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { success: false, error: "OPENROUTER_API_KEY is not configured (add it to Vercel/hosting environment variables)" };
  }

  if (!title || !configuration || !locationLabel) {
    return { success: false, error: "Title, configuration, and location are required." };
  }

  const systemPrompt = `You are an expert SEO, GEO, and AEO optimization assistant for PIKORUA Realty, a private luxury real estate advisory in Ahmedabad.
Analyze the luxury residential property details provided. Your output must strictly focus on luxury real estate.

You MUST adhere to the following best practices for meta tags:
1. Meta Title:
   - Must be between 50 and 60 characters (max 60 characters).
   - Start with configuration and location (e.g. "4 BHK Penthouse in Sindhu Bhavan Road", "5 BHK Duplex Villa in Ambli").
   - Include the location "Ahmedabad".
   - Conclude with the brand suffix: " | PIKORUA Realty".
2. Meta Description:
   - Must be between 120 and 150 characters (max 150 characters).
   - Summarize the property's key facts (built-up area, specifications, price on request).
   - End with a clear action-oriented call to action (e.g. "Request a private walkthrough.", "Schedule a private consultation.").

Do not include any introductory text, explaining paragraphs, or markdown code blocks (e.g. do not wrap the JSON in \`\`\`json).
Return ONLY a single, valid JSON object matching the following structure:
{
  "seoTitle": "string",
  "seoDescription": "string"
}`;

  const userPrompt = `Property Details:
Title: ${title}
Type/Configuration: ${configuration}
Location: ${locationLabel}
Description: ${description ? description.substring(0, 1000) : ""}
Highlights: ${highlightsText ? highlightsText.substring(0, 1000) : ""}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://pikorua.in",
        "X-Title": "PIKORUA Realty Console",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
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

    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }

    const metadata = JSON.parse(cleanJson);
    return { success: true, metadata };
  } catch (error: any) {
    console.error("Error in generatePropertySeoAction:", error);
    return { success: false, error: error.message || "Failed to generate metadata." };
  }
}

/**
 * Call OpenRouter to automatically generate Page SEO tags for main site pages.
 */
export async function generatePageSeoAction(pageId: string, pageContext?: string) {
  try {
    await requireAuth();
  } catch {
    return { success: false, error: "Unauthorized. Please log in again." };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { success: false, error: "OPENROUTER_API_KEY is not configured (add it to Vercel/hosting environment variables)" };
  }

  const pageNames: Record<string, string> = {
    home: "Home Page (Curated luxury real estate overview of Ahmedabad's Western Corridors)",
    properties: "Properties List Page (A showcase/collection of 4 BHK and 5 BHK apartments, penthouses, duplexes, villas, plots for sale)",
    about: "About Page (PIKORUA Realty's founding story by Jitendra, principles of discretion, locations we serve)",
    testimonials: "Testimonials Page (Verified reviews and experiences from elite luxury home buyers and NRI clients in Ahmedabad)",
    contact: "Contact Page (Private consultation request form, Power of Attorney for NRIs, custom property briefs)",
  };

  const pageTitle = pageNames[pageId] || `${pageId} page`;

  const systemPrompt = `You are an expert SEO, GEO, and AEO optimization assistant for PIKORUA Realty, a private luxury real estate advisory in Ahmedabad.
Analyze the target page context. Your output must strictly focus on luxury real estate.

You MUST adhere to the following best practices for meta tags:
1. Meta Title:
   - Must be between 50 and 60 characters (max 60 characters).
   - Incorporate key terms relevant to the page's focus (e.g. "Curated Luxury Properties", "Private Real Estate Consultation", "Luxury Real Estate Advisory").
   - Include the location "Ahmedabad".
   - Conclude with the brand suffix: " | PIKORUA Realty".
2. Meta Description:
   - Must be between 120 and 150 characters (max 150 characters).
   - Entice premium buyers, sellers, or investors by describing the private advisory model or listing curation.
   - End with a clear action-oriented call to action (e.g. "Begin a private conversation.", "Browse our curated portfolio.").

Do not include any introductory text, explaining paragraphs, or markdown code blocks (e.g. do not wrap the JSON in \`\`\`json).
Return ONLY a single, valid JSON object matching the following structure:
{
  "seoTitle": "string",
  "seoDescription": "string"
}`;

  const userPrompt = `Page ID: ${pageId}
Page Purpose: ${pageTitle}
Optional Context: ${pageContext || ""}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://pikorua.in",
        "X-Title": "PIKORUA Realty Console",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
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

    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }

    const metadata = JSON.parse(cleanJson);
    return { success: true, metadata };
  } catch (error: any) {
    console.error("Error in generatePageSeoAction:", error);
    return { success: false, error: error.message || "Failed to generate metadata." };
  }
}

/**
 * Fetches the latest luxury real estate news from Google News RSS feed.
 * Does not require external packages (parses XML using lightweight regex).
 */
export async function fetchRealEstateNewsAction() {
  try {
    await requireAuth();
  } catch {
    return { success: false, error: "Unauthorized. Please log in again." };
  }

  try {
    const rssUrl = "https://news.google.com/rss/search?q=Ahmedabad+real+estate+luxury+OR+Gujarat+RERA&hl=en-IN&gl=IN&ceid=IN:en";
    const response = await fetch(rssUrl, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      return { success: false, error: `Failed to fetch news feed: ${response.statusText}` };
    }

    const xmlText = await response.text();
    
    // Split XML by <item> tags
    const itemsRaw = xmlText.split("<item>");
    const items: Array<{ title: string; link: string; pubDate: string; source: string }> = [];

    // Skip the first element as it contains channel details rather than items
    for (let i = 1; i < itemsRaw.length; i++) {
      const raw = itemsRaw[i];
      
      const titleMatch = raw.match(/<title>(.*?)<\/title>/);
      const linkMatch = raw.match(/<link>(.*?)<\/link>/);
      const dateMatch = raw.match(/<pubDate>(.*?)<\/pubDate>/);
      const sourceMatch = raw.match(/<source[^>]*>(.*?)<\/source>/);

      if (titleMatch && linkMatch) {
        let title = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim();
        const link = linkMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim();
        const pubDate = dateMatch ? dateMatch[1].trim() : "";
        let source = sourceMatch ? sourceMatch[1].trim() : "News Source";

        // Clean title if it ends with " - Source Name"
        if (title.endsWith(` - ${source}`)) {
          title = title.substring(0, title.length - (source.length + 3)).trim();
        }

        items.push({ title, link, pubDate, source });
      }
      
      if (items.length >= 8) break; // Limit to top 8 news items
    }

    return { success: true, items };
  } catch (error: any) {
    console.error("Error in fetchRealEstateNewsAction:", error);
    return { success: false, error: error.message || "Failed to load news." };
  }
}

/**
 * Decodes the direct article URL from a Google News redirect URL.
 */
async function decodeGoogleNewsUrl(googleUrl: string): Promise<string> {
  try {
    const decoder = new GoogleDecoder();
    const res = await decoder.decode(googleUrl);
    if (res.status && res.decoded_url) {
      return res.decoded_url;
    }
    return googleUrl;
  } catch {
    return googleUrl;
  }
}

/**
 * Scrapes clean text content from a web page by stripping HTML tags.
 */
/**
 * Resolves a high-resolution version of a news image URL by removing crop/resize constraints.
 */
function getHighResImageUrl(imgUrl: string, basePageUrl?: string): string {
  if (!imgUrl) return imgUrl;

  let resolved = imgUrl;
  if (!resolved.startsWith("http://") && !resolved.startsWith("https://") && basePageUrl) {
    try {
      resolved = new URL(resolved, basePageUrl).href;
    } catch {
      // Ignore if invalid
    }
  }

  // 1. Google User Content / Google News images
  if (resolved.includes("googleusercontent.com") || resolved.includes("lh3.googleusercontent.com")) {
    // Replace size parameters at the end (e.g. =s0-w300-rw, =w150-h150, =s120) with =s1200
    resolved = resolved.replace(/=[ws0-9\-r]+$/, "=s1200");
  }

  // 2. Clear query resizing parameters from standard news publisher sites
  try {
    const urlObj = new URL(resolved);
    urlObj.searchParams.delete("width");
    urlObj.searchParams.delete("height");
    urlObj.searchParams.delete("w");
    urlObj.searchParams.delete("h");
    urlObj.searchParams.delete("resize");
    resolved = urlObj.toString();
  } catch {
    // Ignore invalid URL parse
  }

  return resolved;
}

async function scrapeUrlText(url: string): Promise<{ text: string; ogImage: string | null }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-second timeout limit

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      },
      signal: controller.signal,
      next: { revalidate: 0 }
    });
    clearTimeout(timeoutId);

    if (!response.ok) return { text: "", ogImage: null };
    const html = await response.text();

    // Extract og:image content using a regular expression
    let ogImage: string | null = null;
    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogImageMatch) {
      ogImage = ogImageMatch[1];
    } else {
      // Fallback to twitter:image
      const twitterImageMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
                                html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
      if (twitterImageMatch) {
        ogImage = twitterImageMatch[1];
      }
    }

    if (ogImage) {
      ogImage = getHighResImageUrl(ogImage, url);
    }

    // Strip scripts, styles, and tags to keep only readable text
    let cleanText = html
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      text: cleanText.substring(0, 8000), // Return first 8k characters
      ogImage
    };
  } catch (err) {
    clearTimeout(timeoutId);
    console.log("Scraping URL timed out or failed:", url);
    return { text: "", ogImage: null };
  }
}

/**
 * Automatically drafts a complete luxury real estate blog post based on a news headline or link.
 */
export async function generateBlogFromNewsAction(title: string, url?: string, customText?: string) {
  try {
    await requireAuth();
  } catch {
    return { success: false, error: "Unauthorized. Please log in again." };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { success: false, error: "OPENROUTER_API_KEY is not configured (add it to Vercel/hosting environment variables)" };
  }
  let articleContext = customText || "";
  let finalUrl = url || "";
  let ogImage: string | null = null;

  if (url) {
    finalUrl = await decodeGoogleNewsUrl(url);
    if (!articleContext) {
      const scraped = await scrapeUrlText(finalUrl);
      articleContext = scraped.text;
      ogImage = scraped.ogImage;
    }
  }
  const systemPrompt = `You are an expert real estate content writer and SEO strategist for PIKORUA Realty, a private luxury residential real estate advisory in Ahmedabad.
Your task is to write a comprehensive, high-converting, and professionally styled blog post draft based on the provided news headline or article context.

Note: The Scraped Context may contain website navigation menus, cookie policies, or footers. Ignore all irrelevant text and focus ONLY on the actual real estate news facts related to the headline. If no scraped context is provided or if it contains noise, use your own extensive knowledge base about Ahmedabad's property laws, RERA updates, and luxury corridors to write a highly detailed, professional blog post about the headline.

Strict Guidelines:
1. Tone: Advisory-led, authoritative, sophisticated, and targeted at HNIs (High Net Worth Individuals) and NRI investors. Write as a seasoned human real estate advisor, not a generic marketing writer.
2. Focus: Strictly luxury residential properties, infrastructure, and real estate regulations in Ahmedabad. Ignore or pivot away from unrelated themes.
3. Anti-AI Copywriting Rules:
   - NEVER use AI clichés, buzzwords, or filler phrases. Specifically ban: "delve", "tapestry", "testament", "pivotal", "beacon", "redefining", "paradigm shift", "game-changer", "foster", "embark", "landscape", "look no further", "in today's fast-paced world", "ultimate guide", "not only... but also", "crucial role".
   - Avoid robotic transitions: Do not start paragraphs with "Moreover", "Furthermore", "Additionally", "On the other hand", or "Lastly".
   - Do not write formulaic section-concluding summary sentences (e.g. avoid ending a section with "Ultimately, it remains to be seen...").
   - Write in a direct, active, and opinionated human voice. Use varied sentence lengths and human-like natural transitions.
4. Content Format: Output the main blog content as a high-quality, comprehensive HTML article of at least 800 to 1,200 words.
   - Use H2 (<h2>) and H3 (<h3>) tags for section headers. Do NOT use H1 (<h1>).
   - Use clean paragraphs (<p>), bold accents (<strong>), blockquotes (<blockquote>) for advisory notes, and structured bullet lists (<ul> / <li>) or numbered lists (<ol> / <li>) for details.
   - The article must have strong structural depth:
     - An introduction contextualizing the news in the wider Ahmedabad luxury property market.
     - A detailed analysis section with factual specifics (e.g. price trends, typical sizes/built-up area, corridor details for Iskon-Ambli, Sindhu Bhavan Road, Thaltej, Shilaj, Ambli, etc.).
     - A dedicated section on implications for NRI and HNI luxury home buyers.
     - A clear summary advisory conclusion.
4. Slug: Generate a URL-friendly, lowercase slug matching the topic.
5. SEO Meta Tags:
   - seoTitle: Must be between 50 and 60 characters (max 60), starting with target keywords, including location "Ahmedabad", and ending with " | PIKORUA Realty".
   - seoDescription: Must be between 120 and 150 characters (max 150), detailing a benefit statement, and ending with a clear CTA (e.g. "Schedule a private advisory.").
   - excerpt: An engaging summary under 155 characters.
6. FAQs (3 to 5 pairs):
   - High-intent conversational questions about the topic/corridor.
   - Answers must be clear, specify actual details/facts, and be 1-2 sentences.

Do not include any introductory text, explaining paragraphs, or markdown code blocks (e.g. do not wrap the JSON in \`\`\`json).
Return ONLY a single, valid JSON object matching the following structure:
{
  "title": "string",
  "slug": "string",
  "htmlContent": "string",
  "seoTitle": "string",
  "seoDescription": "string",
  "excerpt": "string",
  "faqs": [
    {
      "question": "string",
      "answer": "string"
    }
  ]
}`;

  const userPrompt = `News Headline/Topic: ${title}
Source Link: ${finalUrl || "None provided"}
Scraped Context/Copied Text:
${articleContext ? articleContext.substring(0, 7500) : "No extra context provided. Generate the article using the news headline topic."}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://pikorua.in",
        "X-Title": "PIKORUA Realty Console",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 3000,
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

    let cleanJson = responseText.trim();
    const firstBraceIdx = cleanJson.indexOf("{");
    const lastBraceIdx = cleanJson.lastIndexOf("}");
    if (firstBraceIdx !== -1 && lastBraceIdx !== -1) {
      cleanJson = cleanJson.substring(firstBraceIdx, lastBraceIdx + 1);
    }

    const draft = JSON.parse(cleanJson);
    if (ogImage) {
      draft.coverImage = ogImage;
    }
    return { success: true, draft };
  } catch (error: any) {
    console.error("Error in generateBlogFromNewsAction:", error);
    return { success: false, error: error.message || "Failed to generate blog post." };
  }
}

/**
 * Call OpenRouter (multimodal Gemini 2.5 Flash) to analyze the property image and generate an SEO-optimized Alt text.
 */
export async function generateImageAltAction(
  imageUrl: string,
  propertyName?: string,
  propertyLocation?: string,
  propertyConfig?: string
) {
  try {
    await requireAuth();
  } catch {
    return { success: false, error: "Unauthorized. Please log in again." };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { success: false, error: "OPENROUTER_API_KEY is not configured (add it to Vercel/hosting environment variables)" };
  }

  if (!imageUrl) {
    return { success: false, error: "Image URL is required." };
  }

  const systemPrompt = `You are an expert SEO, GEO, and image optimization assistant for PIKORUA Realty, a private luxury real estate advisory in Ahmedabad.
Analyze the provided property photograph. Write a highly descriptive, search-engine-optimized image ALT text tag (maximum 120 characters) that describes the scene and includes relevant real estate keywords.

Strict Rules:
1. Ground details: Use details from the property info if provided (Project name: "${propertyName || "Luxury Residence"}", Location: "${propertyLocation || "Ahmedabad"}", Type: "${propertyConfig || "Residential"}").
2. Focus: Focus on structural layout, materials, luxury fittings, views, and room type (e.g. "double-height living room", "Italian marble flooring", "curated balcony deck", "glass facade").
3. Suffix: Conclude with "| PIKORUA Realty" if character limit allows, but prioritize description.
4. Output: Return ONLY the raw plain text description, no JSON, no quotes, no introductory text, no markdown. Limit to 120 characters.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://pikorua.in",
        "X-Title": "PIKORUA Realty Console",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Describe this luxury real estate property image for SEO Alt text."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, error: `OpenRouter API error: ${response.status} - ${errText}` };
    }

    const result = await response.json();
    const altText = result.choices?.[0]?.message?.content?.trim();
    if (!altText) {
      return { success: false, error: "OpenRouter returned an empty response." };
    }

    // Strip quotation marks if AI returned them
    const cleanAlt = altText.replace(/^["']|["']$/g, "").trim();
    return { success: true, altText: cleanAlt };
  } catch (error: any) {
    console.error("Error in generateImageAltAction:", error);
    return { success: false, error: error.message || "Failed to generate image alt." };
  }
}

/**
 * Call OpenRouter (Gemini 2.5 Flash) to generate a personalized luxury WhatsApp follow-up greeting.
 */
export async function generateLeadReplyAction(
  leadName: string,
  category?: string,
  location?: string,
  budget?: string,
  message?: string
) {
  try {
    await requireAuth();
  } catch {
    return { success: false, error: "Unauthorized. Please log in again." };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { success: false, error: "OPENROUTER_API_KEY is not configured." };
  }

  const systemPrompt = `You are Jitendra, founder of PIKORUA Realty, an elite private real estate advisory in Ahmedabad.
Write a highly natural, short WhatsApp follow-up message to reply to a new lead.

Pattern to follow:
"Hi [Client Name], saw your inquiry about [specific preference]. Are you free for a quick 2-minute call today? - Jitendra, PIKORUA Realty"

Strict Guidelines:
1. Target Name: Replace "[Client Name]" with the actual lead's name: "${leadName}". It must be dynamically populated (e.g. "Hi Amit,").
2. Contextual Preference: Replace "[specific preference]" with a concise description based on the client's details: Category: "${category || ""}", Location: "${location || ""}", Budget: "${budget || ""}", Custom message: "${message || ""}".
   - E.g. If category is "penthouse", write "a custom penthouse".
   - E.g. If location is "Ambli" and budget is "5 Cr", write "a property in Ambli within a 5 Cr budget".
   - E.g. If they filled a general enquiry, write "our private property advisory in Ahmedabad".
   - Keep it short, natural, and concise.
3. Call to Action: Always ask: "Are you free for a quick 2-minute call today?"
4. Suffix: Conclude exactly with: " - Jitendra, PIKORUA Realty"
5. Formatting: Do not use quotes, JSON, or markdown. Return ONLY the raw plain text of the WhatsApp message. Keep the message under 180 characters.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://pikorua.in",
        "X-Title": "PIKORUA Realty Console",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }],
        temperature: 0.5,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      return { success: false, error: `API error: ${response.status}` };
    }

    const result = await response.json();
    const replyText = result.choices?.[0]?.message?.content?.trim();
    if (!replyText) {
      return { success: false, error: "Empty response from AI." };
    }

    // Clean quotes if any
    const cleanReply = replyText.replace(/^["']|["']$/g, "").trim();
    return { success: true, replyText: cleanReply };
  } catch (error: any) {
    console.error("Error in generateLeadReplyAction:", error);
    return { success: false, error: error.message || "Failed to generate lead reply." };
  }
}

/**
 * Signs a JWT using Node's native crypto module and exchanges it for a Google OAuth access token.
 */
async function getGoogleAuthToken(serviceAccountJson: string): Promise<string> {
  const account = JSON.parse(serviceAccountJson);
  const rawKey = account.private_key || "";
  const privateKey = rawKey.replace(/\\n/g, "\n");
  const clientEmail = account.client_email;

  const header = {
    alg: "RS256",
    typ: "JWT"
  };

  const now = Math.floor(Date.now() / 1000);
  const claimSet = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  };

  const base64UrlEncode = (str: string) => {
    return Buffer.from(str)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

  // Sign using RS256
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(signatureInput);
  const signature = sign.sign(privateKey, "base64");
  const encodedSignature = signature
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${signatureInput}.${encodedSignature}`;

  // Exchange JWT for access token
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to exchange JWT for token: ${text}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Fires background requests to notify Google Indexing API when properties/blogs change.
 */
async function triggerGoogleIndexing(url: string, type: "URL_UPDATED" | "URL_DELETED") {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    console.log("Google Indexing API is not configured (missing GOOGLE_SERVICE_ACCOUNT_JSON). Skipping ping for URL:", url);
    return;
  }

  try {
    const accessToken = await getGoogleAuthToken(serviceAccountJson);
    const response = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url,
        type: type
      })
    });

    if (response.ok) {
      console.log(`Successfully pinged Google Indexing API (${type}) for URL: ${url}`);
    } else {
      const errText = await response.text();
      console.warn(`Google Indexing API returned error: ${response.status} - ${errText} for URL: ${url}`);
    }
  } catch (error) {
    console.error("Failed to run Google Indexing API background ping:", error);
  }
}

/**
 * Test or manually trigger a Google Indexing API submission.
 */
export async function submitToGoogleIndexingAction(url: string, type: "URL_UPDATED" | "URL_DELETED") {
  try {
    await requireAuth();
  } catch {
    return { success: false, error: "Unauthorized." };
  }

  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    return {
      success: false,
      error: "GOOGLE_SERVICE_ACCOUNT_JSON is not configured in environment variables.",
      instructions: [
        "1. Create a project in Google Cloud Console.",
        "2. Enable the Web Search Indexing API.",
        "3. Create a Service Account and download the JSON key file.",
        "4. In Google Search Console, add the Service Account email as an Owner of the property https://pikorua.in",
        "5. Paste the entire JSON file contents as the GOOGLE_SERVICE_ACCOUNT_JSON environment variable."
      ]
    };
  }

  try {
    const accessToken = await getGoogleAuthToken(serviceAccountJson);
    const response = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url,
        type: type
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, error: `Google Indexing API error: ${response.status} - ${errText}` };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error in submitToGoogleIndexingAction:", error);
    return { success: false, error: error.message || "Failed to submit to Google Indexing." };
  }
}





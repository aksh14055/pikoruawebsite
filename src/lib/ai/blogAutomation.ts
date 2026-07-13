// @ts-expect-error google-news-url-decoder does not ship TypeScript declarations.
import { GoogleDecoder } from "google-news-url-decoder";

/**
 * Core news-fetch and AI-drafting logic shared by:
 *  - the admin "AI News Drafter" panel (src/app/admin/actions.ts, auth-gated)
 *  - the unattended cron job (src/app/api/cron/auto-blog, CRON_SECRET-gated)
 * Neither auth model belongs here — each caller enforces its own.
 */

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

interface OpenRouterChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

/**
 * Fetches the latest luxury real estate news from Google News RSS feed.
 * Does not require external packages (parses XML using lightweight regex).
 */
export async function fetchRealEstateNews(): Promise<
  { success: true; items: NewsItem[] } | { success: false; error: string }
> {
  try {
    const rssUrl = "https://news.google.com/rss/search?q=Ahmedabad+luxury+residential+OR+Gujarat+RERA+OR+Ahmedabad+Metro+expansion+OR+GIFT+City+infrastructure+OR+NRI+property+India&hl=en-IN&gl=IN&ceid=IN:en";
    const response = await fetch(rssUrl, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      return { success: false, error: `Failed to fetch news feed: ${response.statusText}` };
    }

    const xmlText = await response.text();

    // Split XML by <item> tags
    const itemsRaw = xmlText.split("<item>");
    const items: NewsItem[] = [];

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
        const source = sourceMatch ? sourceMatch[1].trim() : "News Source";

        // Clean title if it ends with " - Source Name"
        if (title.endsWith(` - ${source}`)) {
          title = title.substring(0, title.length - (source.length + 3)).trim();
        }

        items.push({ title, link, pubDate, source });
      }

      if (items.length >= 8) break; // Limit to top 8 news items
    }

    return { success: true, items };
  } catch (error: unknown) {
    console.error("Error in fetchRealEstateNews:", error);
    return { success: false, error: getErrorMessage(error, "Failed to load news.") };
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

/**
 * Scrapes clean text content from a web page by stripping HTML tags.
 */
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
    const cleanText = html
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      text: cleanText.substring(0, 8000), // Return first 8k characters
      ogImage
    };
  } catch {
    clearTimeout(timeoutId);
    console.log("Scraping URL timed out or failed:", url);
    return { text: "", ogImage: null };
  }
}

export interface BlogDraft {
  title: string;
  slug: string;
  htmlContent: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  faqs: { question: string; answer: string }[];
  coverImage?: string;
}

/**
 * Automatically drafts a complete luxury real estate blog post based on a news headline or link.
 */
export async function generateBlogDraftFromNews(
  title: string,
  url?: string,
  customText?: string
): Promise<{ success: true; draft: BlogDraft } | { success: false; error: string }> {
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
   - NEVER use AI clichés, buzzwords, or filler phrases. Specifically ban: "delve", "tapestry", "testament", "pivotal", "beacon", "redefining", "paradigm shift", "game-changer", "foster", "embark", "landscape", "look no further", "in today's fast-paced world", "ultimate guide", "not only... but also", "crucial role", "leverage", "seamlessly", "unprecedented", "navigate", "robust", "holistic", "synergy", "cutting-edge", "bespoke", "transformative", "unlock".
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
7. Internal Linking: The following are key PIKORUA corridor pages with their exact URL paths. When you naturally mention any of these areas in the article, hyperlink the FIRST occurrence using an HTML anchor tag (e.g. <a href="/sindhu-bhavan-road-properties">Sindhu Bhavan Road</a>). Do NOT force mentions — only link where they occur naturally in the text. Do NOT add target or rel attributes.
   - Sindhu Bhavan Road → /sindhu-bhavan-road-properties
   - Iskon-Ambli Road OR Iscon Ambli Road → /iscon-ambli-road-properties
   - Thaltej → /thaltej-properties
   - Shilaj → /shilaj-properties
   - Vaishno Devi → /vaishno-devi-properties
   - SG Highway → /sg-highway-properties
   - NRI advisory OR NRI property investment → /nri-property-investment-ahmedabad
   - Luxury penthouses OR duplexes → /penthouses-ahmedabad
   - Luxury villas OR bungalows → /villas-bungalows-ahmedabad

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

    const result = (await response.json()) as OpenRouterChatResponse;
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

    const draft = JSON.parse(cleanJson) as BlogDraft;
    if (ogImage) {
      draft.coverImage = ogImage;
    }
    return { success: true, draft };
  } catch (error: unknown) {
    console.error("Error in generateBlogDraftFromNews:", error);
    return { success: false, error: getErrorMessage(error, "Failed to generate blog post.") };
  }
}

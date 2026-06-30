// Google News Decoder helper
function decodeGoogleNewsUrl(googleUrl) {
  try {
    const urlParts = googleUrl.split('/');
    const base64Part = urlParts[urlParts.length - 1]?.split('?')[0];
    if (!base64Part) return googleUrl;
    
    const decodedBuffer = Buffer.from(base64Part, 'base64');
    const decodedString = decodedBuffer.toString('binary');
    const match = decodedString.match(/https?:\/\/[a-zA-Z0-9_\-\.\/\?=&%]+/);
    if (match) {
      return match[0];
    }
    return googleUrl;
  } catch {
    return googleUrl;
  }
}

// Scrape helper
async function scrapeUrlText(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) return { text: "", ogImage: null };
    const html = await response.text();

    let ogImage = null;
    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogImageMatch) {
      ogImage = ogImageMatch[1];
    } else {
      const twitterImageMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
                                html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
      if (twitterImageMatch) {
        ogImage = twitterImageMatch[1];
      }
    }

    if (ogImage && !ogImage.startsWith("http://") && !ogImage.startsWith("https://")) {
      ogImage = new URL(ogImage, url).href;
    }

    return { text: html.substring(0, 100), ogImage };
  } catch (err) {
    console.error(err);
    return { text: "", ogImage: null };
  }
}

async function run() {
  const rssUrl = "https://news.google.com/rss/search?q=Ahmedabad+real+estate+luxury+OR+Gujarat+RERA&hl=en-IN&gl=IN&ceid=IN:en";
  const rssRes = await fetch(rssUrl);
  const xml = await rssRes.text();
  
  const linkMatches = xml.match(/<link>(.*?)<\/link>/g);
  if (!linkMatches) {
    console.log("No links found in RSS");
    return;
  }
  
  console.log(`Found ${linkMatches.length} links. Testing first 3 links:\n`);
  
  for (let i = 1; i <= 3; i++) {
    const rawLink = linkMatches[i].replace(/<\/?link>/g, "").trim();
    console.log(`[${i}] Raw Google Link:`, rawLink);
    const decoded = decodeGoogleNewsUrl(rawLink);
    console.log(`[${i}] Decoded Link:`, decoded);
    
    const scraped = await scrapeUrlText(decoded);
    console.log(`[${i}] Scraped Image:`, scraped.ogImage);
    console.log("-------------------------------------------\n");
  }
}

run();

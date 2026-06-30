const { GoogleDecoder } = require('google-news-url-decoder');

const googleNewsUrl = 'https://news.google.com/rss/articles/CBMijwFBVV95cUxOVXNZM0hyQ20yeHAweW5LUXZYNU9YVzdQX2JKM2pkQnVyaDRwUm1ZQ3ZYa3lQRm16US1Sdmp6M2VuUzVXb0pxWUdwdHNLUEpWVHRXX1RQTWNNWUN2RUlVb3RHYnB3VXFSYlJLQkdjcFJFOWIzSEgyYXRuTkhtTTBMLTdsdFYzQ3FOSDRWcEZWSQ?oc=5';

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
    console.error("Scrape error:", err.message);
    return { text: "", ogImage: null };
  }
}

async function run() {
  const decoder = new GoogleDecoder();
  try {
    const result = await decoder.decode(googleNewsUrl);
    console.log("Decoded Result status:", result.status);
    if (result.status && result.decoded_url) {
      console.log("Original Target URL:", result.decoded_url);
      const scraped = await scrapeUrlText(result.decoded_url);
      console.log("SUCCESS! Scraped original image:", scraped.ogImage);
    } else {
      console.log("Failed to decode URL:", result.message);
    }
  } catch (err) {
    console.error("Error decoding url:", err.message);
  }
}

run();

const link = "https://news.google.com/rss/articles/CBMijwFBVV95cUxOVXNZM0hyQ20yeHAweW5LUXZYNU9YVzdQX2JKM2pkQnVyaDRwUm1ZQ3ZYa3lQRm16US1Sdmp6M2VuUzVXb0pxWUdwdHNLUEpWVHRXX1RQTWNNWUN2RUlVb3RHYnB3VXFSYlJLQkdjcFJFOWIzSEgyYXRuTkhtTTBMLTdsdFYzQ3FOSDRWcEZWSQ?oc=5";

async function run() {
  console.log("Fetching Google News link:", link);
  const response = await fetch(link, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }
  });

  console.log("Response Status:", response.status);
  console.log("Final Redirected URL:", response.url);
  
  const html = await response.text();
  console.log("HTML length:", html.length);
  
  // Look for og:image
  let ogImage = null;
  const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                       html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogImageMatch) {
    ogImage = ogImageMatch[1];
  }
  console.log("Scraped og:image:", ogImage);
}

run();

const url = "https://lh3.googleusercontent.com/J6_coFbogxhRI9iM864NL_liGXvsQp2AupsKei7z0cNNfDvGUmWUy20nuUhkREQyrpY4bEeIBuc=s0-w300-rw";

function getHighResImageUrl(imgUrl) {
  if (!imgUrl) return imgUrl;
  
  // 1. Google User Content (lh3.googleusercontent.com / googleusercontent)
  if (imgUrl.includes("googleusercontent.com")) {
    // Replace size parameters at the end (e.g. =s300, =w300-rw, =s0-w300-rw) with =s1600
    const cleaned = imgUrl.replace(/=[ws0-9\-r]+$/, "=s1600");
    return cleaned;
  }
  
  // 2. Indian Express / Times of India / Economic Times query parameters
  try {
    const urlObj = new URL(imgUrl);
    // Remove resizing query parameters
    urlObj.searchParams.delete("width");
    urlObj.searchParams.delete("height");
    urlObj.searchParams.delete("w");
    urlObj.searchParams.delete("h");
    urlObj.searchParams.delete("resize");
    return urlObj.toString();
  } catch {
    return imgUrl;
  }
}

console.log("Original:", url);
console.log("High Res:", getHighResImageUrl(url));

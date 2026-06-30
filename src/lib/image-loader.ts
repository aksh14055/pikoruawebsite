export default function weservLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // SVG images do not need resizing/optimization
  if (src.endsWith(".svg")) return src;

  // Local development check for local assets
  if (src.startsWith("/") && !src.startsWith("//")) {
    if (process.env.NODE_ENV === "development") {
      return src;
    }
  }

  if (src.includes("localhost") || src.includes("127.0.0.1")) {
    return src;
  }

  // Convert relative paths to public absolute URLs for production proxying
  const absoluteUrl = src.startsWith("http")
    ? src
    : `https://www.pikorua.in${src.startsWith("/") ? src : `/${src}`}`;

  const q = quality || 75;

  // Route through the free, fast, and cached weserv.nl Cloudflare image optimization proxy
  return `https://images.weserv.nl/?url=${encodeURIComponent(absoluteUrl)}&w=${width}&q=${q}&output=webp`;
}

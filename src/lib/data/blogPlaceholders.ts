// Curated fallback covers for AI-drafted blog posts that didn't scrape a
// usable og:image from their source article. Add more here as they're shot.
export const BLOG_PLACEHOLDER_COVERS = [
  "/blog/blog-discretion-cover.png",
  "/blog/blog-pikorua-consulting-cover.png",
];

export function pickPlaceholderCover(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return BLOG_PLACEHOLDER_COVERS[hash % BLOG_PLACEHOLDER_COVERS.length];
}

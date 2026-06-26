export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: "market-report" | "advisory" | "nri-insights" | "corridor-spotlight";
  categoryLabel: string;
  publishedAt: string;
  readTime: string;
  excerpt: string;
  coverImage: string;
  content: string[]; // Array of paragraphs to keep layout structure clean
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  isActive?: boolean;
  updatedAt?: string;
  /** Slugs of related /locations or /property-types landing pages to cross-link from this post */
  relatedLandingSlugs?: string[];
  /** Rich HTML body from DOCX import — takes precedence over content[] when set */
  htmlContent?: string;
}

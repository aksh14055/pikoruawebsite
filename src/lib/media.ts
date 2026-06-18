const BASE = "https://rwtueiruyktjzvsgdcoh.supabase.co/storage/v1/object/public/media";

export const MEDIA = {
  logo: "/logo.png",
  logoIcon: "/logo-icon.png",
  founder: `${BASE}/images/founder_v2.jpg`,
  videos: {
    hero: "/videos/hero.mp4",
    hero2: "/videos/hero2.mp4",
    bg: `${BASE}/videos/bg.mp4`,
    bg1: "/videos/bg_1.mp4",
    heroPoster: `${BASE}/videos/hero-poster.jpg`,
  },
} as const;

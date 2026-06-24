import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  {
    // Restrict content sources; adjust CDN/font origins as needed.
    // `unsafe-inline` is required for Tailwind's runtime styles in dev.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://cdn.sanity.io https://lh3.googleusercontent.com https://rwtueiruyktjzvsgdcoh.supabase.co https://img.youtube.com https://i.ytimg.com",
      "media-src 'self' https://cdn.sanity.io https://rwtueiruyktjzvsgdcoh.supabase.co",
      "connect-src 'self' https://*.supabase.co https://api.sanity.io https://cdn.sanity.io https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com",
      "frame-src https://www.youtube.com https://youtube.com https://www.google.com https://maps.google.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "rwtueiruyktjzvsgdcoh.supabase.co",
        pathname: "/storage/v1/object/public/media/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "pikorua.in",
          },
        ],
        destination: "https://www.pikorua.in/:path*",
        permanent: true,
      },
      {
        // Ikebana: corrected configuration/size, old slug embedded outdated figures
        source: "/properties/4-5-bhk-penthouse-duplex-7300-15500-sindhu-bhavan",
        destination: "/properties/5-bhk-3300-6300-sindhu-bhavan",
        permanent: true,
      },
    ];
  },
  // Silence workspace-root detection warning when pnpm-lock exists at a parent level
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

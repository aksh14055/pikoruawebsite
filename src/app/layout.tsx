import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Preloader } from "@/components/ui/Preloader";
import { LazyLeadCapturePopup } from "@/components/ui/LazyLeadCapturePopup";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { WebVitalsReporter } from "@/components/analytics/WebVitalsReporter";
import { env } from "@/lib/env";
import { absoluteUrl, serializeJsonLd, SITE_NAME, SITE_URL, GOOGLE_BUSINESS_PROFILE_URL } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - Ahmedabad's Finest Luxury Residences`,
    template: `%s | ${SITE_NAME}`,
  },
  icons: {
    icon: "/logo-icon.png",
    shortcut: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
  description:
    "A private gateway to Ahmedabad's finest luxury residences, curated privately for buyers, NRIs, investors, and sellers.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Ahmedabad's Finest Luxury Residences`,
    description:
      "A private gateway to Ahmedabad's finest luxury residences, curated privately for discerning buyers.",
    images: [{ url: absoluteUrl("/logo.png") }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "A private gateway to Ahmedabad's finest luxury residences.",
    images: [absoluteUrl("/logo.png")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "google91c2c9a5f53b75d8.html",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: {
        "@id": `${SITE_URL}#real-estate-agent`,
      },
      inLanguage: "en-IN",
    },
    {
      "@type": ["RealEstateAgent", "LocalBusiness"],
      "@id": `${SITE_URL}#real-estate-agent`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: absoluteUrl("/logo-icon.png"),
      image: absoluteUrl("/logo.png"),
      description:
        "Private luxury residential real estate advisory for Ahmedabad buyers, sellers, investors, and NRI clients.",
      sameAs: [
        "https://www.instagram.com/pikorua.realty?igsh=MTN5d2NmNW1yY3Vvag==",
        "https://www.facebook.com/share/18tH6uh55f/?mibextid=wwXIfr",
        "https://www.linkedin.com/company/pikorua-realty/posts/?feedView=all",
        "https://youtube.com/@pikorua_realty_official?si=M3r65vxOcgUvdGfi",
        // Google Business Profile — links the schema entity to the verified
        // local GMB listing for local SEO knowledge-graph association
        GOOGLE_BUSINESS_PROFILE_URL,
      ],
      areaServed: {
        "@type": "City",
        name: "Ahmedabad",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
      knowsAbout: [
        "Luxury apartments in Ahmedabad",
        "Penthouses in Ahmedabad",
        "Duplex homes in Ahmedabad",
        "Villas and bungalows in Ahmedabad",
        "Premium residential plots in Ahmedabad",
        "NRI property purchase in Gujarat",
        "Private residential real estate advisory",
        "Luxury residential investment in Ahmedabad",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Iskon-Ambli Road",
        addressLocality: "Ahmedabad",
        addressRegion: "Gujarat",
        postalCode: "380058",
        addressCountry: "IN",
      },
      // Google Maps URL — hasMap links the schema entity directly to the
      // verified Google Business Profile map listing (Local SEO signal)
      hasMap: GOOGLE_BUSINESS_PROFILE_URL,
      email: "connect@pikorua.in",
      telephone: `+${env.WHATSAPP_NUMBER}`,
      priceRange: "₹₹₹₹",
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: `+${env.WHATSAPP_NUMBER}`,
          contactType: "sales",
          areaServed: ["IN", "AE", "US", "GB", "SG", "CA", "AU"],
          availableLanguage: ["en", "hi", "gu"],
        },
        {
          "@type": "ContactPoint",
          email: "connect@pikorua.in",
          contactType: "customer support",
          areaServed: "IN",
          availableLanguage: ["en", "hi", "gu"],
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        bestRating: "5",
        worstRating: "1",
        ratingCount: "6",
        reviewCount: "6",
      },
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Private luxury property buying advisory",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Discreet seller representation",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "NRI residential property advisory",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} h-full`}
    >
      <head>
        {/* Eliminate cold TCP/TLS handshake for Supabase CDN (hero video, property images, founder avatar) */}
        <link rel="preconnect" href="https://rwtueiruyktjzvsgdcoh.supabase.co" crossOrigin="anonymous" />
        {/* DNS prefetch for third-party analytics scripts — avoids DNS lookup latency on first tag fire */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="alternate" type="text/plain" title="PIKORUA Realty AI index" href={absoluteUrl("/llms.txt")} />
        <link
          rel="alternate"
          type="text/plain"
          title="PIKORUA Realty full AI content index"
          href={absoluteUrl("/llms-full.txt")}
        />
      </head>
      <body className="min-h-full flex flex-col bg-lux-black text-ivory antialiased">
        <GoogleAnalytics />
        <GoogleTagManager />
        <WebVitalsReporter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationSchema) }}
        />
        <Preloader />
        <LazyLeadCapturePopup />
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

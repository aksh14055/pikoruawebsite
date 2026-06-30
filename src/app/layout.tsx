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
      areaServed: [
        {
          "@type": "City",
          name: "Ahmedabad",
          sameAs: [
            "https://en.wikipedia.org/wiki/Ahmedabad",
            "https://www.wikidata.org/wiki/Q1070",
          ],
        },
        {
          "@type": "GeoShape",
          polygon: "23.00,72.44 23.08,72.44 23.08,72.54 23.00,72.54 23.00,72.44",
        },
      ],
      knowsAbout: [
        // Core luxury advisory
        "Luxury real estate consultant Ahmedabad",
        "Luxury property consultant Ahmedabad",
        "Luxury property broker Ahmedabad",
        "Luxury real estate broker Ahmedabad",
        "Luxury property dealer Ahmedabad",
        "Premium property consultant Ahmedabad",
        "Premium real estate consultant Ahmedabad",
        "Luxury home consultant Ahmedabad",
        "Luxury apartment consultant Ahmedabad",
        "Trusted luxury property consultant Ahmedabad",
        "Best luxury property consultant Ahmedabad",
        "Top luxury real estate broker Ahmedabad",
        "Luxury property advisory Ahmedabad",
        "Luxury real estate consultancy Ahmedabad",
        "Exclusive property consultant Ahmedabad",
        "Boutique real estate consultant Ahmedabad",
        "High end property consultant Ahmedabad",
        "Premium home broker Ahmedabad",
        "Luxury residential property Ahmedabad",
        "Luxury homes for sale Ahmedabad",
        // General discovery
        "Real estate in Ahmedabad",
        "Properties in Ahmedabad",
        "Ahmedabad real estate",
        "Ahmedabad properties",
        "Residential properties Ahmedabad",
        "Off-market properties Ahmedabad",
        "Real estate advisory Ahmedabad",
        "Property consultant Gujarat",
        // Buyer-intent
        "Buy luxury property in Ahmedabad",
        "Buy premium apartment in Ahmedabad",
        "Buy luxury flat in Ahmedabad",
        "Buy 4 BHK luxury apartment Ahmedabad",
        "Buy 5 BHK luxury apartment Ahmedabad",
        "Buy penthouse in Ahmedabad",
        "Buy duplex in Ahmedabad",
        "Buy bungalow in Ahmedabad",
        "Buy villa in Ahmedabad",
        "Buy luxury villa near Ahmedabad",
        "Buy premium home in Ahmedabad",
        "Ready to move luxury apartment Ahmedabad",
        "Under construction luxury projects Ahmedabad",
        "New luxury residential projects Ahmedabad",
        "Exclusive apartments for sale Ahmedabad",
        "Premium residences for sale Ahmedabad",
        "High rise luxury apartments Ahmedabad",
        "Gated community luxury apartments Ahmedabad",
        // Property types
        "Luxury 3 BHK Ahmedabad",
        "Luxury 4 BHK Ahmedabad",
        "Luxury 5 BHK Ahmedabad",
        "Premium 4 BHK Ahmedabad",
        "Premium 5 BHK Ahmedabad",
        "4 BHK flat for sale Ahmedabad luxury",
        "5 BHK flat for sale Ahmedabad luxury",
        "Luxury penthouse for sale Ahmedabad",
        "Luxury duplex Ahmedabad",
        "Duplex apartment for sale Ahmedabad",
        "Bungalow for sale Ahmedabad",
        "Luxury bungalow Ahmedabad",
        "Villa for sale Ahmedabad",
        "Luxury villa Ahmedabad",
        "Weekend villa near Ahmedabad",
        "Farmhouse near Ahmedabad",
        "Premium plot for sale Ahmedabad",
        "Residential plot Ahmedabad premium",
        "Luxury ready possession flat Ahmedabad",
        "Luxury under construction apartment Ahmedabad",
        // Area and locality
        "Luxury property Sindhu Bhavan Road",
        "Luxury flats Sindhu Bhavan Road Ahmedabad",
        "Luxury apartment SBR Ahmedabad",
        "Premium property SBR Ahmedabad",
        "Luxury property Iscon Ambli Road",
        "Luxury flats Iscon Ambli Road Ahmedabad",
        "Premium apartment Iscon Ambli Road",
        "Luxury property Thaltej Ahmedabad",
        "Luxury property Vastrapur Ahmedabad",
        "Luxury property Bodakdev Ahmedabad",
        "Luxury flat Bodakdev Ahmedabad",
        "Luxury property Satellite Ahmedabad",
        "Premium property Prahlad Nagar Ahmedabad",
        "Luxury flat near SG Highway Ahmedabad",
        "Luxury property near Rajpath Club",
        "Luxury property near Karnavati Club",
        "Luxury apartment near Ahmedabad Airport",
        // Investment and NRI
        "NRI property consultant Ahmedabad",
        "NRI real estate advisor Ahmedabad",
        "NRI property investment Ahmedabad",
        "Luxury property investment Ahmedabad",
        "Premium property investment Ahmedabad",
        "Best areas to invest in Ahmedabad property",
        "Real estate investment consultant Ahmedabad",
        "Buy property in Ahmedabad from abroad",
        "NRI home buying assistance Ahmedabad",
        "Luxury home investment Ahmedabad",
        "Rental yield property Ahmedabad",
        "Capital appreciation property Ahmedabad",
        // Seller-intent
        "Sell luxury property Ahmedabad",
        "Sell premium apartment Ahmedabad",
        "Luxury property resale consultant Ahmedabad",
        "Luxury home resale Ahmedabad",
        "Sell bungalow Ahmedabad",
        "Sell penthouse Ahmedabad",
        "Property valuation Ahmedabad luxury",
        "Luxury property marketing Ahmedabad",
        "Exclusive property listing Ahmedabad",
        "Find buyer for luxury property Ahmedabad",
        "Trusted property broker Ahmedabad",
      ],

      address: {
        "@type": "PostalAddress",
        streetAddress: "Iskon-Ambli Road",
        addressLocality: "Ahmedabad",
        addressRegion: "Gujarat",
        postalCode: "380058",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "23.0246",
        longitude: "72.5074",
      },
      hasMap: GOOGLE_BUSINESS_PROFILE_URL,
      review: [
        {
          "@type": "Review",
          author: {
            "@type": "Person",
            name: "Krunal Patel",
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
          },
          reviewBody: "We are incredibly grateful to Jitendra bhai for helping us find and purchase our dream home! From the very beginning, he was professional, attentive, and genuinely invested in understanding our needs.",
        },
        {
          "@type": "Review",
          author: {
            "@type": "Person",
            name: "Rutuja Joshi",
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
          },
          reviewBody: "Navigating the complexities of luxury real estate requires not just expertise, but a rare blend of patience, discernment, and unwavering integrity; qualities that Jitendra embodies effortlessly.",
        },
      ],
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

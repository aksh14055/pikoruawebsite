import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Preloader } from "@/components/ui/Preloader";
import { LeadCapturePopup } from "@/components/ui/LeadCapturePopup";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { WebVitalsReporter } from "@/components/analytics/WebVitalsReporter";
import { env } from "@/lib/env";
import { absoluteUrl, serializeJsonLd, SITE_NAME, SITE_URL } from "@/lib/seo";
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
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${SITE_URL}#real-estate-agent`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/logo-icon.png"),
  image: absoluteUrl("/logo-icon.png"),
  description:
    "Private luxury residential real estate advisory for Ahmedabad buyers, sellers, investors, and NRI clients.",
  sameAs: [
    "https://www.instagram.com/pikorua.realty?igsh=MTN5d2NmNW1yY3Vvag==",
    "https://www.facebook.com/share/18tH6uh55f/?mibextid=wwXIfr",
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
    "Villas and bungalows in Ahmedabad",
    "NRI property purchase in Gujarat",
    "Private residential real estate advisory",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ahmedabad",
    addressRegion: "Gujarat",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: `+${env.WHATSAPP_NUMBER}`,
    contactType: "sales",
  },
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
      <body className="min-h-full flex flex-col bg-lux-black text-ivory antialiased">
        <GoogleTagManager />
        <WebVitalsReporter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationSchema) }}
        />
        <Preloader />
        <LeadCapturePopup />
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

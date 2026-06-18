import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Preloader } from "@/components/ui/Preloader";
import { LeadCapturePopup } from "@/components/ui/LeadCapturePopup";
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
    default: "PIKORUA Realty — Ahmedabad's Finest Luxury Residences",
    template: "%s | PIKORUA Realty",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
  description:
    "A private gateway to Ahmedabad's finest luxury residences — curated, never listed. Apartments, penthouses, villas, bungalows, and premium plots for discerning buyers, NRIs, and investors.",
  metadataBase: new URL("https://pikorua.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://pikorua.in",
    siteName: "PIKORUA Realty",
    title: "PIKORUA Realty — Ahmedabad's Finest Luxury Residences",
    description:
      "A private gateway to Ahmedabad's finest luxury residences — curated, never listed.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PIKORUA Realty",
    description: "A private gateway to Ahmedabad's finest luxury residences.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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

import Link from "next/link";
import type { Metadata } from "next";
import { env } from "@/lib/env";
import { buildWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Thank You",
  description: "We've received your enquiry and will be in touch shortly.",
  robots: { index: false, follow: false },
};

interface ThankYouPageProps {
  searchParams: Promise<{ source?: string; purpose?: string }>;
}

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const params = await searchParams;
  const isSeller = params.purpose === "selling";
  const isNri = params.purpose === "nri-purchase";

  const message = isSeller
    ? "We'll reach out to discuss a discreet representation for your property."
    : isNri
    ? "We'll be in touch shortly — and we're happy to connect across time zones."
    : "We'll review your preferences and reach out with curated residential options.";

  const whatsappUrl = buildWhatsAppUrl(
    env.WHATSAPP_NUMBER,
    "Hi, I just submitted an enquiry on pikorua.in"
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--lux-black)",
        color: "var(--ivory)",
        fontFamily: "system-ui, sans-serif",
        gap: "1.5rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#C8A45D",
        }}
      >
        PIKORUA Realty
      </p>
      <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 400 }}>
        Your enquiry is received.
      </h1>
      <p style={{ color: "#9ca3af", maxWidth: "440px", lineHeight: 1.8 }}>
        {message}
      </p>
      <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
        In the meantime, reach us directly on WhatsApp:
      </p>
      <a
        href={whatsappUrl}
        style={{
          padding: "0.75rem 2rem",
          background: "#25D366",
          color: "#fff",
          textDecoration: "none",
          fontSize: "0.875rem",
          borderRadius: "4px",
          letterSpacing: "0.02em",
        }}
      >
        Speak on WhatsApp
      </a>
      <Link
        href="/"
        style={{
          color: "#C8A45D",
          textDecoration: "none",
          fontSize: "0.875rem",
          letterSpacing: "0.05em",
          marginTop: "0.5rem",
        }}
      >
        Return Home
      </Link>
    </div>
  );
}

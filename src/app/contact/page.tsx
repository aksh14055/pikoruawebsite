import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import type { LeadPurpose } from "@/types";

// ─── URL purpose → LeadPurpose mapping ───────────────────────────────────────
// ?purpose=buy → self-use, ?purpose=sell → selling, etc.

const PURPOSE_MAP: Record<string, LeadPurpose> = {
  buy:     "self-use",
  sell:    "selling",
  nri:     "nri-purchase",
  invest:  "investment",
  explore: "exploring",
};

import { getPageSeoData } from "@/lib/supabase/queries";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoData("contact");
  const defaultTitle = "Get In Touch | PIKORUA Realty";
  const defaultDesc = "Begin a private conversation with PIKORUA Realty. Whether you're looking to buy, sell, or invest in Ahmedabad's finest residential properties — we respond personally.";

  return {
    title: seo?.seoTitle || defaultTitle,
    description: seo?.seoDescription || defaultDesc,
    alternates: { canonical: "https://pikorua.in/contact" },
  };
}

interface ContactPageProps {
  searchParams: Promise<{ purpose?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { purpose: rawPurpose } = await searchParams;
  const purposeKey = rawPurpose?.toLowerCase() ?? "";
  const initialPurpose: LeadPurpose | "" = PURPOSE_MAP[purposeKey] ?? "";

  return (
    <>
      <Header alwaysSolid />
      <main>
        <ContactHero purpose={purposeKey} />
        <ContactFormSection initialPurpose={initialPurpose} />
      </main>
      <Footer />
    </>
  );
}

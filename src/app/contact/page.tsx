import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { FAQ_ITEMS } from "@/lib/data/faq";
import { createMetadata, serializeJsonLd } from "@/lib/seo";
import { getPageSeoData } from "@/lib/supabase/queries";
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

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoData("contact");
  const defaultTitle = "Private Real Estate Consultation";
  const defaultDesc = "Begin a private conversation with PIKORUA Realty. Whether you're looking to buy, sell, or invest in Ahmedabad's finest residential properties — we respond personally.";

  return createMetadata({
    title: seo?.seoTitle || defaultTitle,
    description: seo?.seoDescription || defaultDesc,
    path: "/contact",
  });
}

interface ContactPageProps {
  searchParams: Promise<{ purpose?: string }>;
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { purpose: rawPurpose } = await searchParams;
  const purposeKey = rawPurpose?.toLowerCase() ?? "";
  const initialPurpose: LeadPurpose | "" = PURPOSE_MAP[purposeKey] ?? "";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <Header alwaysSolid />
      <main>
        <ContactHero purpose={purposeKey} />
        <ContactFormSection initialPurpose={initialPurpose} />
        <section className="bg-lux-black py-16 lg:py-24 border-t border-white/[0.06]" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-2 flex flex-col items-center mb-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-champagne-gold font-sans font-medium">
                Common Questions
              </p>
              <div className="w-8 h-px bg-champagne-gold/50" aria-hidden="true" />
              <h2
                id="faq-heading"
                className="font-display text-[clamp(1.5rem,3vw,2rem)] font-light text-white uppercase tracking-wider text-center mt-2"
              >
                Frequently Asked Questions
              </h2>
            </div>
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

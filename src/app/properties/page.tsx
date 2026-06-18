import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertiesGrid } from "@/components/properties/PropertiesGrid";
import { STATIC_PROPERTIES } from "@/lib/data/properties";
import { getSupabaseProperties, getPageSeoData } from "@/lib/supabase/queries";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoData("properties");
  const defaultTitle = "Properties — PIKORUA Realty";
  const defaultDesc = "Browse PIKORUA's curated portfolio of luxury real estate in Ahmedabad with a residential-first focus — apartments, penthouses, duplexes, villas, bungalows, premium plots, and strategic investments.";

  return {
    title: seo?.seoTitle || defaultTitle,
    description: seo?.seoDescription || defaultDesc,
    alternates: { canonical: "https://pikorua.in/properties" },
  };
}

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const dbProperties = await getSupabaseProperties({ onlyActive: true });
  const properties = dbProperties.length > 0 ? dbProperties : STATIC_PROPERTIES;

  return (
    <>
      <Header alwaysSolid />
      <main id="main-content">
        {/* Page hero */}
        <section className="bg-lux-black pt-24 pb-8 lg:pt-32 lg:pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="w-6 h-px bg-champagne-gold/40 mb-4" aria-hidden="true" />
            <p className="text-[9px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-3">
              Private Inventory
            </p>
            <h1 className="font-display text-[clamp(1.25rem,2.2vw,1.75rem)] font-normal text-ivory leading-tight uppercase tracking-wider">
              The Collection
            </h1>
            <p className="mt-3 text-ivory/50 font-sans text-xs max-w-sm leading-relaxed">
              A refined shortlist of Ahmedabad's premier residences and land parcels, curated for architectural distinction.
            </p>
          </div>
        </section>

        <PropertiesGrid properties={properties} />
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PRIORITY_LOCATION_PAGES } from "@/lib/data/location-network";
import { ENTITY_IDS } from "@/lib/entity-profile";
import { absoluteUrl, createMetadata, serializeJsonLd, SITE_URL } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: "Ahmedabad Luxury Location Network | PIKORUA Realty",
    description:
      "Compare all 23 of Ahmedabad's luxury residential corridors — established western neighbourhoods and emerging villa, plot and growth markets — with pricing, buyer fit and access reality.",
    path: "/locations",
  });
}

const GROUPS = ["Established luxury area", "Growth and landed-property corridor"] as const;

const GROUP_COPY: Record<(typeof GROUPS)[number], { heading: string; description: string }> = {
  "Established luxury area": {
    heading: "Established Luxury Areas",
    description:
      "Mature western Ahmedabad neighbourhoods with deep social infrastructure, schools, clubs and resale demand.",
  },
  "Growth and landed-property corridor": {
    heading: "Growth and Landed-Property Corridors",
    description:
      "Expanding corridors suited to villas, plots and larger homes, where infrastructure delivery drives long-term value.",
  },
};

export default function LocationsIndexPage() {
  const pageUrl = absoluteUrl("/locations");

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: "Ahmedabad Luxury Location Network",
    description:
      "Compare all of Ahmedabad's luxury residential corridors, from established western neighbourhoods to emerging villa, plot and growth markets.",
    about: { "@id": ENTITY_IDS.realEstateAgent },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: PRIORITY_LOCATION_PAGES.map((page, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(page.href),
        name: page.label,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Locations", item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }} />
      <Header alwaysSolid />
      <main id="main-content">
        <section className="bg-lux-black pt-24 pb-8 lg:pt-32 lg:pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="w-6 h-px bg-champagne-gold/40 mb-4" aria-hidden="true" />
            <p className="text-[9px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-3">
              Location Expertise
            </p>
            <h1 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-normal text-ivory leading-tight uppercase tracking-wider">
              Ahmedabad&rsquo;s Luxury Location Network
            </h1>
            <p className="mt-4 max-w-2xl text-ivory/50 font-sans text-sm leading-relaxed">
              Compare established western neighbourhoods with emerging villa, plot and growth corridors — each with its own buyer profile, access reality and investment case.
            </p>
          </div>
        </section>

        {GROUPS.map((group) => {
          const pages = PRIORITY_LOCATION_PAGES.filter((page) => page.eyebrow === group);
          const copy = GROUP_COPY[group];

          return (
            <section key={group} className="bg-soft-black py-14 lg:py-20 border-t border-white/[0.06]">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 max-w-2xl">
                  <h2 className="font-display text-[clamp(1.2rem,2vw,1.6rem)] font-normal text-ivory uppercase tracking-wider">
                    {copy.heading}
                  </h2>
                  <p className="mt-3 text-ivory/50 font-sans text-sm leading-relaxed">{copy.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-champagne-gold/[0.08]">
                  {pages.map((page) => (
                    <Link
                      key={page.slug}
                      href={page.href}
                      className="group bg-soft-black p-5 sm:p-7 border border-transparent hover:border-champagne-gold/40 hover:bg-lux-black transition-all duration-300 focus-visible:outline-2 focus-visible:outline-champagne-gold focus-visible:outline-offset-[-2px]"
                    >
                      <div className="w-6 h-px bg-champagne-gold/30 mb-4 group-hover:w-10 group-hover:bg-champagne-gold/60 transition-all duration-300" aria-hidden="true" />
                      <h3 className="font-display text-lg text-ivory mb-2 group-hover:text-champagne-gold transition-colors duration-200">
                        {page.label}
                      </h3>
                      <p className="text-xs font-sans text-ivory/35 leading-relaxed line-clamp-2">
                        {page.intro}
                      </p>
                      <span
                        className="block mt-4 text-champagne-gold/30 group-hover:text-champagne-gold group-hover:translate-x-1 transition-all duration-200 text-sm"
                        aria-hidden="true"
                      >
                        Explore corridor →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </>
  );
}

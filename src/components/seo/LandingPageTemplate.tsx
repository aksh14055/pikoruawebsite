import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { GeoLandingPage } from "@/lib/data/geo";
import { getLandingFilterHref, getRelatedLandingPages } from "@/lib/data/geo";
import type { StaticProperty } from "@/lib/data/properties";
import { PROPERTY_STATUS_LABELS, RESIDENTIAL_CATEGORY_LABELS } from "@/types";

interface LandingPageTemplateProps {
  page: GeoLandingPage;
  properties: StaticProperty[];
}

export function LandingPageTemplate({ page, properties }: LandingPageTemplateProps) {
  const relatedPages = getRelatedLandingPages(page);
  const collectionHref = getLandingFilterHref(page);

  return (
    <>
      <Header alwaysSolid />
      <main id="main-content" className="bg-lux-black text-ivory min-h-screen">
        <section className="relative min-h-[72vh] pt-28 pb-14 lg:pt-36 lg:pb-20 overflow-hidden border-b border-white/[0.06]">
          <Image
            src={page.heroImage}
            alt={page.h1}
            fill
            quality={75}
            preload
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-lux-black via-lux-black/82 to-lux-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-lux-black via-transparent to-lux-black/20" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <Breadcrumb
                items={[
                  { label: "Home", href: "/" },
                  page.kind === "location"
                    ? { label: "Locations", href: "/properties" }
                    : { label: "Properties", href: "/properties" },
                  { label: page.label },
                ]}
              />
              <div className="w-8 h-px bg-champagne-gold/60 mb-5" aria-hidden="true" />
              <p className="text-[10px] uppercase tracking-[0.28em] text-champagne-gold font-sans mb-4">
                {page.eyebrow}
              </p>
              <h1 className="font-display text-[clamp(2rem,5vw,4.5rem)] font-light uppercase tracking-wider leading-tight">
                {page.h1}
              </h1>
              <p className="mt-6 text-sm sm:text-base text-ivory/70 font-sans leading-relaxed max-w-2xl">
                {page.description}
              </p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link
                  href={collectionHref}
                  className="inline-flex min-h-[46px] items-center justify-center px-7 py-3 text-xs font-sans uppercase tracking-[0.2em] text-lux-black bg-champagne-gold hover:bg-antique-gold transition-colors duration-200 rounded-sm"
                >
                  View Matching Properties
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-[46px] items-center justify-center px-7 py-3 text-xs font-sans uppercase tracking-[0.2em] text-champagne-gold border border-champagne-gold/45 hover:border-champagne-gold hover:bg-champagne-gold/[0.05] transition-colors duration-200 rounded-sm"
                >
                  Request Private Advisory
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 border-b border-white/[0.06]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-4">
                Advisory View
              </p>
              <h2 className="font-display text-[clamp(1.5rem,3vw,2.4rem)] font-light uppercase tracking-wider leading-tight">
                What buyers should know
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-8">
              <p className="text-sm sm:text-base text-ivory/70 leading-relaxed font-sans">
                {page.intro}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.22em] text-champagne-gold font-sans mb-4">
                    Market Signals
                  </h3>
                  <ul className="space-y-3 text-sm text-ivory/60 font-sans leading-relaxed">
                    {page.marketSignals.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 rounded-full bg-champagne-gold flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-[0.22em] text-champagne-gold font-sans mb-4">
                    Best Fit
                  </h3>
                  <ul className="space-y-3 text-sm text-ivory/60 font-sans leading-relaxed">
                    {page.idealFor.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 rounded-full bg-champagne-gold flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 border-b border-white/[0.06]" aria-labelledby="matching-properties-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-3">
                  Private Collection
                </p>
                <h2
                  id="matching-properties-heading"
                  className="font-display text-[clamp(1.4rem,2.6vw,2rem)] font-light uppercase tracking-wider"
                >
                  Matching Residences
                </h2>
              </div>
              <Link
                href={collectionHref}
                className="text-xs font-sans uppercase tracking-[0.18em] text-champagne-gold hover:text-antique-gold transition-colors"
              >
                View Filtered Collection <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.slice(0, 6).map((property) => (
                  <Link
                    key={property.id}
                    href={`/properties/${property.slug}`}
                    className="group block border border-white/[0.07] bg-soft-black/50 rounded-sm overflow-hidden hover:border-champagne-gold/35 transition-colors duration-200"
                  >
                    <div className="relative aspect-[4/3] bg-soft-black overflow-hidden">
                      <Image
                        src={property.coverImage}
                        alt={`${property.configuration} in ${property.locationLabel}`}
                        fill
                        quality={75}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-champagne-gold/80 font-sans mb-2">
                        {property.locationLabel}
                      </p>
                      <h3 className="font-display text-lg text-ivory uppercase tracking-wide leading-tight">
                        {property.configuration}
                      </h3>
                      <p className="mt-2 text-sm text-ivory/55 font-sans">{property.sizeRange}</p>
                      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
                        <span className="text-xs text-ivory/45 font-sans">
                          {RESIDENTIAL_CATEGORY_LABELS[property.category]}
                        </span>
                        <span className="text-xs text-champagne-gold/80 font-sans uppercase tracking-[0.14em]">
                          {PROPERTY_STATUS_LABELS[property.status]}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="border border-white/[0.07] rounded-sm p-8 bg-soft-black/40">
                <p className="text-sm text-ivory/65 font-sans leading-relaxed max-w-2xl">
                  Public inventory for this brief is intentionally limited. Share your requirement and PIKORUA Realty can review private or off-market options aligned with this search.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Market Intelligence — rendered when bodyContent is populated.
            This section is the primary SEO/GEO content depth driver.
            700–1,000 words of named-entity-dense prose per page. */}
        {page.bodyContent && page.bodyContent.length > 0 && (
          <section
            className="py-16 lg:py-24 border-b border-white/[0.06]"
            aria-labelledby="market-intelligence-heading"
          >
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 flex flex-col items-start gap-3">
                <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans">
                  Market Intelligence
                </p>
                <div className="w-6 h-px bg-champagne-gold/40" aria-hidden="true" />
                <h2
                  id="market-intelligence-heading"
                  className="font-display text-[clamp(1.4rem,2.6vw,2rem)] font-light uppercase tracking-wider"
                >
                  {page.label} — Advisory Guide
                </h2>
              </div>
              <div className="space-y-6">
                {page.bodyContent.map((paragraph, index) => {
                  const isHeading = paragraph.startsWith("### ");
                  if (isHeading) {
                    return (
                      <h3
                        key={index}
                        className="font-display text-lg text-champagne-gold uppercase tracking-wide pt-4 first:pt-0"
                      >
                        {paragraph.replace(/^### /, "")}
                      </h3>
                    );
                  }
                  return (
                    <p
                      key={index}
                      className="text-sm sm:text-base text-ivory/70 font-sans leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section className="py-16 lg:py-24 border-b border-white/[0.06]" aria-labelledby="landing-faq-heading">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-3">
                Common Questions
              </p>
              <h2
                id="landing-faq-heading"
                className="font-display text-[clamp(1.4rem,2.6vw,2rem)] font-light uppercase tracking-wider"
              >
                Advisory FAQ
              </h2>
            </div>
            <FaqAccordion items={page.faqs} />
          </div>
        </section>

        {relatedPages.length > 0 && (
          <section className="py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-6">
                Related Guides
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPages.map((related) => (
                  <Link
                    key={related.href}
                    href={related.href}
                    className="group border border-white/[0.07] rounded-sm p-5 hover:border-champagne-gold/35 transition-colors"
                  >
                    <span className="text-[10px] uppercase tracking-[0.2em] text-ivory/35 font-sans">
                      {related.eyebrow}
                    </span>
                    <h3 className="mt-3 font-display text-lg uppercase tracking-wide text-ivory group-hover:text-champagne-gold transition-colors">
                      {related.label}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

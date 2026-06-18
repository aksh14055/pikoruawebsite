import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StatsStrip } from "@/components/ui/StatsStrip";
import { MEDIA } from "@/lib/media";
import { getSupabaseAboutPageContent, getPageSeoData } from "@/lib/supabase/queries";
import { FOUNDER_NAME, DEFAULT_HERO_TITLE, DEFAULT_FOUNDER_STORY } from "@/lib/data/about";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeoData("about");
  const defaultTitle = "About — PIKORUA Realty";
  const defaultDesc = "PIKORUA Realty is Ahmedabad's private luxury real estate advisory with a strong residential-first focus, founded on discretion, deep location intelligence, and the belief that the finest properties deserve a quieter way to be found.";

  return {
    title: seo?.seoTitle || defaultTitle,
    description: seo?.seoDescription || defaultDesc,
    alternates: { canonical: "https://pikorua.in/about" },
  };
}

export const dynamic = "force-dynamic";

const PRINCIPLES = [
  {
    label: "Discretion",
    body: "Your search, your sale, your investment — handled with complete confidentiality. No exposure without your consent.",
  },
  {
    label: "Curation",
    body: "We bring you a shortlist that matters. Not a hundred options — four that are right for you specifically.",
  },
  {
    label: "Presence",
    body: "From first conversation to handover, we remain involved. Not a platform. An advisor.",
  },
];

export default async function AboutPage() {
  const dbContent = await getSupabaseAboutPageContent();

  const heroTitle = dbContent?.heroTitle || DEFAULT_HERO_TITLE;
  const founderAvatar = dbContent?.founderAvatar || MEDIA.founder;
  const founderStory = dbContent?.founderStory || DEFAULT_FOUNDER_STORY;

  const renderTitle = (title: string) => {
    const parts = title.split(/(PIKORUA)/i);
    return parts.map((part, index) => 
      part.toUpperCase() === "PIKORUA" ? (
        <span key={index} className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-gold via-antique-gold to-champagne-gold font-normal">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "PIKORUA Realty",
    "url": "https://pikorua.in/about",
    "image": founderAvatar,
    "areaServed": {
      "@type": "City",
      "name": "Ahmedabad",
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "IN",
    },
    "founder": {
      "@type": "Person",
      "name": FOUNDER_NAME,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <Header alwaysSolid />
      <main id="main-content" className="relative bg-lux-black overflow-hidden">
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-champagne-gold/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-[-10%] w-[500px] h-[500px] bg-champagne-gold/5 rounded-full blur-[150px] pointer-events-none" />

        <section className="pt-32 pb-8 lg:pt-44 lg:pb-10 relative z-10" aria-labelledby="about-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Portrait */}
              <div className="lg:col-span-5 relative w-full max-w-sm aspect-[6/7] mx-auto lg:mx-0 translate-y-6 lg:translate-y-10 overflow-hidden bg-soft-black border border-white/[0.06] rounded-2xl group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <Image
                  src={founderAvatar}
                  alt={`${FOUNDER_NAME}, Founder of PIKORUA Realty`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-lux-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-4 border border-white/5 pointer-events-none rounded-xl" />
              </div>

              {/* Copy */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                <div className="space-y-2 flex flex-col items-center lg:items-start">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-champagne-gold font-sans font-medium">
                    Our Story
                  </p>
                  <div className="w-8 h-px bg-champagne-gold/50 mx-auto lg:mx-0" aria-hidden="true" />
                </div>

                <h1
                  id="about-heading"
                  className="font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-light text-white uppercase tracking-wider leading-tight text-center lg:text-left"
                >
                  {renderTitle(heroTitle)}
                </h1>

                <div className="space-y-6 text-ivory/80 font-sans font-light leading-relaxed text-center lg:text-left">
                  {founderStory.map((para: string, idx: number) => {
                    if (idx === 0) {
                      return (
                        <p 
                          key={idx} 
                          className="text-[clamp(1.05rem,2vw,1.25rem)] text-white font-light leading-relaxed tracking-wide"
                        >
                          {para}
                        </p>
                      );
                    }
                    return (
                      <p 
                        key={idx} 
                        className="text-sm sm:text-base md:text-lg leading-relaxed text-ivory/75 font-light"
                      >
                        {para}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <StatsStrip className="pt-0 lg:pt-0 border-t-0" />

        {/* Core Philosophy Section */}
        <section className="py-20 lg:py-32 border-t border-white/[0.04] relative z-10" aria-labelledby="principles-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-2 flex flex-col items-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.3em] text-champagne-gold font-sans font-medium">
                Our Values
              </p>
              <div className="w-8 h-px bg-champagne-gold/50 mx-auto" aria-hidden="true" />
              <h2 id="principles-heading" className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-light text-white uppercase tracking-wider leading-tight text-center pt-4">
                The Pillars of Our Practice
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {PRINCIPLES.map((principle) => (
                <div 
                  key={principle.label}
                  className="group relative p-8 lg:p-10 bg-soft-black/40 border border-white/[0.05] rounded-2xl transition-all duration-300 hover:border-champagne-gold/30 hover:bg-soft-black/70 hover:translate-y-[-4px] flex flex-col justify-between"
                >
                  {/* Subtle golden top-corner glow on hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-champagne-gold/0 to-transparent group-hover:via-champagne-gold/40 transition-all duration-500 rounded-t-2xl" />

                  <div className="space-y-4">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold/60 font-sans font-medium">
                      Pillar
                    </div>
                    <h3 className="font-display text-2xl lg:text-3xl font-light text-white uppercase tracking-wide">
                      {principle.label}
                    </h3>
                    <p className="text-sm lg:text-base leading-relaxed text-ivory/70 font-light font-sans">
                      {principle.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="bg-lux-black py-16 lg:py-24 border-t border-white/[0.04] relative z-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="w-12 h-px bg-champagne-gold/40 mx-auto" aria-hidden="true" />
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-light text-ivory leading-tight uppercase tracking-wider">
              Begin a private conversation.
            </h2>
            <p className="text-ivory/70 font-sans text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Reach out to us to schedule a confidential discussion about your luxury property requirements in Ahmedabad.
            </p>
            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-sans uppercase tracking-[0.2em] text-lux-black bg-champagne-gold hover:bg-antique-gold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne-gold min-h-[46px] shadow-lg shadow-champagne-gold/10 hover:shadow-champagne-gold/20"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


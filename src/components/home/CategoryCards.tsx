"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";
import type { ResidentialCategory } from "@/types";

interface Category {
  slug: ResidentialCategory;
  label: string;
  tagline: string;
  cta: string;
  imageUrl: string;
  location: string;
  href: string;
}

const CATEGORIES: Category[] = [
  { 
    slug: "apartment", 
    label: "Apartment", 
    tagline: "Curated tower residences in prime city corridors",
    cta: "Explore Apartments",
    imageUrl: "/properties/anamika/anamika.jpg",
    location: "Iskon-Ambli Road",
    href: "/property-types/luxury-apartments-ahmedabad"
  },
  { 
    slug: "penthouse", 
    label: "Penthouse", 
    tagline: "Elevated homes with skyline scale and privacy",
    cta: "Explore Penthouses",
    imageUrl: "/properties/belrosa/belrosa-3-view.jpg",
    location: "Sindhu Bhavan",
    href: "/property-types/penthouses-duplexes-ahmedabad"
  },
  { 
    slug: "duplex", 
    label: "Duplex", 
    tagline: "Multi-level residences with space, volume, and distinction",
    cta: "Explore Duplex Homes",
    imageUrl: "/properties/ikebana/ikebana1.png",
    location: "Science City",
    href: "/property-types/penthouses-duplexes-ahmedabad"
  },
  { 
    slug: "villa", 
    label: "Villa", 
    tagline: "Independent luxury living with privacy, land, and presence",
    cta: "Explore Villas",
    imageUrl: "/properties/belagio/belagio-pool.jpg",
    location: "Shilaj",
    href: "/property-types/villas-bungalows-ahmedabad"
  },
  { 
    slug: "plot", 
    label: "Plot / Land", 
    tagline: "Rare land parcels for homes and assets built with intention",
    cta: "Discuss Land Opportunities",
    imageUrl: "/properties/kalrav-alpines/kalrav-alpines-1.jpg",
    location: "Bhadaj",
    href: "/property-types/residential-plots-ahmedabad"
  },
  { 
    slug: "investment", 
    label: "Investment Property", 
    tagline: "Strategic real estate assets selected for long-term value",
    cta: "Explore Investment Properties",
    imageUrl: "/properties/eminence-96/eminence-96-3-pool.webp",
    location: "Thaltej",
    href: "/property-types/luxury-residential-investment-ahmedabad"
  },
];

export function CategoryCards() {
  const [activeCategory, setActiveCategory] = useState(0);
  const { ref } = useScrollReveal<HTMLDivElement>({ threshold: 0.05 });

  return (
    <section className="bg-[#FAF9F6] py-24 lg:py-32" aria-labelledby="category-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - Editorial 2-Column Layout */}
        <div className="mb-20 lg:mb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-black/[0.06] pb-10">
          <div className="lg:col-span-7">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#C8A45D] font-sans mb-4 font-medium">
              EXPLORE OUR PROPERTIES
            </p>
            <h2
              id="category-heading"
              className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-normal text-[#0B0B0B] leading-tight uppercase tracking-wider mb-6"
            >
              Every expression of luxury, curated.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pl-6">
            <p className="text-base font-sans text-[#0B0B0B]/55 leading-relaxed">
              From private residences and rare land parcels to select investment opportunities, PIKORUA curates properties around lifestyle, location, privacy, and long-term value.
            </p>
          </div>
        </div>

        {/* Curation Container */}
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Categories Index List (Desktop rows / Mobile accordions) */}
          <div className="lg:col-span-7 w-full">
            
            {/* Desktop Table List (Visible only on LG and up) */}
            <div className="hidden lg:flex flex-col">
              {CATEGORIES.map((cat, i) => {
                const isActive = activeCategory === i;
                return (
                  <Link
                    key={cat.slug}
                    href={cat.href}
                    onMouseEnter={() => setActiveCategory(i)}
                    className="border-b border-black/[0.06] relative block group/row"
                  >
                    {/* Active bottom line indicator */}
                    <div
                      className={cn(
                        "absolute bottom-[-1px] left-0 h-[2px] bg-[#C8A45D] transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] z-10",
                        isActive ? "w-full" : "w-0"
                      )}
                    />
                    
                    <div
                      className={cn(
                        "transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isActive ? "py-8 pl-6 bg-[#F7F3EA]/60" : "py-6 pl-0 group-hover/row:pl-4 group-hover/row:bg-[#F7F3EA]/20"
                      )}
                    >
                      <div className="flex items-start gap-8">
                        {/* Number Index */}
                        <span
                          className={cn(
                            "text-xs font-mono tracking-widest tabular-nums mt-1.5 transition-colors duration-300",
                            isActive ? "text-[#C8A45D]" : "text-black/35 group-hover/row:text-black/60"
                          )}
                        >
                          0{i + 1}
                        </span>

                        {/* Title and details block */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3
                              className={cn(
                                "font-display text-xl lg:text-2xl font-light tracking-wide transition-all duration-300",
                                isActive ? "text-[#0B0B0B] translate-x-2 font-normal" : "text-[#0B0B0B]/30 group-hover/row:text-[#0B0B0B]/60"
                              )}
                            >
                              {cat.label}
                            </h3>

                            {/* Arrow Indicator */}
                            <span
                              className={cn(
                                "text-lg font-sans transition-all duration-300 pr-6",
                                isActive ? "text-[#C8A45D] translate-x-1" : "text-black/20 group-hover/row:text-[#C8A45D]/60 group-hover/row:translate-x-1"
                              )}
                            >
                              →
                            </span>
                          </div>

                          {/* Expandable details content (tagline and CTA) */}
                          <div
                            className={cn(
                              "transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden",
                              isActive ? "max-h-[100px] opacity-100 mt-3 translate-x-2" : "max-h-0 opacity-0"
                            )}
                          >
                            <p className="text-sm font-sans text-[#0B0B0B]/55 leading-relaxed pr-8">
                              {cat.tagline}
                            </p>
                            <span
                              className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.15em] text-[#C8A45D] transition-colors duration-200 mt-3 font-medium border-b border-[#C8A45D]/30 pb-0.5"
                            >
                              {cat.cta}
                              <span className="transition-transform duration-200 group-hover/row:translate-x-1">→</span>
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile/Tablet Accordion Stack (Visible on smaller viewports) */}
            <div className="flex flex-col lg:hidden">
              {CATEGORIES.map((cat, i) => {
                const isActive = activeCategory === i;
                return (
                  <div
                    key={cat.slug}
                    className="border-b border-black/[0.06]"
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => setActiveCategory(isActive ? 0 : i)}
                      className={cn(
                        "w-full flex items-center justify-between py-5 text-left transition-all duration-300",
                        isActive ? "bg-[#F7F3EA]/35 px-4" : "bg-transparent px-0"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "text-[10px] font-mono tracking-widest tabular-nums",
                          isActive ? "text-[#C8A45D]" : "text-black/35"
                        )}>
                          0{i + 1}
                        </span>
                        <h3 className={cn(
                          "font-display text-[16px] sm:text-lg font-light tracking-wide transition-colors duration-300",
                          isActive ? "text-[#0B0B0B] font-normal" : "text-[#0B0B0B]/30"
                        )}>
                          {cat.label}
                        </h3>
                      </div>
                      <span className={cn(
                        "text-[#C8A45D] transition-transform duration-300 text-xs",
                        isActive ? "rotate-180" : ""
                      )}>
                        ▼
                      </span>
                    </button>

                    {/* Accordion Body */}
                    <div
                      className={cn(
                        "transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden",
                        isActive ? "max-h-[460px] opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className={cn(
                        "flex flex-col transition-all duration-300 pb-6",
                        isActive ? "px-4" : "px-0"
                      )}>
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-soft-black mb-4">
                          <Image
                            src={cat.imageUrl}
                            alt={cat.label}
                            fill
                            quality={90}
                            sizes="(max-width: 768px) 95vw, 40vw"
                            className="object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-lux-black/45 via-transparent to-transparent z-10" />
                          
                          {/* Metadata tag overlay on mobile */}
                          <div className="absolute bottom-4 right-4 z-20 bg-lux-black/80 backdrop-blur-sm px-3 py-1.5 rounded-sm text-[8px] font-sans uppercase tracking-[0.18em] text-ivory/80">
                            Asset · {cat.location}
                          </div>
                        </div>
                        
                        <p className="text-xs font-sans text-[#0B0B0B]/60 leading-relaxed">
                          {cat.tagline}
                        </p>

                        <Link
                          href={cat.href}
                          className="mt-5 inline-flex items-center justify-center w-full py-3.5 text-xs font-sans uppercase tracking-[0.15em] text-white bg-[#0B0B0B] hover:bg-[#C8A45D] transition-colors duration-300 min-h-[44px] rounded-sm font-semibold"
                        >
                          {cat.cta} →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT COLUMN: Cinematic Image Preview (Desktop only) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28 h-[580px] w-full bg-lux-black rounded-sm overflow-hidden border border-black/[0.03] shadow-2xl relative">
            {CATEGORIES.map((cat, idx) => {
              const isActive = activeCategory === idx;
              return (
                <div
                  key={cat.slug}
                  className={cn(
                    "absolute inset-0 transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isActive
                      ? "opacity-100 pointer-events-auto z-10"
                      : "opacity-0 pointer-events-none z-0"
                  )}
                >
                  <Image
                    src={cat.imageUrl}
                    alt={cat.label}
                    fill
                    quality={90}
                    sizes="40vw"
                    className={cn(
                      "object-cover object-center transition-transform duration-[1000ms] ease-out",
                      isActive ? "scale-100" : "scale-105"
                    )}
                    priority={idx === 0}
                  />
                  {/* Subtle dark overlay for premium depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-lux-black/80 via-lux-black/20 to-transparent z-20" />
                  
                  {/* Elegant double border frames overlay */}
                  <div className="absolute inset-3 border border-white/10 pointer-events-none z-30" />
                  <div className="absolute inset-4 border border-[#C8A45D]/20 pointer-events-none z-30" />
                  
                  {/* Premium editorial caption overlay */}
                  <div
                    className={cn(
                      "absolute bottom-8 left-8 right-8 z-30 text-left transition-all duration-[800ms] delay-100 ease-out",
                      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                  >
                    <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#C8A45D] mb-1.5 font-medium">
                      Featured Asset
                    </p>
                    <h4 className="font-display text-xl text-white font-light tracking-wide">
                      {cat.location}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Section Level Private Consultation CTA Card */}
        <div className="mt-24 lg:mt-28 bg-[#F7F3EA] border border-black/[0.04] p-8 lg:p-12 text-center max-w-3xl mx-auto rounded-sm relative overflow-hidden shadow-sm">
          {/* Elegant gold corner accents */}
          <div className="absolute top-4 left-4 w-4 h-[1px] bg-[#C8A45D]/40" />
          <div className="absolute top-4 left-4 w-[1px] h-4 bg-[#C8A45D]/40" />
          <div className="absolute bottom-4 right-4 w-4 h-[1px] bg-[#C8A45D]/40" />
          <div className="absolute bottom-4 right-4 w-[1px] h-4 bg-[#C8A45D]/40" />
          
          <h3 className="font-display text-xl lg:text-2xl font-light text-[#0B0B0B] mb-3">
            Not sure which property fits your brief?
          </h3>
          <p className="text-sm font-sans text-[#0B0B0B]/55 max-w-xl mx-auto mb-8 leading-relaxed">
            Our private advisors work selectively to source residences off-market. Share your requirements for a quiet, curated match.
          </p>
          <Link
            href="/contact#requirement"
            className="inline-flex items-center justify-center px-8 py-4 text-xs font-sans uppercase tracking-[0.2em] text-white bg-[#0B0B0B] hover:bg-[#C8A45D] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne-gold min-h-[48px] rounded-sm font-medium"
          >
            Begin Private Consultation →
          </Link>
        </div>
      </div>
    </section>
  );
}

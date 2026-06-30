"use client";

import Link from "next/link";
import { useScrollReveal, revealClasses } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";
import type { LocationSlug } from "@/types";

interface LocationItem {
  slug: Exclude<LocationSlug, "other">;
  label: string;
  descriptor: string;
}

const LOCATIONS: LocationItem[] = [
  { slug: "sg-highway",    label: "SG Highway",    descriptor: "Ahmedabad's premier luxury spine" },
  { slug: "sindhu-bhavan", label: "Sindhu Bhavan", descriptor: "Wide boulevards, luxury towers, prime connectivity" },
  { slug: "iskon-ambli",   label: "Iskon-Ambli",   descriptor: "West Corridor's established prestige address" },
  { slug: "thaltej",       label: "Thaltej",        descriptor: "Quiet residential charm with premium neighbours" },
  { slug: "shilaj",        label: "Shilaj",         descriptor: "Expanding luxury at Ahmedabad's growing edge" },
  { slug: "vaishno-devi",  label: "Vaishno Devi",  descriptor: "Upcoming corridor with exceptional value" },
];

export function LocationGrid() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="bg-soft-black py-20 lg:py-28" aria-labelledby="locations-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-4">
            Location Expertise
          </p>
          <h2
            id="locations-heading"
            className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-normal text-ivory leading-tight uppercase tracking-wider"
          >
            Six corridors we know intimately
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-champagne-gold/[0.08]">
          {LOCATIONS.map((loc, i) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className={cn(
                "group bg-soft-black p-5 sm:p-8 border border-transparent hover:border-champagne-gold/40 transition-all duration-300",
                "hover:bg-lux-black",
                "focus-visible:outline-2 focus-visible:outline-champagne-gold focus-visible:outline-offset-[-2px]",
                revealClasses.base,
                visible ? revealClasses.visible : revealClasses.hidden
              )}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="w-6 h-px bg-champagne-gold/30 mb-5 group-hover:w-10 group-hover:bg-champagne-gold/60 transition-all duration-300" aria-hidden="true" />
              <h3 className="font-display text-lg text-ivory mb-2 group-hover:text-champagne-gold transition-colors duration-200">
                {loc.label}
              </h3>
              <p className="text-xs font-sans text-ivory/35 leading-relaxed">
                {loc.descriptor}
              </p>
              <span
                className="block mt-5 text-champagne-gold/30 group-hover:text-champagne-gold group-hover:translate-x-1 transition-all duration-200 text-sm"
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
}

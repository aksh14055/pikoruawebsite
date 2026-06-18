"use client";

import Link from "next/link";
import { useScrollReveal, revealClasses } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    id: "buyer",
    label: "Buyer Advisory",
    description: "We source what's never listed — before others know it exists. Your brief stays confidential.",
    href: "/contact?purpose=buy",
  },
  {
    id: "seller",
    label: "Seller Representation",
    description: "Your home is introduced privately, never broadcast. Qualified buyers only.",
    href: "/contact?purpose=sell",
  },
  {
    id: "nri",
    label: "NRI Advisory",
    description: "Virtual access, time-zone flexibility, trusted on-ground representation.",
    href: "/contact?purpose=nri",
  },
  {
    id: "investment",
    label: "Investment Guidance",
    description: "Data-led selection in corridors that hold value — for those building a portfolio.",
    href: "/contact?purpose=invest",
  },
];

export function AdvisoryPillars() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="bg-lux-black py-24 lg:py-32" aria-labelledby="advisory-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-4">
            How We Serve
          </p>
          <h2
            id="advisory-heading"
            className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-normal text-ivory leading-tight uppercase tracking-wider"
          >
            Four ways we work with you
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-champagne-gold/[0.06]">
          {PILLARS.map((pillar, i) => (
            <div
              key={pillar.id}
              className={cn(
                "group bg-lux-black p-8 lg:p-10 hover:bg-soft-black transition-all duration-300",
                revealClasses.base,
                visible ? revealClasses.visible : revealClasses.hidden
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-8 h-px bg-champagne-gold/40 mb-6 group-hover:w-14 group-hover:bg-champagne-gold/70 transition-all duration-300" aria-hidden="true" />
              <h3 className="font-display text-xl text-ivory mb-3 group-hover:text-champagne-gold transition-colors duration-200">
                {pillar.label}
              </h3>
              <p className="text-sm font-sans text-ivory/40 leading-relaxed mb-6">
                {pillar.description}
              </p>
              <Link
                href={pillar.href}
                className="inline-flex items-center gap-1.5 text-xs font-sans text-champagne-gold/60 hover:text-champagne-gold tracking-[0.1em] uppercase transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-champagne-gold rounded-sm"
              >
                Start a conversation
                <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

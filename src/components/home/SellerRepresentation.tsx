"use client";

import Link from "next/link";
import { useScrollReveal, revealClasses } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const SELLER_PILLARS = [
  { label: "Absolute Discretion", detail: "No public portals, signboards, or visible listing marketing. Your address is protected." },
  { label: "Vetted HNI Network", detail: "Introduced only to verified buyers who have demonstrated both intent and financial capacity." },
  { label: "Data-Led Valuation", detail: "Strategic pricing based on private corridor transactions, not speculative portal listings." },
];

export function SellerRepresentation() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section className="bg-ivory py-20 lg:py-28" aria-labelledby="seller-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start",
            revealClasses.base,
            visible ? revealClasses.visible : revealClasses.hidden
          )}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-5">
              Seller Representation
            </p>
            <h2
              id="seller-heading"
              className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-normal text-lux-black leading-tight uppercase tracking-wider mb-6"
            >
              Your home deserves<br />
              a private introduction —<br />
              <span className="text-lux-black/30">not a public listing.</span>
            </h2>
            <p className="text-lux-black/50 font-sans text-base leading-relaxed mb-8 max-w-md">
              We represent exceptional residences exclusively to a pre-qualified audience.
              No signboards. No negotiation theatre. Just the right buyer, introduced quietly.
            </p>
            <Link
              href="/contact?purpose=sell"
              className="inline-flex items-center justify-center px-8 py-4 text-xs font-sans uppercase tracking-[0.2em] text-champagne-gold border border-champagne-gold/50 hover:bg-champagne-gold hover:text-lux-black transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne-gold min-h-[52px]"
            >
              Discuss Selling, Privately
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {SELLER_PILLARS.map((pillar) => (
              <div key={pillar.label} className="border-t border-lux-black/[0.08] pt-5">
                <h3 className="font-sans text-sm font-medium text-lux-black mb-2">{pillar.label}</h3>
                <p className="text-xs font-sans text-lux-black/40 leading-relaxed">{pillar.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

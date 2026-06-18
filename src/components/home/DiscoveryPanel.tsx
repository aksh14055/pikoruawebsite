"use client";

import Link from "next/link";
import { useScrollReveal, revealClasses } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

export function DiscoveryPanel() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section
      className="bg-ivory py-24 lg:py-32 border-y border-lux-black/[0.06]"
      aria-labelledby="discovery-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center",
            revealClasses.base,
            visible ? revealClasses.visible : revealClasses.hidden
          )}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-5">
              Guided Discovery
            </p>
            <h2
              id="discovery-heading"
              className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-normal text-lux-black leading-tight uppercase tracking-wider mb-6"
            >
              Tell us what you seek.<br />
              <span className="text-lux-black/35">We'll curate the rest.</span>
            </h2>
            <p className="text-lux-black/50 font-sans text-base leading-relaxed max-w-md">
              Answer a few thoughtful questions. We'll match you with residences
              that fit — not a list, but a shortlist worth your time.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <ol className="space-y-3" aria-label="Discovery steps">
              {[
                "Your intent — buying, selling, or investing",
                "Preferred location and residence type",
                "Budget range and timeline",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full border border-champagne-gold/60 bg-white text-[10px] font-sans font-medium text-champagne-gold flex items-center justify-center tabular-nums shadow-sm">
                    {i + 1}
                  </span>
                  <span className="text-sm font-sans text-lux-black/50 leading-relaxed pt-0.5">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-2">
              <Link
                href="/contact#discovery"
                className="inline-flex items-center gap-3 px-8 py-4 text-xs font-sans uppercase tracking-[0.2em] text-lux-black bg-champagne-gold hover:bg-antique-gold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne-gold min-h-[52px]"
              >
                Begin Guided Discovery
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

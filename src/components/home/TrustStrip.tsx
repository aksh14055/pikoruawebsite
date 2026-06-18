"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const ITEMS = [
  "Luxury Real Estate Advisory",
  "Curated Luxury Real Estate",
  "HNI & NRI Focused",
  "Ahmedabad Luxury Corridors",
];

export function TrustStrip() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ threshold: 0.5 });

  return (
    <div
      className="bg-soft-black border-b border-champagne-gold/20"
      aria-hidden="true"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="flex flex-wrap items-center justify-center lg:justify-between gap-y-4 py-5">
          {ITEMS.map((item, i) => (
            <div key={item} className="flex items-center gap-4 sm:gap-6">
              {i > 0 && (
                <div className="hidden sm:block w-px h-5 bg-champagne-gold/20" />
              )}
              <span
                className={cn(
                  "text-[10px] uppercase tracking-[0.22em] font-sans text-ivory/35 transition-all duration-500 ease-out",
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                )}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

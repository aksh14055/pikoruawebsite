"use client";

import { useScrollReveal, revealClasses } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface PositioningStatementProps {
  statement?: string;
}

export function PositioningStatement({
  statement = "PIKORUA is a private gateway to Ahmedabad's finest residences — for those who seek address over algorithm.",
}: PositioningStatementProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section className="bg-ivory py-24 lg:py-36" aria-label="About PIKORUA">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={cn(revealClasses.base, visible ? revealClasses.visible : revealClasses.hidden)}
        >
          <div className="w-12 h-px bg-champagne-gold/60 mb-10" aria-hidden="true" />
          <p className="font-display text-[clamp(1.5rem,3.5vw,2.75rem)] font-normal leading-[1.25] text-lux-black/85">
            {statement}
          </p>
          <div className="mt-10 flex items-center gap-4">
            <div className="w-8 h-px bg-champagne-gold/50" aria-hidden="true" />
            <p className="text-xs uppercase tracking-[0.2em] text-champagne-gold font-sans">
              Curated. Private. Ahmedabad.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

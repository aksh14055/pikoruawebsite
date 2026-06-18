"use client";

import { COMPANY_STATS } from "@/lib/data/stats";
import { cn } from "@/lib/utils";
import { useMarqueeSpeed } from "@/hooks/useMarqueeSpeed";

interface StatsStripProps {
  pauseOnHover?: boolean;
  className?: string;
  size?: "sm" | "lg";
  stats?: { value: string; label: string }[];
}

const VALUE_SIZE: Record<NonNullable<StatsStripProps["size"]>, string> = {
  sm: "text-[clamp(1.1rem,2vw,1.5rem)]",
  lg: "text-[clamp(1.75rem,3.5vw,2.75rem)]",
};

const LABEL_SIZE: Record<NonNullable<StatsStripProps["size"]>, string> = {
  sm: "text-[9px] sm:text-[10px]",
  lg: "text-[10px] sm:text-xs",
};

const GAP_SIZE: Record<NonNullable<StatsStripProps["size"]>, string> = {
  sm: "px-6 sm:px-10",
  lg: "px-8 sm:px-14",
};

export function StatsStrip({ pauseOnHover = true, className, size = "lg", stats }: StatsStripProps) {
  const { ref, durationSeconds } = useMarqueeSpeed<HTMLDivElement>();
  const displayedStats = stats && stats.length > 0 ? stats : COMPANY_STATS;

  return (
    <section
      className={cn("py-10 lg:py-14 border-t border-white/[0.04] relative z-10", className)}
      aria-label="PIKORUA Realty in numbers"
    >
      <div className={cn("w-full overflow-hidden relative", pauseOnHover && "marquee-container")}>
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-32 bg-gradient-to-r from-lux-black to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-32 bg-gradient-to-l from-lux-black to-transparent z-10 pointer-events-none" />
        <div
          ref={ref}
          className={cn(
            "flex items-center w-max",
            pauseOnHover ? "animate-marquee" : "animate-marquee-continuous"
          )}
          style={durationSeconds ? { animationDuration: `${durationSeconds}s` } : undefined}
        >
          {[...displayedStats, ...displayedStats].map((stat, idx) => (
            <div key={`${stat.label}-${idx}`} className="flex items-center flex-shrink-0">
              <div className={cn("flex flex-col items-center text-center", GAP_SIZE[size])}>
                <span className={cn("font-display font-light text-champagne-gold leading-none", VALUE_SIZE[size])}>
                  {stat.value}
                </span>
                <span className={cn("uppercase tracking-[0.2em] text-ivory/60 font-sans mt-2 whitespace-nowrap", LABEL_SIZE[size])}>
                  {stat.label}
                </span>
              </div>
              <span className="w-px h-10 bg-white/10" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

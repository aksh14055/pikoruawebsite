"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMarqueeSpeed } from "@/hooks/useMarqueeSpeed";
import { DEVELOPER_PARTNERS } from "@/lib/data/developer-partners";

interface PartnerMarqueeProps {
  className?: string;
  partners?: { name: string; src: string; width: number; height: number }[];
}

const getPartnerLogoStyles = (name: string) => {
  if (name.toLowerCase().includes("gala")) {
    return "h-11 sm:h-12 max-w-[140px] sm:max-w-[155px] scale-110";
  }
  if (name.toLowerCase().includes("ravi desai")) {
    return "h-11 sm:h-12 max-w-[160px] sm:max-w-[180px] scale-115";
  }
  return "h-9 sm:h-10 max-w-[140px] sm:max-w-[155px]";
};

export function PartnerMarquee({ className, partners: propPartners }: PartnerMarqueeProps) {
  const { ref: marqueeRef, durationSeconds } = useMarqueeSpeed<HTMLDivElement>(110); // Increased flow speed
  const activePartners = propPartners && propPartners.length > 0 ? propPartners : DEVELOPER_PARTNERS;
  const repeatedPartners = [...activePartners, ...activePartners];

  return (
    <section className={cn("py-12 border-y border-white/[0.04] bg-soft-black/20 relative z-10 overflow-hidden", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <h2 className="sr-only">Luxury Property Developer Alliances in Ahmedabad</h2>
        <ul className="sr-only">
          {activePartners.map((partner) => (
            <li key={partner.name}>{partner.name}</li>
          ))}
        </ul>
        <p className="text-[10px] uppercase tracking-[0.28em] text-champagne-gold/60 font-sans">
          Developer Alliances
        </p>
      </div>

      <div className="w-full overflow-hidden relative">
        {/* Soft edge masking for smooth fade edges */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-40 bg-gradient-to-r from-lux-black to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-40 bg-gradient-to-l from-lux-black to-transparent z-10 pointer-events-none" />

        <div
          ref={marqueeRef}
          className="flex items-center w-max animate-marquee-continuous"
          style={durationSeconds ? { animationDuration: `${durationSeconds}s` } : { animationDuration: "60s" }}
        >
          {repeatedPartners.map((partner, idx) => (
            <div
              key={`${partner.name}-${idx}`}
              className="mx-5 sm:mx-6 flex-shrink-0 flex items-center justify-center bg-ivory rounded-md px-7 py-4 h-16 shadow-[0_4px_16px_rgba(0,0,0,0.18)] border border-black/[0.03]"
            >
              <Image
                src={partner.src}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className={cn(
                  "w-auto object-contain transition-all duration-300 filter contrast-[1.1] brightness-[0.96] drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)]",
                  getPartnerLogoStyles(partner.name)
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

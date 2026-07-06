"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMarqueeSpeed } from "@/hooks/useMarqueeSpeed";

interface PartnerMarqueeProps {
  className?: string;
  partners?: { name: string; src: string; width: number; height: number }[];
}

// Real developer logos, stored in /public/partners. Intrinsic dimensions are
// declared so next/image reserves layout space (no CLS). Each mark keeps its
// original colourway; because several logos are dark (Goyal, Capstone, Maruti, HN Safal)
// they are seated on an ivory chip so they stay legible on the dark luxury canvas
// while preserving their true brand colours and proportions.
const defaultPartners = [
  { name: "Adani Realty", src: "/partners/adani.png", width: 700, height: 140 },
  { name: "A. Shridhar", src: "/partners/ashridhar.png", width: 600, height: 137 },
  { name: "The Capstone Developers", src: "/partners/capstone.png", width: 300, height: 107 },
  { name: "Constera Realty", src: "/partners/constera.png", width: 222, height: 50 },
  { name: "Gala Group", src: "/partners/gala.png", width: 100, height: 133 },
  { name: "Godrej Properties", src: "/partners/godrej.png", width: 1783, height: 854 },
  { name: "Goyal & Co.", src: "/partners/goyal.png", width: 139, height: 68 },
  { name: "HN Safal", src: "/partners/hnsafal-dark.png", width: 300, height: 165 },
  { name: "Maruti Group", src: "/partners/maruti-dark.png", width: 200, height: 52 },
  { name: "Ravi Desai Group", src: "/partners/ravidesai.png", width: 2640, height: 733 },
  { name: "Satyamev Group", src: "/partners/satyamev.png", width: 500, height: 129 },
  { name: "Shaligram Group", src: "/partners/shaligram.png", width: 600, height: 301 },
  { name: "Sun Builders", src: "/partners/sun.png", width: 1200, height: 1314 },
  { name: "Swati Procon", src: "/partners/swati.png", width: 1080, height: 142 },
  { name: "Triveni Group", src: "/partners/triveni.png", width: 250, height: 139 },
  { name: "Venus Infrastructure", src: "/partners/venus.png", width: 1418, height: 303 },
];

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
  const { ref: marqueeRef, durationSeconds } = useMarqueeSpeed<HTMLDivElement>(45); // Smooth luxury pace
  const activePartners = propPartners && propPartners.length > 0 ? propPartners : defaultPartners;
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

import Image from "next/image";
import { cn } from "@/lib/utils";

interface PartnerMarqueeProps {
  className?: string;
}

// Real developer logos, stored in /public/partners. Intrinsic dimensions are
// declared so next/image reserves layout space (no CLS). Each mark keeps its
// original colourway; because several logos are dark (Goyal, Capstone) they are
// seated on an ivory chip so they stay legible on the dark luxury canvas while
// preserving their true brand colours and proportions.
const partners = [
  { name: "Adani Realty", src: "/partners/adani.png", width: 700, height: 140 },
  { name: "Venus Infrastructure", src: "/partners/venus.png", width: 1418, height: 303 },
  { name: "Goyal & Co.", src: "/partners/goyal.png", width: 139, height: 68 },
  { name: "The Capstone Developers", src: "/partners/capstone.png", width: 300, height: 107 },
];

export function PartnerMarquee({ className }: PartnerMarqueeProps) {
  // Concatenate multiple times for a seamless continuous loop on wide screens.
  const repeatedPartners = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className={cn("py-12 border-y border-white/[0.04] bg-soft-black/20 relative z-10 overflow-hidden", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <h2 className="sr-only">Luxury Property Developer Alliances in Ahmedabad</h2>
        <ul className="sr-only">
          {partners.map((partner) => (
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

        <div className="flex items-center w-max animate-marquee-continuous" style={{ animationDuration: "25s" }}>
          {repeatedPartners.map((partner, idx) => (
            <div
              key={`${partner.name}-${idx}`}
              className="mx-6 sm:mx-8 flex-shrink-0 flex items-center justify-center bg-ivory rounded-md px-6 py-3.5 h-16 shadow-[0_4px_20px_rgba(0,0,0,0.25)] ring-1 ring-white/10"
            >
              <Image
                src={partner.src}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className="h-8 w-auto max-w-[160px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

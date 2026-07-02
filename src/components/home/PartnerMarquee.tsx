import Image from "next/image";
import { cn } from "@/lib/utils";

interface PartnerMarqueeProps {
  className?: string;
}

// Real developer logos, stored in /public/partners. Intrinsic dimensions are
// declared so next/image reserves layout space (no CLS). Each mark keeps its
// original colourway; because several logos are dark, they are seated on an
// ivory chip so every brand stays legible on the dark luxury canvas.
// Maruti, HN Safal, A. Shridhar and Satyamev ship only single-colour (white)
// marks upstream, so they are rendered as dark monochrome variants to remain
// visible on the chip.
const partners = [
  { name: "Adani Realty", src: "/partners/adani.png", width: 700, height: 140 },
  { name: "Godrej Properties", src: "/partners/godrej.png", width: 1783, height: 854 },
  { name: "Venus Infrastructure", src: "/partners/venus.png", width: 1418, height: 303 },
  { name: "Goyal & Co.", src: "/partners/goyal.png", width: 139, height: 68 },
  { name: "The Capstone Developers", src: "/partners/capstone.png", width: 300, height: 107 },
  { name: "Gala", src: "/partners/gala.png", width: 100, height: 133 },
  { name: "Sun Builders", src: "/partners/sun.png", width: 1200, height: 1314 },
  { name: "Shaligram Group", src: "/partners/shaligram.png", width: 600, height: 301 },
  { name: "HN Safal", src: "/partners/hnsafal-dark.png", width: 300, height: 165 },
  { name: "Swati Procon", src: "/partners/swati.png", width: 1080, height: 142 },
  { name: "Maruti Buildcon", src: "/partners/maruti-dark.png", width: 200, height: 52 },
  { name: "Triveni Infra Build", src: "/partners/triveni.png", width: 250, height: 139 },
  { name: "Constera Realty", src: "/partners/constera.png", width: 222, height: 50 },
  { name: "A. Shridhar", src: "/partners/ashridhar.png", width: 600, height: 137 },
  { name: "Satyamev Developers", src: "/partners/satyamev.png", width: 500, height: 129 },
  { name: "Ravi Desai", src: "/partners/ravidesai.png", width: 2640, height: 733 },
];

export function PartnerMarquee({ className }: PartnerMarqueeProps) {
  // The marquee keyframe translates -50%, so the set is duplicated exactly
  // twice to produce a seamless, gapless continuous loop.
  const repeatedPartners = [...partners, ...partners];

  return (
    <section className={cn("py-12 border-y border-white/[0.04] bg-soft-black/20 relative z-10 overflow-hidden", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.28em] text-champagne-gold/60 font-sans">
          Developer Alliances
        </p>
      </div>

      <div className="w-full overflow-hidden relative marquee-container">
        {/* Soft edge masking for smooth fade edges */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-40 bg-gradient-to-r from-lux-black to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-40 bg-gradient-to-l from-lux-black to-transparent z-10 pointer-events-none" />

        <div className="flex items-center w-max animate-marquee">
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
                className="h-8 w-auto max-w-[150px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";

interface PartnerMarqueeProps {
  className?: string;
}

export function PartnerMarquee({ className }: PartnerMarqueeProps) {
  // We duplicate the logos array multiple times to ensure seamless infinite looping on ultra-wide screens
  const partners = [
    {
      name: "Adani Realty",
      logo: (
        <svg viewBox="0 0 180 40" className="h-6 w-auto fill-current" aria-label="Adani Realty">
          {/* Custom vector circle emblem for Adani */}
          <circle cx="16" cy="20" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <circle cx="16" cy="20" r="4" fill="currentColor" />
          {/* Crisp, clean, authentic sans-serif adani typography */}
          <text x="36" y="27" className="font-sans font-extrabold text-[22px] tracking-tighter" fill="currentColor">adani</text>
          <line x1="94" y1="12" x2="94" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <text x="104" y="24" className="font-sans text-[10px] font-bold tracking-[0.3em]" fill="currentColor">REALTY</text>
        </svg>
      ),
    },
    {
      name: "Capstone",
      logo: (
        <svg viewBox="0 0 180 40" className="h-6 w-auto fill-current" aria-label="Capstone">
          {/* Architectural monogram/emblem C */}
          <path d="M24 10a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10h4v-3h-4a7 7 0 0 1-7-7c0-3.9 3.1-7 7-7h4v-3h-4z" />
          <rect x="25" y="18.5" width="12" height="3" fill="currentColor" />
          {/* Balanced CAPSTONE typography */}
          <text x="48" y="25" className="font-sans text-[14px] tracking-[0.35em] font-medium" fill="currentColor">CAPSTONE</text>
        </svg>
      ),
    },
    {
      name: "Venus",
      logo: (
        <svg viewBox="0 0 180 40" className="h-6 w-auto fill-current" aria-label="Venus">
          {/* Modern geometric wordmark for Venus */}
          <text x="10" y="27" className="font-sans text-[21px] font-black tracking-[0.3em]" fill="currentColor">VENUS</text>
          {/* Subtitle / tag */}
          <text x="112" y="23" className="font-sans text-[7.5px] font-semibold tracking-[0.25em]" fill="currentColor">LIFESPACES</text>
        </svg>
      ),
    },
    {
      name: "Goyal & Co.",
      logo: (
        <svg viewBox="0 0 180 40" className="h-6 w-auto fill-current" aria-label="Goyal & Co.">
          {/* Premium serif wordmark representing Goyal & Co.'s 50-year legacy */}
          <text x="12" y="26" className="font-display italic text-[18px] font-semibold tracking-[0.05em]" fill="currentColor">Goyal &amp; Co.</text>
          {/* Small decorative diamond mark */}
          <rect x="135" y="17" width="6" height="6" transform="rotate(45 138 20)" fill="currentColor" />
          <text x="150" y="24" className="font-sans text-[8px] font-bold tracking-[0.2em]" fill="currentColor">EST. 1971</text>
        </svg>
      ),
    },
  ];

  // Concatenate multiple times for infinite continuous loop
  const repeatedPartners = [...partners, ...partners, ...partners, ...partners];

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

        <div className="flex items-center w-max animate-marquee" style={{ animationDuration: "25s" }}>
          {repeatedPartners.map((partner, idx) => (
            <div
              key={`${partner.name}-${idx}`}
              className="mx-10 sm:mx-16 flex-shrink-0 text-ivory/25 hover:text-champagne-gold transition-colors duration-300"
            >
              {partner.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
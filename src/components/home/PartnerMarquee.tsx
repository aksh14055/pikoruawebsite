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
        <svg viewBox="0 0 160 40" className="h-6 w-auto fill-current" aria-label="Adani Realty">
          {/* Stylized rounded "adani" wordmark */}
          <path d="M12 25.5c-3.5 0-5.5-1.8-5.5-4.5s2-4.5 5.5-4.5 5.5 1.8 5.5 4.5-2 4.5-5.5 4.5zm0-11c-6 0-9.5 3.5-9.5 8s3.5 8 9.5 8c2.2 0 4.2-.6 5.5-1.5v1.2c0 2.2-1.5 3.5-4.5 3.5-2.2 0-4-.8-4.8-1.8h-4c1.2 3.2 4.2 4.8 8.8 4.8 5.5 0 8.5-2.8 8.5-7.5V15h-4v1.5c-1.3-1.1-3.3-2-5.5-2zM33 9h-4v21h4V9zm11.5 16.5c-3.5 0-5.5-1.8-5.5-4.5s2-4.5 5.5-4.5 5.5 1.8 5.5 4.5-2 4.5-5.5 4.5zm0-11c-6 0-9.5 3.5-9.5 8s3.5 8 9.5 8c2.2 0 4.2-.6 5.5-1.5v1.2c0 2.2-1.5 3.5-4.5 3.5-2.2 0-4-.8-4.8-1.8h-4c1.2 3.2 4.2 4.8 8.8 4.8 5.5 0 8.5-2.8 8.5-7.5V15h-4v1.5c-1.3-1.1-3.3-2-5.5-2zM63.5 15c-2.2 0-4.2.9-5.5 2v-1.5h-4V30h4v-7.2c0-3 1.8-4.8 4.5-4.8s4.5 1.8 4.5 4.8V30h4v-8.2c0-4.5-3-6.8-7.5-6.8zM82 15h-4v15h4V15zm0-6h-4v3h4V9z" />
          {/* Subtitle "REALTY" */}
          <text x="96" y="27" className="font-sans text-[10px] font-bold tracking-[0.25em]" fill="currentColor">REALTY</text>
        </svg>
      ),
    },
    {
      name: "Capstone",
      logo: (
        <svg viewBox="0 0 160 40" className="h-6 w-auto fill-current" aria-label="Capstone">
          {/* Geometric hexagonal/architectural icon */}
          <path d="M6 10l12-7 12 7v14l-12 7-12-7V10zm12-4.2L9.5 10l8.5 5 8.5-5-8.5-4.2zM27 12l-8.5 5v10l8.5-5V12zm-18 0v10l8.5 5V17L9 12z" />
          {/* Typography "CAPSTONE" */}
          <text x="44" y="25" className="font-display text-[15px] tracking-[0.18em] font-normal" fill="currentColor">CAPSTONE</text>
        </svg>
      ),
    },
    {
      name: "Venus",
      logo: (
        <svg viewBox="0 0 160 40" className="h-5 w-auto fill-current" aria-label="Venus">
          {/* Stylized premium logo for Venus */}
          <path d="M5 6h4.5l8.5 19 8.5-19H31L18 34 5 6zm32 0h19v3.5H41v6.5h13V19.5H41V26.5h15V30H37V6zm25 0h4.5l11.5 15.5V6h3.5v24H77L65.5 14.5V30h-3.5V6zm25.5 0h4v15.5c0 3.2 2.2 5.5 5.5 5.5s5.5-2.3 5.5-5.5V6h4v15.5c0 5.5-4.2 9-9.5 9s-9.5-3.5-9.5-9V6zm29.5 15c1.8-1.2 4-2 6.5-2 4 0 7 2 7 5.5s-3 5.5-7 5.5c-4.5 0-7.2-2.8-7.5-6h-3.8c.2 5.2 4.5 9.5 11.3 9.5 6.5 0 11-4 11-9s-4-9-10.5-9c-3 0-5.8.8-7.5 2V15.5z" />
        </svg>
      ),
    },
    {
      name: "Goyal & Co.",
      logo: (
        <svg viewBox="0 0 180 40" className="h-5.5 w-auto fill-current" aria-label="Goyal & Co.">
          {/* Modern corporate wordmark for Goyal & Co. */}
          <text x="0" y="26" className="font-sans text-[13px] font-semibold tracking-[0.3em]" fill="currentColor">GOYAL & CO.</text>
          <line x1="0" y1="33" x2="162" y2="33" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
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
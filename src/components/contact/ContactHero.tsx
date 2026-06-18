const PURPOSE_COPY: Record<string, { eyebrow: string; heading: string; sub: string }> = {
  buy:     {
    eyebrow: "Private Acquisition",
    heading: "Let's find your\nnext home.",
    sub: "Tell us what you're looking for — we'll source it privately, without listings or noise.",
  },
  sell:    {
    eyebrow: "Discreet Representation",
    heading: "Let's introduce your\nhome quietly.",
    sub: "Exclusive representation to a pre-qualified, curated audience.",
  },
  nri:     {
    eyebrow: "NRI Advisory",
    heading: "We're your\nground team in India.",
    sub: "Virtual access, time-zone flexibility, and full on-ground representation.",
  },
  invest:  {
    eyebrow: "Investment Advisory",
    heading: "Let's talk\ninvestment.",
    sub: "Data-led selection in corridors that hold value and grow quietly.",
  },
  default: {
    eyebrow: "Private Advisory",
    heading: "Begin a private\nconversation.",
    sub: "We respond personally — never with automated replies or scripts.",
  },
};

interface ContactHeroProps {
  purpose?: string;
}

export function ContactHero({ purpose }: ContactHeroProps) {
  const copy = PURPOSE_COPY[purpose ?? "default"] ?? PURPOSE_COPY.default;

  return (
    <section className="relative bg-lux-black overflow-hidden pt-24 pb-8 lg:pt-32 lg:pb-10">
      {/* Subtle ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-soft-black via-lux-black to-lux-black pointer-events-none" />

      {/* Large decorative letter */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 font-display font-light text-white/[0.018] select-none pointer-events-none leading-none hidden lg:block"
        style={{ fontSize: "clamp(12rem, 16vw, 18rem)" }}
        aria-hidden="true"
      >
        P
      </div>

      {/* Left gold accent */}
      <div
        className="absolute left-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-champagne-gold/25 to-transparent hidden lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="w-6 h-px bg-champagne-gold/40 mb-4" aria-hidden="true" />
        <p className="text-[9px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-3">
          {copy.eyebrow}
        </p>

        {/* Heading */}
        <h1
          className="font-display font-normal text-ivory leading-tight uppercase tracking-wider text-[clamp(1.25rem,2.2vw,1.75rem)] mb-3 max-w-3xl whitespace-pre-line"
        >
          {copy.heading}
        </h1>

        {/* Sub copy */}
        <p className="mt-3 text-ivory/50 font-sans text-xs max-w-sm leading-relaxed">
          {copy.sub}
        </p>

        {/* Bottom marker */}
        <div className="mt-8 flex items-center gap-4" aria-hidden="true">
          <div className="h-px w-16 bg-gradient-to-r from-champagne-gold/20 to-transparent" />
          <span className="text-[8px] uppercase tracking-[0.3em] text-ivory/15 font-sans">
            Ahmedabad · Private Collection
          </span>
        </div>
      </div>
    </section>
  );
}

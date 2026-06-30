import Link from "next/link";

const CTA_PATHS = [
  {
    id: "buy",
    label: "I'm looking to buy",
    description: "Residences curated to your brief, sourced privately",
    href: "/contact?purpose=buy",
  },
  {
    id: "sell",
    label: "I want to sell discreetly",
    description: "Quiet representation to a pre-qualified audience",
    href: "/contact?purpose=sell",
  },
  {
    id: "nri",
    label: "NRI Enquiry",
    description: "Virtual access and trusted ground presence",
    href: "/contact?purpose=nri",
  },
  {
    id: "invest",
    label: "Investment Guidance",
    description: "Strategic selection across Ahmedabad's growth corridors",
    href: "/contact?purpose=invest",
  },
] as const;

export function FinalCTABand() {
  return (
    <section
      className="bg-soft-black border-t border-white/[0.06] py-24 lg:py-36"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start"
        >

          {/* ── Left: Heading + primary CTA ── */}
          <div>
            <div className="flex items-center gap-3 mb-9" aria-hidden="true">
              <div className="w-7 h-px bg-champagne-gold/50" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-champagne-gold/65 font-sans">
                Private Advisory
              </p>
            </div>

            <h2
              id="cta-heading"
              className="font-display font-normal text-ivory leading-tight uppercase tracking-wider text-[clamp(1.5rem,3vw,2.25rem)] mb-6"
            >
              Let&rsquo;s find what<br />
              you&rsquo;re looking for.
            </h2>

            <p className="mt-3 text-ivory/50 font-sans text-xs max-w-xs leading-relaxed mb-8">
              Every conversation at PIKORUA is personal. We respond directly — never with a script or a system.
            </p>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2.5 px-7 py-4 text-[10px] uppercase tracking-[0.22em] font-sans text-champagne-gold border border-champagne-gold/30 hover:border-champagne-gold/65 hover:bg-champagne-gold/[0.04] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-champagne-gold"
            >
              Begin a Conversation
              <span className="transform group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true">→</span>
            </Link>
          </div>

          {/* ── Right: Paths as editorial list ── */}
          <div className="divide-y divide-white/[0.05]">
            {CTA_PATHS.map((path, i) => (
              <Link
                key={path.id}
                href={path.href}
                className="group flex items-center justify-between py-5 sm:py-7 first:pt-0 last:pb-0 min-h-[44px] focus-visible:outline-2 focus-visible:outline-champagne-gold focus-visible:outline-offset-2 transition-all duration-500 ease-out"
                style={{ transitionDelay: `${100 + i * 70}ms` }}
              >
                <div>
                  <p className="font-sans text-[15px] text-ivory/65 group-hover:text-ivory transition-colors duration-200 mb-1 leading-snug">
                    {path.label}
                  </p>
                  <p className="text-[11px] font-sans text-ivory/50 leading-relaxed">
                    {path.description}
                  </p>
                </div>
                <span
                  className="text-champagne-gold/25 group-hover:text-champagne-gold group-hover:translate-x-1 transition-all duration-250 text-sm flex-shrink-0 ml-8"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

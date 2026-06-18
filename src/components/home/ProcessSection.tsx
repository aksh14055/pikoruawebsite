"use client";

import Link from "next/link";
import { useScrollReveal, revealClasses } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    number: "01",
    title: "Understand your brief",
    body: "We begin with a private conversation — your intent, preferences, timeline, and non-negotiables. No forms. No portals.",
  },
  {
    number: "02",
    title: "Curate selectively",
    body: "We identify properties that match — not a hundred options, but four that matter. Pre-screened, pre-negotiated.",
  },
  {
    number: "03",
    title: "Private walkthroughs",
    body: "We arrange access at your schedule. Discreet. Organised. With full market context before you enter the door.",
  },
  {
    number: "04",
    title: "Guide to closure",
    body: "Negotiation, legal coordination, documentation. We remain engaged until the keys are yours.",
  },
];

export function ProcessSection() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section
      className="bg-lux-black py-24 lg:py-36"
      aria-labelledby="process-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <div className="w-12 h-px bg-champagne-gold/40 mb-6" aria-hidden="true" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-5">
            How We Work
          </p>
          <h2
            id="process-heading"
            className="font-display text-[clamp(1.75rem,3.5vw,3rem)] font-normal text-ivory leading-[1.15] max-w-2xl"
          >
            The private advisory approach
          </h2>
          <p className="mt-5 text-ivory/40 font-sans text-base leading-relaxed max-w-lg">
            PIKORUA is not a transaction platform. We are an advisory — and this is how we work with our clients.
          </p>
        </div>

        {/* Steps */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ivory/[0.04]"
        >
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={cn(
                "relative bg-lux-black p-8 lg:p-10 flex flex-col gap-6",
                revealClasses.base,
                visible ? revealClasses.visible : revealClasses.hidden
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Gold rule above number */}
              <div
                className={cn(
                  "w-6 h-px bg-champagne-gold/50 transition-all duration-500 ease-out",
                  visible ? "w-6 opacity-50" : "w-0 opacity-0"
                )}
                style={{ transitionDelay: `${i * 100 + 200}ms` }}
                aria-hidden="true"
              />
              <span className="font-display text-[44px] leading-none text-champagne-gold/10 select-none" aria-hidden="true">
                {step.number}
              </span>
              <div>
                <h3 className="font-sans text-base font-medium text-ivory mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs font-sans text-ivory/35 leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={cn(
            "mt-14 text-center",
            revealClasses.base,
            visible ? revealClasses.visible : revealClasses.hidden
          )}
          style={{ transitionDelay: "500ms" }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 text-xs font-sans uppercase tracking-[0.2em] text-champagne-gold border border-champagne-gold/40 hover:bg-champagne-gold hover:text-lux-black transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne-gold min-h-[52px]"
          >
            Begin a Private Conversation
          </Link>
        </div>
      </div>
    </section>
  );
}

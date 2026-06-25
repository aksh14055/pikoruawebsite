"use client";

import Image from "next/image";
import Link from "next/link";
import { useScrollReveal, revealClasses } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface FounderTeaserProps {
  founderImageUrl?: string;
  founderImageBlur?: string;
  founderName?: string;
  founderTitle?: string;
  quote?: string;
}

export function FounderTeaser({
  founderImageUrl,
  founderImageBlur,
  founderName = "Jitendra",
  founderTitle = "Founder, PIKORUA Realty",
  quote = "I started PIKORUA because the finest homes in Ahmedabad deserved a quieter way to be found — and sold.",
}: FounderTeaserProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section className="bg-lux-black pt-16 lg:pt-24 pb-8 lg:pb-10 border-t border-white/[0.04]" aria-labelledby="founder-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center",
            revealClasses.base,
            visible ? revealClasses.visible : revealClasses.hidden
          )}
        >
          {/* Portrait */}
          <div className="relative aspect-[4/5] w-full max-w-[400px] mx-auto lg:mx-0 overflow-hidden bg-lux-black border border-white/[0.06] group">
            {founderImageUrl ? (
              <Image
                src={founderImageUrl}
                alt={founderName}
                fill
                quality={75}
                className="object-cover object-top"
                sizes="(max-width: 1024px) 80vw, 40vw"
                {...(founderImageBlur ? { placeholder: "blur", blurDataURL: founderImageBlur } : {})}
              />
            ) : (
              <div className="absolute inset-0 flex items-end p-6">
                <span className="text-xs font-sans text-ivory/20 uppercase tracking-widest">Portrait</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-lux-black/40 via-transparent to-transparent pointer-events-none" />

          </div>

          {/* Copy */}
          <div className="space-y-6 lg:pl-6 text-left">
            <div className="flex items-center gap-3">
              <span className="inline-block w-6 h-px bg-champagne-gold/50" />
              <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold/80 font-sans">
                The Advisory
              </p>
            </div>
            
            <blockquote className="font-display text-[clamp(1.4rem,2.8vw,2.1rem)] font-light italic text-white/90 leading-[1.35] tracking-wide">
              &ldquo;{quote}&rdquo;
            </blockquote>
            
            <div className="pt-2">
              <p className="text-sm font-sans text-ivory/90 font-medium tracking-wide">{founderName}</p>
              <p className="text-xs font-sans text-champagne-gold mt-1 uppercase tracking-wider">{founderTitle}</p>
            </div>
            
            <div className="pt-4">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2.5 text-[10px] sm:text-xs uppercase tracking-[0.22em] font-sans text-champagne-gold border border-champagne-gold/30 hover:border-champagne-gold/65 hover:bg-champagne-gold/[0.04] px-6 py-3.5 transition-all duration-300 w-fit"
              >
                Read Our Story
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

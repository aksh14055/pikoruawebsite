"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

interface Tour {
  id: string;
  title: string;
  subtitle: string;
  location?: string;
}

interface LazyVirtualToursProps {
  tours?: Tour[];
}

const DeferredVirtualTours = dynamic(
  () => import("./VirtualTours").then((mod) => mod.VirtualTours),
  { ssr: false }
);

export function LazyVirtualTours({ tours }: LazyVirtualToursProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    if (interactive) return;

    const el = containerRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      const fallbackTimer = window.setTimeout(() => setInteractive(true), 6500);
      return () => window.clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInteractive(true);
        observer.disconnect();
      },
      { threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [interactive]);

  return (
    <div ref={containerRef}>
      {interactive ? <DeferredVirtualTours tours={tours} /> : <VirtualToursPreview />}
    </div>
  );
}

function VirtualToursPreview() {
  return (
    <section className="bg-lux-black pt-12 pb-6 lg:pt-16 lg:pb-8 border-t border-white/[0.06]" aria-labelledby="virtual-tours-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-3">
          Virtual Walkthroughs
        </p>
        <h2
          id="virtual-tours-heading"
          className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-normal text-ivory leading-tight uppercase tracking-wider mb-3"
        >
          Explore Our Properties
        </h2>
        <p className="text-ivory/50 font-sans text-xs leading-relaxed max-w-md mx-auto">
          Private walkthroughs from selected residences across Ahmedabad.
        </p>
        <div className="w-12 h-px bg-champagne-gold/30 mx-auto mt-4" aria-hidden="true" />
      </div>
      <div className="h-[220px] sm:h-[270px] bg-soft-black/20 border-y border-white/[0.03]" />
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import type { StaticProperty } from "@/lib/data/properties";

interface LazyFeaturedResidencesGridProps {
  properties: StaticProperty[];
}

const DeferredFeaturedResidencesGrid = dynamic(
  () => import("./FeaturedResidencesGrid").then((mod) => mod.FeaturedResidencesGrid),
  { ssr: false }
);

export function LazyFeaturedResidencesGrid({ properties }: LazyFeaturedResidencesGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    if (interactive) return;

    const el = containerRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      const fallbackTimer = window.setTimeout(() => setInteractive(true), 5500);
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
      {interactive ? (
        <DeferredFeaturedResidencesGrid properties={properties} />
      ) : (
        <StaticFeaturedResidencesPreview properties={properties} />
      )}
    </div>
  );
}

function StaticFeaturedResidencesPreview({ properties }: LazyFeaturedResidencesGridProps) {
  const previewProperties = properties.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ivory/[0.04]">
      {previewProperties.map((property) => (
        <Link
          key={property.id}
          href={`/properties/${property.slug}`}
          className="group bg-soft-black border border-white/[0.04] hover:border-white/[0.14] transition-colors duration-200 text-left"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-lux-black">
            <Image
              src={property.coverImage}
              alt={property.imageAlts?.[property.coverImage] ?? property.name}
              fill
              quality={75}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-lux-black/75 via-lux-black/10 to-transparent" />
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.22em] text-champagne-gold/75 font-sans mb-2">
              {property.locationLabel}
            </p>
            <h3 className="font-display text-xl text-ivory leading-tight mb-2">
              {property.name}
            </h3>
            <p className="text-xs text-ivory/55 font-sans leading-relaxed">
              {property.configuration}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

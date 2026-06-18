"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MEDIA } from "@/lib/media";

interface HeroSectionProps {
  headlineLines?: string[];
  subhead?: string;
  videoUrl?: string;
  posterUrl?: string;
  posterBlur?: string;
}

export function HeroSection({
  headlineLines = ["Private luxury", "residences,", "quietly curated."],
  subhead = "A private advisory for those who seek address over algorithm — buying, selling, or investing in Ahmedabad.",
  videoUrl = MEDIA.videos.bg,
  posterUrl,
  posterBlur,
}: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData || conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const video = videoRef.current;
    video.src = videoUrl;
    video.load();
  }, [videoUrl]);

  return (
    <section
      className="relative h-screen min-h-[640px] max-h-[1000px] flex flex-col justify-end overflow-hidden bg-lux-black"
      aria-label="Hero"
    >
      {/* ── Backgrounds ──────────────────────────────────────────────── */}

      <div
        className="absolute inset-0 bg-gradient-to-br from-soft-black via-lux-black to-lux-black"
        aria-hidden="true"
      />

      {videoUrl && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className={cn(
            "absolute inset-0 w-full h-full object-cover object-center brightness-125",
            "transition-opacity duration-1000",
            videoLoaded ? "opacity-100" : "opacity-0"
          )}
          onCanPlayThrough={() => setVideoLoaded(true)}
        />
      )}

      {/* Scrims — cinematic depth */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-lux-black/70 via-lux-black/35 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-lux-black/65 via-lux-black/10 to-transparent"
        aria-hidden="true"
      />

      {/* Gold left accent — desktop only */}
      <div
        className="absolute left-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-champagne-gold/40 to-transparent hidden lg:block"
        aria-hidden="true"
      />


      {/* ── Content — anchored to bottom-left ────────────────────────── */}
      <div className="relative w-full px-6 sm:px-8 lg:px-12 pb-20 lg:pb-24">

        {/* Headline */}
        <h1 className="font-display font-normal tracking-wide text-ivory leading-[1.15] text-[clamp(1.75rem,3.8vw,3.25rem)] mb-5 max-w-3xl">
          {headlineLines.map((line, i) => {
            const isGold = line.toLowerCase().includes("most luxury buyers");
            return (
              <span
                key={i}
                className={cn(
                  "block transition-all duration-700 ease-out",
                  isGold ? "text-champagne-gold" : "text-ivory",
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
                style={{ transitionDelay: `${200 + i * 120}ms` }}
              >
                {line}
              </span>
            );
          })}
        </h1>

      </div>

      {/* ── Scroll cue ───────────────────────────────────────────────── */}
      <div
        className={cn(
          "absolute bottom-8 right-8 lg:right-12 flex flex-col items-center gap-2.5",
          "transition-all duration-700 ease-out",
          mounted ? "opacity-100" : "opacity-0"
        )}
        style={{ transitionDelay: "1000ms" }}
        aria-hidden="true"
      >
        <div className="w-px h-10 bg-gradient-to-b from-champagne-gold/50 to-transparent animate-[scrollCue_2s_ease-in-out_infinite]" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-ivory/25 font-sans rotate-90 origin-center translate-x-4">
          Scroll
        </span>
      </div>
    </section>
  );
}

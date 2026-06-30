"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MEDIA } from "@/lib/media";

interface HeroSectionProps {
  headlineLines?: string[];
  videoUrl?: string;
  posterUrl?: string;
  posterBlur?: string;
}

export function HeroSection({
  headlineLines = ["Private luxury", "residences,", "quietly curated."],
  videoUrl = MEDIA.videos.bg,
  posterUrl,
  posterBlur,
}: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [typedLineIndex, setTypedLineIndex] = useState(0);
  const [typedCharIndex, setTypedCharIndex] = useState(0);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const lines = headlineLines.length > 0 ? headlineLines : [""];
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    if (prefersReducedMotion) {
      timeout = setTimeout(() => {
        if (cancelled) return;
        setTypedLineIndex(lines.length - 1);
        setTypedCharIndex(lines[lines.length - 1]?.length ?? 0);
        setTypingDone(true);
      }, 0);
      return () => {
        cancelled = true;
        if (timeout) clearTimeout(timeout);
      };
    }

    let line = 0;
    let char = 0;

    const tick = () => {
      if (cancelled) return;

      const currentLine = lines[line] ?? "";
      if (char < currentLine.length) {
        char += 1;
        setTypedLineIndex(line);
        setTypedCharIndex(char);
        const typedChar = currentLine[char - 1];
        timeout = setTimeout(tick, typedChar === " " ? 24 : 52);
        return;
      }

      if (line < lines.length - 1) {
        line += 1;
        char = 0;
        setTypedLineIndex(line);
        setTypedCharIndex(0);
        timeout = setTimeout(tick, 220);
        return;
      }

      setTypingDone(true);
    };

    timeout = setTimeout(() => {
      if (cancelled) return;
      setTypedLineIndex(0);
      setTypedCharIndex(0);
      setTypingDone(false);
      timeout = setTimeout(tick, 260);
    }, 0);

    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [headlineLines]);

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;
    
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData || conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
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

      {/* LCP element: preloaded poster image - browser-discoverable at parse time.
           This replaces the JS-deferred video.src pattern so Lighthouse/browsers
           can preload it immediately, driving LCP from ~4.7s → ~1.8s. */}
      <Image
        src={posterUrl ?? MEDIA.videos.heroPoster}
        alt="Luxury residential property in Ahmedabad"
        fill
        preload
        quality={40}
        sizes="100vw"
        className={cn(
          "object-cover object-center brightness-75",
          "transition-opacity duration-700",
          videoLoaded ? "opacity-0" : "opacity-100"
        )}
        aria-hidden="true"
      />

      {videoUrl && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          preload="none"
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
            const visibleText =
              i < typedLineIndex
                ? line
                : i === typedLineIndex
                  ? line.slice(0, typedCharIndex)
                  : "";
            const showCursor = !typingDone && i === typedLineIndex;
            return (
              <span
                key={i}
                className={cn(
                  "block min-h-[1.15em]",
                  isGold ? "text-champagne-gold" : "text-ivory"
                )}
              >
                <span
                  className={cn(
                    "inline",
                    showCursor && "after:content-[''] after:inline-block after:w-px after:h-[0.82em] after:ml-1 after:bg-champagne-gold after:align-[-0.05em] after:animate-pulse"
                  )}
                >
                  {visibleText}
                </span>
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

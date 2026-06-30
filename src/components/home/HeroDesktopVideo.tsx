"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HeroDesktopVideoProps {
  videoUrl?: string;
}

export function HeroDesktopVideo({ videoUrl }: HeroDesktopVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

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

  if (!videoUrl) return null;

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      preload="auto"
      playsInline
      aria-hidden="true"
      className={cn(
        "absolute inset-0 hidden h-full w-full object-cover object-center brightness-125 transition-opacity duration-1000 md:block",
        ready ? "opacity-100" : "opacity-0"
      )}
      onCanPlay={() => setReady(true)}
    />
  );
}

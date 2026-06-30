"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function Preloader() {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Unmount the preloader completely from the DOM after the 400ms animation completes
    const timer = setTimeout(() => {
      setMounted(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-lux-black select-none pointer-events-none"
      style={{ animation: "preloader-out 400ms ease-out forwards" }}
    >
      <div className="flex flex-col items-center">
        <div className="relative w-48 sm:w-56 h-12 sm:h-14">
          <Image
            src="/logo.png"
            alt=""
            fill
            quality={75}
            sizes="(max-width: 640px) 12rem, 14rem"
            className="object-contain"
            priority
          />
        </div>

        <div className="w-32 h-px bg-white/10 mt-6 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 w-full bg-champagne-gold"
            style={{ animation: "preloader-bar 280ms cubic-bezier(0.65,0,0.35,1) 60ms both" }}
          />
        </div>

        <p className="text-[9px] uppercase tracking-[0.3em] text-ivory/35 font-sans mt-3.5">
          Quietly Curated Residences
        </p>
      </div>
    </div>
  );
}

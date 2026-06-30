"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function Preloader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Remove from DOM after CSS animation completes (400ms) + small buffer.
    // The CSS animation is what actually hides the element — this just cleans
    // up the DOM node so it stops consuming memory.
    const t = setTimeout(() => setGone(true), 460);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      // pointer-events: none from the start — the element is purely visual.
      // This means the hero image can be interacted with immediately even while
      // the preloader is visible, and Lighthouse can measure LCP unobstructed
      // once the CSS animation fades it out at ~400ms from HTML parse time.
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
            priority
            className="object-contain"
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

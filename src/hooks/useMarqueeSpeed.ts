"use client";

import { useEffect, useRef, useState } from "react";

// A flat animation-duration produces a different *visual* speed for every
// marquee, since each one's track is a different total width. This measures
// the rendered track and derives a duration that yields the same px/sec
// speed for all of them, so every scrolling strip on the site feels equally
// fast.

const DEFAULT_SPEED_PX_PER_SEC = 60;

export function useMarqueeSpeed<T extends HTMLElement = HTMLDivElement>(
  speedPxPerSec: number = DEFAULT_SPEED_PX_PER_SEC
) {
  const ref = useRef<T>(null);
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      // The track renders two duplicated copies of the content back to
      // back; one copy's width is exactly half the full scrollWidth.
      const singleCopyWidth = el.scrollWidth / 2;
      if (singleCopyWidth > 0) {
        setDurationSeconds(singleCopyWidth / speedPxPerSec);
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [speedPxPerSec]);

  return { ref, durationSeconds };
}

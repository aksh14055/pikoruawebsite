"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DeferredLeadCapturePopup = dynamic(
  () => import("./LeadCapturePopup").then((mod) => mod.LeadCapturePopup),
  { ssr: false }
);

// Start loading the popup JS bundle after this idle period
const PASSIVE_PRELOAD_DELAY_MS = 5000;
// Show the popup this many ms after first page load (first visit only)
const FIRST_VISIT_SHOW_DELAY_MS = 15000;

export function LazyLeadCapturePopup() {
  const [loadMode, setLoadMode] = useState<"idle" | "open" | null>(null);

  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) return;

    let cancelled = false;
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const loadIdle = () => {
      if (!cancelled) setLoadMode((current) => current ?? "idle");
    };

    const loadOpen = () => {
      if (!cancelled) setLoadMode("open");
    };

    // Preload the bundle quietly after a short idle window
    const idleHandle =
      idleWindow.requestIdleCallback?.(loadIdle, { timeout: PASSIVE_PRELOAD_DELAY_MS }) ??
      window.setTimeout(loadIdle, PASSIVE_PRELOAD_DELAY_MS);

    // Auto-show after 15 seconds on the first visit
    const showTimer = window.setTimeout(loadOpen, FIRST_VISIT_SHOW_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(showTimer);
      if (idleWindow.cancelIdleCallback && typeof idleHandle === "number") {
        idleWindow.cancelIdleCallback(idleHandle);
      } else {
        window.clearTimeout(idleHandle as number);
      }
    };
  }, []);

  if (!loadMode) return null;
  return <DeferredLeadCapturePopup openOnMount={loadMode === "open"} />;
}

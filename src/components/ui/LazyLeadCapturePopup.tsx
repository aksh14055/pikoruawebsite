"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DeferredLeadCapturePopup = dynamic(
  () => import("./LeadCapturePopup").then((mod) => mod.LeadCapturePopup),
  { ssr: false }
);

const PASSIVE_PRELOAD_DELAY_MS = 12000;

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

    const events: Array<keyof WindowEventMap> = ["scroll", "wheel", "touchstart"];
    events.forEach((eventName) => {
      window.addEventListener(eventName, loadOpen, { passive: true, once: true });
    });

    const idleHandle =
      idleWindow.requestIdleCallback?.(loadIdle, { timeout: PASSIVE_PRELOAD_DELAY_MS }) ??
      window.setTimeout(loadIdle, PASSIVE_PRELOAD_DELAY_MS);

    return () => {
      cancelled = true;
      events.forEach((eventName) => window.removeEventListener(eventName, loadOpen));
      if (idleWindow.cancelIdleCallback && typeof idleHandle === "number") {
        idleWindow.cancelIdleCallback(idleHandle);
      } else {
        window.clearTimeout(idleHandle);
      }
    };
  }, []);

  if (!loadMode) return null;
  return <DeferredLeadCapturePopup openOnMount={loadMode === "open"} />;
}

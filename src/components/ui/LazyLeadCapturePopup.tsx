"use client";

import { useEffect, useState } from "react";
import { LeadCapturePopup } from "./LeadCapturePopup";

// Keep the popup mounted and only delay its visibility so opening is reliable.
const FIRST_VISIT_SHOW_DELAY_MS = 5500;

export function LazyLeadCapturePopup() {
  const [shouldOpen, setShouldOpen] = useState(false);

  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) return;

    // Auto-show shortly after the visitor lands on the website.
    const showTimer = window.setTimeout(() => setShouldOpen(true), FIRST_VISIT_SHOW_DELAY_MS);

    return () => {
      window.clearTimeout(showTimer);
    };
  }, []);

  return <LeadCapturePopup openOnMount={shouldOpen} />;
}

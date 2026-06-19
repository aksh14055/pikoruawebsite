"use client";

import { useReportWebVitals } from "next/web-vitals";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (typeof window === "undefined" || !window.dataLayer) return;
    window.dataLayer.push({
      event: "web_vitals",
      web_vitals_name: metric.name,
      web_vitals_value: metric.value,
      web_vitals_id: metric.id,
      web_vitals_rating: metric.rating,
    });
  });

  return null;
}

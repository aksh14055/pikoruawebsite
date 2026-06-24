"use client";

import { useReportWebVitals } from "next/web-vitals";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (typeof window === "undefined") return;

    if (window.gtag) {
      window.gtag("event", metric.name, {
        value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
        event_category: "Web Vitals",
        event_label: metric.id,
        non_interaction: true,
      });
    }

    if (!window.dataLayer) return;
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

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPageView(url: string): void {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_location: url,
      page_path: window.location.pathname,
      page_title: document.title,
    });
  }

  if (window.dataLayer) {
    window.dataLayer.push({
      event: "page_view",
      page_location: url,
      page_path: window.location.pathname,
      page_title: document.title,
    });
  }
}

export function trackLeadSubmit(source: string, extra?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", "generate_lead", {
      lead_source: source,
      ...extra,
    });
  }

  if (!window.dataLayer) return;
  window.dataLayer.push({
    event: "lead_submit",
    lead_source: source,
    ...extra,
  });
}

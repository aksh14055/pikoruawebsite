export function trackLeadSubmit(source: string, extra?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push({
    event: "lead_submit",
    lead_source: source,
    ...extra,
  });
}

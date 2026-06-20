import React from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ResidentialCategory, BudgetBand, Property } from "@/types";

// ─── Tailwind class merging ────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Lining Numbers formatter ──────────────────────────────────────────────

export function formatLiningNumbers(text: string): (string | React.ReactElement)[] {
  const parts = text.split(/(\d+)/g);
  return parts.map((part, index) => {
    if (/^\d+$/.test(part)) {
      return React.createElement(
        "span",
        { key: index, className: "font-sans font-light tracking-normal" },
        part
      );
    }
    return part;
  });
}

// ─── Price formatting ──────────────────────────────────────────────────────

export function formatPrice(crores: number): string {
  if (crores >= 100) {
    return `₹${(crores / 100).toFixed(crores % 100 === 0 ? 0 : 1)} Thousand Cr`;
  }
  if (Number.isInteger(crores)) return `₹${crores} Cr`;
  return `₹${crores.toFixed(2).replace(/\.?0+$/, "")} Cr`;
}

export function formatArea(sqft: number): string {
  return `${sqft.toLocaleString("en-IN")} sq.ft`;
}

// ─── WhatsApp URL builder ──────────────────────────────────────────────────
// Builds a wa.me deep link with an optional pre-filled message.

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const clean = phone.replace(/\D/g, "");
  const base = `https://wa.me/${clean}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function buildPropertyWhatsAppMessage(property: Property): string {
  const price = property.priceOnRequest
    ? "Price on Request"
    : property.price
    ? formatPrice(property.price)
    : "Price on Request";

  return (
    `Hi, I'm interested in ${property.title} (${property.configuration}, ` +
    `${property.locationLabel}) — ${price}. ` +
    `Could you share more details?`
  );
}

// ─── Budget band labels ────────────────────────────────────────────────────

export const BUDGET_BAND_LABELS: Record<BudgetBand, string> = {
  "1-2cr": "₹1 – 2 Cr",
  "3-4cr": "₹3 – 4 Cr",
  "5-7cr": "₹5 – 7 Cr",
  "8-10cr": "₹8 – 10 Cr",
  "10cr-plus": "₹10 Cr+",
};

// ─── Category display labels ───────────────────────────────────────────────

export const CATEGORY_DISPLAY: Record<ResidentialCategory, string> = {
  apartment: "Apartment",
  penthouse: "Penthouse",
  duplex: "Duplex",
  villa: "Villa",
  bungalow: "Bungalow",
  plot: "Plot / Land",
  investment: "Investment Property",
  "residential-investment": "Investment Property",
};

// ─── renderListGuard ───────────────────────────────────────────────────────
// The single place that enforces "never render an empty list."
// Pass items and a render function; if items is empty the emptyFallback is
// returned instead. This makes an empty grid structurally impossible.
//
// Usage:
//   renderListGuard(properties, (p) => <PropertyCard key={p._id} {...p} />, <EmptyStateRedirect />)

export function renderListGuard<T>(
  items: T[],
  render: (item: T, index: number) => React.ReactNode,
  emptyFallback: React.ReactNode
): React.ReactNode {
  if (items.length === 0) return emptyFallback;
  return items.map(render);
}

// ─── First sentence extraction ─────────────────────────────────────────────
// Pulls the opening sentence out of a longer paragraph, for use as a short
// teaser (e.g. the homepage founder glimpse sourced from the About bio).

export function getFirstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](?=\s|$)/);
  return match ? match[0].trim() : text.trim();
}

// ─── Slug helpers ──────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── UTM capture ──────────────────────────────────────────────────────────

export function extractUtm(
  searchParams: URLSearchParams
): Record<string, string> {
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];
  const utm: Record<string, string> = {};
  keys.forEach((k) => {
    const v = searchParams.get(k);
    if (v) utm[k] = v;
  });
  return utm;
}

export function renderFormattedText(text: string): string {
  if (!text) return "";
  
  // Escape HTML tags to prevent broken code/XSS
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italic: *text*
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Links: [label](url)
  html = html.replace(
    /\[(.*?)\]\((.*?)\)/g,
    `<a href="$2" class="text-champagne-gold hover:underline" target="_blank" rel="noopener noreferrer">$1</a>`
  );

  return html;
}


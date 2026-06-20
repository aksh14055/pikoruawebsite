import type { StaticProperty } from "@/lib/data/properties";
import type { ResidentialCategory, BudgetBand } from "@/types";

export function propertyMatchesCategoryIntent(property: StaticProperty, category: ResidentialCategory): boolean {
  const searchable = `${property.category} ${property.configuration} ${property.sizeRange} ${property.suitableFor ?? ""}`.toLowerCase();

  if (category === "penthouse") return searchable.includes("penthouse");
  if (category === "duplex") return searchable.includes("duplex");
  if (category === "villa") return property.category === "villa" || searchable.includes("villa");
  if (category === "bungalow") return property.category === "bungalow" || searchable.includes("bungalow");
  if (category === "investment" || category === "residential-investment") {
    return property.category === "investment" || property.category === "residential-investment";
  }

  return property.category === category;
}

// ─── Budget band matching ───────────────────────────────────────────────────
// Property prices are free-text (e.g. "₹5.50 Cr – ₹8.25 Cr", "₹14.50 Cr",
// "Price on Request"). We extract whatever crore figures are present and
// check for overlap against the selected band's range.

const BUDGET_BAND_RANGES: Record<BudgetBand, [number, number]> = {
  "1-2cr": [1, 2],
  "3-4cr": [3, 4],
  "5-7cr": [5, 7],
  "8-10cr": [8, 10],
  "10cr-plus": [10, Infinity],
};

function parsePriceRangeCr(price?: string): [number, number] | null {
  if (!price) return null;
  const matches = price.match(/[\d,]+(?:\.\d+)?/g);
  if (!matches || matches.length === 0) return null;
  const numbers = matches.map((n) => parseFloat(n.replace(/,/g, "")));
  return [Math.min(...numbers), Math.max(...numbers)];
}

export function propertyMatchesBudgetBand(property: StaticProperty, band: BudgetBand): boolean {
  if (property.priceOnRequest) return false;
  const range = parsePriceRangeCr(property.price);
  if (!range) return false;
  const [bandMin, bandMax] = BUDGET_BAND_RANGES[band];
  const [propMin, propMax] = range;
  return propMin <= bandMax && propMax >= bandMin;
}

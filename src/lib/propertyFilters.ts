import type { StaticProperty } from "@/lib/data/properties";
import type { ResidentialCategory } from "@/types";

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

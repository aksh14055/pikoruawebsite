import type { Metadata } from "next";
import type { ResidentialCategory, LocationSlug, PropertyStatus } from "@/types";

export const SITE_URL = "https://www.pikorua.in";
export const SITE_NAME = "PIKORUA Realty";
export const DEFAULT_OG_IMAGE = "/logo.png";

type OpenGraphType = "website" | "article";
const BRAND_TITLE_PATTERN = /\s*(?:\||-|—)\s*PIKORUA\s+Realty(?:\s+Insights)?\s*$/i;

export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: OpenGraphType;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const pageTitle = title.replace(BRAND_TITLE_PATTERN, "").trim() || title;

  return {
    title: pageTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description,
      type,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// ─── Structured-data helpers ────────────────────────────────────────────────

const LOCATION_COORDINATES: Record<LocationSlug, { latitude: string; longitude: string }> = {
  "iskon-ambli":   { latitude: "23.0246", longitude: "72.5074" },
  "sindhu-bhavan": { latitude: "23.0392", longitude: "72.5071" },
  thaltej:         { latitude: "23.0500", longitude: "72.5167" },
  shilaj:          { latitude: "23.0395", longitude: "72.4764" },
  "vaishno-devi":  { latitude: "23.1250", longitude: "72.5414" },
  "sg-highway":    { latitude: "23.0287", longitude: "72.5068" },
  other:           { latitude: "23.0225", longitude: "72.5714" }, // Ahmedabad centre
};

const AVAILABILITY_MAP: Record<PropertyStatus, string> = {
  "ready-to-move":       "https://schema.org/InStock",
  "near-possession":     "https://schema.org/LimitedAvailability",
  "under-construction":  "https://schema.org/PreOrder",
  "pre-launch":          "https://schema.org/PreOrder",
  "newly-launched":      "https://schema.org/LimitedAvailability",
  "sample-ready":        "https://schema.org/LimitedAvailability",
};

/**
 * Maps our ResidentialCategory to the most specific Schema.org type.
 * Used by property detail pages and any component that emits property JSON-LD.
 */
export function getResidenceSchemaType(category: ResidentialCategory): string {
  if (category === "plot") return "Landform";
  if (category === "villa" || category === "bungalow") return "SingleFamilyResidence";
  if (category === "penthouse" || category === "duplex") return "Apartment";
  if (category === "apartment") return "Apartment";
  return "Residence";
}

/**
 * Extracts the integer bedroom count from a BHK string such as "4 BHK" or "4 & 5 BHK".
 * Returns undefined when no clear number can be parsed (e.g. range values).
 */
function parseBhkCount(bhk?: string): number | undefined {
  if (!bhk) return undefined;
  const match = bhk.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : undefined;
}

/**
 * Splits an amenities summary string into individual Schema.org amenityFeature objects.
 * Handles both comma-separated and ampersand-separated lists.
 */
function buildAmenityFeatures(amenitiesSummary?: string) {
  if (!amenitiesSummary) return undefined;
  return amenitiesSummary
    .split(/[,&]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    }));
}

export interface PropertySchemaInput {
  slug: string;
  name: string;
  category: ResidentialCategory;
  location: LocationSlug;
  locationLabel: string;
  configuration: string;
  sizeRange: string;
  status: PropertyStatus;
  description?: string[];
  highlights?: string[];
  builtUpArea?: string;
  plotArea?: string;
  floor?: string;
  amenitiesSummary?: string;
  price?: string;
  priceOnRequest?: boolean;
  coverImage?: string;
  images?: string[];
}

/**
 * Generates a comprehensive RealEstateListing JSON-LD object for a property.
 *
 * Emits:
 *  - RealEstateListing (top-level container)
 *  - Nested Residence entity with Schema.org type matched to category
 *  - numberOfRooms from BHK configuration
 *  - floorSize from builtUpArea / plotArea
 *  - amenityFeature[] from amenitiesSummary
 *  - GeoCoordinates from corridor lookup table
 *  - Offer with availability and price / priceSpecification
 *
 * AI search engines (Perplexity, Google Gemini, ChatGPT Search) parse these
 * fields to answer queries like "5 BHK penthouse on Sindhu Bhavan Road Ahmedabad".
 */
export function generatePropertySchema(property: PropertySchemaInput) {
  const canonicalUrl = absoluteUrl(`/properties/${property.slug}`);
  const coords = LOCATION_COORDINATES[property.location] ?? LOCATION_COORDINATES.other;
  const bedroomCount = parseBhkCount(property.floor ?? property.configuration);
  const amenities = buildAmenityFeatures(property.amenitiesSummary);

  const areaValue = property.builtUpArea ?? property.plotArea ?? property.sizeRange;
  const floorSize = areaValue
    ? { "@type": "QuantitativeValue", value: areaValue, unitText: "SQFT" }
    : undefined;

  const priceDisplay = property.priceOnRequest
    ? "Price on Request"
    : (property.price ?? "Price on Request");

  const residenceEntity: Record<string, unknown> = {
    "@type": getResidenceSchemaType(property.category),
    "@id": `${canonicalUrl}#residence`,
    name: property.name,
    description: property.description?.[0] ?? "",
    ...(property.coverImage ? { image: absoluteUrl(property.coverImage) } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: property.locationLabel,
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: coords.latitude,
      longitude: coords.longitude,
    },
    ...(bedroomCount !== undefined ? { numberOfRooms: bedroomCount } : {}),
    ...(floorSize ? { floorSize } : {}),
    ...(amenities ? { amenityFeature: amenities } : {}),
    ...(property.highlights?.length
      ? { additionalProperty: property.highlights.map((h) => ({ "@type": "PropertyValue", value: h })) }
      : {}),
  };

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${canonicalUrl}#listing`,
    url: canonicalUrl,
    name: `${property.configuration} · ${property.sizeRange} in ${property.locationLabel}`,
    description: property.description?.[0] ?? "",
    image: (property.images ?? [])
      .filter(Boolean)
      .slice(0, 6)
      .map((img) => absoluteUrl(img)),
    about: residenceEntity,
    offers: {
      "@type": "Offer",
      availability: AVAILABILITY_MAP[property.status] ?? "https://schema.org/LimitedAvailability",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "INR",
        description: priceDisplay,
      },
      seller: { "@id": `${SITE_URL}#real-estate-agent` },
    },
  };
}

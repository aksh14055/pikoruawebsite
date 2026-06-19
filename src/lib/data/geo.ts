import type { LocationSlug, ResidentialCategory } from "@/types";
import type { StaticProperty } from "@/lib/data/properties";
import { propertyMatchesCategoryIntent } from "@/lib/propertyFilters";

export type LandingPageKind = "location" | "property-type";

export interface LandingFaq {
  question: string;
  answer: string;
}

export interface GeoLandingPage {
  kind: LandingPageKind;
  slug: string;
  href: string;
  label: string;
  eyebrow: string;
  title: string;
  h1: string;
  description: string;
  heroImage: string;
  intro: string;
  marketSignals: string[];
  idealFor: string[];
  faqs: LandingFaq[];
  locationSlug?: LocationSlug;
  categories?: ResidentialCategory[];
  matchKeywords?: string[];
  relatedSlugs?: string[];
  collectionHref?: string;
}

export const LOCATION_LANDING_PAGES: GeoLandingPage[] = [
  {
    kind: "location",
    slug: "sindhu-bhavan",
    href: "/locations/sindhu-bhavan",
    label: "Sindhu Bhavan Road",
    eyebrow: "Prime Corridor",
    title: "Luxury Properties on Sindhu Bhavan Road, Ahmedabad",
    h1: "Luxury Properties on Sindhu Bhavan Road",
    description:
      "Private advisory for luxury apartments, penthouses, villas, and bungalows on Sindhu Bhavan Road, Ahmedabad's most recognized high-value residential corridor.",
    heroImage: "/properties/anurita/anurita-1.jpg",
    locationSlug: "sindhu-bhavan",
    intro:
      "Sindhu Bhavan Road is one of Ahmedabad's strongest luxury residential signals, preferred by HNI families who want immediate access to dining, private clubs, premium schools, and the western business belt without losing residential privacy.",
    marketSignals: [
      "Strong demand for large-format apartments, penthouses, duplexes, and independent villa estates.",
      "High buyer preference for privacy-led layouts, controlled entry, basement parking, and premium amenity decks.",
      "Limited availability keeps qualified buyer shortlists tight, especially for ready or near-possession homes.",
    ],
    idealFor: [
      "HNI families upgrading from central Ahmedabad into larger western-corridor residences.",
      "NRIs seeking a recognizable luxury address with strong resale recall.",
      "Sellers who want discreet representation instead of public portal exposure.",
    ],
    faqs: [
      {
        question: "Is Sindhu Bhavan Road a good location for luxury homes in Ahmedabad?",
        answer:
          "Yes. Sindhu Bhavan Road is one of Ahmedabad's most established luxury residential corridors, known for premium apartments, bungalows, private dining, and strong buyer recognition.",
      },
      {
        question: "What property types are common on Sindhu Bhavan Road?",
        answer:
          "The corridor has luxury apartments, penthouses, duplex homes, select villas, and private bungalow estates, usually suited to HNI and NRI residential buyers.",
      },
    ],
    relatedSlugs: ["iskon-ambli", "thaltej", "villas-bungalows-ahmedabad"],
  },
  {
    kind: "location",
    slug: "iskon-ambli",
    href: "/locations/iskon-ambli",
    label: "Iskon-Ambli Road",
    eyebrow: "Prime Corridor",
    title: "Luxury Properties on Iskon-Ambli Road, Ahmedabad",
    h1: "Luxury Properties on Iskon-Ambli Road",
    description:
      "Curated luxury apartments, sky mansions, penthouses, and duplex residences on Ahmedabad's Iskon-Ambli corridor.",
    heroImage: "/properties/maruti-360/maruti-360-view.jpg",
    locationSlug: "iskon-ambli",
    intro:
      "Iskon-Ambli is a core western Ahmedabad luxury corridor, valued for connectivity, premium social infrastructure, and a strong supply of large vertical residences with private club amenities.",
    marketSignals: [
      "A preferred zone for large 4 and 5 BHK homes, penthouses, and sky mansions.",
      "Demand is strongest for single-floor privacy, generous decks, and low-density tower planning.",
      "The corridor offers quick access to SG Highway, Sindhu Bhavan Road, Thaltej, and key lifestyle destinations.",
    ],
    idealFor: [
      "Families prioritizing connectivity and premium social infrastructure.",
      "Buyers seeking tower residences with scale, views, and private amenities.",
      "Investors evaluating proven western Ahmedabad residential demand.",
    ],
    faqs: [
      {
        question: "Why do luxury buyers prefer Iskon-Ambli Road?",
        answer:
          "Iskon-Ambli combines connectivity, premium residential supply, and high-end social infrastructure, making it one of Ahmedabad's strongest corridors for large luxury apartments and penthouses.",
      },
      {
        question: "Are there ready-to-move luxury homes on Iskon-Ambli Road?",
        answer:
          "Availability changes quickly. PIKORUA Realty maintains a private shortlist that may include ready, near-possession, and under-construction residences depending on buyer fit.",
      },
    ],
    relatedSlugs: ["sindhu-bhavan", "thaltej", "penthouses-duplexes-ahmedabad"],
  },
  {
    kind: "location",
    slug: "thaltej",
    href: "/locations/thaltej",
    label: "Thaltej",
    eyebrow: "Western Ahmedabad",
    title: "Luxury Properties in Thaltej, Ahmedabad",
    h1: "Luxury Properties in Thaltej",
    description:
      "Private advisory for luxury apartments, duplexes, and penthouses in Thaltej, Ahmedabad's mature western residential market.",
    heroImage: "/properties/capstone/castone1.png",
    locationSlug: "thaltej",
    intro:
      "Thaltej offers a mature luxury-residential environment with access to SG Highway, established neighborhoods, and a quieter rhythm than denser commercial-adjacent corridors.",
    marketSignals: [
      "Strong fit for buyers who want western Ahmedabad access with a more residential feel.",
      "Appeal for duplex and penthouse layouts with larger internal volumes.",
      "Good corridor for families balancing schools, work access, and long-term livability.",
    ],
    idealFor: [
      "End-use buyers who value calm residential positioning.",
      "Families comparing Thaltej, Shilaj, and Iskon-Ambli.",
      "Buyers looking for premium duplex homes and penthouses in western Ahmedabad.",
    ],
    faqs: [
      {
        question: "Is Thaltej considered a luxury residential area?",
        answer:
          "Yes. Thaltej is a mature western Ahmedabad residential market with premium towers, duplex homes, and strong access to SG Highway and surrounding luxury corridors.",
      },
      {
        question: "Who should consider buying in Thaltej?",
        answer:
          "Thaltej suits families who want western Ahmedabad connectivity, quieter residential surroundings, and access to large-format apartments or duplex residences.",
      },
    ],
    relatedSlugs: ["iskon-ambli", "shilaj", "luxury-apartments-ahmedabad"],
  },
  {
    kind: "location",
    slug: "shilaj",
    href: "/locations/shilaj",
    label: "Shilaj",
    eyebrow: "Villa And Land Corridor",
    title: "Luxury Villas, Bungalows, and Plots in Shilaj, Ahmedabad",
    h1: "Luxury Villas and Plots in Shilaj",
    description:
      "Curated villas, bungalows, and premium residential plots in Shilaj for buyers seeking privacy, land, and western Ahmedabad access.",
    heroImage: "/properties/vaikunth/vaikunth-1.png",
    locationSlug: "shilaj",
    intro:
      "Shilaj is favored by buyers who want land, privacy, and lower-density living while staying connected to Thaltej, Bopal, and the broader western Ahmedabad growth belt.",
    marketSignals: [
      "Strong relevance for villa, bungalow, and plotted development searches.",
      "Appeals to buyers who want more outdoor area and less vertical-density pressure.",
      "Inventory often needs careful diligence around access roads, permissions, and neighborhood maturity.",
    ],
    idealFor: [
      "Families seeking independent homes or plotted land.",
      "Buyers comparing Shilaj, Vaishno Devi, and Thaltej for long-term growth.",
      "NRIs planning a future private residence in Ahmedabad.",
    ],
    faqs: [
      {
        question: "Is Shilaj good for villas and bungalows?",
        answer:
          "Yes. Shilaj is one of Ahmedabad's relevant western corridors for villas, bungalows, and plotted residential options, especially for buyers prioritizing land and privacy.",
      },
      {
        question: "What should buyers check before buying land in Shilaj?",
        answer:
          "Buyers should review title, zoning, approach road, development permissions, utilities, and neighborhood maturity. PIKORUA Realty handles this diligence during private advisory.",
      },
    ],
    relatedSlugs: ["thaltej", "vaishno-devi", "residential-plots-ahmedabad"],
  },
  {
    kind: "location",
    slug: "vaishno-devi",
    href: "/locations/vaishno-devi",
    label: "Vaishno Devi",
    eyebrow: "Growth Corridor",
    title: "Luxury Villas and Premium Plots near Vaishno Devi, Ahmedabad",
    h1: "Luxury Homes near Vaishno Devi",
    description:
      "Private advisory for luxury villas, bungalows, plots, and large-format residences near Vaishno Devi, Ahmedabad.",
    heroImage: "/properties/northpark/northpark-1.jpg",
    locationSlug: "vaishno-devi",
    intro:
      "Vaishno Devi is a growth-led residential corridor for buyers comparing larger homes, villa communities, and premium plotted opportunities with long-term western-northern Ahmedabad upside.",
    marketSignals: [
      "Relevant for villas, plotted land, and larger under-construction residential formats.",
      "Buyer demand is shaped by connectivity, project quality, and future infrastructure maturity.",
      "Private evaluation matters because micro-location differences can materially affect long-term value.",
    ],
    idealFor: [
      "Buyers seeking larger formats beyond dense central corridors.",
      "Investors evaluating growth-led residential pockets.",
      "Families comparing villa communities and premium plotted assets.",
    ],
    faqs: [
      {
        question: "Is Vaishno Devi suitable for luxury property investment?",
        answer:
          "Vaishno Devi can be relevant for long-term residential investment, especially for villas and plots, but project quality, access, and micro-location need careful review.",
      },
      {
        question: "What property types are available near Vaishno Devi?",
        answer:
          "The area includes villas, bungalows, premium plots, and selected larger apartment formats, with availability varying by project stage and seller discretion.",
      },
    ],
    relatedSlugs: ["shilaj", "sg-highway", "residential-plots-ahmedabad"],
  },
  {
    kind: "location",
    slug: "sg-highway",
    href: "/locations/sg-highway",
    label: "SG Highway",
    eyebrow: "Connectivity Spine",
    title: "Luxury Properties near SG Highway, Ahmedabad",
    h1: "Luxury Properties near SG Highway",
    description:
      "Advisory for premium residential properties near SG Highway and connected western Ahmedabad corridors.",
    heroImage: "/properties/eminence-96/emini96-1.png",
    locationSlug: "sg-highway",
    intro:
      "SG Highway acts as a connectivity spine for western Ahmedabad. Buyers usually evaluate it alongside Thaltej, Iskon-Ambli, Shilaj, and Vaishno Devi depending on lifestyle, commute, and privacy needs.",
    marketSignals: [
      "Strong connectivity, but micro-location and building context matter heavily.",
      "Useful for buyers who need access across business, airport, and western residential zones.",
      "The best residential choices often sit just off the highway rather than directly on it.",
    ],
    idealFor: [
      "Buyers prioritizing citywide connectivity.",
      "Investors comparing western Ahmedabad access-led residential assets.",
      "Families who want advisory across nearby corridors rather than one fixed micro-market.",
    ],
    faqs: [
      {
        question: "Should I buy directly on SG Highway or nearby?",
        answer:
          "For residential use, many luxury buyers prefer premium pockets just off SG Highway for better privacy and livability while retaining connectivity.",
      },
      {
        question: "Which areas should I compare with SG Highway?",
        answer:
          "Common comparisons include Thaltej, Iskon-Ambli, Shilaj, Sindhu Bhavan Road, and Vaishno Devi, depending on budget and property type.",
      },
    ],
    relatedSlugs: ["thaltej", "iskon-ambli", "luxury-residential-investment-ahmedabad"],
  },
];

export const PROPERTY_TYPE_LANDING_PAGES: GeoLandingPage[] = [
  {
    kind: "property-type",
    slug: "luxury-apartments-ahmedabad",
    href: "/property-types/luxury-apartments-ahmedabad",
    label: "Luxury Apartments",
    eyebrow: "Property Type",
    title: "Luxury Apartments in Ahmedabad",
    h1: "Luxury Apartments in Ahmedabad",
    description:
      "Private advisory for luxury 4 BHK and 5 BHK apartments in Ahmedabad's premium residential corridors.",
    heroImage: "/properties/swati-senor/swati-senor-1.jpg",
    categories: ["apartment"],
    matchKeywords: ["apartment", "4 bhk", "5 bhk"],
    intro:
      "Luxury apartment buying in Ahmedabad is no longer about size alone. The strongest residences combine privacy, arrival experience, floor plate quality, security, amenity depth, and corridor strength.",
    marketSignals: [
      "Demand is concentrated in western Ahmedabad corridors such as Iskon-Ambli, Sindhu Bhavan Road, and Thaltej.",
      "Buyers increasingly prefer fewer units per floor, large decks, private lift lobbies, and strong clubhouse programming.",
      "Ready and near-possession homes command attention when location, layout, and maintenance quality align.",
    ],
    idealFor: [
      "Families upgrading to larger 4 BHK and 5 BHK residences.",
      "NRIs who want managed building infrastructure instead of independent-home upkeep.",
      "Sellers of premium apartments seeking qualified private buyer access.",
    ],
    faqs: [
      {
        question: "Which areas are best for luxury apartments in Ahmedabad?",
        answer:
          "Iskon-Ambli, Sindhu Bhavan Road, Thaltej, and nearby western corridors are among the most relevant areas for luxury apartments in Ahmedabad.",
      },
      {
        question: "What should I check before buying a luxury apartment?",
        answer:
          "Review floor plate privacy, lift access, parking, amenity quality, maintenance standards, legal documentation, RERA status where applicable, and future resale positioning.",
      },
    ],
    relatedSlugs: ["iskon-ambli", "sindhu-bhavan", "penthouses-duplexes-ahmedabad"],
  },
  {
    kind: "property-type",
    slug: "penthouses-duplexes-ahmedabad",
    href: "/property-types/penthouses-duplexes-ahmedabad",
    label: "Penthouses And Duplexes",
    eyebrow: "Property Type",
    title: "Penthouses and Duplex Homes in Ahmedabad",
    h1: "Penthouses and Duplex Homes in Ahmedabad",
    description:
      "Curated penthouses and duplex residences in Ahmedabad for buyers seeking scale, privacy, terraces, and skyline living.",
    heroImage: "/properties/ikebana/ikebana1.png",
    categories: ["penthouse", "duplex", "apartment"],
    matchKeywords: ["penthouse", "duplex"],
    intro:
      "Penthouses and duplex residences sit at the top end of Ahmedabad's vertical luxury market. The best opportunities are judged by privacy, ceiling height, terrace utility, view corridor, and building quality.",
    marketSignals: [
      "Many of the strongest penthouse and duplex options are held privately or released selectively.",
      "The premium is justified when the layout solves privacy, entertainment, and multi-generational living needs.",
      "Buyer diligence should include terrace rights, top-floor heat management, service access, and maintenance exposure.",
    ],
    idealFor: [
      "HNI buyers seeking a house-like experience inside a managed tower.",
      "Families wanting separate entertainment, family, and guest zones.",
      "NRIs comparing rare signature homes for long-term use.",
    ],
    faqs: [
      {
        question: "Are penthouses in Ahmedabad usually listed publicly?",
        answer:
          "Some are public, but many high-value penthouses and duplex residences are shared selectively through private advisory because sellers and developers prefer qualified buyer access.",
      },
      {
        question: "What makes a penthouse worth the premium?",
        answer:
          "Privacy, terrace usability, view protection, floor height, lift access, layout efficiency, building quality, and legal clarity around exclusive areas determine whether the premium is justified.",
      },
    ],
    relatedSlugs: ["luxury-apartments-ahmedabad", "sindhu-bhavan", "iskon-ambli"],
  },
  {
    kind: "property-type",
    slug: "villas-bungalows-ahmedabad",
    href: "/property-types/villas-bungalows-ahmedabad",
    label: "Villas And Bungalows",
    eyebrow: "Property Type",
    title: "Luxury Villas and Bungalows in Ahmedabad",
    h1: "Luxury Villas and Bungalows in Ahmedabad",
    description:
      "Private advisory for luxury villas, independent bungalows, and low-density residential estates in Ahmedabad.",
    heroImage: "/properties/anurita/anurita-1.jpg",
    categories: ["villa", "bungalow"],
    matchKeywords: ["villa", "bungalow"],
    intro:
      "Luxury villas and bungalows in Ahmedabad are bought for privacy, land, identity, and long-term family utility. The right option depends as much on title and neighborhood maturity as it does on architecture.",
    marketSignals: [
      "Demand is strong in Sindhu Bhavan Road, Shilaj, Vaishno Devi, and selected low-density western pockets.",
      "Buyers compare plot size, built-up quality, security, parking, staff access, and redevelopment flexibility.",
      "True private inventory often moves through relationship-led advisory rather than public listing portals.",
    ],
    idealFor: [
      "Families who want independent living and private outdoor space.",
      "Buyers upgrading from apartments into land-backed homes.",
      "Sellers of bungalows who want controlled, confidential buyer access.",
    ],
    faqs: [
      {
        question: "Where should I look for luxury villas in Ahmedabad?",
        answer:
          "Relevant pockets include Sindhu Bhavan Road, Shilaj, Vaishno Devi, and selected western Ahmedabad neighborhoods depending on land size, access, and privacy needs.",
      },
      {
        question: "What diligence matters for bungalows?",
        answer:
          "Title clarity, construction approvals, plot dimensions, access, parking, service areas, renovation scope, and future resale fit should be reviewed before committing.",
      },
    ],
    relatedSlugs: ["shilaj", "sindhu-bhavan", "residential-plots-ahmedabad"],
  },
  {
    kind: "property-type",
    slug: "residential-plots-ahmedabad",
    href: "/property-types/residential-plots-ahmedabad",
    label: "Residential Plots",
    eyebrow: "Property Type",
    title: "Premium Residential Plots in Ahmedabad",
    h1: "Premium Residential Plots in Ahmedabad",
    description:
      "Curated residential plots and land parcels in Ahmedabad for private homes, long-term assets, and family estates.",
    heroImage: "/properties/kalrav-alpines/kalrav-alpines-1.jpg",
    categories: ["plot"],
    matchKeywords: ["plot", "land"],
    intro:
      "Premium residential plots require more diligence than finished homes. The right parcel should balance title strength, access, permissible use, neighborhood maturity, infrastructure, and long-term family or investment plans.",
    marketSignals: [
      "Shilaj and Vaishno Devi remain relevant for larger plotted residential opportunities.",
      "Micro-location differences can materially change livability and exit value.",
      "Legal and development diligence is more important than brochure-level presentation.",
    ],
    idealFor: [
      "Families planning a custom private residence.",
      "Investors seeking land-backed residential exposure.",
      "NRIs who want to secure a future Ahmedabad base before building.",
    ],
    faqs: [
      {
        question: "Which Ahmedabad areas are relevant for premium residential plots?",
        answer:
          "Shilaj, Vaishno Devi, and selected western growth pockets are common options, but the right choice depends on access, title, permissions, and the intended build plan.",
      },
      {
        question: "What documents should be checked before buying a plot?",
        answer:
          "Title chain, zoning, NA permissions where applicable, development permissions, survey records, encumbrance, access road, and utility readiness should be checked.",
      },
    ],
    relatedSlugs: ["shilaj", "vaishno-devi", "villas-bungalows-ahmedabad"],
  },
  {
    kind: "property-type",
    slug: "luxury-residential-investment-ahmedabad",
    href: "/property-types/luxury-residential-investment-ahmedabad",
    label: "Residential Investment",
    eyebrow: "Property Type",
    title: "Luxury Residential Investment in Ahmedabad",
    h1: "Luxury Residential Investment in Ahmedabad",
    description:
      "Private advisory for HNI and NRI buyers evaluating luxury residential investment opportunities in Ahmedabad.",
    heroImage: "/properties/eminence-96/eminence-96-3-pool.webp",
    categories: ["investment", "residential-investment", "apartment", "plot"],
    matchKeywords: ["investment", "plot", "near-possession", "ready"],
    collectionHref: "/properties",
    intro:
      "Luxury residential investment in Ahmedabad works best when treated as a micro-market decision, not just a price-per-square-foot comparison. Corridor, scarcity, buyer depth, and exit profile matter.",
    marketSignals: [
      "Western Ahmedabad continues to attract end-use and NRI demand for larger premium homes.",
      "Ready or near-possession assets may suit buyers who prioritize certainty.",
      "Land and plotted assets require deeper legal diligence but can offer long-term strategic value.",
    ],
    idealFor: [
      "NRIs building a long-term Ahmedabad residential asset base.",
      "HNI investors seeking quality over public inventory volume.",
      "Families balancing future self-use with capital preservation.",
    ],
    faqs: [
      {
        question: "Is Ahmedabad good for luxury residential investment?",
        answer:
          "Ahmedabad can be attractive for luxury residential investment when the property has strong corridor positioning, legal clarity, scarcity, and realistic exit demand.",
      },
      {
        question: "Should NRIs buy ready homes or under-construction homes?",
        answer:
          "It depends on risk appetite, timeline, developer strength, payment structure, and future use. PIKORUA Realty compares both options during private advisory.",
      },
    ],
    relatedSlugs: ["sg-highway", "iskon-ambli", "residential-plots-ahmedabad"],
  },
];

export const ALL_GEO_LANDING_PAGES = [
  ...LOCATION_LANDING_PAGES,
  ...PROPERTY_TYPE_LANDING_PAGES,
];

export function getLocationLandingPage(slug: string): GeoLandingPage | undefined {
  return LOCATION_LANDING_PAGES.find((page) => page.slug === slug);
}

export function getPropertyTypeLandingPage(slug: string): GeoLandingPage | undefined {
  return PROPERTY_TYPE_LANDING_PAGES.find((page) => page.slug === slug);
}

export function getRelatedLandingPages(page: GeoLandingPage): GeoLandingPage[] {
  if (!page.relatedSlugs?.length) return [];
  return page.relatedSlugs
    .map((slug) => ALL_GEO_LANDING_PAGES.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is GeoLandingPage => Boolean(candidate));
}

export function getLandingPagesBySlugs(slugs: string[]): GeoLandingPage[] {
  return slugs
    .map((slug) => ALL_GEO_LANDING_PAGES.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is GeoLandingPage => Boolean(candidate));
}

function slugToPhrase(slug: string): string {
  return slug.replace(/-ahmedabad$/, "").replace(/-/g, " ");
}

/**
 * Matches a blog post's own text against landing-page keywords. Works for both
 * static fallback posts and Supabase-sourced posts (the `blogs` table has no
 * curated relation column, so this can't rely on an explicit field).
 */
export function getRelatedLandingPagesForText(
  text: string,
  limit = 4
): GeoLandingPage[] {
  const haystack = text.toLowerCase().replace(/-/g, " ");
  const matches = ALL_GEO_LANDING_PAGES.filter((page) => {
    const keywords = page.kind === "property-type" ? page.matchKeywords ?? [] : [slugToPhrase(page.slug)];
    return keywords.some((keyword) => haystack.includes(keyword.toLowerCase().replace(/-/g, " ")));
  });
  return matches.slice(0, limit);
}

export function getLandingProperties(page: GeoLandingPage, properties: StaticProperty[]): StaticProperty[] {
  if (page.kind === "location" && page.locationSlug) {
    return properties.filter((property) => property.location === page.locationSlug);
  }

  const categories = page.categories ?? [];
  const keywords = page.matchKeywords ?? [];

  return properties.filter((property) => {
    const searchable = `${property.category} ${property.configuration} ${property.sizeRange} ${property.locationLabel} ${property.suitableFor ?? ""}`.toLowerCase();
    return (
      categories.some((category) => propertyMatchesCategoryIntent(property, category)) ||
      keywords.some((keyword) => searchable.includes(keyword.toLowerCase()))
    );
  });
}

export function getLandingFilterHref(page: GeoLandingPage): string {
  if (page.collectionHref) return page.collectionHref;

  if (page.kind === "location" && page.locationSlug) {
    return `/properties?location=${page.locationSlug}`;
  }

  const primaryCategory = page.categories?.[0];
  return primaryCategory ? `/properties?category=${primaryCategory}` : "/properties";
}

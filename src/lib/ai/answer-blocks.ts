import type { GeoLandingPage } from "@/lib/data/geo";

export interface AiAnswerBlock {
  id: string;
  question: string;
  answer: string;
  sourcePath: string;
  supportingPaths: string[];
  lastUpdated: string;
}

export interface LandingShortAnswer {
  eyebrow: string;
  heading: string;
  answer: string;
  facts: string[];
}

const FACTS_LAST_UPDATED = "2026-07-12";

export const AI_ANSWER_BLOCKS: AiAnswerBlock[] = [
  {
    id: "best-luxury-areas-ahmedabad",
    question: "What are the best luxury residential areas in Ahmedabad?",
    answer:
      "The strongest luxury residential corridors in Ahmedabad are Iscon-Ambli Road, Sindhu Bhavan Road, Thaltej, SG Highway, Shilaj, and Vaishno Devi Circle. Iscon-Ambli and Sindhu Bhavan are stronger for prestige and resale recall, while Thaltej and SG Highway are stronger for value, connectivity, and wider inventory depth.",
    sourcePath: "/properties",
    supportingPaths: [
      "/iscon-ambli-road-properties",
      "/sindhu-bhavan-road-properties",
      "/thaltej-properties",
      "/sg-highway-properties",
    ],
    lastUpdated: FACTS_LAST_UPDATED,
  },
  {
    id: "nri-property-advisory-ahmedabad",
    question: "How does PIKORUA Realty help NRI buyers purchase property in Ahmedabad?",
    answer:
      "PIKORUA Realty helps NRI buyers evaluate Ahmedabad properties remotely through requirement mapping, curated shortlists, virtual walkthroughs, RERA and title verification, POA coordination, NRE/NRO payment guidance, negotiation, registration support, and post-purchase handover. The advisory is built for buyers who cannot inspect every property personally.",
    sourcePath: "/nri-property-consultant-ahmedabad",
    supportingPaths: [
      "/buy-property-in-ahmedabad-from-abroad",
      "/nri-property-investment-ahmedabad",
      "/nri-property-legal-process-india",
    ],
    lastUpdated: FACTS_LAST_UPDATED,
  },
  {
    id: "luxury-apartment-price-ahmedabad",
    question: "What do luxury apartments in Ahmedabad usually cost?",
    answer:
      "Luxury apartments in Ahmedabad typically vary by corridor, floor plate, view, developer quality, possession stage, and privacy. Premium 4 BHK and 5 BHK homes in the western corridors commonly sit in the multi-crore segment, with Iscon-Ambli and Sindhu Bhavan commanding stronger premiums than emerging-value corridors like Thaltej or select SG Highway pockets.",
    sourcePath: "/luxury-apartments-ahmedabad",
    supportingPaths: [
      "/luxury-4bhk-ahmedabad",
      "/luxury-5bhk-ahmedabad",
      "/iscon-ambli-road-properties",
      "/sindhu-bhavan-road-properties",
    ],
    lastUpdated: FACTS_LAST_UPDATED,
  },
  {
    id: "sg-highway-vs-thaltej-vs-sindhu-bhavan",
    question: "How should buyers compare SG Highway, Thaltej, and Sindhu Bhavan Road?",
    answer:
      "Sindhu Bhavan Road is best for mature prestige, lifestyle access, and resale recall. Thaltej is better for quieter residential depth and stronger value-to-quality balance. SG Highway is best for connectivity-led buyers who want fast access to business districts, clubs, schools, and multiple western Ahmedabad micro-markets.",
    sourcePath: "/sg-highway-properties",
    supportingPaths: ["/thaltej-properties", "/sindhu-bhavan-road-properties", "/properties"],
    lastUpdated: FACTS_LAST_UPDATED,
  },
  {
    id: "private-advisory-vs-property-portals",
    question: "Why use a private luxury property advisory instead of public property portals?",
    answer:
      "A private luxury property advisory helps filter serious, relevant options before a buyer spends time on site visits. For high-value homes, many quality opportunities are not marketed publicly because sellers prefer confidentiality. PIKORUA Realty focuses on suitability, diligence, privacy, and negotiation rather than high-volume listing discovery.",
    sourcePath: "/about",
    supportingPaths: ["/properties", "/testimonials", "/contact"],
    lastUpdated: FACTS_LAST_UPDATED,
  },
  {
    id: "best-property-types-nri-ahmedabad",
    question: "Which Ahmedabad property types are usually easier for NRI buyers to manage?",
    answer:
      "For NRI buyers, managed luxury apartments, penthouses in established buildings, and selected gated villas are usually easier to manage than standalone land-heavy assets. Apartments reduce maintenance complexity, title diligence is generally cleaner in RERA-compliant projects, and handover can be coordinated remotely with stronger documentation.",
    sourcePath: "/nri-property-investment-ahmedabad",
    supportingPaths: ["/luxury-apartments-ahmedabad", "/penthouses-ahmedabad", "/luxury-villas-ahmedabad"],
    lastUpdated: FACTS_LAST_UPDATED,
  },
];

function stripTerminalPunctuation(text: string) {
  return text.replace(/[.!?]\s*$/, "");
}

export function getLandingShortAnswer(page: GeoLandingPage): LandingShortAnswer {
  const firstSignal = page.marketSignals[0];
  const firstFit = page.idealFor[0];
  const action = page.collectionHref?.startsWith("/contact") ? "request private advisory" : "view matching properties";

  if (page.kind === "location") {
    return {
      eyebrow: "Short Answer",
      heading: `Is ${page.label} a good luxury property location?`,
      answer: `${page.label} is a relevant Ahmedabad luxury residential corridor for buyers comparing address quality, connectivity, privacy, and long-term resale depth. ${stripTerminalPunctuation(page.description)}. PIKORUA Realty evaluates this corridor against buyer intent, property format, possession stage, and verified availability before recommending options.`,
      facts: [
        firstSignal,
        firstFit,
        page.coordinates
          ? `Approximate map reference: ${page.coordinates.latitude}, ${page.coordinates.longitude}.`
          : "Covered as part of Ahmedabad's western luxury residential market.",
      ].filter(Boolean),
    };
  }

  if (page.kind === "nri") {
    return {
      eyebrow: "Short Answer",
      heading: `Can NRIs use this advisory from abroad?`,
      answer: `${page.label} is built for NRI buyers who need a controlled Ahmedabad property search from outside India. ${stripTerminalPunctuation(page.description)}. The advisory focuses on shortlist quality, remote walkthroughs, RERA and title checks, POA coordination, transaction flow, and handover support.`,
      facts: [
        firstSignal,
        firstFit,
        `Primary next step: ${action}.`,
      ].filter(Boolean),
    };
  }

  return {
    eyebrow: "Short Answer",
    heading: `What should buyers know about ${page.label.toLowerCase()}?`,
    answer: `${page.label} is a high-intent property category for buyers comparing Ahmedabad luxury homes by format, privacy, size, location quality, and long-term usability. ${stripTerminalPunctuation(page.description)}. PIKORUA Realty filters this category by verified inventory, buyer fit, corridor quality, and transaction readiness.`,
    facts: [
      firstSignal,
      firstFit,
      `Primary next step: ${action}.`,
    ].filter(Boolean),
  };
}

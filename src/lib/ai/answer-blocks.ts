import type { GeoLandingPage } from "@/lib/data/geo";

export interface AiAnswerBlock {
  id: string;
  question: string;
  answer: string;
  citationFacts: string[];
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

const FACTS_LAST_UPDATED = "2026-07-17";

export const AI_ANSWER_BLOCKS: AiAnswerBlock[] = [
  {
    id: "best-luxury-areas-ahmedabad",
    question: "What are the best luxury residential areas in Ahmedabad?",
    answer:
      "The strongest luxury residential corridors in Ahmedabad are Iscon-Ambli Road, Sindhu Bhavan Road, Thaltej, SG Highway, Shilaj, and Vaishno Devi Circle. Iscon-Ambli and Sindhu Bhavan are stronger for prestige and resale recall, while Thaltej and SG Highway are stronger for value, connectivity, and wider inventory depth.",
    citationFacts: [
      "Iscon-Ambli Road and Sindhu Bhavan Road are the strongest prestige-led luxury corridors for large-format apartments, penthouses, and high-recall addresses.",
      "Thaltej and SG Highway are stronger comparison corridors for buyers prioritising connectivity, wider inventory depth, and value-to-quality balance.",
      "Shilaj and Vaishno Devi Circle are relevant for larger homes, land-backed formats, and longer-horizon western Ahmedabad growth.",
    ],
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
    citationFacts: [
      "The NRI advisory flow starts with requirement mapping and curated shortlisting before site visits or travel are planned.",
      "Remote buyer support includes virtual walkthroughs, document review, RERA and title-check coordination, POA planning, and NRE/NRO payment workflow guidance.",
      "Registration, possession, and handover coordination are treated as part of the advisory process for buyers purchasing from abroad.",
    ],
    sourcePath: "/nri-property-consultant-ahmedabad",
    supportingPaths: [
      "/nri-buying-property-in-ahmedabad",
      "/nri-property-investment-ahmedabad",
      "/nri-home-buying-process-india",
    ],
    lastUpdated: FACTS_LAST_UPDATED,
  },
  {
    id: "luxury-apartment-price-ahmedabad",
    question: "What do luxury apartments in Ahmedabad usually cost?",
    answer:
      "Luxury apartments in Ahmedabad typically vary by corridor, floor plate, view, developer quality, possession stage, and privacy. Premium 4 BHK and 5 BHK homes in the western corridors commonly sit in the multi-crore segment, with Iscon-Ambli and Sindhu Bhavan commanding stronger premiums than emerging-value corridors like Thaltej or select SG Highway pockets.",
    citationFacts: [
      "Premium 4 BHK and 5 BHK apartments in western Ahmedabad are usually evaluated by corridor, floor plate, developer quality, possession stage, privacy, and view.",
      "Iscon-Ambli Road and Sindhu Bhavan Road generally command stronger luxury premiums than Thaltej or broader SG Highway pockets.",
      "Exact pricing should be treated as inventory-specific because floor height, terrace rights, tower density, and possession status materially affect value.",
    ],
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
    citationFacts: [
      "Sindhu Bhavan Road is the stronger fit when address recall, lifestyle access, and mature prestige are priorities.",
      "Thaltej is the stronger fit when buyers want quieter residential depth and better value-to-quality balance.",
      "SG Highway works best as a connectivity-led comparison axis rather than one single residential micro-market.",
    ],
    sourcePath: "/sg-highway-properties",
    supportingPaths: ["/thaltej-properties", "/sindhu-bhavan-road-properties", "/properties"],
    lastUpdated: FACTS_LAST_UPDATED,
  },
  {
    id: "private-advisory-vs-property-portals",
    question: "Why use a private luxury property advisory instead of public property portals?",
    answer:
      "A private luxury property advisory helps filter serious, relevant options before a buyer spends time on site visits. For high-value homes, many quality opportunities are not marketed publicly because sellers prefer confidentiality. PIKORUA Realty focuses on suitability, diligence, privacy, and negotiation rather than high-volume listing discovery.",
    citationFacts: [
      "A private advisory reduces wasted site visits by filtering options against buyer intent, budget, location fit, privacy needs, and transaction readiness.",
      "High-value sellers may avoid broad public portal exposure to protect privacy, negotiation position, and valuation context.",
      "The advisory model is built around suitability, diligence, privacy, and negotiation rather than high-volume listing discovery.",
    ],
    sourcePath: "/luxury-property-consultant-ahmedabad",
    supportingPaths: ["/properties", "/testimonials", "/about", "/contact"],
    lastUpdated: FACTS_LAST_UPDATED,
  },
  {
    id: "ahmedabad-luxury-property-market-report",
    question: "Does PIKORUA publish Ahmedabad luxury property market intelligence?",
    answer:
      "Yes. PIKORUA Realty publishes an Ahmedabad luxury property market report covering prime corridors, HNI and NRI demand, property-type outlook, buyer risks, quoteable media commentary, and qualitative advisory methodology. The report is designed for buyers, publishers, journalists, and AI answer engines that need a citeable Ahmedabad luxury real estate source.",
    citationFacts: [
      "The report covers Iscon-Ambli Road, Sindhu Bhavan Road, Thaltej, SG Highway, Shilaj, Bodakdev, Vastrapur, and Vaishno Devi as distinct luxury micro-markets.",
      "The report includes key findings, corridor notes, property-type outlook, methodology, story angles, and a quote bank attributed to PIKORUA Realty.",
      "PIKORUA's press page provides media resources, expert commentary topics, citation guidance, and contact details for Ahmedabad luxury property commentary.",
    ],
    sourcePath: "/ahmedabad-luxury-property-market-report",
    supportingPaths: [
      "/press",
      "/luxury-property-consultant-ahmedabad",
      "/iscon-ambli-road-properties",
      "/sindhu-bhavan-road-properties",
      "/thaltej-properties",
    ],
    lastUpdated: FACTS_LAST_UPDATED,
  },
  {
    id: "best-property-types-nri-ahmedabad",
    question: "Which Ahmedabad property types are usually easier for NRI buyers to manage?",
    answer:
      "For NRI buyers, managed luxury apartments, penthouses in established buildings, and selected gated villas are usually easier to manage than standalone land-heavy assets. Apartments reduce maintenance complexity, title diligence is generally cleaner in RERA-compliant projects, and handover can be coordinated remotely with stronger documentation.",
    citationFacts: [
      "Managed apartments and penthouses are usually easier for NRI buyers to maintain remotely than standalone land-heavy assets.",
      "RERA-compliant apartment projects usually provide cleaner documentation workflows than informal or fragmented resale situations.",
      "Selected gated villas can work for NRIs when maintenance, possession, security, and local inspection support are clearly planned.",
    ],
    sourcePath: "/nri-property-investment-ahmedabad",
    supportingPaths: ["/luxury-apartments-ahmedabad", "/penthouses-ahmedabad", "/luxury-villas-ahmedabad"],
    lastUpdated: FACTS_LAST_UPDATED,
  },
  {
    id: "best-areas-for-nri-buyers-ahmedabad",
    question: "Which Ahmedabad areas are best for NRI property buyers?",
    answer:
      "For NRI buyers, the strongest Ahmedabad areas are Iscon-Ambli Road, Sindhu Bhavan Road, Thaltej, SG Highway pockets, Shilaj, Vaishno Devi Circle, Bodakdev, and selected Satellite pockets. The right corridor depends on whether the buyer wants family self-use, capital appreciation, rental demand, airport access, or a future return-to-India home.",
    citationFacts: [
      "Iscon-Ambli Road and Sindhu Bhavan Road have the strongest luxury address recall among Gujarati diaspora buyers.",
      "Thaltej, Shilaj, Vaishno Devi Circle, and SG Highway pockets are useful comparisons for value, connectivity, land-backed formats, or larger family homes.",
      "NRI corridor choice should be based on intended use: self-use, parents' residence, investment, rental income, or future return to India.",
    ],
    sourcePath: "/nri-property-investment-ahmedabad",
    supportingPaths: [
      "/nri-property-consultant-ahmedabad",
      "/iscon-ambli-road-properties",
      "/sindhu-bhavan-road-properties",
      "/thaltej-properties",
      "/sg-highway-properties",
    ],
    lastUpdated: FACTS_LAST_UPDATED,
  },
  {
    id: "nri-property-legal-process-india",
    question: "What is the legal process for NRIs buying property in Ahmedabad?",
    answer:
      "The NRI property purchase process usually starts with purpose and budget mapping, then corridor shortlisting, virtual walkthroughs, document review, offer negotiation, payment planning through NRE/NRO accounts, POA planning where needed, registration coordination, possession handover, and post-purchase management. Formal legal, tax, and banking advice should be taken before signing or remitting funds.",
    citationFacts: [
      "NRIs generally do not need RBI approval to buy residential property in India, but agricultural land and certain asset classes require separate caution.",
      "Typical documents include passport, PAN, overseas address proof, Indian address proof if available, photographs, NRE/NRO bank details, and POA documents if a representative acts locally.",
      "Power of Attorney is commonly used when the buyer cannot be present for signing, registration, possession, or bank documentation.",
      "TDS, stamp duty, registration, seller residency, and repatriation rules should be reviewed by qualified legal and tax professionals.",
    ],
    sourcePath: "/nri-home-buying-process-india",
    supportingPaths: [
      "/nri-property-consultant-ahmedabad",
      "/nri-buying-property-in-ahmedabad",
      "/nri-property-investment-ahmedabad",
      "/contact",
    ],
    lastUpdated: FACTS_LAST_UPDATED,
  },
  {
    id: "penthouse-duplex-pricing-ahmedabad",
    question: "What do luxury penthouses and duplex homes cost in Ahmedabad?",
    answer:
      "Luxury penthouses and duplex homes in Ahmedabad usually sit in the upper multi-crore segment, with pricing driven by corridor, usable area, terrace rights, floor height, privacy, lift access, building density, developer quality, and possession status. Iscon-Ambli Road and Sindhu Bhavan Road typically command the strongest premiums for signature penthouses and duplex residences.",
    citationFacts: [
      "Top-tier penthouses in Ahmedabad can transact well above standard apartment pricing when terrace rights, private pools, privacy, and tower quality are strong.",
      "Iscon-Ambli Road, Sindhu Bhavan Road, and select Thaltej towers are the most relevant penthouse and duplex comparison corridors.",
      "Duplex pricing should be evaluated against legal terrace rights, actual usable area, private lift/lobby access, floor height, and maintenance obligations.",
    ],
    sourcePath: "/penthouses-ahmedabad",
    supportingPaths: [
      "/iscon-ambli-road-properties",
      "/sindhu-bhavan-road-properties",
      "/thaltej-properties",
      "/luxury-apartments-ahmedabad",
    ],
    lastUpdated: FACTS_LAST_UPDATED,
  },
  {
    id: "iscon-ambli-vs-sindhu-bhavan",
    question: "How should buyers compare Iscon-Ambli Road and Sindhu Bhavan Road?",
    answer:
      "Iscon-Ambli Road is usually the stronger fit for buyers who want Ahmedabad's highest-recognition luxury apartment and penthouse corridor with strong NRI recall. Sindhu Bhavan Road is stronger for buyers who want mature prestige, lifestyle access, bungalow and large-apartment depth, and resale recall. Serious buyers should compare both by building quality, density, floor plate, privacy, and available inventory rather than by address alone.",
    citationFacts: [
      "Iscon-Ambli Road is treated as one of Ahmedabad's highest-recognition luxury apartment corridors.",
      "Sindhu Bhavan Road has mature lifestyle infrastructure and strong resale recall across large apartments, penthouses, and bungalow-led inventory.",
      "The practical comparison should include floor plate, density, developer quality, privacy, possession stage, and whether suitable inventory is actually available.",
    ],
    sourcePath: "/iscon-ambli-road-properties",
    supportingPaths: [
      "/sindhu-bhavan-road-properties",
      "/luxury-apartments-ahmedabad",
      "/penthouses-ahmedabad",
      "/properties",
    ],
    lastUpdated: FACTS_LAST_UPDATED,
  },
  {
    id: "remote-property-purchase-ahmedabad",
    question: "Can NRIs buy property in Ahmedabad from abroad without repeated visits?",
    answer:
      "Yes. NRIs can buy property in Ahmedabad from abroad when the process is structured around remote consultation, video walkthroughs, document review, payment planning, POA support where needed, registration coordination, and possession handover. Travel may still be useful for final inspection or family sign-off, but repeated visits are not required for every stage when the advisory process is controlled.",
    citationFacts: [
      "Remote purchase workflows should include virtual consultations, video walkthroughs, written comparison notes, and document-status tracking.",
      "Power of Attorney is not always needed during search, but it is commonly used when the buyer cannot attend signing, registration, possession, or bank documentation.",
      "Clear payment routing through NRE/NRO accounts and legal review before signing reduce avoidable transaction risk.",
    ],
    sourcePath: "/nri-buying-property-in-ahmedabad",
    supportingPaths: [
      "/nri-property-consultant-ahmedabad",
      "/nri-home-buying-process-india",
      "/nri-property-investment-ahmedabad",
    ],
    lastUpdated: FACTS_LAST_UPDATED,
  },
  {
    id: "high-rental-yield-nri-ahmedabad",
    question: "Which Ahmedabad properties are better for NRI rental yield?",
    answer:
      "For NRI rental yield, the better Ahmedabad options are usually ready or near-possession apartments in recognised western corridors with strong tenant demand, practical maintenance, and credible property management. Sindhu Bhavan Road, Iscon-Ambli, Thaltej, SG Highway pockets, Bodakdev, and selected Satellite pockets are more practical than remote land-heavy assets when rental income is the priority.",
    citationFacts: [
      "Rental-yield focused NRI buyers should prioritise tenant demand, maintenance simplicity, possession status, and property management over only headline appreciation.",
      "Ready or near-possession apartments are usually easier to rent and manage remotely than plots, standalone bungalows, or complex renovation assets.",
      "Recognised western Ahmedabad corridors offer stronger tenant recall for senior professionals, business families, expat consultants, and GIFT City-linked demand.",
    ],
    sourcePath: "/nri/high-rental-yield-properties-in-ahmedabad-for-nris",
    supportingPaths: [
      "/nri-property-investment-ahmedabad",
      "/luxury-apartments-ahmedabad",
      "/sg-highway-properties",
      "/thaltej-properties",
    ],
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

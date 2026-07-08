import type { LocationSlug, PropertyStatus, ResidentialCategory } from "@/types";

type AdvisoryLocation = LocationSlug | "default";

interface CorridorAdvisory {
  hook: string;
  rental: string;
  appreciation: string;
  demand: string;
  lifestyle: string[];
}

interface PropertyAdvisoryInput {
  category: ResidentialCategory;
  location: LocationSlug;
  locationLabel: string;
  status: PropertyStatus;
  suitableFor?: string;
}

const CORRIDOR_ADVISORY: Record<AdvisoryLocation, CorridorAdvisory> = {
  "iskon-ambli": {
    hook: "scarce luxury supply, strong executive rental demand, and long-term address recall",
    rental: "Strong furnished rental potential from CXOs, founders, expats, and senior professionals, subject to furnishing, possession, and final fit-out.",
    appreciation: "High potential because Iskon-Ambli has limited premium supply, strong resale recall, and deep HNI/NRI demand.",
    demand: "Consistent demand for 4 and 5 BHK residences, duplexes, penthouses, and low-density tower formats.",
    lifestyle: [
      "Rajpath Club and Karnavati Club access within the west Ahmedabad luxury circuit.",
      "Premium schools, hospitals, dining, and retail across Bodakdev, Ambli, and SG Highway.",
      "A mature social ecosystem for HNI families, founders, and returning NRI buyers.",
    ],
  },
  "sindhu-bhavan": {
    hook: "premium dining, strong resale depth, and daily convenience for families",
    rental: "Healthy rental interest from business owners, senior executives, and NRI families seeking furnished luxury homes near Sindhu Bhavan Road.",
    appreciation: "High potential due to strong buyer recall, limited central-west land supply, and sustained luxury demand.",
    demand: "Deep demand for ready and near-possession luxury apartments, villas, and larger family homes.",
    lifestyle: [
      "Rajpath Club, Karnavati Club, and Sindhu Bhavan's premium dining belt are key lifestyle anchors.",
      "Strong access to established schools, hospitals, cafes, retail, and business corridors.",
      "A premium social ecosystem with high visibility among Ahmedabad's luxury home buyers.",
    ],
  },
  thaltej: {
    hook: "central-west connectivity, family infrastructure, and established villa demand",
    rental: "Selective rental demand from senior professionals and families who prefer larger homes with fast access to SG Highway and Bodakdev.",
    appreciation: "Good potential because Thaltej benefits from central-west scarcity and demand for larger homes.",
    demand: "Steady micro-market demand for villas, bungalows, premium apartments, and family-sized residences.",
    lifestyle: [
      "Convenient access to Rajpath Club, Karnavati Club, and the SG Highway social corridor.",
      "Established schools, hospitals, temples, dining, and daily conveniences nearby.",
      "Premium family ecosystem suited to long-term self-use and wealth preservation.",
    ],
  },
  shilaj: {
    hook: "westward growth, lower-density living, and improving connectivity",
    rental: "Moderate-to-strong rental potential for well-finished homes as the Shilaj-Ambli corridor matures.",
    appreciation: "Good potential as west Ahmedabad expands and demand shifts toward larger, quieter residential formats.",
    demand: "Rising demand from families seeking more space, gated communities, and access to premium west Ahmedabad.",
    lifestyle: [
      "Access to the Rajpath and Karnavati Club circuit through Ambli and SG Highway.",
      "Schools, healthcare, retail, and food options are improving quickly across the westward growth belt.",
      "Quieter residential ecosystem with premium low-density and family-focused appeal.",
    ],
  },
  "vaishno-devi": {
    hook: "township growth, highway connectivity, and future-facing residential demand",
    rental: "Selective rental potential from professionals and families looking for larger gated formats near the Ahmedabad-Gandhinagar corridor.",
    appreciation: "Medium-to-high potential as infrastructure, township density, and institutional demand continue to mature.",
    demand: "Growing demand for villas, plots, and plotted communities with better air, space, and connectivity.",
    lifestyle: [
      "Access to premium township, golf, and club options across the Ahmedabad-Gandhinagar corridor.",
      "Improving schools, hospitals, retail, and daily conveniences along SP Ring Road and SG Highway.",
      "A quieter premium ecosystem for families prioritizing space and long-term growth.",
    ],
  },
  "sg-highway": {
    hook: "corporate connectivity, city-wide access, and strong tenant visibility",
    rental: "Strong tenant visibility from corporate leaders, founders, expats, and professionals who need fast access across Ahmedabad.",
    appreciation: "Good potential because SG Highway remains a primary mobility, office, retail, and luxury residential spine.",
    demand: "Broad demand across premium apartments, investment-led assets, and high-access family residences.",
    lifestyle: [
      "Rajpath Club, Karnavati Club, premium hotels, malls, and dining are accessible through the SG Highway corridor.",
      "Strong access to schools, hospitals, offices, retail, and cross-city transport.",
      "High-utility social ecosystem for NRI buyers balancing self-use, rental, and resale.",
    ],
  },
  other: {
    hook: "Ahmedabad connectivity, premium livability, and long-term residential demand",
    rental: "Rental potential should be benchmarked against current furnished inventory, building quality, and possession timeline.",
    appreciation: "Potential depends on land scarcity, infrastructure growth, builder delivery, and depth of resale demand.",
    demand: "Demand should be validated against the exact micro-market, project format, and competing supply.",
    lifestyle: [
      "Club, school, hospital, retail, and dining access should be reviewed around the exact address.",
      "Premium social fit depends on the surrounding residential catchment and daily convenience.",
      "Best suited when the lifestyle ecosystem matches the buyer's family, rental, and resale goals.",
    ],
  },
  default: {
    hook: "Ahmedabad connectivity, premium livability, and long-term residential demand",
    rental: "Rental potential should be benchmarked against current furnished inventory, building quality, and possession timeline.",
    appreciation: "Potential depends on land scarcity, infrastructure growth, builder delivery, and depth of resale demand.",
    demand: "Demand should be validated against the exact micro-market, project format, and competing supply.",
    lifestyle: [
      "Club, school, hospital, retail, and dining access should be reviewed around the exact address.",
      "Premium social fit depends on the surrounding residential catchment and daily convenience.",
      "Best suited when the lifestyle ecosystem matches the buyer's family, rental, and resale goals.",
    ],
  },
};

const REMOTE_BUYING_SUPPORT = [
  {
    label: "Virtual tours",
    value: "Live virtual inspections can be arranged for layout flow, approach road, views, common areas, and site context.",
  },
  {
    label: "Video walkthroughs",
    value: "Recorded walkthroughs help NRIs compare shortlisted homes asynchronously across time zones.",
  },
  {
    label: "Documentation help",
    value: "End-to-end coordination for title papers, RERA checks, sale terms, payment schedule, and power-of-attorney workflow.",
  },
];

const TRUST_TRIGGERS = [
  {
    label: "Builder credibility",
    value: "Developer track record, delivery discipline, specifications, and construction stage are reviewed before shortlisting.",
  },
  {
    label: "Past projects",
    value: "Completed project quality, resident feedback, and comparable luxury delivery are checked wherever available.",
  },
  {
    label: "Legal clarity",
    value: "Title chain, RERA details, allotment terms, sale agreement, payment plan, and handover obligations can be reviewed before booking.",
  },
];

function getExpectedRentalText(property: PropertyAdvisoryInput, corridor: CorridorAdvisory) {
  if (property.category === "plot") {
    return "Rental income is not the primary thesis for this asset; returns should be assessed through land appreciation and future development optionality.";
  }

  if (property.category === "villa" || property.category === "bungalow") {
    return "Selective rental demand from senior executives and NRI families; strongest when the home is furnished, maintained, and professionally managed.";
  }

  if (property.status === "ready-to-move" || property.status === "near-possession") {
    return corridor.rental;
  }

  return `${corridor.rental} Final rent should be benchmarked closer to possession after fit-out and market inventory are clear.`;
}

export function getNriPropertyAdvisory(property: PropertyAdvisoryInput) {
  const corridor = CORRIDOR_ADVISORY[property.location] ?? CORRIDOR_ADVISORY.default;

  return {
    hook: `Perfect for NRIs due to ${property.locationLabel}'s ${corridor.hook}.`,
    roiSnapshot: [
      {
        label: "Expected rental income",
        value: getExpectedRentalText(property, corridor),
      },
      {
        label: "Appreciation potential",
        value: corridor.appreciation,
      },
      {
        label: "Micro-market demand",
        value: property.suitableFor
          ? `${corridor.demand} ${property.suitableFor}.`
          : corridor.demand,
      },
    ],
    remoteBuyingSupport: REMOTE_BUYING_SUPPORT,
    trustTriggers: TRUST_TRIGGERS,
    lifestyle: corridor.lifestyle,
  };
}

import type { ResidentialCategory } from "@/types";

export interface KeywordCluster {
  pillar: string;
  primary: string[];
  transactional: string[];
  longTail: string[];
  nri: string[];
  hni: string[];
  locationModifiers: string[];
  attributeModifiers: string[];
  questions: string[];
  comparisons: string[];
  contentAngles: string[];
}

const WESTERN_CORRIDORS = [
  "Iscon Ambli Road",
  "Sindhu Bhavan Road",
  "Thaltej",
  "SG Highway",
  "Bodakdev",
  "Vastrapur",
  "Shilaj",
  "Vaishno Devi",
] as const;

const ADVISORY_MODIFIERS = [
  "private advisory",
  "verified inventory",
  "off market access",
  "developer verification",
  "documentation support",
  "negotiation support",
] as const;

export const PROPERTY_TYPE_KEYWORD_CLUSTERS = {
  "luxury-apartments-ahmedabad": {
    pillar: "Luxury apartments and premium flats in Ahmedabad",
    primary: [
      "luxury apartments Ahmedabad",
      "luxury flats Ahmedabad",
      "premium apartments Ahmedabad",
      "high end apartments Ahmedabad",
      "large format apartments Ahmedabad",
    ],
    transactional: [
      "buy luxury apartment in Ahmedabad",
      "luxury apartment for sale Ahmedabad",
      "premium flat for sale Ahmedabad",
      "ready to move luxury apartments Ahmedabad",
      "new launch luxury apartments Ahmedabad",
      "4 BHK luxury flat Ahmedabad",
      "5 BHK luxury flat Ahmedabad",
      "private lift apartment Ahmedabad",
    ],
    longTail: [
      "low density luxury apartments in Ahmedabad",
      "luxury apartments with private lift lobby Ahmedabad",
      "large balcony luxury flats Ahmedabad",
      "gated community luxury apartments Ahmedabad",
      "premium apartments with clubhouse Ahmedabad",
      "luxury flats with servant room Ahmedabad",
      "high rise luxury apartments western Ahmedabad",
      "luxury apartment shortlist Ahmedabad",
    ],
    nri: [
      "NRI buy luxury apartment Ahmedabad",
      "managed luxury apartments Ahmedabad for NRIs",
      "NRI friendly flats Ahmedabad",
      "video tour luxury apartment Ahmedabad",
      "remote purchase luxury flat Ahmedabad",
    ],
    hni: [
      "HNI apartment advisory Ahmedabad",
      "private luxury flat search Ahmedabad",
      "discreet apartment buying Ahmedabad",
      "exclusive apartment inventory Ahmedabad",
    ],
    locationModifiers: [...WESTERN_CORRIDORS],
    attributeModifiers: [
      "private lift lobby",
      "low density tower",
      "large deck",
      "clubhouse",
      "ready possession",
      "RERA registered",
    ],
    questions: [
      "which area is best for luxury apartments in Ahmedabad",
      "what should I check before buying a luxury flat in Ahmedabad",
      "are luxury apartments in Ahmedabad good for NRIs",
      "where can I buy a 5 BHK luxury apartment in Ahmedabad",
    ],
    comparisons: [
      "luxury apartments vs penthouses Ahmedabad",
      "Iscon Ambli vs Sindhu Bhavan luxury apartments",
      "ready possession vs under construction luxury flats Ahmedabad",
    ],
    contentAngles: [
      "Luxury apartment buyer checklist for Ahmedabad",
      "Best corridors for large format apartments in Ahmedabad",
      "NRI guide to managed apartment purchases in Ahmedabad",
    ],
  },
  "luxury-real-estate-ahmedabad": {
    pillar: "Ahmedabad luxury real estate market and advisory",
    primary: [
      "luxury real estate Ahmedabad",
      "Ahmedabad luxury real estate",
      "luxury residential real estate Ahmedabad",
      "premium real estate Ahmedabad",
      "Ahmedabad luxury property market",
    ],
    transactional: [
      "buy luxury real estate Ahmedabad",
      "luxury real estate advisory Ahmedabad",
      "luxury real estate consultant Ahmedabad",
      "Ahmedabad luxury real estate broker",
      "private luxury real estate advisory Ahmedabad",
      "luxury real estate investment Ahmedabad",
    ],
    longTail: [
      "Ahmedabad luxury real estate market guide",
      "best luxury real estate corridors Ahmedabad",
      "luxury real estate for family offices Ahmedabad",
      "off market luxury real estate Ahmedabad",
      "verified luxury residential real estate Ahmedabad",
      "luxury real estate micro market Ahmedabad",
      "luxury real estate resale value Ahmedabad",
    ],
    nri: [
      "Ahmedabad luxury real estate for NRIs",
      "NRI real estate advisory Ahmedabad",
      "NRI luxury real estate investment Ahmedabad",
      "buy Ahmedabad real estate from abroad",
    ],
    hni: [
      "HNI real estate advisory Ahmedabad",
      "private real estate advisory Ahmedabad HNI",
      "HNI luxury residential real estate Ahmedabad",
      "discreet real estate advisory Ahmedabad",
    ],
    locationModifiers: [...WESTERN_CORRIDORS],
    attributeModifiers: [
      "market intelligence",
      "corridor comparison",
      "private mandates",
      "premium developer inventory",
      "capital preservation",
      "resale depth",
    ],
    questions: [
      "what defines luxury real estate in Ahmedabad",
      "which Ahmedabad corridors have the strongest luxury real estate demand",
      "is Ahmedabad luxury real estate good for NRIs",
      "how should HNIs evaluate Ahmedabad real estate",
    ],
    comparisons: [
      "Ahmedabad vs Dubai real estate investment",
      "Ahmedabad vs Mumbai luxury real estate",
      "Iscon Ambli vs Thaltej real estate",
    ],
    contentAngles: [
      "Ahmedabad luxury real estate market report",
      "Corridor-by-corridor real estate comparison",
      "HNI and NRI demand in Ahmedabad luxury real estate",
    ],
  },
  "luxury-property-consultant-ahmedabad": {
    pillar: "Luxury property consultant and advisor in Ahmedabad",
    primary: [
      "luxury property consultant Ahmedabad",
      "luxury property advisor Ahmedabad",
      "premium property consultant Ahmedabad",
      "trusted luxury property consultant Ahmedabad",
      "best luxury property consultant Ahmedabad",
    ],
    transactional: [
      "find luxury property consultant Ahmedabad",
      "hire property advisor Ahmedabad",
      "private luxury property consultant Ahmedabad",
      "buy luxury property with consultant Ahmedabad",
      "sell luxury property consultant Ahmedabad",
      "property valuation consultant Ahmedabad luxury",
    ],
    longTail: [
      "luxury property consultant for Iscon Ambli Ahmedabad",
      "luxury property consultant for Sindhu Bhavan Road",
      "off market property consultant Ahmedabad",
      "private buyer representation Ahmedabad",
      "discreet seller representation Ahmedabad",
      "luxury property negotiation support Ahmedabad",
      "developer project evaluation Ahmedabad",
    ],
    nri: [
      "NRI luxury property consultant Ahmedabad",
      "NRI property buying support Ahmedabad",
      "NRI property documentation consultant Ahmedabad",
      "video inspection property consultant Ahmedabad",
    ],
    hni: [
      "HNI property advisor Ahmedabad",
      "HNI property consultant Gujarat",
      "family property advisor Ahmedabad",
      "private mandate property consultant Ahmedabad",
    ],
    locationModifiers: [...WESTERN_CORRIDORS],
    attributeModifiers: [...ADVISORY_MODIFIERS],
    questions: [
      "how to choose a luxury property consultant in Ahmedabad",
      "what should a property consultant verify before recommending a home",
      "can a consultant help with off market luxury property",
      "does PIKORUA help sellers discreetly",
    ],
    comparisons: [
      "luxury property consultant vs real estate agent Ahmedabad",
      "off market consultant vs public listing Ahmedabad",
      "buyer advisory vs developer sales team Ahmedabad",
    ],
    contentAngles: [
      "Checklist for evaluating luxury property consultants",
      "Private buyer representation in Ahmedabad luxury real estate",
      "How consultants reduce documentation and pricing risk",
    ],
  },
  "real-estate-consultant-ahmedabad": {
    pillar: "Best real estate consultant in Ahmedabad for premium residential decisions",
    primary: [
      "real estate consultant Ahmedabad",
      "best real estate consultant Ahmedabad",
      "property consultant Ahmedabad",
      "real estate advisor Ahmedabad",
      "premium real estate consultant Ahmedabad",
    ],
    transactional: [
      "hire real estate consultant Ahmedabad",
      "find property consultant Ahmedabad",
      "trusted real estate consultant Ahmedabad",
      "buy property through consultant Ahmedabad",
      "sell property consultant Ahmedabad",
      "real estate advisory Ahmedabad",
    ],
    longTail: [
      "real estate consultant for premium homes Ahmedabad",
      "real estate consultant for NRIs Ahmedabad",
      "property consultant for western Ahmedabad",
      "real estate consultant for family home Ahmedabad",
      "property shortlisting consultant Ahmedabad",
      "developer project consultant Ahmedabad",
      "real estate due diligence consultant Ahmedabad",
    ],
    nri: [
      "NRI real estate consultant Ahmedabad",
      "NRI property advisor Ahmedabad",
      "remote real estate consultant Ahmedabad",
      "NRI buying property in India consultant",
    ],
    hni: [
      "HNI real estate advisor Ahmedabad",
      "private property consultant Ahmedabad",
      "premium home advisor Ahmedabad",
      "confidential seller advisor Ahmedabad",
    ],
    locationModifiers: [...WESTERN_CORRIDORS],
    attributeModifiers: [
      "shortlisting",
      "site visits",
      "valuation",
      "documentation",
      "negotiation",
      "handover",
    ],
    questions: [
      "who is the best real estate consultant in Ahmedabad",
      "what should a real estate consultant do for buyers",
      "how do I verify a property consultant in Ahmedabad",
      "can a consultant help with property documentation",
    ],
    comparisons: [
      "real estate consultant vs broker Ahmedabad",
      "premium consultant vs public property portal Ahmedabad",
      "Ahmedabad property consultant vs developer sales team",
    ],
    contentAngles: [
      "How to choose a real estate consultant in Ahmedabad",
      "Buyer-first property advisory process",
      "Questions to ask before hiring a property consultant",
    ],
  },
  "ultra-luxury-properties-ahmedabad": {
    pillar: "Ultra luxury and trophy properties in Ahmedabad",
    primary: [
      "ultra luxury properties Ahmedabad",
      "ultra luxury homes Ahmedabad",
      "trophy properties Ahmedabad",
      "exclusive luxury homes Ahmedabad",
      "signature residences Ahmedabad",
    ],
    transactional: [
      "buy ultra luxury property Ahmedabad",
      "ultra luxury property for sale Ahmedabad",
      "exclusive penthouse Ahmedabad",
      "luxury trophy home Ahmedabad",
      "off market ultra luxury homes Ahmedabad",
      "private ultra luxury property advisory Ahmedabad",
    ],
    longTail: [
      "rare luxury properties in Ahmedabad",
      "limited inventory luxury homes Ahmedabad",
      "ultra premium homes in western Ahmedabad",
      "high value residences Ahmedabad",
      "private floor luxury residences Ahmedabad",
      "sky mansion Ahmedabad",
      "legacy luxury homes Ahmedabad",
    ],
    nri: [
      "ultra luxury property Ahmedabad for NRIs",
      "NRI trophy home Ahmedabad",
      "NRI high value property India Ahmedabad",
      "private ultra luxury home video inspection Ahmedabad",
    ],
    hni: [
      "HNI ultra luxury homes Ahmedabad",
      "family office luxury property Ahmedabad",
      "private mandate ultra luxury Ahmedabad",
      "discreet trophy home advisory Ahmedabad",
    ],
    locationModifiers: ["Iscon Ambli Road", "Sindhu Bhavan Road", "Bodakdev", "Thaltej", "Shilaj"],
    attributeModifiers: [
      "private lift",
      "terrace rights",
      "limited inventory",
      "builder pedigree",
      "large floor plate",
      "privacy",
    ],
    questions: [
      "where are ultra luxury properties in Ahmedabad",
      "what makes a property ultra luxury in Ahmedabad",
      "are ultra luxury homes publicly listed in Ahmedabad",
      "how should HNIs evaluate trophy homes",
    ],
    comparisons: [
      "ultra luxury apartment vs bungalow Ahmedabad",
      "penthouse vs villa for HNI buyers Ahmedabad",
      "Iscon Ambli vs Sindhu Bhavan ultra luxury homes",
    ],
    contentAngles: [
      "The ultra luxury property checklist for Ahmedabad",
      "Why trophy homes need private advisory",
      "Scarcity and resale depth in Ahmedabad ultra luxury real estate",
    ],
  },
  "luxury-homes-ahmedabad": {
    pillar: "Luxury homes in Ahmedabad for family living, HNIs, and NRIs",
    primary: [
      "luxury homes Ahmedabad",
      "premium homes Ahmedabad",
      "high end homes Ahmedabad",
      "luxury houses Ahmedabad",
      "luxury family homes Ahmedabad",
    ],
    transactional: [
      "buy luxury home in Ahmedabad",
      "luxury homes for sale Ahmedabad",
      "premium home for sale Ahmedabad",
      "ready luxury homes Ahmedabad",
      "new luxury homes Ahmedabad",
      "designer homes Ahmedabad",
    ],
    longTail: [
      "best luxury homes in Ahmedabad for families",
      "luxury homes near schools Ahmedabad",
      "luxury homes near clubs Ahmedabad",
      "vastu compliant luxury homes Ahmedabad",
      "smart luxury homes Ahmedabad",
      "large luxury homes western Ahmedabad",
      "private luxury home search Ahmedabad",
    ],
    nri: [
      "NRI luxury homes Ahmedabad",
      "buy luxury home in Ahmedabad from USA",
      "return to India luxury home Ahmedabad",
      "managed luxury homes for NRIs Ahmedabad",
    ],
    hni: [
      "HNI luxury homes Ahmedabad",
      "private home advisory Ahmedabad",
      "family home upgrade Ahmedabad luxury",
      "discreet luxury home search Ahmedabad",
    ],
    locationModifiers: [...WESTERN_CORRIDORS],
    attributeModifiers: [
      "family living",
      "school access",
      "club access",
      "privacy",
      "parking",
      "maintenance quality",
    ],
    questions: [
      "where can I buy luxury homes in Ahmedabad",
      "which Ahmedabad area is best for luxury family homes",
      "can NRIs buy luxury homes remotely",
      "what makes a luxury home good for resale",
    ],
    comparisons: [
      "luxury homes vs luxury apartments Ahmedabad",
      "Thaltej vs Sindhu Bhavan luxury homes",
      "ready luxury homes vs new launch homes Ahmedabad",
    ],
    contentAngles: [
      "Luxury home buying guide for Ahmedabad families",
      "Best corridors for family luxury homes",
      "NRI return-to-India home planning in Ahmedabad",
    ],
  },
  "luxury-4bhk-ahmedabad": {
    pillar: "Luxury 4 BHK homes and apartments in Ahmedabad",
    primary: [
      "luxury 4 BHK Ahmedabad",
      "4 BHK luxury apartment Ahmedabad",
      "4 BHK luxury flat Ahmedabad",
      "premium 4 BHK Ahmedabad",
      "4 bedroom luxury homes Ahmedabad",
    ],
    transactional: [
      "buy 4 BHK luxury apartment Ahmedabad",
      "4 BHK flat for sale Ahmedabad luxury",
      "ready to move 4 BHK Ahmedabad",
      "new launch 4 BHK Ahmedabad",
      "4 BHK on Iscon Ambli Road",
      "4 BHK on Sindhu Bhavan Road",
    ],
    longTail: [
      "large 4 BHK apartment Ahmedabad",
      "4 BHK with private lift Ahmedabad",
      "4 BHK luxury flat with servant room Ahmedabad",
      "4 BHK low density tower Ahmedabad",
      "4 BHK for family upgrade Ahmedabad",
      "4 BHK premium apartment with clubhouse Ahmedabad",
    ],
    nri: [
      "NRI buy 4 BHK Ahmedabad",
      "4 BHK luxury flat Ahmedabad for NRIs",
      "remote purchase 4 BHK Ahmedabad",
      "video tour 4 BHK luxury apartment Ahmedabad",
    ],
    hni: [
      "HNI 4 BHK apartment Ahmedabad",
      "private 4 BHK shortlist Ahmedabad",
      "family upgrade 4 BHK Ahmedabad",
      "exclusive 4 BHK inventory Ahmedabad",
    ],
    locationModifiers: ["Iscon Ambli Road", "Sindhu Bhavan Road", "Thaltej", "SG Highway", "Vastrapur"],
    attributeModifiers: [
      "private lift",
      "large deck",
      "servant room",
      "low density",
      "ready possession",
      "clubhouse",
    ],
    questions: [
      "what is the best area for 4 BHK luxury apartments in Ahmedabad",
      "should I buy ready or under construction 4 BHK Ahmedabad",
      "what size is a luxury 4 BHK in Ahmedabad",
      "can NRIs buy a 4 BHK in Ahmedabad remotely",
    ],
    comparisons: [
      "4 BHK vs 5 BHK Ahmedabad",
      "4 BHK Iscon Ambli vs Thaltej",
      "4 BHK apartment vs bungalow Ahmedabad",
    ],
    contentAngles: [
      "4 BHK luxury apartment checklist",
      "Best 4 BHK corridors in Ahmedabad",
      "Family upgrade guide for 4 BHK buyers",
    ],
  },
  "luxury-5bhk-ahmedabad": {
    pillar: "Luxury 5 BHK apartments, penthouses, and large homes in Ahmedabad",
    primary: [
      "luxury 5 BHK Ahmedabad",
      "5 BHK luxury apartment Ahmedabad",
      "5 BHK luxury flat Ahmedabad",
      "premium 5 BHK Ahmedabad",
      "5 bedroom luxury homes Ahmedabad",
    ],
    transactional: [
      "buy 5 BHK luxury apartment Ahmedabad",
      "5 BHK flat for sale Ahmedabad luxury",
      "5 BHK penthouse Ahmedabad",
      "large 5 BHK apartment Ahmedabad",
      "5 BHK on Iscon Ambli Road",
      "5 BHK on Sindhu Bhavan Road",
    ],
    longTail: [
      "5 BHK with private lift Ahmedabad",
      "5 BHK luxury flat with terrace Ahmedabad",
      "single floor 5 BHK apartment Ahmedabad",
      "5 BHK duplex Ahmedabad",
      "5 BHK for joint family Ahmedabad",
      "large floor plate 5 BHK Ahmedabad",
    ],
    nri: [
      "NRI buy 5 BHK Ahmedabad",
      "5 BHK luxury home Ahmedabad for NRIs",
      "remote shortlist 5 BHK Ahmedabad",
      "NRI future family home Ahmedabad 5 BHK",
    ],
    hni: [
      "HNI 5 BHK apartment Ahmedabad",
      "private 5 BHK shortlist Ahmedabad",
      "joint family luxury home Ahmedabad",
      "exclusive 5 BHK inventory Ahmedabad",
    ],
    locationModifiers: ["Iscon Ambli Road", "Sindhu Bhavan Road", "Thaltej", "Bodakdev", "Vastrapur"],
    attributeModifiers: [
      "large floor plate",
      "private lobby",
      "terrace",
      "servant quarters",
      "three car parking",
      "low density tower",
    ],
    questions: [
      "where can I buy a 5 BHK luxury apartment in Ahmedabad",
      "what should I check before buying a 5 BHK in Ahmedabad",
      "is a 5 BHK better than a penthouse in Ahmedabad",
      "are 5 BHK apartments good for NRIs",
    ],
    comparisons: [
      "5 BHK vs penthouse Ahmedabad",
      "5 BHK Iscon Ambli vs Sindhu Bhavan",
      "5 BHK apartment vs villa Ahmedabad",
    ],
    contentAngles: [
      "5 BHK luxury buying checklist",
      "Large family home planning in Ahmedabad",
      "How to evaluate large floor plates",
    ],
  },
  "penthouses-duplexes-ahmedabad": {
    pillar: "Penthouses, duplexes, triplexes, and sky villas in Ahmedabad",
    primary: [
      "penthouses Ahmedabad",
      "luxury penthouse Ahmedabad",
      "duplex apartment Ahmedabad",
      "duplex penthouse Ahmedabad",
      "sky villas Ahmedabad",
    ],
    transactional: [
      "buy penthouse in Ahmedabad",
      "penthouse for sale Ahmedabad",
      "duplex for sale Ahmedabad",
      "luxury duplex Ahmedabad",
      "sky villa for sale Ahmedabad",
      "private terrace penthouse Ahmedabad",
    ],
    longTail: [
      "penthouse with private terrace Ahmedabad",
      "duplex penthouse with pool Ahmedabad",
      "top floor penthouse Ahmedabad",
      "private lift penthouse Ahmedabad",
      "large terrace rights penthouse Ahmedabad",
      "triplex penthouse Ahmedabad",
      "sky mansion Ahmedabad",
    ],
    nri: [
      "NRI buy penthouse Ahmedabad",
      "penthouse Ahmedabad for NRI buyers",
      "remote penthouse inspection Ahmedabad",
      "NRI luxury duplex Ahmedabad",
    ],
    hni: [
      "HNI penthouse Ahmedabad",
      "trophy penthouse Ahmedabad",
      "private penthouse advisory Ahmedabad",
      "exclusive duplex inventory Ahmedabad",
    ],
    locationModifiers: ["Iscon Ambli Road", "Sindhu Bhavan Road", "Thaltej", "SG Highway", "Vastrapur"],
    attributeModifiers: [
      "terrace rights",
      "private pool",
      "private lift",
      "floor height",
      "wraparound deck",
      "panoramic views",
    ],
    questions: [
      "where can I buy a penthouse in Ahmedabad",
      "what should I verify before buying a penthouse",
      "are terrace rights legal in Ahmedabad penthouses",
      "is a penthouse better than a bungalow in Ahmedabad",
    ],
    comparisons: [
      "penthouse vs duplex Ahmedabad",
      "penthouse vs bungalow Ahmedabad",
      "Iscon Ambli vs Sindhu Bhavan penthouses",
    ],
    contentAngles: [
      "Penthouse due diligence checklist",
      "Terrace rights and usable area in duplex homes",
      "Why penthouses are usually off market",
    ],
  },
  "luxury-villas-ahmedabad": {
    pillar: "Luxury villas and bungalows in Ahmedabad",
    primary: [
      "luxury villas Ahmedabad",
      "luxury bungalows Ahmedabad",
      "villas and bungalows Ahmedabad",
      "independent luxury homes Ahmedabad",
      "gated villas Ahmedabad",
    ],
    transactional: [
      "buy luxury villa Ahmedabad",
      "villa for sale Ahmedabad luxury",
      "bungalow for sale Ahmedabad",
      "independent house for sale Ahmedabad luxury",
      "gated villa for sale Ahmedabad",
      "private bungalow Ahmedabad",
    ],
    longTail: [
      "luxury villa with garden Ahmedabad",
      "gated community villas Ahmedabad",
      "independent bungalow western Ahmedabad",
      "large plot villa Ahmedabad",
      "family villa near clubs Ahmedabad",
      "luxury villa with private parking Ahmedabad",
      "land backed homes Ahmedabad",
    ],
    nri: [
      "NRI buy villa Ahmedabad",
      "NRI buy bungalow Ahmedabad",
      "managed villa Ahmedabad for NRIs",
      "future family bungalow Ahmedabad NRI",
    ],
    hni: [
      "HNI villa Ahmedabad",
      "private bungalow advisory Ahmedabad",
      "family estate Ahmedabad",
      "legacy home Ahmedabad",
    ],
    locationModifiers: ["Sindhu Bhavan Road", "Bodakdev", "Shilaj", "Thaltej", "Vaishno Devi"],
    attributeModifiers: [
      "garden",
      "plot size",
      "security",
      "privacy",
      "renovation scope",
      "title clarity",
    ],
    questions: [
      "where can I buy luxury villas in Ahmedabad",
      "what should I check before buying a bungalow",
      "can NRIs buy villas in Ahmedabad",
      "which areas have independent luxury homes in Ahmedabad",
    ],
    comparisons: [
      "villa vs bungalow Ahmedabad",
      "villa vs penthouse Ahmedabad",
      "Shilaj vs Sindhu Bhavan villas",
    ],
    contentAngles: [
      "Villa and bungalow buyer checklist",
      "Title diligence for independent homes",
      "Best corridors for land-backed luxury homes",
    ],
  },
  "luxury-bungalows-ahmedabad": {
    pillar: "Luxury bungalows and private independent homes in Ahmedabad",
    primary: [
      "luxury bungalows Ahmedabad",
      "luxury bungalow for sale Ahmedabad",
      "independent bungalow Ahmedabad",
      "premium bungalows Ahmedabad",
      "private bungalows Ahmedabad",
    ],
    transactional: [
      "buy bungalow in Ahmedabad",
      "luxury bungalow for sale in Ahmedabad",
      "off market bungalow Ahmedabad",
      "bungalow near Sindhu Bhavan Road",
      "bungalow near Bodakdev",
      "private bungalow advisory Ahmedabad",
    ],
    longTail: [
      "legacy bungalow Ahmedabad",
      "independent bungalow with garden Ahmedabad",
      "old bungalow redevelopment Ahmedabad",
      "large plot bungalow Ahmedabad",
      "premium bungalow with title clarity Ahmedabad",
      "private family bungalow Ahmedabad",
      "bungalow with renovation potential Ahmedabad",
    ],
    nri: [
      "NRI buy bungalow Ahmedabad",
      "NRI future family home Ahmedabad bungalow",
      "remote bungalow inspection Ahmedabad",
      "NRI inherited bungalow sale Ahmedabad",
    ],
    hni: [
      "HNI bungalow Ahmedabad",
      "family estate advisory Ahmedabad",
      "confidential bungalow sale Ahmedabad",
      "private buyer for bungalow Ahmedabad",
    ],
    locationModifiers: ["Sindhu Bhavan Road", "Bodakdev", "Shilaj", "Thaltej", "Satellite"],
    attributeModifiers: [
      "plot survey",
      "title chain",
      "road access",
      "renovation budget",
      "construction approval",
      "privacy",
    ],
    questions: [
      "where can I find luxury bungalows in Ahmedabad",
      "what documents are needed before buying a bungalow",
      "are bungalows in Ahmedabad usually off market",
      "can NRIs sell inherited bungalows in Ahmedabad",
    ],
    comparisons: [
      "bungalow vs villa Ahmedabad",
      "bungalow vs penthouse Ahmedabad",
      "Bodakdev vs Sindhu Bhavan bungalows",
    ],
    contentAngles: [
      "Bungalow title and renovation checklist",
      "Why premium bungalows transact privately",
      "How to price a luxury bungalow for sale",
    ],
  },
  "residential-plots-ahmedabad": {
    pillar: "Luxury plots and premium residential land in Ahmedabad",
    primary: [
      "luxury plots Ahmedabad",
      "premium residential plots Ahmedabad",
      "residential land Ahmedabad",
      "luxury plot for sale Ahmedabad",
      "NA plots Ahmedabad",
    ],
    transactional: [
      "buy residential plot Ahmedabad",
      "premium plot for sale Ahmedabad",
      "luxury plot for sale in Ahmedabad",
      "residential land for sale Ahmedabad",
      "plot near Shilaj Ahmedabad",
      "plot near Vaishno Devi Ahmedabad",
    ],
    longTail: [
      "NA title residential plot Ahmedabad",
      "gated community plots Ahmedabad",
      "plot with clear title Ahmedabad",
      "premium land western Ahmedabad",
      "large residential plot Ahmedabad",
      "plot for custom home Ahmedabad",
      "AUDA plot due diligence Ahmedabad",
      "AMC residential plot Ahmedabad",
    ],
    nri: [
      "NRI buy residential plot Ahmedabad",
      "NRI land investment Ahmedabad",
      "NRI buy NA plot in Ahmedabad",
      "remote plot diligence Ahmedabad",
    ],
    hni: [
      "HNI land investment Ahmedabad",
      "family land asset Ahmedabad",
      "custom home plot Ahmedabad HNI",
      "private plot advisory Ahmedabad",
    ],
    locationModifiers: ["Shilaj", "Vaishno Devi", "Bopal", "Ambli", "Sanand Road"],
    attributeModifiers: [
      "NA permission",
      "zoning",
      "approach road",
      "survey records",
      "FSI",
      "utility readiness",
    ],
    questions: [
      "where can I buy premium residential plots in Ahmedabad",
      "what is NA permission for plots in Ahmedabad",
      "can NRIs buy residential plots in Ahmedabad",
      "what should I verify before buying land in Ahmedabad",
    ],
    comparisons: [
      "plot vs apartment investment Ahmedabad",
      "Shilaj vs Vaishno Devi plots",
      "AUDA vs AMC plots Ahmedabad",
    ],
    contentAngles: [
      "Residential plot due diligence checklist",
      "NA plots and zoning explained for buyers",
      "NRI guide to buying residential land in Ahmedabad",
    ],
  },
  "luxury-residential-investment-ahmedabad": {
    pillar: "Investment property in Ahmedabad for HNIs and NRIs",
    primary: [
      "investment property Ahmedabad",
      "property investment Ahmedabad",
      "NRI investment property Ahmedabad",
      "luxury property investment Ahmedabad",
      "real estate investment Ahmedabad",
    ],
    transactional: [
      "buy investment property Ahmedabad",
      "high rental yield property Ahmedabad",
      "ROI property Ahmedabad for NRI",
      "ready possession investment property Ahmedabad",
      "investment grade real estate Ahmedabad",
      "safe property investment India for NRIs",
    ],
    longTail: [
      "best areas to invest in Ahmedabad property",
      "capital appreciation property Ahmedabad",
      "rental income property Ahmedabad",
      "managed investment property Ahmedabad",
      "western Ahmedabad investment property",
      "property with resale demand Ahmedabad",
      "investment property with legal clarity Ahmedabad",
    ],
    nri: [
      "NRI property investment Ahmedabad",
      "property investment Ahmedabad for Dubai NRIs",
      "invest in Ahmedabad real estate from USA",
      "NRI rental yield property Ahmedabad",
      "repatriation property sale proceeds NRI",
    ],
    hni: [
      "HNI property investment Ahmedabad",
      "family office real estate investment Ahmedabad",
      "capital preservation property Ahmedabad",
      "private investment property advisory Ahmedabad",
    ],
    locationModifiers: ["Iscon Ambli Road", "Sindhu Bhavan Road", "Thaltej", "SG Highway", "Shilaj"],
    attributeModifiers: [
      "rental yield",
      "capital appreciation",
      "tenant demand",
      "exit liquidity",
      "developer credibility",
      "possession status",
    ],
    questions: [
      "is Ahmedabad good for property investment",
      "which areas have high rental yield in Ahmedabad",
      "should NRIs buy ready or under construction property",
      "how is rental income taxed for NRIs in India",
    ],
    comparisons: [
      "Ahmedabad vs Dubai real estate investment",
      "Ahmedabad vs Mumbai property investment",
      "apartment vs plot investment Ahmedabad",
    ],
    contentAngles: [
      "NRI investment property framework",
      "Rental yield vs capital appreciation in Ahmedabad",
      "Investment property exit planning for NRIs",
    ],
  },
  "commercial-properties-ahmedabad": {
    pillar: "Premium commercial property, office, showroom, and lifestyle investment assets in Ahmedabad",
    primary: [
      "commercial property Ahmedabad",
      "premium commercial property Ahmedabad",
      "office space Ahmedabad",
      "showroom Ahmedabad",
      "commercial investment Ahmedabad",
    ],
    transactional: [
      "buy commercial property Ahmedabad",
      "premium office for sale Ahmedabad",
      "showroom for sale Ahmedabad",
      "commercial property investment Ahmedabad",
      "luxury office space Ahmedabad",
      "flagship showroom Ahmedabad",
    ],
    longTail: [
      "premium office space SG Highway Ahmedabad",
      "office space Prahlad Nagar Ahmedabad",
      "showroom space Sindhu Bhavan Road",
      "high street retail showroom Ahmedabad",
      "commercial property with rental yield Ahmedabad",
      "Grade A office Ahmedabad",
      "weekend villa investment near Ahmedabad",
    ],
    nri: [
      "NRI commercial property Ahmedabad",
      "NRI invest in commercial property India",
      "NRI buy office Ahmedabad",
      "commercial rental income Ahmedabad NRI",
    ],
    hni: [
      "HNI commercial property Ahmedabad",
      "business owner office purchase Ahmedabad",
      "flagship office advisory Ahmedabad",
      "private commercial mandate Ahmedabad",
    ],
    locationModifiers: ["SG Highway", "Prahlad Nagar", "CG Road", "Sindhu Bhavan Road", "Bodakdev"],
    attributeModifiers: [
      "lease yield",
      "frontage",
      "floor plate",
      "parking",
      "tenant quality",
      "visibility",
    ],
    questions: [
      "where are the best premium offices in Ahmedabad",
      "is commercial property in Ahmedabad good for investment",
      "where can I buy a showroom in Ahmedabad",
      "can NRIs buy commercial property in India",
    ],
    comparisons: [
      "commercial vs residential investment Ahmedabad",
      "office vs showroom investment Ahmedabad",
      "Prahlad Nagar vs SG Highway office space",
    ],
    contentAngles: [
      "Commercial property diligence for Ahmedabad investors",
      "Office and showroom investment comparison",
      "NRI guide to commercial property in India",
    ],
  },
} satisfies Record<string, KeywordCluster>;

export const RESIDENTIAL_CATEGORY_KEYWORD_CLUSTERS: Record<ResidentialCategory, string[]> = {
  apartment: [
    "luxury apartment Ahmedabad",
    "premium flat Ahmedabad",
    "4 BHK apartment Ahmedabad",
    "5 BHK apartment Ahmedabad",
    "managed apartment for NRIs Ahmedabad",
  ],
  penthouse: [
    "luxury penthouse Ahmedabad",
    "penthouse for sale Ahmedabad",
    "terrace penthouse Ahmedabad",
    "sky mansion Ahmedabad",
    "private lift penthouse Ahmedabad",
  ],
  duplex: [
    "duplex apartment Ahmedabad",
    "duplex penthouse Ahmedabad",
    "luxury duplex Ahmedabad",
    "triplex penthouse Ahmedabad",
    "duplex home with terrace Ahmedabad",
  ],
  villa: [
    "luxury villa Ahmedabad",
    "gated villa Ahmedabad",
    "villa for sale Ahmedabad",
    "independent luxury home Ahmedabad",
    "managed villa for NRIs Ahmedabad",
  ],
  bungalow: [
    "luxury bungalow Ahmedabad",
    "independent bungalow Ahmedabad",
    "private bungalow Ahmedabad",
    "legacy home Ahmedabad",
    "off market bungalow Ahmedabad",
  ],
  plot: [
    "luxury plot Ahmedabad",
    "premium residential plot Ahmedabad",
    "NA plot Ahmedabad",
    "residential land Ahmedabad",
    "custom home plot Ahmedabad",
  ],
  investment: [
    "investment property Ahmedabad",
    "property investment Ahmedabad",
    "rental yield property Ahmedabad",
    "capital appreciation property Ahmedabad",
    "commercial investment Ahmedabad",
  ],
  "residential-investment": [
    "residential investment property Ahmedabad",
    "NRI investment property Ahmedabad",
    "investment grade real estate Ahmedabad",
    "managed investment property Ahmedabad",
    "high ROI luxury real estate Ahmedabad",
  ],
  office: [
    "office space Ahmedabad",
    "premium office Ahmedabad",
    "Grade A office Ahmedabad",
    "office for sale Ahmedabad",
    "Prahlad Nagar office space Ahmedabad",
  ],
  showroom: [
    "showroom Ahmedabad",
    "showroom for sale Ahmedabad",
    "high street showroom Ahmedabad",
    "retail showroom Ahmedabad",
    "flagship showroom Ahmedabad",
  ],
};

const CLUSTER_GROUPS: Array<keyof KeywordCluster> = [
  "primary",
  "transactional",
  "longTail",
  "nri",
  "hni",
  "locationModifiers",
  "attributeModifiers",
  "questions",
  "comparisons",
  "contentAngles",
];

function uniqueTerms(terms: string[]) {
  const seen = new Set<string>();
  return terms.filter((term) => {
    const normalized = term.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

export function getKeywordClusterForSlug(slug: string): KeywordCluster | undefined {
  return PROPERTY_TYPE_KEYWORD_CLUSTERS[slug as keyof typeof PROPERTY_TYPE_KEYWORD_CLUSTERS];
}

export function getKeywordClusterTermsForSlug(slug: string, options: { limit?: number } = {}) {
  const cluster = getKeywordClusterForSlug(slug);
  if (!cluster) return [];

  const terms = uniqueTerms([
    cluster.pillar,
    ...CLUSTER_GROUPS.flatMap((group) => {
      const value = cluster[group];
      return Array.isArray(value) ? value : [];
    }),
  ]);

  return typeof options.limit === "number" ? terms.slice(0, options.limit) : terms;
}

export function getKeywordClusterSummaryForSlug(slug: string) {
  const cluster = getKeywordClusterForSlug(slug);
  if (!cluster) return null;

  return {
    pillar: cluster.pillar,
    primary: cluster.primary,
    transactional: cluster.transactional,
    longTail: cluster.longTail,
    nri: cluster.nri,
    hni: cluster.hni,
    questions: cluster.questions,
    comparisons: cluster.comparisons,
    contentAngles: cluster.contentAngles,
  };
}

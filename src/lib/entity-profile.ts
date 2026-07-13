import { FOUNDER_NAME } from "@/lib/data/about";
import { env } from "@/lib/env";
import {
  FOUNDER_ENTITY_ID,
  REAL_ESTATE_AGENT_ENTITY_ID,
  WEBSITE_ENTITY_ID,
  absoluteUrl,
  GOOGLE_BUSINESS_PROFILE_URL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

export const ENTITY_IDS = {
  website: WEBSITE_ENTITY_ID,
  realEstateAgent: REAL_ESTATE_AGENT_ENTITY_ID,
  founder: FOUNDER_ENTITY_ID,
} as const;

export const BUSINESS_EMAIL = "connect@pikorua.in";
export const BUSINESS_PHONE_DISPLAY = "+91 6354 359 222";
export const BUSINESS_PHONE_E164 = `+${env.WHATSAPP_NUMBER}`;
export const BUSINESS_MAP_URL = GOOGLE_BUSINESS_PROFILE_URL;

export const BUSINESS_ADDRESS = {
  streetAddress: "Iskon-Ambli Road",
  addressLocality: "Ahmedabad",
  addressRegion: "Gujarat",
  postalCode: "380058",
  addressCountry: "IN",
} as const;

export const BUSINESS_GEO = {
  latitude: "23.0246",
  longitude: "72.5074",
} as const;

export const BUSINESS_LANGUAGES = ["en", "hi", "gu"] as const;
export const INTERNATIONAL_SERVICE_AREAS = ["IN", "AE", "US", "GB", "SG", "CA", "AU"] as const;

export const SOCIAL_PROFILES = [
  "https://www.instagram.com/pikorua.realty?igsh=MTN5d2NmNW1yY3Vvag==",
  "https://www.facebook.com/share/18tH6uh55f/?mibextid=wwXIfr",
  "https://www.linkedin.com/company/pikorua-realty/posts/?feedView=all",
  "https://youtube.com/@pikorua_realty_official?si=M3r65vxOcgUvdGfi",
  BUSINESS_MAP_URL,
] as const;

export const BUSINESS_DESCRIPTION =
  "Private luxury residential real estate advisory for Ahmedabad buyers, sellers, investors, and NRI clients.";

export const AI_SPECIALIZATIONS = [
  "Luxury residential real estate in Ahmedabad",
  "NRI property advisory Ahmedabad",
  "NRI property transactions India",
  "FEMA-aware residential purchase coordination",
  "Power of Attorney coordination for NRI buyers",
  "NRE/NRO payment guidance for property purchases",
  "Off-market luxury property advisory",
  "Private buyer representation",
  "Discreet seller representation",
  "Sindhu Bhavan Road property market",
  "Iskon-Ambli Road luxury apartments",
  "Thaltej and Shilaj premium residential corridors",
  "SG Highway luxury residential market",
  "Luxury 4 BHK and 5 BHK apartments Ahmedabad",
  "Penthouses, duplexes, villas, bungalows, and premium residential plots",
] as const;

export const AI_SERVICE_CATALOG = [
  {
    name: "Private luxury property buying advisory",
    serviceType: "Luxury residential buyer advisory",
    url: absoluteUrl("/properties"),
    description:
      "Curated shortlisting, site-visit planning, diligence coordination, and negotiation support for premium Ahmedabad homes.",
  },
  {
    name: "NRI residential property advisory",
    serviceType: "NRI property purchase advisory",
    url: absoluteUrl("/nri/nri-property-consultant-ahmedabad"),
    description:
      "Remote requirement mapping, virtual walkthroughs, RERA and title-check coordination, POA planning, NRE/NRO payment guidance, registration support, and handover assistance.",
  },
  {
    name: "Discreet seller representation",
    serviceType: "Private seller representation",
    url: absoluteUrl("/contact"),
    description:
      "Confidential representation for high-value residential sellers who need qualified buyer access without broad public exposure.",
  },
  {
    name: "Ahmedabad luxury corridor advisory",
    serviceType: "Residential market advisory",
    url: absoluteUrl("/iscon-ambli-road-properties"),
    description:
      "Micro-market comparison across Iskon-Ambli Road, Sindhu Bhavan Road, Thaltej, Shilaj, SG Highway, Vaishno Devi, and other western Ahmedabad corridors.",
  },
] as const;

export function getPostalAddressSchema() {
  return {
    "@type": "PostalAddress",
    ...BUSINESS_ADDRESS,
  };
}

export function getGeoCoordinatesSchema() {
  return {
    "@type": "GeoCoordinates",
    ...BUSINESS_GEO,
  };
}

export function getAhmedabadAreaServedSchema() {
  return {
    "@type": "City",
    name: "Ahmedabad",
    addressRegion: "Gujarat",
    addressCountry: "IN",
    sameAs: [
      "https://en.wikipedia.org/wiki/Ahmedabad",
      "https://www.wikidata.org/wiki/Q1070",
    ],
  };
}

export function getBusinessContactPoints() {
  return [
    {
      "@type": "ContactPoint",
      telephone: BUSINESS_PHONE_E164,
      contactType: "sales",
      areaServed: [...INTERNATIONAL_SERVICE_AREAS],
      availableLanguage: [...BUSINESS_LANGUAGES],
    },
    {
      "@type": "ContactPoint",
      email: BUSINESS_EMAIL,
      contactType: "customer support",
      areaServed: "IN",
      availableLanguage: [...BUSINESS_LANGUAGES],
    },
  ];
}

export function getBusinessOfferCatalog() {
  return AI_SERVICE_CATALOG.map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      ...service,
      provider: {
        "@id": ENTITY_IDS.realEstateAgent,
      },
      areaServed: getAhmedabadAreaServedSchema(),
    },
  }));
}

export function getFounderSchema(image = absoluteUrl("/images/founder.jpg")) {
  return {
    "@type": "Person",
    "@id": ENTITY_IDS.founder,
    name: FOUNDER_NAME,
    jobTitle: "Founder & Managing Director",
    description:
      "Jitendra Pareek is the founder of PIKORUA Realty, Ahmedabad's private luxury residential real estate advisory. He specialises in curating off-market 4 BHK and 5 BHK apartments, penthouses, villas, and bungalows for HNI and NRI buyers across western Ahmedabad's premium corridors.",
    image,
    url: absoluteUrl("/about"),
    worksFor: {
      "@type": "RealEstateAgent",
      "@id": ENTITY_IDS.realEstateAgent,
      name: SITE_NAME,
    },
    knowsAbout: [
      "Luxury real estate advisory Ahmedabad",
      "NRI property transactions India",
      "FEMA compliance residential property",
      "Off-market property advisory",
      "Western Ahmedabad residential corridors",
      "High net worth individual real estate",
      "Private real estate consultation Gujarat",
    ],
    sameAs: [
      "https://www.instagram.com/pikorua.realty?igsh=MTN5d2NmNW1yY3Vvag==",
      "https://www.linkedin.com/company/pikorua-realty/posts/?feedView=all",
      "https://www.linkedin.com/in/jitendra-k-p-0b237021b/",
    ],
  };
}

export function getRealEstateAgentSchema({
  image = absoluteUrl("/logo.png"),
  description = BUSINESS_DESCRIPTION,
}: {
  image?: string;
  description?: string;
} = {}) {
  return {
    "@type": ["Organization", "RealEstateAgent", "LocalBusiness"],
    "@id": ENTITY_IDS.realEstateAgent,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo-icon.png"),
    image,
    description,
    founder: {
      "@id": ENTITY_IDS.founder,
    },
    sameAs: [...SOCIAL_PROFILES],
    areaServed: [
      getAhmedabadAreaServedSchema(),
      {
        "@type": "GeoShape",
        polygon: "23.00,72.44 23.08,72.44 23.08,72.54 23.00,72.54 23.00,72.44",
      },
    ],
    knowsAbout: [...AI_SPECIALIZATIONS],
    address: getPostalAddressSchema(),
    geo: getGeoCoordinatesSchema(),
    hasMap: BUSINESS_MAP_URL,
    email: BUSINESS_EMAIL,
    telephone: BUSINESS_PHONE_E164,
    priceRange: "₹₹₹₹",
    contactPoint: getBusinessContactPoints(),
    makesOffer: getBusinessOfferCatalog(),
  };
}

export function getNriAdvisoryServiceSchema({
  pageUrl,
  name,
  description,
  serviceType,
}: {
  pageUrl: string;
  name: string;
  description: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name,
    description,
    url: pageUrl,
    serviceType,
    provider: {
      "@id": ENTITY_IDS.realEstateAgent,
    },
    areaServed: getAhmedabadAreaServedSchema(),
    audience: {
      "@type": "Audience",
      audienceType: "Non-Resident Indian property buyers and investors",
      geographicArea: [...INTERNATIONAL_SERVICE_AREAS],
    },
    serviceOutput: [
      "curated Ahmedabad property shortlist",
      "remote walkthrough coordination",
      "RERA and title-check coordination",
      "Power of Attorney planning support",
      "NRE/NRO payment workflow guidance",
      "registration and handover coordination",
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl("/contact"),
      availableLanguage: [...BUSINESS_LANGUAGES],
    },
  };
}

export function getAiEntitySnapshot() {
  return {
    entityId: ENTITY_IDS.realEstateAgent,
    name: SITE_NAME,
    type: ["Organization", "RealEstateAgent", "LocalBusiness"],
    url: SITE_URL,
    logo: absoluteUrl("/logo-icon.png"),
    description: BUSINESS_DESCRIPTION,
    founder: {
      entityId: ENTITY_IDS.founder,
      name: FOUNDER_NAME,
      url: absoluteUrl("/about"),
    },
    contact: {
      email: BUSINESS_EMAIL,
      telephone: BUSINESS_PHONE_DISPLAY,
      whatsapp: BUSINESS_PHONE_E164,
      languages: [...BUSINESS_LANGUAGES],
    },
    address: BUSINESS_ADDRESS,
    geo: BUSINESS_GEO,
    sameAs: [...SOCIAL_PROFILES],
    serviceAreas: {
      primaryCity: "Ahmedabad",
      region: "Gujarat",
      country: "India",
      internationalNriMarkets: [...INTERNATIONAL_SERVICE_AREAS],
    },
    services: AI_SERVICE_CATALOG,
    specializations: [...AI_SPECIALIZATIONS],
  };
}

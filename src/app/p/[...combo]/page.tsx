import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STATIC_PROPERTIES } from "@/lib/data/properties";
import {
  parseComboSegments,
  buildComboHref,
  LOCATION_MAP,
  PROPERTY_TYPE_MAP,
  BHK_MAP,
  BUDGET_MAP,
  INTENT_MAP,
  type ParsedCombo,
} from "@/lib/data/seo-dimensions";
import { generateComboPage } from "@/lib/data/combo-content-engine";
import { getRelatedCombos } from "@/lib/data/combo-linker";
import { ALL_STATIC_COMBO_PARAMS } from "@/lib/data/combo-seeder";
import { ProgrammaticPageTemplate } from "@/components/seo/ProgrammaticPageTemplate";
import { absoluteUrl, createMetadata, serializeJsonLd, SITE_URL } from "@/lib/seo";
import { ENTITY_IDS } from "@/lib/entity-profile";

interface ComboPageProps {
  params: Promise<{ combo: string[] }>;
}

// ISR: render on first request, cache for 24 hours.
// SSG top-500 seeded combos are pre-rendered at build time.
export const dynamicParams = true;
export const revalidate = 604800;

export function generateStaticParams() {
  return ALL_STATIC_COMBO_PARAMS;
}

export async function generateMetadata({ params }: ComboPageProps): Promise<Metadata> {
  const { combo } = await params;
  const parsed = parseComboSegments(combo);
  if (!parsed?.location) return {};

  const page = generateComboPage(parsed);

  return createMetadata({
    title: page.title,
    description: page.description,
    path: page.href,
    image: page.heroImage,
    keywords: [
      page.h1,
      ...(parsed.location ? [parsed.location.label, `${parsed.location.label} Ahmedabad`] : []),
      ...(parsed.type ? [parsed.type.pluralLabel, `${parsed.type.pluralLabel} Ahmedabad`] : []),
      ...(parsed.bhk ? [parsed.bhk.label] : []),
      ...(parsed.budget ? [parsed.budget.label] : []),
      ...(parsed.intent ? [parsed.intent.label] : []),
    ],
    // Apply noindex if no properties match — set after property matching below
    noIndex: parsed ? undefined : true,
  });
}

/** Match properties against the combo using simple keyword matching. */
function matchProperties(parsed: ParsedCombo) {
  const loc = parsed.location;
  const type = parsed.type;
  const bhk = parsed.bhk;
  const budget = parsed.budget;

  return STATIC_PROPERTIES.filter((p) => {
    // Location match
    if (loc) {
      const locSlug = loc.slug.toLowerCase();
      const propLoc = (p.locationLabel ?? "").toLowerCase();
      const propSlug = (p.location ?? "").toLowerCase();
      if (!propLoc.includes(locSlug) && !propSlug.includes(locSlug) &&
          !locSlug.split("-").some((word) => propLoc.includes(word) || propSlug.includes(word))) {
        return false;
      }
    }

    // Type match
    if (type && p.category) {
      const typeMap: Record<string, string[]> = {
        "luxury-flats": ["apartment"],
        "penthouses": ["penthouse"],
        "villas": ["villa", "bungalow"],
        "duplex": ["duplex"],
        "office-space": ["commercial-office", "office"],
        "retail-space": ["commercial-retail", "retail"],
        "commercial-plots": ["commercial-plot", "plot"],
        "warehouse": ["warehouse"],
      };
      const validCategories = typeMap[type.slug] ?? [];
      if (validCategories.length > 0 && !validCategories.some((c) => p.category?.includes(c))) {
        return false;
      }
    }

    // BHK match
    if (bhk && type?.bhkApplicable && p.configuration) {
      if (!p.configuration.includes(bhk.shortLabel)) return false;
    }

    // Budget match (basic — properties need a parseable price)
    if (budget && p.price) {
      return true;
    }

    return true;
  }).slice(0, 12);
}

function buildSchemas(parsed: ParsedCombo, page: ReturnType<typeof generateComboPage>, pageUrl: string) {
  const loc = parsed.location!;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: page.title,
    description: page.description,
    url: pageUrl,
    serviceType: page.combo.type?.pluralLabel ?? "Real Estate Advisory",
    provider: { "@id": ENTITY_IDS.realEstateAgent },
    areaServed: {
      "@type": "Place",
      name: `${loc.label}, Ahmedabad`,
      address: {
        "@type": "PostalAddress",
        addressLocality: loc.label,
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: loc.coordinates.lat,
        longitude: loc.coordinates.lng,
      },
    },
  };

  const breadcrumbItems: { name: string; item: string }[] = [
    { name: "Home", item: SITE_URL },
    { name: "Properties", item: absoluteUrl("/properties") },
    { name: "Search", item: absoluteUrl("/p") },
    { name: loc.label, item: absoluteUrl(`/p/${loc.slug}`) },
  ];
  if (parsed.type) {
    breadcrumbItems.push({ name: parsed.type.pluralLabel, item: absoluteUrl(`/p/${loc.slug}/${parsed.type.slug}`) });
  }
  if (parsed.bhk && parsed.type?.bhkApplicable) {
    breadcrumbItems.push({ name: parsed.bhk.label, item: absoluteUrl(`/p/${loc.slug}/${parsed.type!.slug}/${parsed.bhk.slug}`) });
  }
  if (parsed.budget) {
    const prev = [loc.slug, parsed.type?.slug, parsed.bhk?.slug].filter(Boolean);
    breadcrumbItems.push({ name: parsed.budget.label, item: absoluteUrl(`/p/${[...prev, parsed.budget.slug].join("/")}`) });
  }
  if (parsed.intent) {
    breadcrumbItems.push({ name: parsed.intent.label, item: absoluteUrl(page.href) });
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.item,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return { serviceSchema, breadcrumbSchema, faqSchema };
}

export default async function ComboPage({ params }: ComboPageProps) {
  const { combo } = await params;

  // Validate and parse segments
  const parsed = parseComboSegments(combo);
  if (!parsed) notFound();

  const page = generateComboPage(parsed);
  const properties = matchProperties(parsed);
  const relatedLinks = getRelatedCombos(parsed);
  const pageUrl = absoluteUrl(page.href);

  // Set noindex if no properties match
  if (properties.length === 0) {
    page.noindex = true;
  }

  const { serviceSchema, breadcrumbSchema, faqSchema } = buildSchemas(parsed, page, pageUrl);

  return (
    <>
      {page.noindex && (
        // Robots noindex for zero-result pages (prevents thin-content penalty)
        // Note: ideally set via generateMetadata robots field, but this is a
        // fallback for ISR pages where metadata runs before property matching.
        <meta name="robots" content="noindex, follow" />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <ProgrammaticPageTemplate
        page={page}
        properties={properties}
        relatedLinks={relatedLinks}
      />
    </>
  );
}

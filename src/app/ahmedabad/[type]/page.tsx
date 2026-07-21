import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPageTemplate } from "@/components/seo/LandingPageTemplate";
import { STATIC_PROPERTIES } from "@/lib/data/properties";
import {
  getAhmedabadTypePage,
  getLandingProperties,
  AHMEDABAD_TYPE_PAGES,
  AHMEDABAD_FILTER_PAGES,
  AHMEDABAD_LONGTAIL_PAGES,
  type GeoLandingPage,
} from "@/lib/data/geo";
import { getKeywordClusterTermsForSlug } from "@/lib/data/keyword-clusters";
import {
  ENTITY_IDS,
  getAhmedabadAreaServedSchema,
} from "@/lib/entity-profile";
import { absoluteUrl, createMetadata, serializeJsonLd, SITE_URL } from "@/lib/seo";
import { getExchangeRates } from "@/lib/exchange-rates";

interface AhmedabadTypePageProps {
  params: Promise<{ type: string }>;
}

export const dynamicParams = false;

/**
 * Generates static params for all /ahmedabad/[type] pages.
 *
 * The `type` param is the last segment of the href after "/ahmedabad/" —
 * which for Layer-1 and long-tail pages is a single-level slug with no
 * sub-segments (e.g. "luxury-flats", "penthouses", "high-roi-investment-properties").
 *
 * Pages with hrefs of the form /ahmedabad/[type]/[filter] (Layer 2–4) are
 * served by the nested [type]/[filter] route and are NOT included here.
 */
export function generateStaticParams() {
  const allTopLevel = [
    ...AHMEDABAD_TYPE_PAGES,
    ...AHMEDABAD_LONGTAIL_PAGES,
  ];

  return allTopLevel
    .filter((page) => {
      // Only pages whose href is exactly /ahmedabad/[one-segment]
      const parts = page.href.replace(/^\/ahmedabad\//, "").split("/");
      return parts.length === 1;
    })
    .map((page) => ({
      type: page.href.replace(/^\/ahmedabad\//, ""),
    }));
}

export async function generateMetadata({ params }: AhmedabadTypePageProps): Promise<Metadata> {
  const { type } = await params;
  const slug = slugFromTypeSegment(type);
  const page = getAhmedabadTypePage(slug);
  if (!page) return {};

  return createMetadata({
    title: page.title,
    description: page.description,
    path: page.href,
    image: page.heroImage,
    keywords: [
      page.label,
      page.title,
      ...(page.matchKeywords ?? []),
      ...(page.seoKeywords ?? []),
      ...getKeywordClusterTermsForSlug(page.slug, { limit: 80 }),
    ],
  });
}

/** Derive the page slug from the URL segment. */
function slugFromTypeSegment(type: string): string {
  return `ahmedabad-${type}`;
}

function getServiceSchema(page: GeoLandingPage, pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: page.title,
    description: page.description,
    url: pageUrl,
    serviceType: page.label,
    provider: { "@id": ENTITY_IDS.realEstateAgent },
    areaServed: getAhmedabadAreaServedSchema(),
    audience: {
      "@type": "Audience",
      audienceType: "Luxury property buyers, NRIs, and real estate investors in Ahmedabad",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl("/contact"),
    },
  };
}

export default async function AhmedabadTypePage({ params }: AhmedabadTypePageProps) {
  const { type } = await params;
  const slug = slugFromTypeSegment(type);
  const page = getAhmedabadTypePage(slug);
  const { rates, isLive } = await getExchangeRates();

  if (!page) notFound();

  const properties = getLandingProperties(page, STATIC_PROPERTIES);
  const pageUrl = absoluteUrl(page.href);
  const serviceSchema = getServiceSchema(page, pageUrl);

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: page.title,
    description: page.description,
    about: { "@id": ENTITY_IDS.realEstateAgent },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: properties.slice(0, 12).map((property, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/properties/${property.slug}`),
        name: `${property.configuration} in ${property.locationLabel}`,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Properties", item: absoluteUrl("/properties") },
      { "@type": "ListItem", position: 3, name: "Ahmedabad", item: absoluteUrl("/ahmedabad") },
      { "@type": "ListItem", position: 4, name: page.label, item: pageUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />
      <LandingPageTemplate page={page} properties={properties} initialRates={rates} initialIsLive={isLive} />
    </>
  );
}

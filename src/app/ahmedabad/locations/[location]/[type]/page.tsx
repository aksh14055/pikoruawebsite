import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPageTemplate } from "@/components/seo/LandingPageTemplate";
import { STATIC_PROPERTIES } from "@/lib/data/properties";
import {
  getAhmedabadLocationPage,
  getLandingProperties,
  AHMEDABAD_LOCATION_PAGES,
  type GeoLandingPage,
} from "@/lib/data/geo";
import { getKeywordClusterTermsForSlug } from "@/lib/data/keyword-clusters";
import {
  ENTITY_IDS,
  getAhmedabadAreaServedSchema,
} from "@/lib/entity-profile";
import { absoluteUrl, createMetadata, serializeJsonLd, SITE_URL } from "@/lib/seo";
import { getExchangeRates } from "@/lib/exchange-rates";

interface AhmedabadLocationTypePageProps {
  params: Promise<{ location: string; type: string }>;
}

export const dynamicParams = false;

/**
 * Generates static params for all /ahmedabad/locations/[location]/[type] pages.
 *
 * AHMEDABAD_LOCATION_PAGES have hrefs like:
 *   /ahmedabad/locations/thaltej/luxury-flats   → location=thaltej, type=luxury-flats
 *   /ahmedabad/locations/bodakdev/penthouses     → location=bodakdev, type=penthouses
 */
export function generateStaticParams() {
  return AHMEDABAD_LOCATION_PAGES.map((page) => {
    const withoutPrefix = page.href.replace(/^\/ahmedabad\/locations\//, "");
    const [location, type] = withoutPrefix.split("/");
    return { location, type };
  });
}

export async function generateMetadata({ params }: AhmedabadLocationTypePageProps): Promise<Metadata> {
  const { location, type } = await params;
  const slug = slugFromSegments(location, type);
  const page = getAhmedabadLocationPage(slug);
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

/** Build the page slug from location + type segments. */
function slugFromSegments(location: string, type: string): string {
  return `${location}-${type}`;
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

export default async function AhmedabadLocationTypePage({ params }: AhmedabadLocationTypePageProps) {
  const { location, type } = await params;
  const slug = slugFromSegments(location, type);
  const page = getAhmedabadLocationPage(slug);
  const { rates, isLive } = await getExchangeRates();

  if (!page) notFound();

  const properties = getLandingProperties(page, STATIC_PROPERTIES);
  const pageUrl = absoluteUrl(page.href);
  const serviceSchema = getServiceSchema(page, pageUrl);

  const locationLabel = location
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const typeLabel = type
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: page.title,
    description: page.description,
    about: {
      "@type": "Place",
      name: locationLabel,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ahmedabad",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
    },
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
      { "@type": "ListItem", position: 4, name: locationLabel, item: absoluteUrl(`/ahmedabad/locations/${location}`) },
      { "@type": "ListItem", position: 5, name: page.label, item: pageUrl },
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

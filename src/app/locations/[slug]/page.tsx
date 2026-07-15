import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { LandingPageTemplate } from "@/components/seo/LandingPageTemplate";
import { STATIC_PROPERTIES } from "@/lib/data/properties";
import {
  LOCATION_LANDING_PAGES,
  getLandingProperties,
  getLocationLandingPage,
} from "@/lib/data/geo";
import { ENTITY_IDS } from "@/lib/entity-profile";
import { absoluteUrl, createMetadata, serializeJsonLd, SITE_URL } from "@/lib/seo";

interface LocationPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCATION_LANDING_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getLocationLandingPage(slug);
  if (!page) return {};

  return createMetadata({
    title: page.title,
    description: page.description,
    path: page.href,
    image: page.heroImage,
    keywords: [page.label, page.title, ...(page.matchKeywords ?? []), ...(page.seoKeywords ?? [])],
  });
}

export default async function LocationLandingPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const page = getLocationLandingPage(slug);

  if (!page) {
    notFound();
  }

  if (page.href !== `/locations/${slug}`) {
    permanentRedirect(page.href);
  }

  const properties = getLandingProperties(page, STATIC_PROPERTIES);
  const pageUrl = absoluteUrl(page.href);
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: page.title,
    description: page.description,
    about: [
      {
        "@type": "Place",
        "name": page.label,
        ...(page.wikipediaUrl || page.wikidataUrl
          ? {
              "sameAs": [
                page.wikipediaUrl,
                page.wikidataUrl,
              ].filter(Boolean),
            }
          : {}),
        ...(page.coordinates ? {
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": page.coordinates.latitude,
            "longitude": page.coordinates.longitude,
          }
        } : {}),
      },
      {
        "@id": ENTITY_IDS.realEstateAgent,
      },
    ],
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
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Properties",
        item: absoluteUrl("/properties"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.label,
        item: pageUrl,
      },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
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
      <LandingPageTemplate page={page} properties={properties} />
    </>
  );
}

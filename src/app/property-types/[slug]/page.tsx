import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPageTemplate } from "@/components/seo/LandingPageTemplate";
import { STATIC_PROPERTIES } from "@/lib/data/properties";
import {
  PROPERTY_TYPE_LANDING_PAGES,
  getLandingProperties,
  getPropertyTypeLandingPage,
} from "@/lib/data/geo";
import { absoluteUrl, createMetadata, serializeJsonLd, SITE_URL } from "@/lib/seo";

interface PropertyTypePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return PROPERTY_TYPE_LANDING_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PropertyTypePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPropertyTypeLandingPage(slug);
  if (!page) return {};

  return createMetadata({
    title: page.title,
    description: page.description,
    path: page.href,
    image: page.heroImage,
  });
}

export default async function PropertyTypeLandingPage({ params }: PropertyTypePageProps) {
  const { slug } = await params;
  const page = getPropertyTypeLandingPage(slug);

  if (!page) {
    notFound();
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
    about: {
      "@id": `${SITE_URL}#real-estate-agent`,
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

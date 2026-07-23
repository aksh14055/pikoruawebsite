import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPageTemplate } from "@/components/seo/LandingPageTemplate";
import { PRIVATE_CLIENT_PAGES, getPrivateClientPageByUrlSlug } from "@/lib/data/private-client-advisory";
import { STATIC_PROPERTIES } from "@/lib/data/properties";
import { getLandingProperties } from "@/lib/data/geo";
import { absoluteUrl, createMetadata, serializeJsonLd, SITE_URL } from "@/lib/seo";
import { BUSINESS_LANGUAGES, ENTITY_IDS, getAhmedabadAreaServedSchema } from "@/lib/entity-profile";

interface PrivateClientPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return PRIVATE_CLIENT_PAGES.map((page) => ({ slug: page.href.replace("/private-client-advisory/", "") }));
}

export async function generateMetadata({ params }: PrivateClientPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPrivateClientPageByUrlSlug(slug);
  if (!page) return {};
  return createMetadata({
    title: page.title,
    description: page.description,
    path: page.href,
    image: page.heroImage,
    keywords: [page.label, page.title, ...(page.seoKeywords ?? [])],
  });
}

export default async function PrivateClientPage({ params }: PrivateClientPageProps) {
  const { slug } = await params;
  const page = getPrivateClientPageByUrlSlug(slug);
  if (!page) notFound();

  const pageUrl = absoluteUrl(page.href);
  const properties = getLandingProperties(page, STATIC_PROPERTIES);
  const serviceSchema = {
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
      audienceType: "HNIs, UHNIs, business families, promoters, founders, CXOs, global Indians, family offices and private clients",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl("/contact?purpose=private-client"),
      availableLanguage: [...BUSINESS_LANGUAGES],
    },
  };
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: page.title,
    description: page.description,
    about: [{ "@id": ENTITY_IDS.realEstateAgent }, { "@id": `${pageUrl}#service` }],
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
      { "@type": "ListItem", position: 2, name: "Private Client Advisory", item: absoluteUrl("/private-client-advisory") },
      { "@type": "ListItem", position: 3, name: page.label, item: pageUrl },
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
      {[serviceSchema, collectionPageSchema, breadcrumbSchema, faqSchema].map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}
      <LandingPageTemplate page={page} properties={properties} />
    </>
  );
}


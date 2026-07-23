import type { Metadata } from "next";
import { LandingPageTemplate } from "@/components/seo/LandingPageTemplate";
import { PUBLIC_FIGURES_ADVISORY_PAGE as page } from "@/lib/data/private-client-advisory";
import { STATIC_PROPERTIES } from "@/lib/data/properties";
import { getLandingProperties } from "@/lib/data/geo";
import { absoluteUrl, createMetadata, serializeJsonLd, SITE_URL } from "@/lib/seo";
import { BUSINESS_LANGUAGES, ENTITY_IDS, getAhmedabadAreaServedSchema } from "@/lib/entity-profile";

export const metadata: Metadata = createMetadata({
  title: page.title,
  description: page.description,
  path: page.href,
  image: page.heroImage,
  keywords: [page.label, ...(page.seoKeywords ?? [])],
});

export default function PublicFiguresPropertyAdvisoryPage() {
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
      audienceType: "Public figures, business leaders and privacy-sensitive households",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl("/contact?purpose=private-client"),
      availableLanguage: [...BUSINESS_LANGUAGES],
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Private Client Advisory",
        item: absoluteUrl("/private-client-advisory"),
      },
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
      {[serviceSchema, breadcrumbSchema, faqSchema].map((schema, index) => (
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

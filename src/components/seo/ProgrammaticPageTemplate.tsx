"use client";

import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { ProgrammaticPage } from "@/lib/data/combo-content-engine";
import type { RelatedLinksCluster } from "@/lib/data/combo-linker";
import type { StaticProperty } from "@/lib/data/properties";
import { RESIDENTIAL_CATEGORY_LABELS } from "@/types";
import { buildWhatsAppUrl } from "@/lib/utils";
import { env } from "@/lib/env";
import {
  ArrowRight,
  MapPin,
  TrendingUp,
  Banknote,
  Building2,
  PhoneCall,
  ChevronRight,
} from "lucide-react";

interface ProgrammaticPageTemplateProps {
  page: ProgrammaticPage;
  properties: StaticProperty[];
  relatedLinks: RelatedLinksCluster[];
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER PILL — shows active dimension with link to remove it
// ─────────────────────────────────────────────────────────────────────────────
function FilterPill({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="filter-pill"
      aria-label={`Remove filter: ${label}`}
    >
      {label}
      <span className="filter-pill__remove" aria-hidden="true">×</span>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY CARD (compact)
// ─────────────────────────────────────────────────────────────────────────────
function PropertyCard({ property }: { property: StaticProperty }) {
  const href = `/properties/${property.slug}`;
  const categoryLabel =
    RESIDENTIAL_CATEGORY_LABELS[
      property.category as keyof typeof RESIDENTIAL_CATEGORY_LABELS
    ] ?? property.category;

  return (
    <Link href={href} className="prog-property-card group" aria-label={`View ${property.configuration} at ${property.locationLabel}`}>
      <div className="prog-property-card__image">
        {property.images?.[0] && (
          <Image
            src={property.images[0]}
            alt={`${property.configuration} in ${property.locationLabel}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <span className="prog-property-card__badge">{categoryLabel}</span>
      </div>
      <div className="prog-property-card__body">
        <p className="prog-property-card__config">{property.configuration}</p>
        <p className="prog-property-card__location">
          <MapPin size={13} aria-hidden="true" />
          {property.locationLabel}
        </p>
        {property.price && (
          <p className="prog-property-card__price">{property.price}</p>
        )}
        <span className="prog-property-card__cta">
          View details <ArrowRight size={13} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICE INSIGHTS STRIP
// ─────────────────────────────────────────────────────────────────────────────
function PriceInsightsStrip({ page }: { page: ProgrammaticPage }) {
  const loc = page.combo.location!;
  const bhk = page.combo.bhk;
  const type = page.combo.type;

  const insights = [
    {
      icon: Banknote,
      label: "Price Range",
      value: loc.priceContext,
    },
    {
      icon: TrendingUp,
      label: "Market Trend",
      value:
        loc.corridor === "west" || loc.corridor === "sg-highway"
          ? "7–12% p.a. appreciation"
          : loc.corridor === "gift-city"
          ? "8–14% p.a. GIFT City premium"
          : "6–9% p.a. growth",
    },
    ...(bhk && type?.bhkApplicable
      ? [{ icon: Building2, label: "Carpet Area", value: bhk.sizeRangeResidential }]
      : []),
    {
      icon: MapPin,
      label: "Area",
      value: loc.area,
    },
  ];

  return (
    <div className="prog-insights-strip" role="region" aria-label="Price insights">
      {insights.map(({ icon: Icon, label, value }) => (
        <div key={label} className="prog-insights-strip__item">
          <Icon size={20} className="prog-insights-strip__icon" aria-hidden="true" />
          <div>
            <p className="prog-insights-strip__label">{label}</p>
            <p className="prog-insights-strip__value">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RELATED LINKS CLUSTER
// ─────────────────────────────────────────────────────────────────────────────
function RelatedLinksSection({ clusters }: { clusters: RelatedLinksCluster[] }) {
  if (clusters.length === 0) return null;
  return (
    <section className="prog-related" aria-labelledby="related-heading">
      <h2 id="related-heading" className="prog-related__heading">
        Explore Related Listings
      </h2>
      <div className="prog-related__clusters">
        {clusters.map((cluster) => (
          <div key={cluster.heading} className="prog-related__cluster">
            <h3 className="prog-related__cluster-heading">{cluster.heading}</h3>
            <ul className="prog-related__list" role="list">
              {cluster.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="prog-related__link">
                    <ChevronRight size={14} className="prog-related__chevron" aria-hidden="true" />
                    <span>
                      <strong>{link.label}</strong>
                      {link.description && (
                        <span className="prog-related__desc"> — {link.description}</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NO-RESULTS CTA
// ─────────────────────────────────────────────────────────────────────────────
function NoResultsCta({ page }: { page: ProgrammaticPage }) {
  const loc = page.combo.location!;
  const type = page.combo.type;
  const whatsappUrl = buildWhatsAppUrl(
    env.WHATSAPP_NUMBER,
    `Hi PIKORUA, I am looking for ${type ? type.pluralLabel.toLowerCase() : "property"} in ${loc.label}. Please share available options.`
  );

  return (
    <div className="prog-no-results" role="status" aria-live="polite">
      <Building2 size={48} className="prog-no-results__icon" aria-hidden="true" />
      <h2 className="prog-no-results__heading">
        No listings currently available
      </h2>
      <p className="prog-no-results__body">
        Our portal shows verified, RERA-compliant inventory only. New
        {type ? ` ${type.pluralLabel.toLowerCase()}` : " properties"} in{" "}
        {loc.label} arrive regularly — contact us for an off-market shortlist.
      </p>
      <div className="prog-no-results__actions">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="prog-no-results__whatsapp"
          aria-label="WhatsApp PIKORUA Realty"
        >
          <PhoneCall size={18} aria-hidden="true" />
          WhatsApp for Inventory
        </a>
        <Link href="/contact" className="prog-no-results__contact">
          Send an Enquiry
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVE FILTER BAR
// ─────────────────────────────────────────────────────────────────────────────
function ActiveFilterBar({ page }: { page: ProgrammaticPage }) {
  const { location, type, bhk, budget, intent } = page.combo;

  // Build parent hrefs by dropping trailing segments
  const segments: string[] = [];
  if (location) segments.push(location.slug);
  const locHref = `/p/${segments.join("/")}`;

  const typeSegments = type ? [...segments, type.slug] : segments;
  const typeHref = `/p/${typeSegments.join("/")}`;

  const bhkSegments = bhk ? [...typeSegments, bhk.slug] : typeSegments;
  const bhkHref = `/p/${bhkSegments.join("/")}`;

  const budgetSegments = budget ? [...bhkSegments, budget.slug] : bhkSegments;
  const budgetHref = `/p/${budgetSegments.join("/")}`;

  const pills = [
    location && { label: location.label, href: "/p" },
    type && { label: type.pluralLabel, href: locHref },
    bhk && type?.bhkApplicable && { label: bhk.label, href: typeHref },
    budget && { label: budget.label, href: bhkHref },
    intent && { label: intent.label, href: budgetHref },
  ].filter(Boolean) as { label: string; href: string }[];

  if (pills.length === 0) return null;

  return (
    <nav
      className="prog-filter-bar"
      aria-label="Active search filters"
    >
      <span className="prog-filter-bar__label">Filtered by:</span>
      <div className="prog-filter-bar__pills" role="list">
        {pills.map((pill) => (
          <div role="listitem" key={pill.label}>
            <FilterPill label={pill.label} href={pill.href} />
          </div>
        ))}
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BREADCRUMB ITEMS
// ─────────────────────────────────────────────────────────────────────────────
function buildBreadcrumbs(page: ProgrammaticPage) {
  const { location, type, bhk, budget, intent } = page.combo;
  const items: { label: string; href: string }[] = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "Search", href: "/p" },
  ];

  if (location) items.push({ label: location.label, href: `/p/${location.slug}` });
  if (type) items.push({ label: type.pluralLabel, href: `/p/${location!.slug}/${type.slug}` });
  if (bhk && type?.bhkApplicable) {
    items.push({ label: bhk.label, href: `/p/${location!.slug}/${type!.slug}/${bhk.slug}` });
  }
  if (budget) {
    const prev = [location!.slug, type?.slug, bhk?.slug].filter(Boolean);
    items.push({ label: budget.label, href: `/p/${[...prev, budget.slug].join("/")}` });
  }
  if (intent) items.push({ label: intent.label, href: page.href });

  return items;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────
export function ProgrammaticPageTemplate({
  page,
  properties,
  relatedLinks,
}: ProgrammaticPageTemplateProps) {
  const breadcrumbs = buildBreadcrumbs(page);
  const whatsappUrl = buildWhatsAppUrl(
    env.WHATSAPP_NUMBER,
    `Hi PIKORUA, I found your listing for ${page.h1}. I am interested in more details.`
  );

  return (
    <>
      <Header />
      <main id="main-content" className="prog-page">
        {/* ── Breadcrumb ───────────────────────────────────────────── */}
        <div className="prog-page__breadcrumb">
          <Breadcrumb items={breadcrumbs} />
        </div>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="prog-hero" aria-labelledby="prog-h1">
          <div className="prog-hero__image-wrap">
            <Image
              src={page.heroImage}
              alt={page.h1}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="prog-hero__overlay" aria-hidden="true" />
          </div>
          <div className="prog-hero__content container">
            <p className="prog-hero__eyebrow">{page.eyebrow}</p>
            <h1 id="prog-h1" className="prog-hero__h1">
              {page.h1}
            </h1>
            <p className="prog-hero__intro">{page.intro}</p>
            <div className="prog-hero__actions">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="prog-hero__cta prog-hero__cta--primary"
                aria-label="WhatsApp PIKORUA for this search"
              >
                <PhoneCall size={18} aria-hidden="true" />
                Get a Shortlist on WhatsApp
              </a>
              <Link
                href="/contact"
                className="prog-hero__cta prog-hero__cta--secondary"
              >
                Send Enquiry
              </Link>
            </div>
          </div>
        </section>

        {/* ── Active Filters ───────────────────────────────────────── */}
        <div className="container">
          <ActiveFilterBar page={page} />
        </div>

        {/* ── Price Insights Strip ─────────────────────────────────── */}
        <div className="container">
          <PriceInsightsStrip page={page} />
        </div>

        {/* ── Listings ─────────────────────────────────────────────── */}
        <section className="container prog-listings" aria-labelledby="listings-heading">
          <h2 id="listings-heading" className="prog-listings__heading">
            {properties.length > 0
              ? `${properties.length} Verified ${page.combo.type?.pluralLabel ?? "Properties"} in ${page.combo.location?.label}`
              : `${page.combo.type?.pluralLabel ?? "Properties"} in ${page.combo.location?.label}`}
          </h2>

          {properties.length > 0 ? (
            <div className="prog-listings__grid">
              {properties.map((p) => (
                <PropertyCard key={p.slug} property={p} />
              ))}
            </div>
          ) : (
            <NoResultsCta page={page} />
          )}
        </section>

        {/* ── Market Signals ───────────────────────────────────────── */}
        <section className="container prog-signals" aria-labelledby="signals-heading">
          <h2 id="signals-heading" className="prog-signals__heading">
            Market Intelligence
          </h2>
          <ul className="prog-signals__list" role="list">
            {page.marketSignals.map((signal, i) => (
              <li key={i} className="prog-signals__item">
                <TrendingUp size={18} className="prog-signals__icon" aria-hidden="true" />
                <p>{signal}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Body Content ─────────────────────────────────────────── */}
        <section className="container prog-body" aria-labelledby="body-heading">
          <h2 id="body-heading" className="prog-body__heading">
            {`${page.combo.type?.pluralLabel ?? "Property"} Guide — ${page.combo.location?.label}`}
          </h2>
          <div className="prog-body__content">
            {page.bodyContent.map((para, i) => {
              if (para.startsWith("### ")) {
                return (
                  <h3 key={i} className="prog-body__subheading">
                    {para.replace("### ", "")}
                  </h3>
                );
              }
              return <p key={i} className="prog-body__para">{para}</p>;
            })}
          </div>
        </section>

        {/* ── Ideal For ────────────────────────────────────────────── */}
        <section className="container prog-ideal" aria-labelledby="ideal-heading">
          <h2 id="ideal-heading" className="prog-ideal__heading">
            Who Is This For?
          </h2>
          <ul className="prog-ideal__list" role="list">
            {page.idealFor.map((item, i) => (
              <li key={i} className="prog-ideal__item">
                <span className="prog-ideal__bullet" aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ── FAQs ─────────────────────────────────────────────────── */}
        <section className="container prog-faq" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="prog-faq__heading">
            Frequently Asked Questions
          </h2>
          <FaqAccordion items={page.faqs} />
        </section>

        {/* ── Related Internal Links ───────────────────────────────── */}
        <div className="container">
          <RelatedLinksSection clusters={relatedLinks} />
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────────── */}
        <section className="prog-bottom-cta" aria-labelledby="bottom-cta-heading">
          <div className="container prog-bottom-cta__inner">
            <h2 id="bottom-cta-heading" className="prog-bottom-cta__heading">
              Need a curated shortlist?
            </h2>
            <p className="prog-bottom-cta__body">
              PIKORUA Realty's advisory team maintains private access to
              off-market inventory in {page.combo.location?.label}. Share your
              requirements — we respond within 24 hours.
            </p>
            <div className="prog-bottom-cta__actions">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="prog-bottom-cta__btn prog-bottom-cta__btn--primary"
              >
                <PhoneCall size={18} aria-hidden="true" />
                WhatsApp PIKORUA
              </a>
              <Link href="/contact" className="prog-bottom-cta__btn prog-bottom-cta__btn--secondary">
                Send Enquiry <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

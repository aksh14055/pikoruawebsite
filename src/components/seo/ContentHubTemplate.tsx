"use client";

import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { ContentHubPage } from "@/lib/data/content-hubs";
import { buildWhatsAppUrl } from "@/lib/utils";
import { env } from "@/lib/env";
import {
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  PhoneCall,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface ContentHubTemplateProps {
  page: ContentHubPage;
  relatedPages: ContentHubPage[];
}

// ─── Expert Summary Card ─────────────────────────────────────────────────────
function ExpertSummaryCard({ takeaways }: { takeaways: string[] }) {
  return (
    <div className="hub-summary-card" role="region" aria-labelledby="summary-heading">
      <div className="hub-summary-card__header">
        <div className="hub-summary-card__icon-badge">
          <Sparkles size={16} className="text-champagne-gold" aria-hidden="true" />
        </div>
        <div>
          <h2 id="summary-heading" className="hub-summary-card__heading">
            Executive Summary & Key Takeaways
          </h2>
          <p className="hub-summary-card__subheading">Key insights from PIKORUA's advisory team</p>
        </div>
      </div>
      <ul className="hub-summary-card__list" role="list">
        {takeaways.map((item, i) => (
          <li key={i} className="hub-summary-card__item">
            <span className="hub-summary-card__num" aria-hidden="true">0{i + 1}</span>
            <div className="hub-summary-card__text">
              <p>{item}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Comparison Table ────────────────────────────────────────────────────────
function ComparisonTable({
  rows,
  labelA,
  labelB,
}: {
  rows: { label: string; a: string; b: string }[];
  labelA: string;
  labelB: string;
}) {
  return (
    <div className="hub-compare-section">
      <div className="hub-compare-section__header">
        <h2 className="hub-compare-section__title">Side-by-Side Comparison</h2>
        <p className="hub-compare-section__subtitle">Detailed evaluation across core investment parameters</p>
      </div>
      <div className="hub-compare-table-wrap" role="region" aria-label="Comparison table">
        <table className="hub-compare-table">
          <thead>
            <tr>
              <th className="hub-compare-table__header hub-compare-table__header--label">
                Evaluation Metric
              </th>
              <th className="hub-compare-table__header hub-compare-table__header--a">
                {labelA}
              </th>
              <th className="hub-compare-table__header hub-compare-table__header--b">
                {labelB}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="hub-compare-table__row">
                <td className="hub-compare-table__cell hub-compare-table__cell--label">
                  {row.label}
                </td>
                <td className="hub-compare-table__cell hub-compare-table__cell--a">
                  {row.a}
                </td>
                <td className="hub-compare-table__cell hub-compare-table__cell--b">
                  {row.b}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Body Sections ───────────────────────────────────────────────────────────
function BodySections({ sections }: { sections: ContentHubPage["sections"] }) {
  return (
    <div className="hub-body">
      {sections.map((section, i) => (
        <section key={i} className="hub-body__section">
          <h2 className="hub-body__section-heading">{section.heading}</h2>
          <div className="hub-body__paras">
            {section.body.map((para, j) => (
              <p key={j} className="hub-body__para">{para}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// ─── Market Signals Bar ──────────────────────────────────────────────────────
function MarketSignalsBar({ signals }: { signals: string[] }) {
  return (
    <div className="hub-signals" role="region" aria-label="Market data signals">
      <div className="hub-signals__header">
        <TrendingUp size={16} className="text-champagne-gold" aria-hidden="true" />
        <span className="hub-signals__title">Market Intelligence Signals</span>
      </div>
      <div className="hub-signals__items">
        {signals.map((sig, i) => (
          <div key={i} className="hub-signals__item">
            <span className="hub-signals__dot" aria-hidden="true" />
            <span>{sig}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Related Pages Cluster ───────────────────────────────────────────────────
function RelatedPagesCluster({ pages }: { pages: ContentHubPage[] }) {
  if (pages.length === 0) return null;
  return (
    <section className="hub-related" aria-labelledby="related-hub-heading">
      <div className="hub-related__header">
        <h2 id="related-hub-heading" className="hub-related__heading">
          <BookOpen size={20} className="text-champagne-gold" aria-hidden="true" />
          Related Market Intelligence &amp; Guides
        </h2>
        <p className="hub-related__sub">Deepen your knowledge of Ahmedabad real estate</p>
      </div>
      <div className="hub-related__grid">
        {pages.map((page) => (
          <Link key={page.slug} href={page.href} className="hub-related__card group">
            <div className="hub-related__card-image">
              <Image
                src={page.heroImage}
                alt={page.h1}
                fill
                sizes="(max-width:640px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="hub-related__card-overlay" aria-hidden="true" />
            </div>
            <div className="hub-related__card-body">
              <p className="hub-related__card-eyebrow">{page.eyebrow}</p>
              <h3 className="hub-related__card-title">{page.h1}</h3>
              <span className="hub-related__card-cta">
                Read guide <ArrowRight size={13} aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Breadcrumb builder ───────────────────────────────────────────────────────
function buildBreadcrumbs(page: ContentHubPage) {
  const prefixLabels: Record<string, string> = {
    compare: "Compare",
    invest: "Investment Guides",
    learn: "Property Education",
    "gift-city": "GIFT City",
  };
  return [
    { label: "Home", href: "/" },
    { label: prefixLabels[page.prefix] ?? page.prefix, href: `/${page.prefix}` },
    { label: page.h1, href: page.href },
  ];
}

// ─── Extract comparison labels from H1 ───────────────────────────────────────
function extractCompareLabels(h1: string): { a: string; b: string } {
  const vsMatch = h1.match(/^(.+?)\s+vs\.?\s+(.+?)(?:\s*[—–-]|:)/i);
  if (vsMatch) return { a: vsMatch[1].trim(), b: vsMatch[2].trim() };
  return { a: "Option A", b: "Option B" };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────
export function ContentHubTemplate({ page, relatedPages }: ContentHubTemplateProps) {
  const breadcrumbs = buildBreadcrumbs(page);
  const compareLabels = extractCompareLabels(page.h1);
  const whatsappUrl = buildWhatsAppUrl(
    env.WHATSAPP_NUMBER,
    `Hi PIKORUA, I read your guide on "${page.h1}" and would like to discuss my investment options.`
  );

  return (
    <>
      <Header alwaysSolid />
      <main id="main-content" className="hub-page">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="hub-hero" aria-labelledby="hub-h1">
          <div className="hub-hero__image-wrap">
            <Image
              src={page.heroImage}
              alt={page.h1}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="hub-hero__overlay" aria-hidden="true" />
            <div className="hub-hero__top-shadow" aria-hidden="true" />
          </div>

          <div className="hub-hero__content container">
            {/* Breadcrumbs inside hero for clean layout below fixed header */}
            <div className="hub-hero__breadcrumb">
              <Breadcrumb items={breadcrumbs} />
            </div>

            <div className="hub-hero__badge">
              <span className="hub-hero__badge-dot" />
              {page.eyebrow}
            </div>

            <h1 id="hub-h1" className="hub-hero__h1">
              {page.h1}
            </h1>

            <p className="hub-hero__intro">
              {page.intro}
            </p>

            <div className="hub-hero__meta">
              <span className="hub-hero__author-badge">PIKORUA Advisory Research</span>
              <span className="hub-hero__dot">•</span>
              <time dateTime={page.publishedAt} className="hub-hero__date">
                Updated {new Date(page.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
              </time>
            </div>
          </div>
        </section>

        {/* ── Content Body Wrapper ────────────────────────── */}
        <div className="hub-container container">

          {/* ── Market Signals Ticker ────────────────────────── */}
          <MarketSignalsBar signals={page.marketSignals} />

          {/* ── Expert Summary Card ──────────────────────────── */}
          <ExpertSummaryCard takeaways={page.keyTakeaways} />

          {/* ── Comparison Table (for compare pages) ─────────── */}
          {page.comparisonTable && page.comparisonTable.length > 0 && (
            <ComparisonTable
              rows={page.comparisonTable}
              labelA={compareLabels.a}
              labelB={compareLabels.b}
            />
          )}

          {/* ── Main Editorial Body ─────────────────────────── */}
          <BodySections sections={page.sections} />

          {/* ── Related Listing Pills ────────────────────────── */}
          {page.relatedListingHrefs.length > 0 && (
            <section className="hub-listings" aria-labelledby="hub-listings-heading">
              <div className="hub-listings__header">
                <h2 id="hub-listings-heading" className="hub-listings__heading">
                  Curated Property Shortlists
                </h2>
                <p className="hub-listings__sub">Explore verified listings matching this search profile</p>
              </div>
              <div className="hub-listings__pills">
                {page.relatedListingHrefs.map((href) => {
                  const label = href.replace("/p/", "").split("/").map((s) => s.replace(/-/g, " ")).join(" › ");
                  return (
                    <Link key={href} href={href} className="hub-listings__pill">
                      <ChevronRight size={14} className="text-champagne-gold" aria-hidden="true" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── FAQ Section ──────────────────────────────────── */}
          <section className="hub-faq" aria-labelledby="hub-faq-heading">
            <div className="hub-faq__header">
              <h2 id="hub-faq-heading" className="hub-faq__heading">
                Frequently Asked Questions
              </h2>
              <p className="hub-faq__sub">Direct answers to key investment questions</p>
            </div>
            <FaqAccordion items={page.faqs} />
          </section>

          {/* ── Related Guides ───────────────────────────────── */}
          <RelatedPagesCluster pages={relatedPages} />

        </div>

        {/* ── Advisory CTA ─────────────────────────────────── */}
        <section className="hub-cta" aria-labelledby="hub-cta-heading">
          <div className="container hub-cta__inner">
            <div className="hub-cta__text">
              <p className="hub-cta__eyebrow">PIKORUA Private Advisory</p>
              <h2 id="hub-cta-heading" className="hub-cta__heading">
                Tailored Real Estate Advisory for HNIs &amp; NRIs
              </h2>
              <p className="hub-cta__body">
                Our advisors provide end-to-end support for high-ticket property acquisitions in Ahmedabad — from off-market discovery to legal due diligence.
              </p>
            </div>
            <div className="hub-cta__actions">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hub-cta__btn hub-cta__btn--primary"
                aria-label="WhatsApp PIKORUA Realty"
              >
                <PhoneCall size={18} aria-hidden="true" />
                Connect on WhatsApp
              </a>
              <Link href="/contact" className="hub-cta__btn hub-cta__btn--secondary">
                Request Advisory Call <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

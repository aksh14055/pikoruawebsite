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
        <CheckCircle2 size={18} className="hub-summary-card__icon" aria-hidden="true" />
        <h2 id="summary-heading" className="hub-summary-card__heading">
          Key Takeaways
        </h2>
      </div>
      <ul className="hub-summary-card__list" role="list">
        {takeaways.map((item, i) => (
          <li key={i} className="hub-summary-card__item">
            <span className="hub-summary-card__num" aria-hidden="true">0{i + 1}</span>
            <p>{item}</p>
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
    <div className="hub-compare-table-wrap" role="region" aria-label="Comparison table">
      <table className="hub-compare-table">
        <thead>
          <tr>
            <th className="hub-compare-table__header hub-compare-table__header--label">
              Criterion
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
  );
}

// ─── Body Sections ───────────────────────────────────────────────────────────
function BodySections({ sections }: { sections: ContentHubPage["sections"] }) {
  return (
    <div className="hub-body">
      {sections.map((section, i) => (
        <section key={i} className="hub-body__section">
          <h2 className="hub-body__section-heading">{section.heading}</h2>
          {section.body.map((para, j) => (
            <p key={j} className="hub-body__para">{para}</p>
          ))}
        </section>
      ))}
    </div>
  );
}

// ─── Market Signals Bar ──────────────────────────────────────────────────────
function MarketSignalsBar({ signals }: { signals: string[] }) {
  return (
    <div className="hub-signals" role="region" aria-label="Market data signals">
      <div className="hub-signals__label">
        <TrendingUp size={14} aria-hidden="true" />
        <span>Market Data</span>
      </div>
      <div className="hub-signals__items">
        {signals.map((sig, i) => (
          <span key={i} className="hub-signals__item">{sig}</span>
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
      <h2 id="related-hub-heading" className="hub-related__heading">
        <BookOpen size={18} aria-hidden="true" />
        Related Guides &amp; Analysis
      </h2>
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
    { label: "Advisory", href: "/properties" },
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
      <Header />
      <main id="main-content" className="hub-page">

        {/* ── Breadcrumb ───────────────────────────────────── */}
        <div className="hub-page__breadcrumb">
          <Breadcrumb items={breadcrumbs} />
        </div>

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="hub-hero" aria-labelledby="hub-h1">
          <div className="hub-hero__image-wrap">
            <Image
              src={page.heroImage}
              alt={page.h1}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="hub-hero__overlay" aria-hidden="true" />
          </div>
          <div className="hub-hero__content container">
            <p className="hub-hero__eyebrow">{page.eyebrow}</p>
            <h1 id="hub-h1" className="hub-hero__h1">{page.h1}</h1>
            <p className="hub-hero__intro">{page.intro}</p>
            <div className="hub-hero__meta">
              <time dateTime={page.publishedAt} className="hub-hero__date">
                Published {new Date(page.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
              </time>
              <span className="hub-hero__author">PIKORUA Advisory Team</span>
            </div>
          </div>
        </section>

        {/* ── Market Signals ───────────────────────────────── */}
        <div className="container">
          <MarketSignalsBar signals={page.marketSignals} />
        </div>

        {/* ── Expert Summary Card ──────────────────────────── */}
        <div className="container">
          <ExpertSummaryCard takeaways={page.keyTakeaways} />
        </div>

        {/* ── Comparison Table (for compare pages) ─────────── */}
        {page.comparisonTable && page.comparisonTable.length > 0 && (
          <div className="container">
            <ComparisonTable
              rows={page.comparisonTable}
              labelA={compareLabels.a}
              labelB={compareLabels.b}
            />
          </div>
        )}

        {/* ── Body Content ─────────────────────────────────── */}
        <div className="container">
          <BodySections sections={page.sections} />
        </div>

        {/* ── Related Listing Strip ────────────────────────── */}
        {page.relatedListingHrefs.length > 0 && (
          <section className="container hub-listings" aria-labelledby="hub-listings-heading">
            <h2 id="hub-listings-heading" className="hub-listings__heading">
              Browse Matching Properties
            </h2>
            <div className="hub-listings__pills">
              {page.relatedListingHrefs.map((href) => {
                const label = href.replace("/p/", "").split("/").map((s) => s.replace(/-/g, " ")).join(" › ");
                return (
                  <Link key={href} href={href} className="hub-listings__pill">
                    <ChevronRight size={13} aria-hidden="true" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="container hub-faq" aria-labelledby="hub-faq-heading">
          <h2 id="hub-faq-heading" className="hub-faq__heading">
            Frequently Asked Questions
          </h2>
          <FaqAccordion items={page.faqs} />
        </section>

        {/* ── Related Guides ───────────────────────────────── */}
        <div className="container">
          <RelatedPagesCluster pages={relatedPages} />
        </div>

        {/* ── Advisory CTA ─────────────────────────────────── */}
        <section className="hub-cta" aria-labelledby="hub-cta-heading">
          <div className="container hub-cta__inner">
            <div className="hub-cta__text">
              <p className="hub-cta__eyebrow">PIKORUA Advisory</p>
              <h2 id="hub-cta-heading" className="hub-cta__heading">
                Ready to discuss your specific situation?
              </h2>
              <p className="hub-cta__body">
                Every investment decision is personal. Our advisory team works with
                a limited number of clients at a time — ensuring the depth of
                attention your capital deserves.
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
                Discuss with PIKORUA
              </a>
              <Link href="/contact" className="hub-cta__btn hub-cta__btn--secondary">
                Schedule a Call <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { GeoLandingPage } from "@/lib/data/geo";
import { getLandingFilterHref, getRelatedLandingPages } from "@/lib/data/geo";
import type { StaticProperty } from "@/lib/data/properties";
import { PROPERTY_STATUS_LABELS, RESIDENTIAL_CATEGORY_LABELS } from "@/types";
import { env } from "@/lib/env";
import { buildWhatsAppUrl } from "@/lib/utils";
import { ArrowRight, PhoneCall, MapPin, ShieldCheck, Landmark, FileText, CheckCircle2 } from "lucide-react";
import { NriCurrencyConverter } from "./NriCurrencyConverter";
import type { ExchangeRates } from "@/lib/exchange-rates";

const NRI_TIMELINE_STEPS = [
  {
    step: "01",
    title: "Briefing & Needs Mapping",
    description: "Timezone-flexible call to outline requirements, financial expectations, and exit horizons.",
    icon: PhoneCall,
  },
  {
    step: "02",
    title: "HD Virtual Walkthroughs",
    description: "Detailed video assessments of the home layout, context, and immediate neighbourhood.",
    icon: MapPin,
  },
  {
    step: "03",
    title: "Legal & RERA Verification",
    description: "Thorough legal checks on land title clearings and builder RERA registrations by legal partners.",
    icon: ShieldCheck,
  },
  {
    step: "04",
    title: "FEMA & Banking Flow Setup",
    description: "Step-by-step guidance on setting up NRE/NRO transaction accounts and capital routing.",
    icon: Landmark,
  },
  {
    step: "05",
    title: "Power of Attorney Setup",
    description: "Consular/embassy attestation support for registering a local POA to execute on your behalf.",
    icon: FileText,
  },
  {
    step: "06",
    title: "Remote Registration & Snagging",
    description: "Registry execution and final on-ground physical snag checking before possession.",
    icon: CheckCircle2,
  },
];

const NRI_TRUST_STATS = [
  { label: "12+ Years", sub: "In the Ahmedabad market" },
  { label: "100%", sub: "RERA-verified properties" },
  { label: "8 Countries", sub: "NRI clients served" },
  { label: "< 2 hrs", sub: "Advisory response time" },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

interface LandingPageTemplateProps {
  page: GeoLandingPage;
  properties: StaticProperty[];
  initialRates?: ExchangeRates;
  initialIsLive?: boolean;
}

export function LandingPageTemplate({ 
  page, 
  properties, 
  initialRates, 
  initialIsLive = false 
}: LandingPageTemplateProps) {
  const relatedPages = getRelatedLandingPages(page);
  const collectionHref = getLandingFilterHref(page);
  const isAdvisoryCta = collectionHref.startsWith("/contact");
  const whatsappUrl = buildWhatsAppUrl(
    env.WHATSAPP_NUMBER,
    `Hi PIKORUA Realty, I am inquiring from abroad regarding the NRI residential advisory page: "${page.title}". I would like to schedule a private video consultation.`
  );
  const parentCrumb =
    page.kind === "location"
      ? { label: "Locations", href: "/properties" }
      : page.kind === "nri"
        ? { label: "NRI Advisory", href: "/nri/nri-property-consultant-ahmedabad" }
        : { label: "Properties", href: "/properties" };

  return (
    <>
      <Header alwaysSolid />
      <main id="main-content" className="bg-lux-black text-ivory min-h-screen">

        {/* ─── HERO ─── */}
        <section className="relative min-h-[85vh] sm:min-h-[80vh] pt-24 pb-16 sm:pt-28 lg:pt-40 lg:pb-24 overflow-hidden border-b border-white/[0.06]">
          <Image
            src={page.heroImage}
            alt={page.h1}
            fill
            quality={80}
            preload
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Stronger left overlay, gentle top fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-lux-black via-lux-black/88 to-lux-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-lux-black/60 via-transparent to-lux-black/10" />
          {/* Decorative bottom fade into next section */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-lux-black to-transparent" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              {/* Breadcrumb — location pages only */}
              {page.kind !== "nri" && (
                <Breadcrumb
                  items={[
                    { label: "Home", href: "/" },
                    parentCrumb,
                    { label: page.label },
                  ]}
                />
              )}

              {/* Eyebrow */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8 bg-champagne-gold/60" aria-hidden="true" />
                <p className="text-[10px] uppercase tracking-[0.28em] text-champagne-gold font-sans">
                  {page.eyebrow}
                </p>
              </div>

              <h1
                className={
                  page.kind === "nri"
                    ? "font-display text-[clamp(1.8rem,4vw,3.6rem)] font-light uppercase tracking-wider leading-[1.05]"
                    : "font-display text-[clamp(2.4rem,5.5vw,5rem)] font-light uppercase tracking-wider leading-[1.02]"
                }
              >
                {page.h1}
              </h1>

              {/* Description — location pages only */}
              {page.kind !== "nri" && (
                <p className="mt-7 text-sm sm:text-base text-ivory/60 font-sans leading-relaxed max-w-xl">
                  {page.description}
                </p>
              )}

              <div className={`flex flex-col sm:flex-row gap-3 ${page.kind === "nri" ? "mt-8" : "mt-10"}`}>
                <Link
                  href={collectionHref}
                  className="inline-flex w-full sm:w-auto min-h-[50px] items-center justify-center px-9 py-3 text-xs font-sans uppercase tracking-[0.2em] text-lux-black bg-champagne-gold hover:bg-antique-gold transition-colors duration-200 rounded-sm"
                >
                  {isAdvisoryCta ? "Request NRI Advisory" : "View Matching Properties"}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex w-full sm:w-auto min-h-[50px] items-center justify-center px-9 py-3 text-xs font-sans uppercase tracking-[0.2em] text-champagne-gold border border-champagne-gold/45 hover:border-champagne-gold hover:bg-champagne-gold/[0.05] transition-colors duration-200 rounded-sm"
                >
                  Request Private Advisory
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── NRI TRUST STRIP ─── */}
        {page.kind === "nri" && (
          <div className="relative z-10 -mt-px border-y border-champagne-gold/10 bg-lux-black/95 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4">
                {NRI_TRUST_STATS.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`px-4 sm:px-6 py-6 sm:py-7 text-center ${
                      // On 2-col: right border on col 0 only; on 4-col: right border on cols 0-2
                      i === 0 ? "border-r border-champagne-gold/10" :
                      i === 1 ? "md:border-r md:border-champagne-gold/10" :
                      i === 2 ? "border-r border-champagne-gold/10" : ""
                    } ${
                      // Bottom border between rows on mobile 2-col
                      i < 2 ? "border-b border-champagne-gold/10 md:border-b-0" : ""
                    }`}
                  >
                    <p className="font-display text-2xl sm:text-3xl md:text-4xl text-champagne-gold font-light tracking-wide">
                      {stat.label}
                    </p>
                    <p className="mt-1 sm:mt-1.5 text-[9px] font-sans uppercase tracking-[0.18em] text-ivory/35">
                      {stat.sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── ADVISORY VIEW ─── */}
        <section className="py-20 lg:py-28 border-b border-white/[0.06]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">
            <div className="lg:col-span-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-4">
                Advisory View
              </p>
              <h2 className="font-display text-[clamp(1.5rem,3vw,2.4rem)] font-light uppercase tracking-wider leading-tight">
                What buyers should know
              </h2>
              <div className="mt-6 w-8 h-px bg-champagne-gold/40" aria-hidden="true" />
            </div>
            <div className="lg:col-span-8 space-y-8">
              <p className="text-sm sm:text-base text-ivory/65 leading-relaxed font-sans">
                {page.intro}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Market Signals */}
                <div className="border-l-2 border-champagne-gold/30 pl-5 py-1">
                  <h3 className="text-[10px] uppercase tracking-[0.22em] text-champagne-gold font-sans mb-4">
                    Market Signals
                  </h3>
                  <ul className="space-y-3 font-sans">
                    {page.marketSignals.map((item, i) => (
                      <li key={item} className="flex gap-3 items-start">
                        <span className="text-[10px] font-medium text-champagne-gold/50 mt-0.5 w-4 flex-shrink-0 font-sans tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm text-ivory/65 leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Best Fit */}
                <div className="border-l-2 border-champagne-gold/30 pl-5 py-1">
                  <h3 className="text-[10px] uppercase tracking-[0.22em] text-champagne-gold font-sans mb-4">
                    Best Fit
                  </h3>
                  <ul className="space-y-3 font-sans">
                    {page.idealFor.map((item, i) => (
                      <li key={item} className="flex gap-3 items-start">
                        <span className="text-[10px] font-medium text-champagne-gold/50 mt-0.5 w-4 flex-shrink-0 font-sans tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm text-ivory/65 leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── REMOTE PURCHASE PROCESS (NRI only) ─── */}
        {page.kind === "nri" && (
          <section
            className="relative py-20 lg:py-28 border-b border-white/[0.06] overflow-hidden bg-soft-black/30"
            aria-labelledby="remote-process-heading"
          >
            {/* Top shimmer line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-gold/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-champagne-gold/10 to-transparent" />
            {/* Radial gold ambient glow from top-left */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-champagne-gold/[0.04] blur-[120px] pointer-events-none" />
            {/* Subtle dot grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.025]"
              style={{
                backgroundImage: "radial-gradient(circle, #D4AF37 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

                {/* Left: 6-step Process Timeline */}
                <div className="lg:col-span-8 space-y-10 order-last lg:order-first">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-3">
                      Remote Advisory
                    </p>
                    <h2 id="remote-process-heading" className="font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-light uppercase tracking-wider text-white">
                      Our Remote Purchase Process
                    </h2>
                    <p className="mt-4 text-sm text-ivory/55 max-w-xl font-sans leading-relaxed">
                      We represent NRI buyers with strict adherence to RERA guidelines, clean title checks, and coordinated banking flows. Here is how we purchase safely from abroad.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {NRI_TIMELINE_STEPS.map((step) => {
                      const IconComponent = step.icon;
                      return (
                        <div
                          key={step.step}
                          className="group relative flex gap-4 items-start p-5 rounded-sm overflow-hidden border border-white/[0.07] bg-lux-black/60 hover:border-champagne-gold/30 hover:bg-lux-black/90 transition-all duration-300"
                        >
                          {/* Decorative large step number */}
                          <span
                            className="absolute right-3 bottom-2 font-display text-[6rem] leading-none font-light select-none pointer-events-none text-champagne-gold/[0.06]"
                            aria-hidden="true"
                          >
                            {step.step}
                          </span>
                          {/* Top accent line on hover */}
                          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-gold/0 to-transparent group-hover:via-champagne-gold/40 transition-all duration-500" />

                          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-champagne-gold/[0.07] border border-champagne-gold/20 rounded-sm group-hover:border-champagne-gold/50 group-hover:bg-champagne-gold/[0.12] transition-all duration-300">
                            <IconComponent className="w-4 h-4 text-champagne-gold/80" />
                          </div>
                          <div className="relative z-10">
                            <div className="flex items-baseline gap-2 mb-1.5">
                              <span className="text-[9px] font-sans font-bold text-champagne-gold/40 tracking-[0.2em]">{step.step}</span>
                              <h3 className="text-sm font-sans font-semibold text-white/90 tracking-wide">{step.title}</h3>
                            </div>
                            <p className="text-xs text-ivory/45 font-sans leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: WhatsApp / Contact Card — shown first on mobile via order */}
                <div className="lg:col-span-4 order-first lg:order-last lg:sticky lg:top-28">
                  <div className="relative overflow-hidden border border-champagne-gold/25 bg-lux-black/90 rounded-sm backdrop-blur-md shadow-2xl shadow-black/40">
                    {/* Top shimmer line */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-gold/60 to-transparent" />
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-champagne-gold/[0.03] to-transparent pointer-events-none" />

                    <div className="relative p-7 sm:p-8">
                      {/* Online status */}
                      <div className="flex items-center gap-2 mb-5">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                        </span>
                        <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-emerald-400/80">Available Now</span>
                      </div>

                      <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-champagne-gold/70 font-medium mb-2">
                        Advisory Connection
                      </p>
                      <h3 className="font-display text-[1.35rem] text-white uppercase tracking-wider leading-snug mb-3">
                        Connect with an Advisor
                      </h3>
                      <p className="text-xs text-ivory/55 font-sans leading-relaxed mb-7">
                        Schedule a timezone-friendly virtual consultation over Zoom/Meet or chat instantly on WhatsApp for real-time corridor updates.
                      </p>

                      <div className="flex flex-col gap-3">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-sm bg-[#25D366] px-5 py-3 text-xs font-sans font-semibold uppercase tracking-[0.18em] text-lux-black hover:bg-[#20ba59] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#25D366]/15 w-full"
                        >
                          <WhatsAppIcon className="h-4 w-4 flex-shrink-0" />
                          WhatsApp Advisor
                        </a>

                        <Link
                          href="/contact?purpose=nri"
                          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-champagne-gold/40 px-5 py-3 text-xs font-sans font-medium uppercase tracking-[0.18em] text-champagne-gold hover:bg-champagne-gold/[0.07] hover:border-champagne-gold transition-colors duration-200 w-full"
                        >
                          Request Virtual Call
                        </Link>
                      </div>

                      <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                        <p className="text-[9px] font-sans text-ivory/35 uppercase tracking-[0.15em]">
                          Typical response
                        </p>
                        <p className="text-[10px] font-sans text-champagne-gold/60 font-medium">
                          &lt; 2 hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* ─── MATCHING RESIDENCES ─── */}
        <section className="py-20 lg:py-28 border-b border-white/[0.06]" aria-labelledby="matching-properties-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-3">
                  Private Collection
                </p>
                <h2
                  id="matching-properties-heading"
                  className="font-display text-[clamp(1.4rem,2.6vw,2.2rem)] font-light uppercase tracking-wider"
                >
                  Matching Residences
                </h2>
              </div>
              <Link
                href={collectionHref}
                className="group inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.18em] text-champagne-gold hover:text-antique-gold transition-colors"
              >
                {isAdvisoryCta ? "Request Advisory" : "View Filtered Collection"}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </div>

            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {properties.slice(0, 6).map((property) => (
                  <Link
                    key={property.id}
                    href={`/properties/${property.slug}`}
                    className="group block border border-white/[0.07] bg-soft-black/50 rounded-sm overflow-hidden hover:border-champagne-gold/35 hover:shadow-[0_4px_32px_0_rgba(212,175,55,0.05)] transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] bg-soft-black overflow-hidden">
                      <Image
                        src={property.coverImage}
                        alt={`${property.configuration} in ${property.locationLabel}`}
                        fill
                        quality={75}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-600"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-lux-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-champagne-gold/80 font-sans mb-2">
                        {property.locationLabel}
                      </p>
                      <h3 className="font-display text-lg text-ivory uppercase tracking-wide leading-tight">
                        {property.configuration}
                      </h3>
                      <p className="mt-2 text-sm text-ivory/50 font-sans">{property.sizeRange}</p>
                      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
                        <span className="text-xs text-ivory/40 font-sans">
                          {RESIDENTIAL_CATEGORY_LABELS[property.category]}
                        </span>
                        <span className="text-xs text-champagne-gold/80 font-sans uppercase tracking-[0.14em]">
                          {PROPERTY_STATUS_LABELS[property.status]}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="border border-white/[0.07] rounded-sm p-8 bg-soft-black/40">
                <p className="text-sm text-ivory/65 font-sans leading-relaxed max-w-2xl">
                  Public inventory for this brief is intentionally limited. Share your requirement and PIKORUA Realty can review private or off-market options aligned with this search.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ─── NRI CURRENCY CALCULATOR (NRI only) ─── */}
        {page.kind === "nri" && (
          <section className="py-20 lg:py-24 border-b border-white/[0.06]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-3">
                    Investment Value
                  </p>
                  <h2 className="font-display text-[clamp(1.4rem,2.6vw,2.2rem)] font-light uppercase tracking-wider">
                    Currency Converter
                  </h2>
                </div>
                <p className="text-xs text-ivory/40 font-sans max-w-xs leading-relaxed">
                  See what Ahmedabad luxury properties cost in your home currency, updated with live mid-market rates.
                </p>
              </div>
              <NriCurrencyConverter initialRates={initialRates} initialIsLive={initialIsLive} />
            </div>
          </section>
        )}

        {/* ─── MARKET INTELLIGENCE ─── */}
        {page.bodyContent && page.bodyContent.length > 0 && (
          <section
            className="py-20 lg:py-28 border-b border-white/[0.06]"
            aria-labelledby="market-intelligence-heading"
          >
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 flex flex-col items-start gap-3">
                <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans">
                  Market Intelligence
                </p>
                <div className="w-6 h-px bg-champagne-gold/40" aria-hidden="true" />
                <h2
                  id="market-intelligence-heading"
                  className="font-display text-[clamp(1.4rem,2.6vw,2rem)] font-light uppercase tracking-wider"
                >
                  {page.label} — Advisory Guide
                </h2>
              </div>
              <div className="space-y-6">
                {page.bodyContent.map((paragraph, index) => {
                  const isHeading = paragraph.startsWith("### ");
                  if (isHeading) {
                    return (
                      <h3
                        key={index}
                        className="font-display text-lg text-champagne-gold uppercase tracking-wide pt-4 first:pt-0"
                      >
                        {paragraph.replace(/^### /, "")}
                      </h3>
                    );
                  }
                  return (
                    <p
                      key={index}
                      className="text-sm sm:text-base text-ivory/65 font-sans leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Compliance & Reference Sources */}
              {page.kind === "location" && (
                <div className="mt-12 pt-8 border-t border-white/[0.06]">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-champagne-gold/60 font-sans mb-4">
                    Regulatory & Compliance Resources
                  </p>
                  <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs font-sans">
                    <a
                      href="https://gujrera.gujarat.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ivory/50 hover:text-champagne-gold transition-colors duration-150 flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-champagne-gold/60" />
                      Verify Projects on Gujarat RERA Portal &rarr;
                    </a>
                    <a
                      href="https://ahmedabadcity.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ivory/50 hover:text-champagne-gold transition-colors duration-150 flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-champagne-gold/60" />
                      Ahmedabad Municipal Corporation (AMC) Portal &rarr;
                    </a>
                    {page.wikipediaUrl && (
                      <a
                        href={page.wikipediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ivory/50 hover:text-champagne-gold transition-colors duration-150 flex items-center gap-1.5"
                      >
                        <span className="w-1 h-1 rounded-full bg-champagne-gold/60" />
                        Explore {page.label} Wiki Geography &rarr;
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ─── FAQ (2-col on desktop for NRI, centered otherwise) ─── */}
        <section
          className="py-20 lg:py-28 border-b border-white/[0.06]"
          aria-labelledby="landing-faq-heading"
        >
          {page.kind === "nri" ? (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 lg:items-center">
                {/* Left heading column */}
                <div className="lg:col-span-4">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-4">
                    Common Questions
                  </p>
                  <h2
                    id="landing-faq-heading"
                    className="font-display text-[clamp(1.4rem,2.6vw,2.2rem)] font-light uppercase tracking-wider leading-tight"
                  >
                    Advisory FAQ
                  </h2>
                  <div className="mt-5 w-8 h-px bg-champagne-gold/40" aria-hidden="true" />
                  <p className="mt-5 text-sm text-ivory/50 font-sans leading-relaxed">
                    Everything you need to know about buying property in Ahmedabad as an NRI — from FEMA rules to repatriation of funds.
                  </p>
                </div>
                {/* Right accordion column */}
                <div className="lg:col-span-8 lg:border-l lg:border-white/[0.06] lg:pl-14">
                  <FaqAccordion items={page.faqs} />
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-3">
                  Common Questions
                </p>
                <h2
                  id="landing-faq-heading"
                  className="font-display text-[clamp(1.4rem,2.6vw,2rem)] font-light uppercase tracking-wider"
                >
                  Advisory FAQ
                </h2>
              </div>
              <FaqAccordion items={page.faqs} />
            </div>
          )}
        </section>

        {/* ─── RELATED GUIDES ─── */}
        {relatedPages.length > 0 && (
          <section className="py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-8">
                Related Guides
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPages.map((related) => (
                  <Link
                    key={related.href}
                    href={related.href}
                    className="group relative overflow-hidden border border-white/[0.07] rounded-sm p-6 hover:border-champagne-gold/35 hover:bg-gradient-to-br hover:from-champagne-gold/[0.04] hover:to-transparent transition-all duration-300"
                  >
                    <span className="text-[9px] uppercase tracking-[0.2em] text-ivory/30 font-sans">
                      {related.eyebrow}
                    </span>
                    <h3 className="mt-3 font-display text-lg uppercase tracking-wide text-ivory group-hover:text-champagne-gold transition-colors duration-200 leading-snug pr-6">
                      {related.label}
                    </h3>
                    <ArrowRight className="absolute bottom-5 right-5 w-4 h-4 text-champagne-gold/0 group-hover:text-champagne-gold/60 group-hover:translate-x-0.5 transition-all duration-300" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

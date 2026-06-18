import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyEnquiryForm } from "@/components/property/PropertyEnquiryForm";
import { STATIC_PROPERTIES } from "@/lib/data/properties";
import { getSupabasePropertyBySlug, getSupabaseAllPropertySlugs } from "@/lib/supabase/queries";
import { PROPERTY_STATUS_LABELS, RESIDENTIAL_CATEGORY_LABELS } from "@/types";
import { MapPin, ArrowLeft, ShieldCheck, Clock, Building } from "lucide-react";
import { renderFormattedText } from "@/lib/utils";

const LOCATION_COORDINATES: Record<string, { latitude: string; longitude: string }> = {
  "iskon-ambli": { latitude: "23.0246", longitude: "72.5074" },
  "sindhu-bhavan": { latitude: "23.0392", longitude: "72.5071" },
  "thaltej": { latitude: "23.0500", longitude: "72.5167" },
  "shilaj": { latitude: "23.0395", longitude: "72.4764" },
  "vaishno-devi": { latitude: "23.1250", longitude: "72.5414" },
  "sg-highway": { latitude: "23.0287", longitude: "72.5068" },
};

const DEFAULT_COORDINATES = { latitude: "23.0225", longitude: "72.5714" }; // Ahmedabad center

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  let dbSlugs: string[] = [];
  try {
    dbSlugs = await getSupabaseAllPropertySlugs();
  } catch (err) {
    console.error("Error fetching slugs for static params:", err);
  }
  const staticSlugs = STATIC_PROPERTIES.map((property) => property.slug);
  const allSlugs = Array.from(new Set([...dbSlugs, ...staticSlugs]));
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  let property = await getSupabasePropertyBySlug(slug);
  if (!property) {
    property = STATIC_PROPERTIES.find((p) => p.slug === slug) || null;
  }
  if (!property) return {};

  const title = property.seoTitle || `${property.configuration} · ${property.sizeRange} in ${property.locationLabel} | PIKORUA Realty`;
  const description = property.seoDescription || property.description?.[0] || 
    `Explore this exclusive ${property.configuration} · ${property.sizeRange} located in ${property.locationLabel}, Ahmedabad. Request private details from PIKORUA Realty.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://pikorua.in/properties/${property.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://pikorua.in/properties/${property.slug}`,
      images: property.coverImage ? [{ url: property.coverImage }] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  let property = await getSupabasePropertyBySlug(slug);
  if (!property) {
    property = STATIC_PROPERTIES.find((p) => p.slug === slug) || null;
  }

  if (!property) {
    notFound();
  }


  const categoryLabel = RESIDENTIAL_CATEGORY_LABELS[property.category] || "Luxury Residence";
  const statusLabel = PROPERTY_STATUS_LABELS[property.status];
  const allImages = property.images && property.images.length > 0 ? property.images : [property.coverImage];

  const coords = LOCATION_COORDINATES[property.location] || DEFAULT_COORDINATES;
  const priceDisplay = property.priceOnRequest ? "Price on Request" : (property.price || "Price on Request");

  // Schema: SingleFamilyResidence
  const residenceSchema = {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    "name": `${property.configuration} · ${property.sizeRange} in ${property.locationLabel}`,
    "description": property.description?.[0] || "",
    "image": property.coverImage,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": coords.latitude,
      "longitude": coords.longitude
    }
  };

  // Schema: BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://pikorua.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Properties",
        "item": "https://pikorua.in/properties"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": property.name,
        "item": `https://pikorua.in/properties/${property.slug}`
      }
    ]
  };

  return (
    <>
      {/* Dynamic JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(residenceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header alwaysSolid />
      <main id="main-content" className="bg-lux-black text-ivory min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-20">
          
          {/* Breadcrumbs & Back Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <Link
              href="/properties"
              className="group inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.2em] text-champagne-gold/70 hover:text-champagne-gold transition-colors duration-150"
            >
              <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Collection
            </Link>

            <nav aria-label="Breadcrumb" className="text-[10px] font-sans text-ivory/30 uppercase tracking-[0.15em] flex items-center gap-1.5">
              <Link href="/" className="hover:text-ivory/60 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/properties" className="hover:text-ivory/60 transition-colors">Properties</Link>
              <span>/</span>
              <span className="text-champagne-gold/80">{property.name}</span>
            </nav>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column — Title, Gallery, Description, Highlights */}
            <div className="lg:col-span-7 space-y-10">
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-champagne-gold font-sans font-medium">
                    {categoryLabel}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-ivory/40">
                    {property.locationLabel}
                  </span>
                </div>
                
                <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-normal text-white leading-tight uppercase tracking-wider">
                  {property.configuration} · {property.sizeRange}
                </h1>

                <p className="text-xs font-sans text-ivory/40 uppercase tracking-[0.12em] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-champagne-gold/50" />
                  Ahmedabad, India
                </p>
              </div>

              {/* Image Gallery */}
              <PropertyGallery images={allImages} name={property.configuration} />

              {/* Description */}
              <div className="space-y-6 pt-4 border-t border-white/[0.06]">
                <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-champagne-gold font-medium">
                  About the Residence
                </h2>
                <div className="font-sans text-ivory/60 text-sm leading-[1.8] space-y-6 font-light">
                  {property.description?.map((paragraph, idx) => {
                    const isHeading = paragraph.startsWith("### ");
                    const isListItem = paragraph.startsWith("- ") || paragraph.startsWith("* ");

                    if (isHeading) {
                      return (
                        <h4 
                          key={idx}
                          className="font-display text-sm text-white uppercase tracking-wider mt-8 mb-3 font-normal"
                          dangerouslySetInnerHTML={{ __html: renderFormattedText(paragraph.substring(4)) }}
                        />
                      );
                    }

                    if (isListItem) {
                      return (
                        <div key={idx} className="flex items-start gap-2.5 my-2 pl-4 text-ivory/70">
                          <span className="w-1 h-1 rounded-full bg-champagne-gold/75 mt-2 flex-shrink-0 animate-pulse" />
                          <span dangerouslySetInnerHTML={{ __html: renderFormattedText(paragraph.substring(2)) }} />
                        </div>
                      );
                    }

                    return (
                      <p 
                        key={idx} 
                        dangerouslySetInnerHTML={{ __html: renderFormattedText(paragraph) }}
                      />
                    );
                  })}
                  {!property.description && (
                    <p>
                      An exclusive premium {categoryLabel.toLowerCase()} designed to maximize space, privacy, and architectural distinction. 
                      Situated in the high-end {property.locationLabel} corridor, this {property.configuration} residence of {property.sizeRange} represents 
                      a unique investment and lifestyle option for HNI and NRI buyers seeking quality, privacy, and discretion in Ahmedabad.
                    </p>
                  )}
                </div>
              </div>

              {/* Highlights */}
              {property.highlights && property.highlights.length > 0 && (
                <div className="space-y-5 pt-4">
                  <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-champagne-gold font-medium">
                    Property Highlights
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-ivory/70 leading-relaxed font-light">
                    {property.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start">
                        <ShieldCheck className="w-4 h-4 text-champagne-gold/75 flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column — Specifications & Form Sidebar */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
              
              {/* Specifications Block */}
              <div className="bg-soft-black border border-white/[0.06] p-6 sm:p-8 rounded-md space-y-6">
                <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-champagne-gold font-medium">
                  Specifications
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="block text-[9px] uppercase tracking-[0.15em] text-ivory/45 font-sans mb-1.5">
                      Configuration
                    </span>
                    <span className="text-sm font-sans text-white/90 font-medium">
                      {property.configuration}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[9px] uppercase tracking-[0.15em] text-ivory/45 font-sans mb-1.5">
                      Dimensions
                    </span>
                    <span className="text-sm font-sans text-white/90 font-medium">
                      {property.sizeRange}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[9px] uppercase tracking-[0.15em] text-ivory/45 font-sans mb-1.5">
                      Status
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-champagne-gold opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-champagne-gold" />
                      </span>
                      <span className="text-xs font-sans text-white/90 uppercase tracking-wider">
                        {statusLabel}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="block text-[9px] uppercase tracking-[0.15em] text-ivory/45 font-sans mb-1.5">
                      Price Guide
                    </span>
                    <span className="text-sm font-sans text-champagne-gold font-medium uppercase tracking-wider">
                      {priceDisplay}
                    </span>
                  </div>
                </div>

                {/* Additional Spec Details */}
                <div className="pt-4 border-t border-white/[0.06] space-y-3 text-[11px] font-sans text-ivory/50 font-light">
                  {property.builtUpArea && (
                    <div className="flex justify-between">
                      <span>Built Up Area:</span>
                      <span className="text-ivory/80">{property.builtUpArea}</span>
                    </div>
                  )}
                  {property.plotArea && (
                    <div className="flex justify-between">
                      <span>Plot Area:</span>
                      <span className="text-ivory/80">{property.plotArea}</span>
                    </div>
                  )}
                  {property.floor && (
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <span className="text-ivory/80">{property.floor}</span>
                    </div>
                  )}
                  {property.suitableFor && (
                    <div className="flex justify-between items-start gap-4">
                      <span className="whitespace-nowrap">Ideal For:</span>
                      <span className="text-ivory/80 text-right">{property.suitableFor}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pre-filled Enquiry Form */}
              <PropertyEnquiryForm
                propertySlug={property.slug}
                propertyName={`${property.configuration} · ${property.sizeRange}`}
                locationLabel={property.locationLabel}
              />
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

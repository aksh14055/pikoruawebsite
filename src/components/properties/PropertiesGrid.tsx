"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { StaticProperty } from "@/lib/data/properties";
import { LOCATION_LABELS, LOCATION_SLUGS, RESIDENTIAL_CATEGORY_LABELS } from "@/types";
import type { LocationSlug, ResidentialCategory } from "@/types";
import { propertyMatchesCategoryIntent } from "@/lib/propertyFilters";
import { ExpandedDetailPanel } from "@/components/home/FeaturedResidencesGrid";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FILTERS: { label: string; value: "" | ResidentialCategory }[] = [
  { label: "All", value: "" },
  { label: "Apartments", value: "apartment" },
  { label: "Penthouses", value: "penthouse" },
  { label: "Duplexes", value: "duplex" },
  { label: "Villas", value: "villa" },
  { label: "Bungalows", value: "bungalow" },
  { label: "Plots", value: "plot" },
  { label: "Investment", value: "investment" },
];

const FILTER_VALUES = new Set<ResidentialCategory>(
  FILTERS.map((filter) => filter.value).filter((value): value is ResidentialCategory => Boolean(value))
);
const LOCATION_VALUES = new Set<LocationSlug>(LOCATION_SLUGS);

function getFilterFromUrl(): "" | ResidentialCategory {
  if (typeof window === "undefined") return "";
  const category = new URLSearchParams(window.location.search).get("category");
  return category && FILTER_VALUES.has(category as ResidentialCategory) ? (category as ResidentialCategory) : "";
}

function getLocationFromUrl(): "" | LocationSlug {
  if (typeof window === "undefined") return "";
  const location = new URLSearchParams(window.location.search).get("location");
  return location && LOCATION_VALUES.has(location as LocationSlug) ? (location as LocationSlug) : "";
}

function getCollectionUrl(filter: "" | ResidentialCategory, location: "" | LocationSlug): string {
  const params = new URLSearchParams();
  if (filter) params.set("category", filter);
  if (location) params.set("location", location);
  const query = params.toString();
  return query ? `/properties?${query}` : "/properties";
}

interface PropertiesGridProps {
  properties: StaticProperty[];
}

export function PropertiesGrid({ properties: currentProperties }: PropertiesGridProps) {
  const [activeFilter, setActiveFilter] = useState<"" | ResidentialCategory>("");
  const [activeLocation, setActiveLocation] = useState<"" | LocationSlug>("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  // Sync expanded property from URL path or query on load & listen to popstate
  useEffect(() => {
    const handleUrlSync = () => {
      setActiveFilter(getFilterFromUrl());
      setActiveLocation(getLocationFromUrl());

      const pathParts = window.location.pathname.split("/").filter(Boolean);
      // Path format: /properties/[slug]
      if (pathParts[0] === "properties" && pathParts[1]) {
        const found = currentProperties.find((p) => p.slug === pathParts[1]);
        if (found) {
          setExpandedSlug(found.slug);
          return;
        }
      }

      // Query parameter fallback (?property=slug)
      const params = new URLSearchParams(window.location.search);
      const propSlug = params.get("property");
      if (propSlug) {
        const found = currentProperties.find((p) => p.slug === propSlug);
        if (found) {
          setExpandedSlug(found.slug);
          return;
        }
      }

      setExpandedSlug(null);
    };

    handleUrlSync();

    window.addEventListener("popstate", handleUrlSync);
    return () => window.removeEventListener("popstate", handleUrlSync);
  }, [currentProperties]);

  // Prevent scroll on body when modal is open
  useEffect(() => {
    if (expandedSlug) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [expandedSlug]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpandedSlug(null);
        window.history.pushState(null, "", getCollectionUrl(activeFilter, activeLocation));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeFilter, activeLocation]);

  const handleToggleExpand = (slug: string) => {
    if (expandedSlug === slug) {
      setExpandedSlug(null);
      window.history.pushState(null, "", getCollectionUrl(activeFilter, activeLocation));
    } else {
      setExpandedSlug(slug);
      window.history.pushState(null, "", `/properties/${slug}`);
    }
  };

  const handleCloseProperty = () => {
    setExpandedSlug(null);
    window.history.pushState(null, "", getCollectionUrl(activeFilter, activeLocation));
  };

  const handleFilterChange = (filter: "" | ResidentialCategory) => {
    setActiveFilter(filter);
    setExpandedSlug(null);
    window.history.pushState(null, "", getCollectionUrl(filter, activeLocation));
  };

  const handleLocationClear = () => {
    setActiveLocation("");
    setExpandedSlug(null);
    window.history.pushState(null, "", getCollectionUrl(activeFilter, ""));
  };

  const filtered = currentProperties.filter((property) => {
    const matchesCategory = activeFilter ? propertyMatchesCategoryIntent(property, activeFilter) : true;
    const matchesLocation = activeLocation ? property.location === activeLocation : true;
    return matchesCategory && matchesLocation;
  });

  const activeProperty = currentProperties.find((p) => p.slug === expandedSlug);

  return (
    <>
      {/* Filter strip */}
      <div className="bg-lux-black border-b border-white/[0.06] sticky top-[64px] lg:top-[80px] z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleFilterChange(f.value)}
                className={cn(
                  "flex-shrink-0 px-5 py-2 text-[11px] font-sans uppercase tracking-[0.15em] border transition-all duration-150 rounded-sm",
                  activeFilter === f.value
                    ? "border-champagne-gold/60 text-ivory bg-champagne-gold/10"
                    : "border-white/[0.08] text-ivory/50 hover:border-white/20 hover:text-ivory"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          {activeLocation && (
            <div className="pb-4 flex items-center gap-3">
              <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-ivory/45">
                Corridor: <span className="text-champagne-gold">{LOCATION_LABELS[activeLocation]}</span>
              </span>
              <button
                type="button"
                onClick={handleLocationClear}
                className="text-[10px] font-sans uppercase tracking-[0.16em] text-ivory/35 hover:text-ivory transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <section className="bg-lux-black py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-start">
            {filtered.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isExpanded={expandedSlug === property.slug}
                onToggle={() => handleToggleExpand(property.slug)}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="border border-white/[0.07] bg-soft-black/40 rounded-sm p-8 text-center">
              <p className="text-sm text-ivory/55 font-sans">
                No public matches for this filter. Request private advisory for off-market options.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center justify-center px-6 py-3 text-xs font-sans uppercase tracking-[0.18em] text-champagne-gold border border-champagne-gold/35 hover:border-champagne-gold transition-colors rounded-sm"
              >
                Start Private Search
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Centered Popup Modal */}
      <AnimatePresence>
        {activeProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={handleCloseProperty}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[1160px] h-[90vh] sm:h-[85vh] md:h-[80vh] max-h-[90vh] bg-lux-black border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col md:flex-row z-10 focus:outline-none"
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
            >
              <ExpandedDetailPanel property={activeProperty} onClose={handleCloseProperty} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

interface PropertyCardProps {
  property: StaticProperty;
  isExpanded: boolean;
  onToggle: () => void;
}

function PropertyCard({ property, isExpanded, onToggle }: PropertyCardProps) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const images = property.images && property.images.length > 0 ? property.images : [property.coverImage];

  useEffect(() => {
    if (!isHovered || images.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentImgIdx((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImgIdx(0);
    setDirection(1);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(-1);
    setCurrentImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(1);
    setCurrentImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const cardImgVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
      scale: 1.01,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 220, damping: 26 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.7, ease: "easeOut" as const },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      scale: 0.99,
      transition: {
        x: { type: "spring" as const, stiffness: 220, damping: 26 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.7, ease: "easeIn" as const },
      },
    }),
  };

  return (
    <motion.div
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.025 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "group block bg-soft-black border focus-visible:outline-2 focus-visible:outline-champagne-gold text-left cursor-pointer rounded-sm overflow-hidden",
        isExpanded 
          ? "border-white/[0.15] shadow-[0_0_30px_rgba(0,0,0,0.15)]" 
          : "border-white/[0.06] hover:border-white/[0.14]"
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-soft-black border-b border-white/[0.02]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentImgIdx}
            custom={direction}
            variants={cardImgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            {images[currentImgIdx] ? (
              <Image
                src={images[currentImgIdx]}
                alt={RESIDENTIAL_CATEGORY_LABELS[property.category]}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                priority={currentImgIdx === 0}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-soft-black via-lux-black to-soft-black flex items-center justify-center">
                <span className="text-[9px] uppercase tracking-[0.2em] text-champagne-gold/40 font-sans text-center px-4">
                  Preview on<br />Request
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators (Dots) */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {images.map((_, idx) => (
              <div
                key={idx}
                className="relative w-3 h-1.5 flex items-center justify-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (idx === currentImgIdx) return;
                  setDirection(idx > currentImgIdx ? 1 : -1);
                  setCurrentImgIdx(idx);
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/30 transition-colors duration-300" />
                {idx === currentImgIdx && (
                  <motion.span
                    layoutId={`activeDot-grid-${property.id}`}
                    className="absolute w-3 h-1.5 rounded-full bg-champagne-gold"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-25 p-1 rounded-full bg-lux-black/75 border border-white/10 text-ivory opacity-0 group-hover:opacity-100 hover:bg-champagne-gold hover:text-lux-black hover:scale-105 transition-all duration-300"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-25 p-1 rounded-full bg-lux-black/75 border border-white/10 text-ivory opacity-0 group-hover:opacity-100 hover:bg-champagne-gold hover:text-lux-black hover:scale-105 transition-all duration-300"
              aria-label="Next image"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="mb-2.5">
          <h2 className="font-display text-[14px] lg:text-[15px] font-normal text-ivory leading-tight group-hover:text-champagne-gold transition-colors duration-200 uppercase tracking-wider">
            <span className="block">{property.configuration}</span>
            <span className="block text-xs font-sans text-champagne-gold/90 mt-1.5 normal-case tracking-normal">{property.sizeRange}</span>
          </h2>
          <p className="text-xs font-sans text-ivory/40 uppercase tracking-[0.12em] mt-1.5">
            {property.locationLabel}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-3">
          <span className="text-xs font-sans text-ivory/50">
            {RESIDENTIAL_CATEGORY_LABELS[property.category]}
          </span>
          <Link
            href={`/properties/${property.slug}`}
            onClick={(event) => event.stopPropagation()}
            className="text-xs font-sans uppercase tracking-[0.12em] text-ivory/40 group-hover:text-champagne-gold/80 flex items-center gap-1 transition-all duration-300"
          >
            Details
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

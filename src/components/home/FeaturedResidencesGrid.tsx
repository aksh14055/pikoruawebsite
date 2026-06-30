"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn, renderFormattedText } from "@/lib/utils";
import { type StaticProperty } from "@/lib/data/properties";
import { PROPERTY_STATUS_LABELS } from "@/types";
import { MapPin, Compass, X, ChevronLeft, ChevronRight } from "lucide-react";

// Category mappings required by the prompt
const DISPLAY_CATEGORY_LABELS: Record<string, string> = {
  apartment: "Apartment",
  penthouse: "Penthouse",
  duplex: "Duplex",
  villa: "Villa",
  bungalow: "Villa",
  plot: "Plot / Land",
  investment: "Investment Property",
  "residential-investment": "Investment Property",
};

interface FeaturedResidencesGridProps {
  properties: StaticProperty[];
}

export function FeaturedResidencesGrid({ properties }: FeaturedResidencesGridProps) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  // Spotlight index state
  const [activeTopIndex, setActiveTopIndex] = useState(0);
  const [activeTopImageIndex, setActiveTopImageIndex] = useState(0);
  const [topDirection, setTopDirection] = useState(1);
  const [isTopPaused, setIsTopPaused] = useState(false);

  // Sync expanded property from URL path or query on load & listen to popstate
  useEffect(() => {
    const handleUrlSync = () => {
      const pathParts = window.location.pathname.split("/").filter(Boolean);
      // Path format: /properties/[slug]
      if (pathParts[0] === "properties" && pathParts[1]) {
        const found = properties.find((p) => p.slug === pathParts[1]);
        if (found) {
          setExpandedSlug(found.slug);
          return;
        }
      }

      // Query parameter fallback (?property=slug)
      const params = new URLSearchParams(window.location.search);
      const propSlug = params.get("property");
      if (propSlug) {
        const found = properties.find((p) => p.slug === propSlug);
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
  }, [properties]);

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
        window.history.pushState(null, "", "/");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleExpand = (slug: string) => {
    if (expandedSlug === slug) {
      setExpandedSlug(null);
      window.history.pushState(null, "", "/");
    } else {
      setExpandedSlug(slug);
      window.history.pushState(null, "", `/properties/${slug}`);
    }
  };

  const handleCloseProperty = () => {
    setExpandedSlug(null);
    window.history.pushState(null, "", "/");
  };

  const activeProperty = properties.find((p) => p.slug === expandedSlug);

  // Pin specific top 3 spotlight properties in exact order
  const ikebanaProp = properties.find((p) => p.id === "ikebana");
  const maruti360Prop = properties.find((p) => p.id === "maruti-360");
  const anamikaProp = properties.find((p) => p.id === "anamika");

  const top3 = [ikebanaProp, maruti360Prop, anamikaProp].filter(Boolean) as StaticProperty[];

  // Seamless infinite strip: a tripled list scrolled natively, snapped back into the middle
  // copy whenever it drifts into an outer copy (invisible since all three copies are identical).
  const manualMarqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = manualMarqueeRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth / 3;
  }, [properties]);

  useEffect(() => {
    const el = manualMarqueeRef.current;
    if (!el) return;
    const handleScroll = () => {
      const oneSet = el.scrollWidth / 3;
      if (el.scrollLeft < oneSet * 0.1) {
        el.scrollLeft += oneSet;
      } else if (el.scrollLeft > oneSet * 1.9) {
        el.scrollLeft -= oneSet;
      }
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMarqueeNav = (dir: 1 | -1) => {
    manualMarqueeRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  // Autoplay spotlight property index
  useEffect(() => {
    if (isTopPaused || top3.length <= 1) return;
    const interval = setInterval(() => {
      setTopDirection(1);
      setActiveTopIndex((prev) => (prev + 1) % top3.length);
      setActiveTopImageIndex(0);
    }, 5000);
    return () => clearInterval(interval);
  }, [isTopPaused, top3.length]);

  const activeTopProp = top3[activeTopIndex];
  const activePropertyImages = activeTopProp
    ? (activeTopProp.images && activeTopProp.images.length > 0 ? activeTopProp.images : [activeTopProp.coverImage])
    : [];

  const topCategoryLabel = activeTopProp
    ? DISPLAY_CATEGORY_LABELS[activeTopProp.category] || "Luxury Residence"
    : "";
  const topPriceDisplay = activeTopProp
    ? (activeTopProp.priceOnRequest ? "Price on Request" : (activeTopProp.price || "Price on Request"))
    : "";
  const topPrimaryDesc = activeTopProp
    ? (activeTopProp.description?.[0] ?? "").split(/(?<=\.)\s+/)[0] || ""
    : "";

  const handlePrevSpotlight = () => {
    setTopDirection(-1);
    setActiveTopIndex((prev) => (prev === 0 ? top3.length - 1 : prev - 1));
    setActiveTopImageIndex(0);
  };

  const handleNextSpotlight = () => {
    setTopDirection(1);
    setActiveTopIndex((prev) => (prev === top3.length - 1 ? 0 : prev + 1));
    setActiveTopImageIndex(0);
  };

  const handlePrevTopImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTopDirection(-1);
    setActiveTopImageIndex((prev) => (prev === 0 ? activePropertyImages.length - 1 : prev - 1));
  };

  const handleNextTopImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTopDirection(1);
    setActiveTopImageIndex((prev) => (prev === activePropertyImages.length - 1 ? 0 : prev + 1));
  };

  const luxuryEase = [0.65, 0, 0.35, 1] as const;

  const spotlightImgVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 24 : -24,
      opacity: 0,
      scale: 1.06,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { duration: 1.1, ease: luxuryEase },
        opacity: { duration: 0.9, ease: luxuryEase },
        scale: { duration: 1.4, ease: luxuryEase },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -24 : 24,
      opacity: 0,
      scale: 0.97,
      transition: {
        x: { duration: 0.9, ease: luxuryEase },
        opacity: { duration: 0.7, ease: luxuryEase },
        scale: { duration: 0.9, ease: luxuryEase },
      },
    }),
  };

  const spotlightSlideVariants = {
    enter: () => ({
      opacity: 0,
    }),
    center: {
      opacity: 1,
      transition: {
        opacity: { duration: 0.4, ease: luxuryEase },
      },
    },
    exit: () => ({
      opacity: 0,
      transition: {
        opacity: { duration: 0.25, ease: luxuryEase },
      },
    }),
  };

  return (
    <div className="relative">
      {/* Dynamic Single Spotlight Showcase */}
      {activeTopProp && (
        <div
          onMouseEnter={() => setIsTopPaused(true)}
          onMouseLeave={() => setIsTopPaused(false)}
          className="relative mb-20 w-full overflow-visible group/spotlight"
        >
          {/* Spotlight Property Navigation Controls — corners, matching image carousel positioning */}
          {top3.length > 1 && (
            <>
              <button
                onClick={handlePrevSpotlight}
                className="absolute left-2 lg:-left-16 xl:-left-20 top-[175px] lg:top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white/80 hover:text-lux-black bg-lux-black/70 hover:bg-champagne-gold backdrop-blur-sm border border-white/20 hover:border-champagne-gold shadow-lg shadow-black/30 transition-all duration-300 hover:scale-105 cursor-pointer"
                aria-label="Previous property"
              >
                <ChevronLeft className="w-5 h-5 stroke-2" />
              </button>
              <button
                onClick={handleNextSpotlight}
                className="absolute right-2 lg:-right-16 xl:-right-20 top-[175px] lg:top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white/80 hover:text-lux-black bg-lux-black/70 hover:bg-champagne-gold backdrop-blur-sm border border-white/20 hover:border-champagne-gold shadow-lg shadow-black/30 transition-all duration-300 hover:scale-105 cursor-pointer"
                aria-label="Next property"
              >
                <ChevronRight className="w-5 h-5 stroke-2" />
              </button>
            </>
          )}
          <div className="relative w-full overflow-hidden [clip-path:inset(0)]">
            <AnimatePresence initial={false} custom={topDirection} mode="wait">
              <motion.div
                key={activeTopIndex}
                custom={topDirection}
                variants={spotlightSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col lg:flex-row h-auto lg:h-[620px] w-full group gap-8 lg:gap-12"
              >
          {/* Left: Cinematic Image Carousel */}
          <div className="w-full lg:w-[58%] h-[350px] lg:h-full relative overflow-hidden bg-lux-black group/spotlight-img">
            <AnimatePresence initial={false} custom={topDirection}>
              {activePropertyImages.length > 0 && (
                <motion.div
                  key={`${activeTopIndex}-${activeTopImageIndex}`}
                  custom={topDirection}
                  variants={spotlightImgVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={activePropertyImages[activeTopImageIndex]}
                    alt={`${activeTopProp.configuration} Spotlight image`}
                    fill
                    quality={75}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center scale-[1.04]"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-transparent pointer-events-none z-10" />

            {/* Carousel Arrows (within the active property's images) */}
            {activePropertyImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevTopImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center text-white/35 hover:text-white bg-black/20 hover:bg-black/50 border border-white/[0.07] hover:border-white/20 transition-all duration-250 lg:opacity-0 lg:group-hover/spotlight-img:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
                </button>
                <button
                  onClick={handleNextTopImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center text-white/35 hover:text-white bg-black/20 hover:bg-black/50 border border-white/[0.07] hover:border-white/20 transition-all duration-250 lg:opacity-0 lg:group-hover/spotlight-img:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4 stroke-[1.5]" />
                </button>
              </>
            )}

            {/* Bottom bar: Private Collection label + counter */}
            <div className="absolute bottom-6 left-7 right-7 z-20 flex items-end justify-between pointer-events-none">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-champagne-gold/60 font-sans">
                Private Collection
              </span>
              {activePropertyImages.length > 1 && (
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/30 font-sans tabular-nums">
                  {String(activeTopImageIndex + 1).padStart(2, "0")} / {String(activePropertyImages.length).padStart(2, "0")}
                </span>
              )}
            </div>

          </div>

          {/* Right: Premium Editorial Info Card */}
          <div className="w-full lg:w-[42%] flex flex-col h-auto lg:h-full text-left">
            {/* Top content block */}
            <div className="flex-1">
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-champagne-gold/75 font-sans font-medium">{activeTopProp.locationLabel}</span>
              </div>

              {/* Title */}
              <h2 className="font-display text-[1.4rem] sm:text-[1.8rem] md:text-[2.2rem] font-light text-white tracking-wide leading-tight mb-3 uppercase">
                <span className="block">{activeTopProp.configuration}</span>
                <span className="block text-sm sm:text-base text-champagne-gold/90 font-sans mt-2 normal-case tracking-normal font-normal">{activeTopProp.sizeRange}</span>
              </h2>

              {/* Gold rule */}
              <div className="w-9 h-px bg-champagne-gold/40 mb-3" />

              {/* Description */}
              <div className="space-y-3 mb-4">
                <p
                  className="font-sans text-xs sm:text-sm text-ivory/60 leading-relaxed font-light"
                  dangerouslySetInnerHTML={{ __html: renderFormattedText(topPrimaryDesc) }}
                />
              </div>

              {/* Details Cards */}
              <div className="grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4">
                {[
                  { label: "Residence Type", value: topCategoryLabel },
                  { label: "Status", value: PROPERTY_STATUS_LABELS[activeTopProp.status] },
                  { label: "Location", value: activeTopProp.locationLabel },
                  { label: "Price Guide", value: topPriceDisplay },
                  ...(activeTopProp.builtUpArea ? [{ label: "Built-Up Area", value: activeTopProp.builtUpArea }] : []),
                  ...(activeTopProp.plotArea ? [{ label: "Plot Area", value: activeTopProp.plotArea }] : []),
                  ...(activeTopProp.floor
                    ? [{ label: "BHK", value: activeTopProp.floor }]
                    : []),
                ].map(({ label, value }) => (
                  <div key={label} className="bg-soft-black border border-white/[0.06] rounded-md p-3.5 space-y-1">
                    <span className="block text-[9px] uppercase tracking-[0.18em] text-champagne-gold font-sans font-medium">{label}</span>
                    <span className="block text-sm font-sans text-ivory/85 leading-snug">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 sm:pt-5 mt-4 border-t border-white/[0.06] flex flex-col gap-3 sm:gap-4">
              <Link
                href={`/properties/${activeTopProp.slug}#enquiry-form`}
                className="group/primary inline-flex items-center justify-center gap-2.5 text-xs uppercase tracking-[0.22em] font-sans text-champagne-gold border border-champagne-gold/30 hover:border-champagne-gold/65 hover:bg-champagne-gold/[0.04] px-5 py-3 transition-all duration-300 w-full sm:w-fit min-h-[40px]"
              >
                Request Private Details
                <span className="transform group-hover/primary:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>
          </div>
              </motion.div>
            </AnimatePresence>
          </div>
    </div>
    )}

      {/* Divider & Carousel Header */}
      {properties.length > 0 && (
        <>
          <div className="flex items-center justify-between mt-16 mb-8 relative z-20">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne-gold" />
              <h3 className="font-display text-xs tracking-[0.2em] text-ivory/60 uppercase">More Residences</h3>
            </div>
            <Link
              href="/properties"
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-sans text-champagne-gold/75 hover:text-champagne-gold transition-colors duration-300"
            >
              View All Properties
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>

          {/* Infinite Manually-Scrollable Strip of Property Cards */}
          <div className="relative">
            <div
              ref={manualMarqueeRef}
              className="marquee-container w-full overflow-x-auto scroll-smooth scrollbar-none relative z-20 py-4"
            >
              <div className="flex gap-5 w-max">
                {[...properties, ...properties, ...properties].map((property, idx) => (
                  <div
                    key={`rem-${property.id}-${idx}`}
                    className="w-[260px] sm:w-[300px] lg:w-[320px] flex-shrink-0"
                  >
                    <StaticPropertyCard
                      property={property}
                      isExpanded={expandedSlug === property.slug}
                      onToggle={() => handleToggleExpand(property.slug)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {properties.length > 1 && (
              <>
                <button
                  onClick={() => handleMarqueeNav(-1)}
                  className="absolute left-2 lg:-left-16 xl:-left-20 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white/80 hover:text-lux-black bg-lux-black/70 hover:bg-champagne-gold backdrop-blur-sm border border-white/20 hover:border-champagne-gold shadow-lg shadow-black/30 transition-all duration-300 hover:scale-105 cursor-pointer"
                  aria-label="Scroll residences left"
                >
                  <ChevronLeft className="w-5 h-5 stroke-2" />
                </button>
                <button
                  onClick={() => handleMarqueeNav(1)}
                  className="absolute right-2 lg:-right-16 xl:-right-20 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white/80 hover:text-lux-black bg-lux-black/70 hover:bg-champagne-gold backdrop-blur-sm border border-white/20 hover:border-champagne-gold shadow-lg shadow-black/30 transition-all duration-300 hover:scale-105 cursor-pointer"
                  aria-label="Scroll residences right"
                >
                  <ChevronRight className="w-5 h-5 stroke-2" />
                </button>
              </>
            )}
          </div>
        </>
      )}

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
    </div>
  );
}

// ─── MINIMAL CARD COMPONENT ───────────────────────────────────────────────────

interface StaticPropertyCardProps {
  property: StaticProperty;
  isExpanded: boolean;
  onToggle: () => void;
}

function StaticPropertyCard({ property, isExpanded, onToggle }: StaticPropertyCardProps) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const categoryLabel = DISPLAY_CATEGORY_LABELS[property.category] || "Luxury Residence";
  const images = property.images && property.images.length > 0 ? property.images : [property.coverImage];

  useEffect(() => {
    if (!isHovered || images.length <= 1) {
      const resetTimer = setTimeout(() => {
        setCurrentImgIdx(0);
        setDirection(1);
      }, 0);
      return () => clearTimeout(resetTimer);
    }
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentImgIdx((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

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

  // Short descriptor fallback
  const shortDesc = property.description && property.description[0]
    ? property.description[0].split(".")[0] + "."
    : `A premium bespoke ${categoryLabel.toLowerCase()} in the luxury corridor.`;

  return (
    <motion.div
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.025 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "group bg-soft-black border text-left cursor-pointer rounded-2xl overflow-hidden flex flex-col justify-between h-full",
        isExpanded 
          ? "border-white/[0.15] shadow-[0_0_30px_rgba(0,0,0,0.15)]" 
          : "border-white/[0.04] hover:border-white/[0.14]"
      )}
    >
      {/* Image Block */}
      <div className="relative aspect-[4/3] overflow-hidden bg-lux-black border-b border-white/[0.02]">
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
                alt={`${DISPLAY_CATEGORY_LABELS[property.category] || property.category} — image ${currentImgIdx + 1}`}
                fill
                quality={75}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center transition-transform duration-[1500ms] ease-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="absolute inset-0 bg-[#121212] flex items-center justify-center">
                <span className="text-[9px] uppercase tracking-[0.2em] text-champagne-gold/30 font-sans">
                  Preview on Request
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
                    layoutId={`activeDot-top-${property.id}`}
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

        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-lux-black/40 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-lux-black/60 via-transparent to-transparent z-10 pointer-events-none" />
        
        {/* Inset Gold Frame Overlay */}

      </div>

      {/* Info Block */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <h3 className="font-display text-[13px] sm:text-[14px] lg:text-[15px] font-normal tracking-wide text-ivory group-hover:text-champagne-gold transition-colors duration-300 uppercase leading-snug">
            <span className="block">{property.configuration}</span>
            {property.floor && (
              <span className="block text-xs font-sans text-champagne-gold/90 mt-1.5 normal-case tracking-normal">{property.floor}</span>
            )}
          </h3>

          <p className="text-xs font-sans text-ivory/50 uppercase tracking-[0.15em] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-champagne-gold/50" />
            {property.locationLabel}
          </p>

          <p className="text-[13px] font-sans text-ivory/55 leading-relaxed pt-1.5 font-light">
            {shortDesc}
          </p>
        </div>

        {/* View Details CTA */}
        <div className="border-t border-white/[0.04] pt-4 mt-5 flex items-center justify-between">
          <span className="text-xs font-sans text-ivory/50">
            {categoryLabel}
          </span>
          <span className="text-xs font-sans uppercase tracking-[0.15em] text-champagne-gold/80 font-medium group-hover:text-champagne-gold flex items-center gap-1 transition-all duration-300">
            View Details
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── EXPANDED PREVIEW PANEL ───────────────────────────────────────────────────

export interface ExpandedDetailPanelProps {
  property: StaticProperty;
  onClose: () => void;
}

const STAGGER_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export function ExpandedDetailPanel({ property, onClose }: ExpandedDetailPanelProps) {
  const categoryLabel = DISPLAY_CATEGORY_LABELS[property.category] || "Luxury Residence";

  const rawDesc = property.description?.[0] ?? "";
  const primaryDesc = rawDesc.split(/(?<=\.)\s+/)[0] || 
    `An exclusive premium ${categoryLabel.toLowerCase()} of ${property.sizeRange} located in the prime ${property.locationLabel} corridor.`;

  const priceDisplay = property.priceOnRequest ? "Price on Request" : (property.price || "Price on Request");

  // Carousel
  const allImages = property.images?.length
    ? property.images
    : property.coverImage
    ? [property.coverImage]
    : [];
  const total = allImages.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const navigate = useCallback((dir: 1 | -1) => {
    if (total <= 1) return;
    setDirection(dir);
    setCurrentIndex((i) => (i + dir + total) % total);
  }, [total]);

  // Auto-advance (3000ms, resetting timer on manual change)
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(() => navigate(1), 3000);
    return () => clearInterval(timer);
  }, [isPaused, total, navigate, currentIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT" ||
          activeEl.hasAttribute("contenteditable"))
      ) {
        return;
      }
      if (e.key === "ArrowLeft") navigate(-1);
      else if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  const imgVariants = {
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

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-[460px] overflow-y-auto md:overflow-hidden">

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-ivory/30 hover:text-white border border-white/[0.07] hover:border-white/20 transition-all duration-250 z-30"
        aria-label="Close preview"
      >
        <X className="w-3.5 h-3.5 stroke-[1.5]" />
      </button>

      {/* Left — Cinematic Image Carousel */}
      <div
        className="relative w-full md:w-[58%] h-[40vh] md:h-full bg-[#080808] overflow-hidden flex-shrink-0 group/carousel"
      >

        {/* Container fade-in on open */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {/* Carousel slides */}
          <AnimatePresence initial={false} custom={direction}>
            {allImages.length > 0 ? (
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={imgVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <Image
                  src={allImages[currentIndex]}
                  alt={`${categoryLabel} — image ${currentIndex + 1} of ${total}`}
                  fill
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 58vw"
                  className="object-cover object-center scale-[1.04]"
                />
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Compass className="w-8 h-8 text-champagne-gold/15" />
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom gradient for label legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-transparent pointer-events-none z-10" />

        {/* Prev / Next arrows — always visible on mobile, hover-only on desktop */}
        {total > 1 && (
          <>
            <button
              onClick={() => navigate(-1)}
              onMouseEnter={() => {
                if (window.matchMedia("(hover: hover)").matches) setIsPaused(true);
              }}
              onMouseLeave={() => {
                if (window.matchMedia("(hover: hover)").matches) setIsPaused(false);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center text-white/35 hover:text-white bg-black/20 hover:bg-black/50 border border-white/[0.07] hover:border-white/20 transition-all duration-250 md:opacity-0 md:group-hover/carousel:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
            </button>
            <button
              onClick={() => navigate(1)}
              onMouseEnter={() => {
                if (window.matchMedia("(hover: hover)").matches) setIsPaused(true);
              }}
              onMouseLeave={() => {
                if (window.matchMedia("(hover: hover)").matches) setIsPaused(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center text-white/35 hover:text-white bg-black/20 hover:bg-black/50 border border-white/[0.07] hover:border-white/20 transition-all duration-250 md:opacity-0 md:group-hover/carousel:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 stroke-[1.5]" />
            </button>
          </>
        )}

        {/* Bottom bar: Private Collection label + counter */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-6 left-7 right-7 z-20 flex items-end justify-between pointer-events-none"
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-champagne-gold/60 font-sans">
            Private Collection
          </span>
          {total > 1 && (
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/30 font-sans tabular-nums">
              {pad(currentIndex + 1)} / {pad(total)}
            </span>
          )}
        </motion.div>
      </div>

      {/* Right — Editorial Content */}
      <div className="w-full md:w-[42%] bg-lux-black flex flex-col overflow-y-auto scrollbar-none flex-shrink-0">

        {/* Top content block */}
        <div className="flex-1 px-5 sm:px-8 md:px-9 pt-5 sm:pt-6 pb-4 sm:pb-5">

          {/* Eyebrow */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={STAGGER_VARIANTS}
            className="flex items-center gap-2.5 mb-4"
          >
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-champagne-gold/75 font-sans font-medium">{property.locationLabel}</span>
          </motion.div>

          {/* Title */}
          <motion.h2
            custom={1}
            initial="hidden"
            animate="visible"
            variants={STAGGER_VARIANTS}
            className="font-display text-[1.4rem] sm:text-[1.8rem] md:text-[2.2rem] font-light text-white tracking-wide leading-tight mb-3 uppercase"
          >
            <span className="block">{property.configuration}</span>
            <span className="block text-sm sm:text-base text-champagne-gold/90 font-sans mt-2 normal-case tracking-normal font-normal">{property.sizeRange}</span>
          </motion.h2>

          {/* Gold rule */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={STAGGER_VARIANTS}
            className="w-9 h-px bg-champagne-gold/40 mb-3"
          />

          {/* Description */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={STAGGER_VARIANTS}
            className="space-y-3 mb-4"
          >
            <p className="font-sans text-xs sm:text-sm text-ivory/60 leading-relaxed font-light">
              {primaryDesc}
            </p>
          </motion.div>

          {/* Details Cards */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={STAGGER_VARIANTS}
            className="grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4"
          >
            {[
              { label: "Residence Type", value: categoryLabel },
              { label: "Status", value: PROPERTY_STATUS_LABELS[property.status] },
              { label: "Location", value: property.locationLabel },
              { label: "Price Guide", value: priceDisplay },
              ...(property.builtUpArea ? [{ label: "Built-Up Area", value: property.builtUpArea }] : []),
              ...(property.plotArea ? [{ label: "Plot Area", value: property.plotArea }] : []),
              ...(property.floor
                ? [{ label: "BHK", value: property.floor }]
                : []),
            ].map(({ label, value }) => (
              <div key={label} className="bg-soft-black border border-white/[0.06] rounded-md p-3.5 space-y-1">
                <span className="block text-[9px] uppercase tracking-[0.18em] text-champagne-gold font-sans font-medium">{label}</span>
                <span className="block text-sm font-sans text-ivory/85 leading-snug">{value}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* CTAs — pinned to bottom */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={STAGGER_VARIANTS}
          className="px-5 sm:px-8 md:px-9 py-4 sm:py-5 border-t border-white/[0.06] flex flex-col gap-3 sm:gap-4"
        >
          <Link
            href={`/properties/${property.slug}#enquiry-form`}
            onClick={onClose}
            className="group/primary inline-flex items-center justify-center gap-2.5 text-xs uppercase tracking-[0.22em] font-sans text-champagne-gold border border-champagne-gold/30 hover:border-champagne-gold/65 hover:bg-champagne-gold/[0.04] px-5 py-3 transition-all duration-300 w-full sm:w-fit min-h-[40px]"
          >
            Request Private Details
            <span className="transform group-hover/primary:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

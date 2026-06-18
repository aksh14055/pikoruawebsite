"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMarqueeSpeed } from "@/hooks/useMarqueeSpeed";

const TOURS_DATA = [
  {
    id: "G17NU0mliT4",
    title: "Off Thaltej - Shilaj Road",
    subtitle: "Smart Sized Luxury 4 BHK Apartments"
  },
  {
    id: "mAJ7w6keKSM",
    title: "Vaishno Devi Circle",
    subtitle: "Luxury 4 & 5 BHK Community"
  },
  {
    id: "aWqhcmZqBdc",
    title: "Off Sindhu Bhavan Road",
    subtitle: "Smart Sized Luxury 4 & 5 BHK Apartments"
  },
  {
    id: "i0k7ewRHgZk",
    title: "Off Sindhu Bhavan Road",
    subtitle: "Ultra Luxury 4 & 5 BHK Residences"
  },
  {
    id: "aWjAEc_rAJU",
    title: "Thaltej Shilaj Road",
    subtitle: "Luxury 4 BHK Apartments"
  },
  {
    id: "GwQq098ICLY",
    title: "Iskon - Ambli Road",
    subtitle: "Iconic 4 BHK & Penthouse"
  },
  {
    id: "RVkRTQj4rw0",
    title: "Iskon - Ambli Road",
    subtitle: "Smart Sized Luxury 4 BHK Residences"
  },
  {
    id: "Fbd5LFA6m3I",
    title: "Ambli - Bopal Road",
    subtitle: "Ultra Luxury Bungalow Collection"
  },
  {
    id: "Mt3tY4SNJ_M",
    title: "Science City Road",
    subtitle: "Iconic 4 & 5 BHK with Panoramic Views"
  },
  {
    id: "b2ZzzwdSbmQ",
    title: "Sindhu Bhavan Road",
    subtitle: "Large & Luxury 4 & 5 BHK Apartments"
  }
];

interface VirtualToursProps {
  tours?: { id: string; title: string; subtitle: string }[];
}

export function VirtualTours({ tours }: VirtualToursProps = {}) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [lastClosedId, setLastClosedId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { ref: marqueeRef, durationSeconds } = useMarqueeSpeed<HTMLDivElement>();
  const displayedTours = tours && tours.length > 0 ? tours : TOURS_DATA;

  const handleMouseEnter = (id: string) => {
    setIsHovered(true);
    // Do not trigger modal if modal is already open or this card was just closed
    if (activeVideoId || id === lastClosedId) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveVideoId(id);
    }, 5000); // 5 seconds delay
  };

  const handleMouseLeave = (id: string) => {
    setIsHovered(false);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (id === lastClosedId) {
      setLastClosedId(null); // Reset lastClosedId once cursor leaves the card
    }
  };

  const handleClose = () => {
    setLastClosedId(activeVideoId);
    setActiveVideoId(null);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  return (
    <section className="bg-lux-black pt-12 pb-6 lg:pt-16 lg:pb-8 border-t border-white/[0.06]" aria-labelledby="virtual-tours-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-3">
          Virtual Walkthroughs
        </p>
        <h2
          id="virtual-tours-heading"
          className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-normal text-ivory leading-tight uppercase tracking-wider mb-3"
        >
          Explore Our Properties
        </h2>
        <p className="text-ivory/50 font-sans text-xs leading-relaxed max-w-md mx-auto">
          Take a virtual tour of our exclusive luxury properties. Hover over a card to play in popup.
        </p>
        <div className="w-12 h-px bg-champagne-gold/30 mx-auto mt-4" aria-hidden="true" />
      </div>

      {/* Horizontal Continuous Marquee Slider */}
      <div className="marquee-container w-full overflow-hidden relative py-4 bg-soft-black/20">
        {/* Vignette Gradients */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-32 bg-gradient-to-r from-lux-black to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-32 bg-gradient-to-l from-lux-black to-transparent z-10 pointer-events-none" />

        <div
          ref={marqueeRef}
          className="flex gap-6 w-max animate-marquee"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            animationPlayState: (activeVideoId || isHovered) ? "paused" : "running",
            ...(durationSeconds ? { animationDuration: `${durationSeconds}s` } : {}),
          }}
        >
          {[...displayedTours, ...displayedTours].map((tour, idx) => (
            <div
              key={`${tour.id}-${idx}`}
              onMouseEnter={() => handleMouseEnter(tour.id)}
              onMouseLeave={() => handleMouseLeave(tour.id)}
              onClick={() => setActiveVideoId(tour.id)}
              className="group relative flex flex-col justify-end w-[290px] h-[190px] sm:w-[380px] sm:h-[240px] rounded-xl overflow-hidden bg-soft-black border border-white/[0.06] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 flex-shrink-0 cursor-pointer"
            >
              {/* YouTube Thumbnail Image */}
              <img
                src={`https://img.youtube.com/vi/${tour.id}/maxresdefault.jpg`}
                alt={tour.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${tour.id}/hqdefault.jpg`;
                }}
              />

              {/* Luxury Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30 transition-opacity duration-300" />

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 border-b-2 border-transparent transition-colors duration-300">
                <p className="font-serif italic font-light text-[clamp(1.5rem,2.5vw,2.2rem)] text-white/95 leading-none mb-1">
                  Ahmedabad
                </p>
                <div className="h-px bg-white/10 my-2" aria-hidden="true" />
                <p className="text-[10px] sm:text-[11px] font-sans text-ivory/70 group-hover:text-champagne-gold transition-colors duration-300 uppercase tracking-widest leading-relaxed">
                  {tour.title}
                </p>
                <p className="text-[8px] sm:text-[9px] font-sans text-ivory/40 uppercase tracking-[0.15em] mt-0.5">
                  {tour.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Video Popup Modal */}
      {activeVideoId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
          onClick={handleClose}
        >
          <div
            className="relative w-[90%] max-w-[800px] aspect-video bg-soft-black border border-champagne-gold/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(200,164,93,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1`}
              title="Property Walkthrough Video"
              className="w-full h-full border-none"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
            
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 hover:text-champagne-gold text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-champagne-gold/40 text-lg shadow-lg font-sans"
              aria-label="Close video player"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

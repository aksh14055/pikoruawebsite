"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  name: string;
}

export function PropertyGallery({ images, name }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const total = images.length;

  const handlePrev = () => {
    if (total <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    if (total <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [total]);

  if (total === 0) {
    return (
      <div className="relative aspect-[16/10] w-full bg-soft-black border border-white/[0.06] flex flex-col items-center justify-center rounded-lg text-ivory/20 gap-3">
        <ImageIcon className="w-10 h-10 stroke-[1]" />
        <span className="text-xs uppercase tracking-widest font-sans">Preview on Request</span>
      </div>
    );
  }

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    }),
  };

  return (
    <div className="space-y-4">
      {/* Main Viewport */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-lux-black border border-white/[0.08] rounded-md group">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={images[currentIndex]}
              alt={`${name} gallery view ${currentIndex + 1}`}
              fill
              quality={90}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center scale-[1.04]"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-transparent pointer-events-none z-10" />

        {/* Navigation Arrows */}
        {total > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-lux-black/70 border border-white/10 flex items-center justify-center text-ivory/60 hover:text-white hover:border-champagne-gold/60 hover:bg-champagne-gold/10 transition-all duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-lux-black/70 border border-white/10 flex items-center justify-center text-ivory/60 hover:text-white hover:border-champagne-gold/60 hover:bg-champagne-gold/10 transition-all duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Index indicator */}
        <div className="absolute bottom-4 right-4 z-10 px-3 py-1 bg-lux-black/80 backdrop-blur-sm border border-white/10 rounded-sm text-[10px] font-sans text-ivory/60 tracking-widest tabular-nums">
          {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </div>

      {/* Thumbnails list */}
      {total > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={cn(
                "relative aspect-[16/10] w-20 sm:w-24 flex-shrink-0 overflow-hidden border transition-all duration-200 rounded-sm",
                idx === currentIndex
                  ? "border-champagne-gold ring-1 ring-champagne-gold/30"
                  : "border-white/10 hover:border-white/30"
              )}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                quality={90}
                sizes="100px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

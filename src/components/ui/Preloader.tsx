"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Wait for the window load event or complete state
    const handleLoad = () => {
      // Small timeout to allow the premium load animation to complete
      const timer = setTimeout(() => {
        setLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // Prevent background scrolling while preloading
  useEffect(() => {
    if (loading && shouldRender) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading, shouldRender]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence onExitComplete={() => setShouldRender(false)}>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-lux-black select-none pointer-events-auto"
        >
          {/* Logo & Progress Bar Container */}
          <div className="flex flex-col items-center">
            {/* Logo fading and scaling up */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-48 sm:w-56 h-12 sm:h-14"
            >
              <Image
                src="/logo.png"
                alt="PIKORUA Realty"
                fill
                quality={90}
                sizes="(max-width: 640px) 12rem, 14rem"
                priority
                className="object-contain"
              />
            </motion.div>

            {/* Champagne Gold Hairline Progress Bar */}
            <div className="w-32 h-[1px] bg-white/10 mt-6 relative overflow-hidden rounded-full">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "0%" }}
                transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
                className="absolute inset-0 bg-champagne-gold w-full"
              />
            </div>

            {/* Subtle luxury brand signature */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-[9px] uppercase tracking-[0.3em] text-ivory font-sans mt-3.5"
            >
              Quietly Curated Residences
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

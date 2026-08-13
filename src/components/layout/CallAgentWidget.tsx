"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getCallAgentContext } from "@/lib/callAgentContext";
import { CallAgentPopup, CALL_AGENT_NAME } from "./CallAgentPopup";

// Auto-open the popup once per browsing session after the visitor reaches
// the midpoint of the page. The floating button remains available earlier.
const AUTO_SHOWN_KEY = "pikorua_call_agent_auto_shown";
const SCROLL_TRIGGER_RATIO = 0.5;
// Fires earlier than the auto-open, as a quieter "notice me" nudge.
const PULSE_TRIGGER_RATIO = 0.25;

export function CallAgentWidget() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [pulsed, setPulsed] = useState(false);
  const hasPulsed = useRef(false);
  const hasAutoTriggered = useRef(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    if (typeof window === "undefined") return;

    const autoOpenDone = Boolean(sessionStorage.getItem(AUTO_SHOWN_KEY));

    const triggerAutoOpen = () => {
      if (autoOpenDone || hasAutoTriggered.current) return;
      hasAutoTriggered.current = true;
      sessionStorage.setItem(AUTO_SHOWN_KEY, "1");
      setVisible(true);
    };

    const onScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const scrolled = window.scrollY / scrollableHeight;

      if (!hasPulsed.current && scrolled >= PULSE_TRIGGER_RATIO) {
        hasPulsed.current = true;
        setPulsed(true);
        setTimeout(() => setPulsed(false), 2200);
      }

      if (scrolled >= SCROLL_TRIGGER_RATIO) triggerAutoOpen();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  const contextLine = getCallAgentContext(pathname);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <div
        className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2"
        style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))" }}
      >
        {/* Hover label */}
        <span
          className={cn(
            "text-xs font-sans tracking-wider text-lux-black bg-ivory px-3 py-1.5 rounded-sm shadow-lg",
            "transition-all duration-200 whitespace-nowrap",
            showLabel ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
          )}
          aria-hidden="true"
        >
          Private Advisory Line — {CALL_AGENT_NAME}
        </span>

        {/* FAB button */}
        <motion.button
          type="button"
          aria-label={`Private advisory line — speak with ${CALL_AGENT_NAME}`}
          onClick={() => setVisible(true)}
          onMouseEnter={() => setShowLabel(true)}
          onMouseLeave={() => setShowLabel(false)}
          onFocus={() => setShowLabel(true)}
          onBlur={() => setShowLabel(false)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={cn(
            "relative flex items-center justify-center w-14 h-14 rounded-full bg-soft-black border border-champagne-gold/40 text-champagne-gold shadow-xl",
            "hover:border-champagne-gold transition-colors duration-200",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne-gold"
          )}
        >
          {/* Ambient sonar ring — signals "always on" without shouting for attention */}
          <motion.span
            className="absolute inset-0 rounded-full border border-champagne-gold/40"
            animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            aria-hidden="true"
          />

          {/* Brand glyph */}
          <Image
            src="/logo-icon.png"
            alt=""
            width={24}
            height={24}
            priority
            className="relative w-6 h-6 object-contain opacity-90"
            style={{ mixBlendMode: "screen" }}
          />

          {/* Pulse ring — fires once after the visitor scrolls into the page */}
          {pulsed && (
            <span
              className="absolute inset-0 rounded-full bg-champagne-gold/30 animate-ping"
              aria-hidden="true"
            />
          )}
        </motion.button>
      </div>

      <CallAgentPopup
        visible={visible}
        onDismiss={() => setVisible(false)}
        contextLine={contextLine}
      />
    </>
  );
}

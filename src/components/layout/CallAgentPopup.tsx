"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone } from "lucide-react";
import {
  CALL_AGENT_NAME,
  CALL_AGENT_PHONE_E164,
  CALL_AGENT_PHONE_DISPLAY,
} from "@/lib/data/callAgent";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

interface CallAgentPopupProps {
  visible: boolean;
  onDismiss: () => void;
  /** Short clause describing what the visitor is looking at, e.g. "about this residence". */
  contextLine?: string | null;
}

export function CallAgentPopup({ visible, onDismiss, contextLine }: CallAgentPopupProps) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="call-agent-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[8000] bg-black/75 backdrop-blur-sm"
            onClick={onDismiss}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="call-agent-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="call-agent-title"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[8001] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-[380px] pointer-events-auto bg-soft-black border border-white/[0.06] rounded-md overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.85)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onDismiss}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-champagne-gold"
              >
                <X size={15} strokeWidth={2} className="text-ivory/70" />
              </button>

              <div className="px-7 pt-9 pb-8 flex flex-col items-center text-center gap-4">
                {/* Brand mark — a single hairline ring around the PIKORUA glyph,
                    not a chatbot avatar */}
                <div className="relative w-14 h-14 rounded-full border border-champagne-gold/35 flex items-center justify-center">
                  <span
                    className="absolute inset-0 rounded-full border border-champagne-gold/25 animate-ping"
                    aria-hidden="true"
                    style={{ animationDuration: "2.8s" }}
                  />
                  <Image
                    src="/logo-icon.png"
                    alt=""
                    width={26}
                    height={26}
                    priority
                    className="relative w-6 h-6 object-contain opacity-90"
                    style={{ mixBlendMode: "screen" }}
                  />
                </div>

                {/* Eyebrow — replaces the generic "online now" chat-widget pill */}
                <p className="text-[9px] uppercase tracking-[0.28em] text-champagne-gold/70 font-sans -mt-1">
                  Private Advisory Line
                </p>

                <div>
                  <h2
                    id="call-agent-title"
                    className="font-display text-2xl text-white font-normal uppercase tracking-wide"
                  >
                    {getGreeting()}, Talk to {CALL_AGENT_NAME}
                  </h2>
                  <div className="mx-auto mt-4 w-10 h-px bg-champagne-gold/50" aria-hidden="true" />
                </div>

                <p className="text-ivory/55 font-sans text-xs leading-relaxed max-w-[260px]">
                  {`${CALL_AGENT_NAME} is PIKORUA’s private property advisor, reachable now ${
                    contextLine ?? "for a private consultation"
                  }.`}
                </p>

                <motion.a
                  href={`tel:${CALL_AGENT_PHONE_E164}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-1 w-full flex items-center justify-center gap-2 px-6 py-3.5 text-[10px] font-sans uppercase tracking-[0.2em] transition-colors duration-300 rounded-sm border text-lux-black bg-champagne-gold border-champagne-gold hover:bg-antique-gold hover:border-antique-gold"
                >
                  <Phone size={13} strokeWidth={2} />
                  Connect with {CALL_AGENT_NAME}
                </motion.a>
                <p className="text-[10px] text-ivory/30 font-sans -mt-2">
                  or dial {CALL_AGENT_PHONE_DISPLAY} directly
                </p>

                <button
                  type="button"
                  onClick={onDismiss}
                  className="text-[9px] uppercase tracking-[0.15em] text-ivory/20 font-sans hover:text-ivory/40 transition-colors duration-150 text-center pt-1"
                >
                  Not now
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

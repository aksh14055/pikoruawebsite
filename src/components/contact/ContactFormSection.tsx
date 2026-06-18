"use client";

import { useState } from "react";
import { DiscoveryForm } from "./DiscoveryForm";
import { QuickEnquiryForm } from "./QuickEnquiryForm";
import { ContactDetails } from "./ContactDetails";
import type { LeadPurpose } from "@/types";

interface ContactFormSectionProps {
  initialPurpose?: LeadPurpose | "";
}

export function ContactFormSection({ initialPurpose = "" }: ContactFormSectionProps) {
  const [isQuick, setIsQuick] = useState(false);

  return (
    <section className="bg-lux-black pb-28 lg:pb-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16 lg:gap-24">

          {/* ── Form panel ── */}
          <div>
            {isQuick ? (
              <QuickEnquiryForm />
            ) : (
              <DiscoveryForm initialPurpose={initialPurpose} id="discovery" />
            )}

            {/* Subtle path toggle */}
            <div className="mt-10 pt-8 border-t border-white/[0.05]">
              {isQuick ? (
                <button
                  type="button"
                  onClick={() => setIsQuick(false)}
                  className="group inline-flex items-center gap-2 text-[11px] font-sans text-ivory/25 hover:text-ivory/50 uppercase tracking-[0.15em] transition-colors duration-200"
                >
                  <span className="transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
                  Prefer a guided consultation?
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsQuick(true)}
                  className="group inline-flex items-center gap-2 text-[11px] font-sans text-ivory/25 hover:text-ivory/50 uppercase tracking-[0.15em] transition-colors duration-200"
                >
                  Prefer to send a quick note?
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </button>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside>
            <div className="sticky top-28 lg:pt-2">
              <ContactDetails />
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}

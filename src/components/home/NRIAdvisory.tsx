"use client";

import Link from "next/link";
import { useScrollReveal, revealClasses } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";
import { env } from "@/lib/env";
import { buildWhatsAppUrl } from "@/lib/utils";

const NRI_SERVICES = [
  { label: "Virtual Tours",          detail: "HD walkthroughs and video calls — see everything before you fly." },
  { label: "Time-Zone Calls",        detail: "Scheduled around your hours, wherever you are in the world." },
  { label: "Legal & FEMA Guidance",  detail: "We navigate Indian property law on your behalf, fully briefed." },
  { label: "Trusted On-Ground Presence", detail: "Site inspections, negotiations, and handover — handled locally." },
];

export function NRIAdvisory() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });
  const whatsappUrl = buildWhatsAppUrl(
    env.WHATSAPP_NUMBER,
    "Hi, I'm an NRI looking to invest in Ahmedabad real estate. Can we connect?"
  );

  return (
    <section className="bg-ivory py-20 lg:py-28" aria-labelledby="nri-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start",
            revealClasses.base,
            visible ? revealClasses.visible : revealClasses.hidden
          )}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-champagne-gold font-sans mb-5">
              NRI Advisory
            </p>
            <h2
              id="nri-heading"
              className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-normal text-lux-black leading-tight uppercase tracking-wider mb-6"
            >
              Invest from anywhere.<br />
              <span className="text-lux-black/35">We hold the ground for you.</span>
            </h2>
            <p className="text-lux-black/50 font-sans text-base leading-relaxed mb-8 max-w-md">
              Distance shouldn't mean compromise. We represent NRI buyers with the
              same rigour as those who are here — virtually, legally, and personally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact?purpose=nri"
                className="inline-flex items-center justify-center px-7 py-3.5 text-xs font-sans uppercase tracking-[0.2em] text-lux-black bg-champagne-gold hover:bg-antique-gold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne-gold min-h-[48px]"
              >
                Talk to Us from Anywhere
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-sans uppercase tracking-[0.2em] text-[#25D366] border border-[#25D366]/40 hover:bg-[#25D366]/10 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#25D366] min-h-[48px]"
              >
                <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
                WhatsApp Now
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {NRI_SERVICES.map((svc) => (
              <div key={svc.label} className="border-t border-lux-black/[0.08] pt-5">
                <h3 className="font-sans text-sm font-medium text-lux-black mb-2">{svc.label}</h3>
                <p className="text-xs font-sans text-lux-black/40 leading-relaxed">{svc.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

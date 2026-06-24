"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { env } from "@/lib/env";
import { trackPageView } from "@/lib/analytics";

export function GoogleAnalytics() {
  const measurementId = env.GA4_MEASUREMENT_ID;
  const pathname = usePathname();

  useEffect(() => {
    if (!measurementId) return;
    trackPageView(window.location.href);
  }, [measurementId, pathname]);

  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}

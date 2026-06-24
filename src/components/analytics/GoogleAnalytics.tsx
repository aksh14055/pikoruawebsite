"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { env } from "@/lib/env";
import { trackPageView } from "@/lib/analytics";

export function GoogleAnalytics() {
  const measurementId = env.GA4_MEASUREMENT_ID;
  const pathname = usePathname();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!measurementId) return;
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
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
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}

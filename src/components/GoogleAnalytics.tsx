"use client";

import Script from "next/script";

interface GoogleAnalyticsProps {
  gaTrackingId: string;
}

// Con next/script (afterInteractive) en vez de <script> en el <head>: el análisis no compite con
// la primera pintura ni con la hidratación (2026-10-23)
export function GoogleAnalytics({ gaTrackingId }: GoogleAnalyticsProps) {
  if (!gaTrackingId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaTrackingId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

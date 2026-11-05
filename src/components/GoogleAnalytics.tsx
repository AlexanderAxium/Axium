"use client";

import Script from "next/script";

interface GoogleAnalyticsProps {
  gaTrackingId: string;
}

// Con next/script (afterInteractive) en vez de <script> en el <head>: el análisis no compite con
// la primera pintura ni con la hidratación (2026-10-23)
//
// Solo se monta DESPUÉS de que la persona acepta en el aviso de cookies
// (`components/axium/consentimiento-cookies.tsx`, 2026-11-04). Aun así, todo lo de publicidad queda
// negado: Axium no hace anuncios con estos datos, así que no hay motivo para habilitarlo.
export function GoogleAnalytics({ gaTrackingId }: GoogleAnalyticsProps) {
  if (!gaTrackingId) return null;

  return (
    <>
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
          });
          gtag('js', new Date());
          gtag('config', '${gaTrackingId}', {
            page_path: window.location.pathname,
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
        strategy="afterInteractive"
      />
    </>
  );
}

import type { Metadata } from "next";

import "./globals.css";
import { AuthProvider } from "@/AuthContext";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SmoothScroll } from "@/components/SmoothScroll";
import { StructuredData } from "@/components/StructuredData";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { TRPCProvider } from "@/hooks/useTRPC";
import { GA_TRACKING_ID } from "@/lib/analytics";
import { defaultMetadata } from "@/lib/seo";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* las dos letras que se ven al entrar (el texto y el titular), antes de que el CSS las
            pida: sin esto la portada se pintaba con la de reserva y saltaba al cargar */}
        <link
          rel="preload"
          href="/gilroy/Gilroy-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/gilroy/GuarujaTitle.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <StructuredData />
      </head>
      <body>
        {GA_TRACKING_ID && <GoogleAnalytics gaTrackingId={GA_TRACKING_ID} />}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          enableColorScheme={false}
        >
          <AuthProvider>
            <TRPCProvider>
              <SmoothScroll>
                {/* Sin RoleBasedRedirect (2026-10-23): sus redirecciones estaban desactivadas y
                    solo dejaba un spinner hasta que respondía la sesión, así que el servidor
                    entregaba la página sin contenido (76 caracteres medidos en producción). Las
                    rutas privadas ya tienen su ProtectedRoute */}
                {children}
              </SmoothScroll>
              <Toaster />
            </TRPCProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

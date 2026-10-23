import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

// el acceso no va a Google (y su descripción decía «MiApp», de la plantilla)
export const metadata: Metadata = generateSEOMetadata({
  title: "Iniciar sesión",
  description: "Accede a tu cuenta de Axium.",
  ruta: "/signin",
  indexar: false,
});

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

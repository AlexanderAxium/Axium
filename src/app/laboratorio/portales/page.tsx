import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Portales } from "~/components/laboratorio/portales";

// Tres mundos: cada pieza del isotipo es una ventana (2026-10-16). Solo en desarrollo.
export const metadata: Metadata = {
  title: "Tres mundos · Laboratorio 3D · Axium",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Portales />;
}

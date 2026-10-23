import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Obra } from "~/components/laboratorio/obra";

// Experiencia inmersiva «la obra», a partir de igloo.inc (2026-10-16). Solo en desarrollo.
export const metadata: Metadata = {
  title: "La obra · Laboratorio 3D · Axium",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Obra />;
}

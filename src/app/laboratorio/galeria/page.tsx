import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Galeria } from "~/components/laboratorio/galeria";

// Segunda prueba del laboratorio 3D: la galería de unseen.co/projects. Como la principal, solo existe
// en desarrollo.
export const metadata: Metadata = {
  title: "Galería · Laboratorio 3D · Axium",
  robots: { index: false, follow: false },
};

export default function PaginaGaleria() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Galeria />;
}

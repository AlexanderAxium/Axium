import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Multitud } from "~/components/laboratorio/ejemplos";

// Ejemplo del laboratorio 3D (2026-10-15). Solo existe en desarrollo.
export const metadata: Metadata = {
  title: "Multitud · Laboratorio 3D · Axium",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Multitud />;
}

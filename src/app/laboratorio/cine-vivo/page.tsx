import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CineVivo } from "~/components/laboratorio/cine-vivo";

// La película de /laboratorio/cine en tiempo real con three.js (2026-10-16). Solo en desarrollo.
export const metadata: Metadata = {
  title: "Cine en vivo · Laboratorio 3D · Axium",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  if (process.env.NODE_ENV === "production") notFound();
  return <CineVivo />;
}

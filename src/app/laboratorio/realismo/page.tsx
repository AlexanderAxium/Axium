import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Realismo } from "~/components/laboratorio/realismo";

// Estudio de realismo (2026-10-16): el isotipo como objeto real, contra un fotograma objetivo.
// Solo en desarrollo.
export const metadata: Metadata = {
  title: "Estudio de realismo · Laboratorio · Axium",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Realismo />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Realismo } from "~/components/laboratorio/realismo";

// Estudio de los cuatro medios (2026-10-16): la mesa del estudio de realismo impresa, pintada y en
// pantalla, con una cortina de tela simulada. Solo en desarrollo.
export const metadata: Metadata = {
  title: "Cuatro medios · Laboratorio · Axium",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Realismo variante="medios" />;
}

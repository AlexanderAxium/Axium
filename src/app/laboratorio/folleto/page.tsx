import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Folleto } from "~/components/laboratorio/folleto";

// El folleto que se tritura, a partir de shader.se (2026-10-16). Solo en desarrollo.
export const metadata: Metadata = {
  title: "El folleto · Laboratorio 3D · Axium",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Folleto />;
}

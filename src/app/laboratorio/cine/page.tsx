import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cine } from "~/components/laboratorio/cine";

// Cine pre-renderizado: la técnica de labs.sigma.software (2026-10-16). Solo en desarrollo.
export const metadata: Metadata = {
  title: "Cine pre-renderizado · Laboratorio 3D · Axium",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Cine />;
}

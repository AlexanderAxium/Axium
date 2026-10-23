import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Terminal } from "~/components/laboratorio/terminal";

// Propuesta de portada «la terminal» (a partir de juncastudio.com, 2026-10-16). Solo en desarrollo.
export const metadata: Metadata = {
  title: "La terminal · Laboratorio 3D · Axium",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Terminal />;
}

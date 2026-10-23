import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Laboratorio } from "~/components/laboratorio/laboratorio";

// Primera prueba del laboratorio 3D (capítulos con scroll, 2026-10-15). Solo existe en desarrollo: en producción responde 404, así
// que no se publica aunque entre en un commit. Fuera de (public): sin barra ni pie del sitio.
export const metadata: Metadata = {
  title: "Laboratorio 3D · Axium",
  robots: { index: false, follow: false },
};

export default function PaginaLaboratorio() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Laboratorio />;
}

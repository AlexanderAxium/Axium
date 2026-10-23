import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Sala } from "~/components/laboratorio/sala";

// Tercera prueba del laboratorio 3D: una escena modelada en Blender con la luz horneada. Solo existe
// en desarrollo.
export const metadata: Metadata = {
  title: "La sala · Laboratorio 3D · Axium",
  robots: { index: false, follow: false },
};

export default function PaginaSala() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Sala />;
}

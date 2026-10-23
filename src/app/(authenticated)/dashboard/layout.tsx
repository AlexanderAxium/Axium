import { DashboardLayoutClient } from "@/app/(authenticated)/dashboard/DashboardLayoutClient";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  ruta: "/dashboard",
  indexar: false,
  title: "Dashboard",
  description:
    "Panel de control administrativo para gestionar usuarios, roles y configuraciones del sistema.",
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}

import { metaPagina } from "@/lib/seo";

// la página es de cliente (el formulario), así que su título va acá
export const metadata = metaPagina({
  titulo: "Libro de reclamaciones",
  descripcion:
    "Libro de reclamaciones virtual de Axium, conforme al Código de Protección y Defensa del Consumidor del Perú.",
  ruta: "/legal/complaints",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

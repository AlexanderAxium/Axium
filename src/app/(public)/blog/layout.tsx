import { metaPagina } from "@/lib/seo";

// la portada del blog es de cliente, así que su título va acá; cada artículo pone el suyo
export const metadata = metaPagina({
  titulo: "Blog de software, webs e IA para empresas",
  descripcion:
    "Guías prácticas de Axium sobre desarrollo de software, páginas web, tiendas online, facturación electrónica e inteligencia artificial para empresas en Perú.",
  ruta: "/blog",
  imagen: "/og/og-blog.jpg",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

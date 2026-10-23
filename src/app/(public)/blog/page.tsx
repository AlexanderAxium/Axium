import { JsonLd } from "~/components/StructuredData";
import { BLOG_SLUGS, fechaIso } from "~/data/blog-data";
import { esquemaBlog } from "~/lib/structured-data";
import blog from "~/locales/es/blog.json";
import BlogIndexContent from "./BlogIndexContent";

// la portada del blog es de cliente: sus datos estructurados van acá, en el servidor, con los
// títulos en español (los que lee Google); el título y la descripción, en el layout
const POSTS = blog.posts as Record<string, { title: string; date: string }>;

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd
        datos={esquemaBlog(
          BLOG_SLUGS.map((slug) => ({
            slug,
            titulo: POSTS[slug]?.title ?? slug,
            fecha: fechaIso(POSTS[slug]?.date ?? ""),
          }))
        )}
      />
      <BlogIndexContent />
    </>
  );
}

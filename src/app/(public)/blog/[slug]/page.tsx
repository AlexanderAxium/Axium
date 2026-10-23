import { notFound } from "next/navigation";
import { JsonLd } from "~/components/StructuredData";
import {
  BLOG_PORTADAS,
  BLOG_SLUGS,
  type BlogSlug,
  fechaIso,
} from "~/data/blog-data";
import { SITIO, metaPagina, resumen } from "~/lib/seo";
import { migas } from "~/lib/structured-data";
import blog from "~/locales/es/blog.json";
import BlogPostContent from "./BlogPostContent";

// el texto del artículo en español: lo que lee Google (la web cambia de idioma en el navegador)
const POSTS = blog.posts as Record<
  string,
  {
    title: string;
    tituloSeo?: string;
    excerpt: string;
    date: string;
    categoria?: string;
  }
>;

export function generateStaticParams() {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!BLOG_SLUGS.includes(slug as (typeof BLOG_SLUGS)[number])) {
    return { title: "Blog" };
  }
  const post = POSTS[slug];
  return metaPagina({
    // el del buscador, si el titular pasa de los ~60 caracteres que muestra Google
    titulo: post?.tituloSeo ?? post?.title ?? "Blog",
    descripcion: resumen(post?.excerpt ?? ""),
    ruta: `/blog/${slug}`,
    imagen: BLOG_PORTADAS[slug as BlogSlug],
    tipo: "article",
    publicado: post ? fechaIso(post.date) : undefined,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!BLOG_SLUGS.includes(slug as (typeof BLOG_SLUGS)[number])) {
    notFound();
  }
  const post = POSTS[slug];
  const esquema = post && {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${SITIO}${BLOG_PORTADAS[slug as BlogSlug]}`,
    datePublished: fechaIso(post.date),
    inLanguage: "es-PE",
    mainEntityOfPage: `${SITIO}/blog/${slug}`,
    author: { "@type": "Organization", name: "Axium", url: SITIO },
    publisher: {
      "@type": "Organization",
      name: "Axium",
      logo: { "@type": "ImageObject", url: `${SITIO}/icon-512.png` },
    },
  };
  return (
    <>
      {esquema && (
        <JsonLd
          datos={[
            esquema,
            migas([
              ["Inicio", "/"],
              ["Blog", "/blog"],
              [post.title, `/blog/${slug}`],
            ]),
          ]}
        />
      )}
      <BlogPostContent />
    </>
  );
}

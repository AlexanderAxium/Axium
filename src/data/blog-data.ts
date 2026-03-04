/** Slugs y assets de entradas del blog. Contenido traducido en locales/{es,en,pt}/blog.json */
export const BLOG_SLUGS = [
  "transformacion-digital",
  "metodologias-agiles",
  "ia-en-el-negocio",
] as const;

export type BlogSlug = (typeof BLOG_SLUGS)[number];

export const BLOG_IMAGES: Record<BlogSlug, string> = {
  "transformacion-digital": "/blog/digital-transformation.jpg",
  "metodologias-agiles": "/blog/agile-software.jpg",
  "ia-en-el-negocio": "/blog/ai-business.jpg",
};

export function getBlogImage(slug: string): string {
  return BLOG_IMAGES[slug as BlogSlug] ?? "/blog/placeholder.jpg";
}

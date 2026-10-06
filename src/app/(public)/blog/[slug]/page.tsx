import { notFound } from "next/navigation";
import { BLOG_SLUGS } from "~/data/blog-data";
import BlogPostContent from "./BlogPostContent";

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
  return {
    title: `Blog | ${slug}`,
  };
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
  return <BlogPostContent />;
}

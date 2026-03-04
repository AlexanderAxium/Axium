"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BLOG_SLUGS, getBlogImage } from "~/data/blog-data";
import { useTranslation } from "~/hooks/useTranslation";

const smoothEase = [0.4, 0, 0.2, 1] as const;

function getPostBodyParagraphs(body: string): string[] {
  return body.split("\n\n").filter(Boolean);
}

export default function BlogPostContent() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { t } = useTranslation("blog");

  const isValidSlug = BLOG_SLUGS.includes(slug as (typeof BLOG_SLUGS)[number]);
  const title = isValidSlug ? t(`posts.${slug}.title`) : "";
  const excerpt = isValidSlug ? t(`posts.${slug}.excerpt`) : "";
  const date = isValidSlug ? t(`posts.${slug}.date`) : "";
  const body = isValidSlug ? t(`posts.${slug}.body`) : "";
  const image = getBlogImage(slug);

  if (!slug || !isValidSlug) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-body-lg text-gray-600 mb-4">
            {t("meta.backToBlog")}
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-secondary font-medium hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("meta.backToBlog")}
          </Link>
        </motion.div>
      </div>
    );
  }

  const paragraphs = getPostBodyParagraphs(body);

  return (
    <div className="min-h-screen bg-white">
      {/* Banner: mismo ancho que el resto (container-section + content-section), fondo abs3.png */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: smoothEase }}
        className="pt-24 sm:pt-20 md:pt-24 pb-8 md:pb-12"
      >
        <div className="container-section">
          <div className="content-section">
            <div className="relative min-h-[280px] sm:min-h-[320px] md:min-h-[360px] rounded-2xl overflow-hidden">
              <Image
                src="/abs3.png"
                alt=""
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 1536px) 100vw, 1536px"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-body-sm text-[#060C20]/80 hover:text-[#060C20] mb-4 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t("meta.backToBlog")}
                </Link>
                <h1 className="text-heading-1 text-[#0f172a] leading-tight max-w-3xl">
                  {title}
                </h1>
                <p className="text-body text-gray-700 mt-3 line-clamp-2 max-w-2xl">
                  {excerpt}
                </p>
                <time
                  dateTime={date}
                  className="text-body-sm text-gray-600 mt-3 block"
                >
                  {t("meta.publishedOn")} {date}
                </time>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container-section py-10 md:py-14">
        <div className="content-section">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
            {/* Contenido principal */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: smoothEase }}
              className="flex-1 min-w-0"
            >
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-8 bg-gray-100">
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                  quality={100}
                  sizes="(max-width: 1024px) 100vw, 70vw"
                />
              </div>
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-body-lg text-gray-700 leading-relaxed mb-6 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </motion.article>

            {/* Sidebar: lista de posts con miniaturas, sticky; oculto en mobile */}
            <aside className="hidden lg:block lg:w-[280px] xl:w-[300px] shrink-0">
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: smoothEase }}
                className="lg:sticky lg:top-24"
              >
                <h2 className="text-base font-normal text-[#060C20] mb-4">
                  {t("meta.allPosts")}
                </h2>
                <nav className="flex flex-col gap-2">
                  {BLOG_SLUGS.map((s) => {
                    const isActive = s === slug;
                    const postTitle = t(`posts.${s}.title`);
                    const postImage = getBlogImage(s);
                    return (
                      <Link
                        key={s}
                        href={`/blog/${s}`}
                        className={`flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors ${
                          isActive
                            ? "bg-[#060C20] text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-[#060C20]"
                        }`}
                      >
                        <div className="relative w-14 h-10 shrink-0 rounded-md overflow-hidden bg-gray-200">
                          <Image
                            src={postImage}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <span className="text-body-sm font-normal line-clamp-2 flex-1 min-w-0">
                          {postTitle}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </motion.div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

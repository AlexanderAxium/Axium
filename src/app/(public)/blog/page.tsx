"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_IMAGES, BLOG_SLUGS } from "~/data/blog-data";
import { useTranslation } from "~/hooks/useTranslation";

const smoothEase = [0.4, 0, 0.2, 1] as const;

export default function BlogIndexPage() {
  const { t } = useTranslation("blog");

  return (
    <div className="min-h-screen bg-white">
      {/* Banner bajo con imagen de fondo (primera entrada o genérico) */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: smoothEase }}
        className="relative h-[180px] sm:h-[200px] md:h-[220px] overflow-hidden"
      >
        <Image
          src={BLOG_IMAGES["transformacion-digital"]}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-section w-full pb-6 md:pb-8">
            <div className="content-section">
              <h1 className="text-display-sm md:text-display text-white drop-shadow-sm">
                {t("meta.title")}
              </h1>
              <p className="text-body text-white/85 mt-2 max-w-xl">
                {t("meta.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container-section py-10 md:py-14">
        <div className="content-section">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
            {/* Lista de artículos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
              className="flex-1 min-w-0"
            >
              <ul className="flex flex-col gap-8">
                {BLOG_SLUGS.map((slug, idx) => (
                  <motion.li
                    key={slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.15 + idx * 0.08,
                      ease: smoothEase,
                    }}
                  >
                    <Link
                      href={`/blog/${slug}`}
                      className="group flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-300"
                    >
                      <div className="relative w-full sm:w-56 h-40 sm:h-36 shrink-0 bg-gray-100">
                        <Image
                          src={BLOG_IMAGES[slug]}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 224px"
                        />
                      </div>
                      <div className="p-4 sm:p-0 sm:py-4 sm:pr-4 flex flex-col justify-center min-w-0">
                        <time className="text-body-sm text-gray-500 mb-1">
                          {t(`posts.${slug}.date`)}
                        </time>
                        <h2 className="text-body font-bold text-[#060C20] group-hover:text-secondary transition-colors line-clamp-2">
                          {t(`posts.${slug}.title`)}
                        </h2>
                        <p className="text-body-sm text-gray-600 mt-1 line-clamp-2">
                          {t(`posts.${slug}.excerpt`)}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-body-sm font-medium text-secondary group-hover:gap-2.5 transition-all">
                          {t("meta.readMore")}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Sidebar sticky: todos los artículos */}
            <aside className="lg:w-[280px] xl:w-[300px] shrink-0">
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: smoothEase }}
                className="lg:sticky lg:top-24 rounded-xl border border-gray-200 bg-gray-50/80 p-5"
              >
                <h2 className="text-body font-bold text-[#060C20] mb-4">
                  {t("meta.allPosts")}
                </h2>
                <nav className="flex flex-col gap-1">
                  {BLOG_SLUGS.map((slug) => (
                    <Link
                      key={slug}
                      href={`/blog/${slug}`}
                      className="rounded-lg px-3 py-2.5 text-body-sm text-gray-600 hover:bg-white hover:text-[#060C20] border border-transparent hover:border-gray-200 transition-colors"
                    >
                      {t(`posts.${slug}.title`)}
                    </Link>
                  ))}
                </nav>
              </motion.div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

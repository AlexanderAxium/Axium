"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_IMAGES, BLOG_SLUGS } from "~/data/blog-data";
import { useTranslation } from "~/hooks/useTranslation";

const smoothEase = [0.4, 0, 0.2, 1] as const;

export function BlogSection() {
  const { t } = useTranslation("blog");

  return (
    <section id="blog" className="py-16 md:py-24 pb-16 md:pb-16 bg-white">
      <div className="container-section">
        <div className="content-section">
          <div className="mb-12 md:mb-16">
            <motion.h2
              className="text-display text-[#060C20] mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: smoothEase }}
            >
              {t("meta.title")}
            </motion.h2>
            <motion.p
              className="text-gray-500 text-body max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
            >
              {t("meta.subtitle")}
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: smoothEase }}
          >
            {BLOG_SLUGS.map((slug) => (
              <article
                key={slug}
                className="group flex flex-col bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-gray-300 hover:shadow-lg"
              >
                <Link href={`/blog/${slug}`} className="flex flex-1 flex-col">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-200">
                    <Image
                      src={BLOG_IMAGES[slug]}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <time
                      dateTime={t(`posts.${slug}.date`)}
                      className="text-body-sm text-gray-500 mb-2"
                    >
                      {t(`posts.${slug}.date`)}
                    </time>
                    <h3 className="text-body font-bold text-[#060C20] mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                      {t(`posts.${slug}.title`)}
                    </h3>
                    <p className="text-body-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
                      {t(`posts.${slug}.excerpt`)}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-medium text-secondary group-hover:gap-2.5 transition-all">
                      {t("meta.readMore")}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

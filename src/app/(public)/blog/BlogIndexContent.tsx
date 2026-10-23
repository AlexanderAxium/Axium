"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { PortadaBlog } from "~/components/axium/portada-blog";
import { BLOG_IMAGES, BLOG_SLUGS } from "~/data/blog-data";
import { useTranslation } from "~/hooks/useTranslation";

export default function BlogIndexContent() {
  const { t } = useTranslation("blog");

  return (
    <div className="min-h-screen bg-white">
      {/* Banner bajo con imagen de fondo (primera entrada o genérico) */}
      <header className="entra-css relative h-[180px] sm:h-[200px] md:h-[220px] overflow-hidden">
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
      </header>

      <div className="container-section py-10 md:py-14">
        <div className="content-section">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
            {/* Lista de artículos */}
            <div
              className="entra-css flex-1 min-w-0"
              style={{ "--entra-retraso": "0.1s" } as CSSProperties}
            >
              <ul className="flex flex-col gap-8">
                {BLOG_SLUGS.map((slug, idx) => (
                  <li
                    key={slug}
                    className="entra-css"
                    style={
                      {
                        "--entra-retraso": `${0.15 + idx * 0.08}s`,
                      } as CSSProperties
                    }
                  >
                    <Link
                      href={`/blog/${slug}`}
                      className="group flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-300"
                    >
                      <div className="w-full shrink-0 overflow-hidden sm:w-56">
                        <PortadaBlog slug={slug} />
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
                  </li>
                ))}
              </ul>
            </div>

            {/* Sidebar sticky: todos los artículos */}
            <aside className="lg:w-[280px] xl:w-[300px] shrink-0">
              <div
                className="entra-css lg:sticky lg:top-24 rounded-xl border border-gray-200 bg-gray-50/80 p-5"
                style={{ "--entra-retraso": "0.3s" } as CSSProperties}
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
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

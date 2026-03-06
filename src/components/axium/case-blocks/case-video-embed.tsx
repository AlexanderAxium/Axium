"use client";

import { Play } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

const smoothEase = [0.4, 0, 0.2, 1] as const;

interface CaseVideoEmbedProps {
  url: string;
  thumbnail?: string;
  caption?: string;
}

function getEmbedUrl(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch)
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;

  return null;
}

function getYtThumbnail(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (ytMatch)
    return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
  return null;
}

export function CaseVideoEmbed({
  url,
  thumbnail,
  caption,
}: CaseVideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getEmbedUrl(url);
  const thumbSrc = thumbnail || getYtThumbnail(url);
  const isDirectVideo = !embedUrl;

  return (
    <section className="relative w-full overflow-hidden bg-[#060C20] py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/3 h-64 w-64 rounded-full bg-[#0072CF]/15 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-[#7ECFC3]/8 blur-[80px]" />
      </div>

      <div className="relative z-10 container-section">
        <div className="content-section max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: smoothEase }}
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
              {!playing && !isDirectVideo ? (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="group relative flex h-full w-full items-center justify-center"
                >
                  {thumbSrc && (
                    <Image
                      src={thumbSrc}
                      alt="Video thumbnail"
                      fill
                      sizes="(max-width: 1024px) 100vw, 1024px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      quality={90}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/30" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30 sm:h-20 sm:w-20">
                    <Play className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                  </div>
                </button>
              ) : isDirectVideo ? (
                <video
                  src={url}
                  controls
                  autoPlay
                  className="h-full w-full object-cover"
                >
                  <track kind="captions" />
                </video>
              ) : embedUrl ? (
                <iframe
                  src={embedUrl}
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : null}
            </div>

            {caption && (
              <p className="mt-4 text-center text-body-sm text-white/50">
                {caption}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

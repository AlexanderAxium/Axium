"use client";

import { motion } from "motion/react";
import Image from "next/image";

const smoothEase = [0.4, 0, 0.2, 1] as const;

interface CaseImageItem {
  src: string;
  alt: string;
  caption?: string;
  /** "square" = 1:1, "full" = ancho completo (ej. última imagen), default = 4/3 */
  aspect?: "square" | "4/3" | "full";
}

interface CaseImagesProps {
  images: CaseImageItem[];
  columns?: 1 | 2 | 3;
  /** Custom column widths when columns=2, e.g. ["40%", "1fr"] */
  columnWidths?: [string, string];
  /** Si true, todas las imágenes usan el mismo alto (object-cover) */
  equalHeight?: boolean;
  /** Aspecto cuando equalHeight: "4/3" = landscape, "3/4" = portrait, "1/1" = cuadrado */
  equalHeightAspect?: "4/3" | "3/4" | "1/1";
}

/** Clean image grid with subtle borders. No backgrounds, no shadows, no 3D effects. */
export function CaseImages({
  images,
  columns = 2,
  columnWidths,
  equalHeight = false,
  equalHeightAspect = "4/3",
}: CaseImagesProps) {
  const useNarrowLeft =
    columnWidths?.[0] === "30%" && columnWidths?.[1] === "1fr";

  return (
    <div
      className={
        columns === 3
          ? "grid gap-6 md:grid-cols-3"
          : columns === 2
            ? useNarrowLeft
              ? "grid grid-cols-1 gap-6 md:grid-cols-[40%_1fr]"
              : "grid gap-6 md:grid-cols-2"
            : "grid gap-6"
      }
    >
      {images.map((img, i) => {
        const aspect = img.aspect ?? "4/3";
        const isFull = aspect === "full";
        const spanFull = isFull && (columns === 2 || columns === 3);

        return (
          <motion.figure
            key={img.src}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              ease: smoothEase,
              delay: i * 0.08,
            }}
            className={`flex min-h-0 flex-col ${spanFull ? (columns === 3 ? "md:col-span-3" : "md:col-span-2") : ""}`}
          >
            <div
              className={`overflow-hidden rounded-2xl border border-[#e2e8f0] w-full ${
                equalHeight
                  ? `relative ${
                      equalHeightAspect === "3/4"
                        ? "aspect-[3/4]"
                        : equalHeightAspect === "1/1"
                          ? "aspect-square"
                          : "aspect-[4/3]"
                    }`
                  : ""
              }`}
            >
              {equalHeight ? (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={1152}
                  height={648}
                  className="w-full h-auto"
                />
              )}
            </div>
            {img.caption && (
              <figcaption className="mt-3 text-center text-body-sm text-[#64748b]">
                {img.caption}
              </figcaption>
            )}
          </motion.figure>
        );
      })}
    </div>
  );
}

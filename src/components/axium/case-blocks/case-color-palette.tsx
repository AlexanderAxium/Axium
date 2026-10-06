"use client";

import { motion } from "motion/react";

const smoothEase = [0.4, 0, 0.2, 1] as const;

export interface ColorSwatch {
  hex: string;
  name: string;
}

interface CaseColorPaletteProps {
  title?: string;
  subtitle?: string;
  colors: ColorSwatch[];
  typography?: {
    heading: string;
    body: string;
  };
}

export function CaseColorPalette({
  title = "Identidad Visual",
  subtitle = "Paleta de Colores",
  colors,
  typography,
}: CaseColorPaletteProps) {
  if (!colors || colors.length === 0) return null;

  return (
    <section className="bg-white py-14 sm:py-18 lg:py-24">
      <div className="container-section">
        <div className="content-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: smoothEase }}
            className="mb-10"
          >
            <p className="text-overline mb-3 text-[#0072CF]">{subtitle}</p>
            <h2 className="text-heading-1 text-[#060C20]">{title}</h2>
          </motion.div>

          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {colors.map((color, i) => (
                  <motion.div
                    key={color.hex}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.08,
                      ease: smoothEase,
                    }}
                    className="group"
                  >
                    <div
                      className="mb-3 aspect-square rounded-2xl shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
                      style={{ backgroundColor: color.hex }}
                    />
                    <p className="text-body font-semibold text-[#060C20]">
                      {color.name}
                    </p>
                    <p className="text-body-sm font-mono text-[#8a919e]">
                      {color.hex}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {typography && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, ease: smoothEase }}
                className="lg:w-[35%]"
              >
                <div className="rounded-2xl border border-[#E5EAF3] bg-[#f8fafb] p-6">
                  <p className="text-overline mb-5 text-[#8a919e]">
                    Tipografía
                  </p>
                  <div className="flex flex-col gap-6">
                    <div>
                      <p className="text-body-sm mb-1 text-[#8a919e]">
                        Encabezados
                      </p>
                      <p
                        className="text-2xl font-bold text-[#060C20]"
                        style={{ fontFamily: typography.heading }}
                      >
                        {typography.heading}
                      </p>
                      <p className="mt-1 text-body-sm text-[#8a919e]">
                        Aa Bb Cc Dd Ee Ff Gg
                      </p>
                    </div>
                    <div className="border-t border-[#E5EAF3] pt-6">
                      <p className="text-body-sm mb-1 text-[#8a919e]">Cuerpo</p>
                      <p
                        className="text-lg text-[#060C20]"
                        style={{ fontFamily: typography.body }}
                      >
                        {typography.body}
                      </p>
                      <p className="mt-1 text-body-sm text-[#8a919e]">
                        Aa Bb Cc Dd Ee Ff Gg
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

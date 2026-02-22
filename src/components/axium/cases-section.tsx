"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { useTranslation } from "~/hooks/useTranslation";
import { useCasesWithLocale } from "~/lib/case-translations";

const slugMap: Record<string, string> = {
  Maintech: "maintech",
  "VitalChain Academy": "vitalchain",
  Feniz: "feniz",
  "Inner Soul Bright": "innersoulbright",
  Clefast: "clefast",
  "Happy Art": "happyart",
  "Redes VIP": "redesvip",
  "Sportt Peru": "sportt",
  "Vitivinícola Luján": "lujan",
  "Ventanas Antiruido": "ventanasantiruido",
  Decibeles: "antiruidopvc",
  "Transportes Rumi": "transportesrumi",
  Villacer: "villacer",
  "Daesur Motors": "daesurmotors",
  "First Automation": "firstautomation",
  "To Live Again": "toliveagain",
  "Podologie MTK": "podologiemtk",
  EnrafMedica: "enrafmedica",
};

export interface CasesSectionProps {
  /** Slug del proyecto actual para excluirlo (ej: en páginas de caso) */
  excludeSlug?: string;
  /** Título de la sección */
  title?: string;
  /** "dark" = fondo oscuro (inicio), "light" = fondo claro (páginas de caso) */
  variant?: "dark" | "light";
  /** ID para anchor (solo en homepage) */
  id?: string;
}

export function CasesSection({
  excludeSlug,
  title: titleProp,
  variant = "dark",
  id: idProp,
}: CasesSectionProps) {
  const id = idProp ?? (variant === "dark" ? "casos" : undefined);
  const cases = useCasesWithLocale();
  const { t } = useTranslation("landing");
  const title =
    titleProp ??
    (variant === "dark"
      ? t("caseDetail.casosDeExito")
      : t("caseDetail.masProyectos"));
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const filtered = excludeSlug
    ? cases.filter((c) => (c.slug ?? slugMap[c.title]) !== excludeSlug)
    : cases;
  const items = filtered;

  useEffect(() => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    api.on("select", () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    });
  }, [api]);

  const isDark = variant === "dark";

  return (
    <section
      id={id}
      className={`py-20 md:py-28 overflow-hidden relative ${
        isDark ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      {/* Light variant: mesh gradients */}
      {!isDark && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/80 to-slate-100" />
          <div className="absolute inset-0 bg-gradient-to-tl from-slate-100/60 via-transparent to-blue-50/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/50 to-slate-100/30" />
        </>
      )}

      <div className="relative z-10">
        <div className="container-section">
          <div className="content-section">
            <div className="flex items-center justify-between gap-4 mb-12 md:mb-16">
              <h2
                className={`text-display ${isDark ? "text-white" : "text-[#060C20]"}`}
              >
                {title}
              </h2>
              <div className="flex items-center gap-4">
                <Link
                  href="/#casos"
                  className={`text-body px-6 py-2 rounded-md font-medium whitespace-nowrap transition-colors ${
                    isDark
                      ? "border border-white text-white hover:bg-white/10"
                      : "border border-[#060C20]/20 text-[#060C20] hover:bg-[#060C20]/5"
                  }`}
                >
                  {t("caseDetail.verPortafolio")}
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  className={`size-8 rounded-full ${
                    isDark
                      ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                      : "border-[#060C20]/20 bg-white text-[#060C20] hover:bg-[#060C20]/5"
                  }`}
                  disabled={!canScrollPrev}
                  onClick={() => api?.scrollPrev()}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="sr-only">{t("caseDetail.anterior")}</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`size-8 rounded-full ${
                    isDark
                      ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                      : "border-[#060C20]/20 bg-white text-[#060C20] hover:bg-[#060C20]/5"
                  }`}
                  disabled={!canScrollNext}
                  onClick={() => api?.scrollNext()}
                >
                  <ArrowRight className="w-4 h-4" />
                  <span className="sr-only">{t("caseDetail.siguiente")}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-section">
          <div className="content-section overflow-visible">
            <div className="relative -mr-4 sm:-mr-6 lg:-mr-8">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                  skipSnaps: false,
                  dragFree: true,
                }}
                setApi={setApi}
                className="w-full overflow-visible"
              >
                <CarouselContent className="pr-4 sm:pr-6 lg:pr-8 gap-4 sm:gap-6 ml-0">
                  {items.map((caseItem, idx) => (
                    <CarouselItem
                      key={`${caseItem.title}-${idx}`}
                      className="shrink-0 basis-[85%] sm:basis-[70%] md:basis-[60%] lg:basis-[45%] xl:basis-[35%] pl-0"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <Link
                          href={`/casos-de-exito/${caseItem.slug ?? slugMap[caseItem.title] ?? caseItem.title.toLowerCase()}`}
                        >
                          <Card
                            className={`overflow-hidden group h-full cursor-pointer transition-all duration-300 ${
                              isDark
                                ? "border border-gray-700/50 hover:border-gray-600 hover:shadow-2xl bg-gray-900/50 backdrop-blur-sm"
                                : "border border-gray-200/80 bg-white hover:border-[#0072CF]/30 hover:shadow-xl"
                            }`}
                          >
                            <div
                              className={`relative h-[320px] overflow-hidden ${
                                isDark
                                  ? "bg-gradient-to-br from-gray-800 to-gray-900"
                                  : "bg-gradient-to-br from-gray-100 to-gray-200"
                              }`}
                            >
                              <img
                                src={caseItem.image}
                                alt={caseItem.title}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              />
                              <div
                                className={`absolute inset-0 bg-gradient-to-t ${
                                  isDark
                                    ? "from-black/80 via-black/40 to-transparent"
                                    : "from-black/50 via-black/20 to-transparent"
                                }`}
                              />

                              <Badge
                                className={`absolute top-4 left-4 shadow-lg ${
                                  isDark
                                    ? "bg-secondary text-white hover:bg-secondary/90 border-0"
                                    : "bg-[#0072CF] text-white border-0 hover:bg-[#0072CF]/90"
                                }`}
                              >
                                {caseItem.industry}
                              </Badge>

                              <div className="absolute bottom-4 left-4 right-4">
                                <h3
                                  className={`mb-1 drop-shadow-lg ${
                                    isDark
                                      ? "text-heading-2 text-white"
                                      : "text-2xl font-bold text-white"
                                  }`}
                                >
                                  {caseItem.title}
                                </h3>
                              </div>
                            </div>

                            <CardContent className="p-6 flex flex-col gap-4">
                              <p
                                className={`text-body-sm line-clamp-2 ${
                                  isDark ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                {caseItem.description}
                              </p>

                              <div className="flex flex-wrap gap-2 mt-auto">
                                {caseItem.services
                                  .slice(0, 2)
                                  .map((service) => (
                                    <span
                                      key={service}
                                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        isDark
                                          ? "bg-accent/20 border border-accent/40 text-accent"
                                          : "border border-[#0072CF]/30 bg-[#0072CF]/10 text-[#0072CF]"
                                      }`}
                                    >
                                      {service}
                                    </span>
                                  ))}
                                {caseItem.services.length > 2 && (
                                  <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                      isDark
                                        ? "bg-gray-700/50 border border-gray-600 text-gray-300"
                                        : "border border-gray-200 bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    +{caseItem.services.length - 2}
                                  </span>
                                )}
                              </div>

                              <div
                                className={`flex items-center gap-2 text-body-sm font-semibold mt-2 group-hover:gap-3 transition-all ${
                                  isDark ? "text-secondary" : "text-[#0072CF]"
                                }`}
                              >
                                <span>{t("caseDetail.verDetalles")}</span>
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

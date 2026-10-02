"use client";

import { CaseContactCTA } from "@/components/axium/case-contact-cta";
import { MagneticCursorArrow } from "@/components/axium/magnetic-cursor-arrow";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { useCasesWithLocale } from "@/lib/case-translations";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Múltiplo de las tres anchuras de rejilla (3 · 2 · 1), para que ninguna página
 * completa termine en una fila coja. Con 20 la última fila quedaba con 2 de 3.
 */
const ITEMS_PER_PAGE = 24;

/** Respeta a quien pidió menos movimiento en su sistema. */
const prefiereMenosMovimiento = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ─── Slug helper ──────────────────────────────────────────────────────────────
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
  Huarmis: "huarmis",
  "Favor & Gracia Church": "favorygracia",
  "Hoteles Paraíso": "hotelesparaiso",
  "JCP Ingenieros": "jcpingenieros",
  "Travel Life": "lifetoursfl",
  "Comunicarte Editores": "comunicarte",
  "GHI Peru": "ghiperu",
  "ANJ Sports": "anjsports",
  AmbientalPE: "ambientalpe",
  "Instructor Management System": "siclo",
  "Financial Management System": "financial-management",
  "Feedback Management System": "feedback-management",
};

function getSlug(title: string, slug?: string) {
  return slug ?? slugMap[title] ?? title.toLowerCase().replace(/\s+/g, "-");
}

// ─── Filter definitions ───────────────────────────────────────────────────────
// Barra superior, no columna lateral: las referencias (basic, upstatement, viget,
// barrel) nunca enseñan más de 3–8 etiquetas de un eje a la vez. De ahí que el
// eje de sector pase de 18 etiquetas a 8 agrupadas.
//
// REGLA: un caso puede estar en más de un filtro, pero **ningún slug de
// CASE_ORDER puede faltar en los tres ejes a la vez**: si no entra en ninguna
// lista, queda invisible para quien filtra (pasó con los cuatro SaaS propios y
// con las siete fichas de 2026-09).

// Eje 1 — Qué hacemos. Es el eje por defecto: las referencias clasifican por el
// trabajo entregado (upstatement: Brands/Products/Editorial/Websites), no por el
// rubro del cliente.
const SERVICE_FILTERS: { label: string; slugs: string[] }[] = [
  {
    label: "Tienda online",
    slugs: [
      "vendiq",
      "aurore",
      "clefast",
      "sportt",
      "lujan",
      "happyart",
      "comunicarte",
      "anjsports",
    ],
  },
  {
    label: "Reservas y agenda",
    slugs: [
      "bookit",
      "rematch",
      "capptura",
      "blendet",
      "jarumi",
      "moviflex",
      "podologiemtk",
      "cesaracosta",
      "lifetoursfl",
    ],
  },
  {
    label: "Plataforma a medida",
    slugs: [
      "rematch",
      "lumiolearn",
      "bookit",
      "vendiq",
      "feniz",
      "siclo",
      "financial-management",
      "feedback-management",
      "ambientalpe",
      "qintitec",
      "web-scraping-ai",
    ],
  },
  {
    label: "Formación online",
    slugs: ["lumiolearn", "maintech", "vitalchain", "huarmis", "cesaracosta"],
  },
  {
    label: "Web de marca",
    slugs: [
      "antiruidopvc",
      "daesurmotors",
      "enrafmedica",
      "firstautomation",
      "podologiemtk",
      "toliveagain",
      "volveravivir",
      "transportesrumi",
      "ventanasantiruido",
      "redesvip",
      "huarmis",
      "favorygracia",
      "hotelesparaiso",
      "jcpingenieros",
      "comunicarte",
      "ghiperu",
      "anjsports",
      "cesaracosta",
      "fenalsa",
      "villacer",
      "innersoulbright",
      "qintitec",
      "blendet",
      "jarumi",
      "capptura",
      "moviflex",
      "ambientalpe",
    ],
  },
  {
    label: "Identidad de marca",
    slugs: [
      "aurore",
      "alyer",
      "maintech",
      "happyart",
      "villacer",
      "cesaracosta",
      "blendet",
      "jarumi",
    ],
  },
];

// Eje 2 — Sector. Ocho categorías amplias (barrel enseña cuatro para todo su
// catálogo). Las 18 anteriores mezclaban rubro con tipo de producto:
// «E-commerce» y «Reservas y citas» se fueron al eje de servicio, donde
// pertenecen, y los rubros de un solo caso se agruparon por comprador.
const INDUSTRY_FILTERS: { label: string; slugs: string[] }[] = [
  {
    label: "Productos propios",
    slugs: ["rematch", "lumiolearn", "bookit", "vendiq"],
  },
  {
    label: "Retail y consumo",
    slugs: [
      "vendiq",
      "aurore",
      "clefast",
      "sportt",
      "lujan",
      "happyart",
      "anjsports",
      "comunicarte",
      "fenalsa",
    ],
  },
  {
    label: "Salud y bienestar",
    slugs: [
      "moviflex",
      "podologiemtk",
      "enrafmedica",
      "innersoulbright",
      "blendet",
      "jarumi",
      "vitalchain",
    ],
  },
  {
    label: "Educación y deporte",
    slugs: [
      "lumiolearn",
      "maintech",
      "vitalchain",
      "huarmis",
      "cesaracosta",
      "siclo",
      "rematch",
      "anjsports",
      "sportt",
    ],
  },
  {
    label: "Tecnología y finanzas",
    slugs: [
      "feniz",
      "qintitec",
      "financial-management",
      "feedback-management",
      "web-scraping-ai",
      "redesvip",
      "firstautomation",
      "siclo",
    ],
  },
  {
    label: "Industria y construcción",
    slugs: [
      "alyer",
      "transportesrumi",
      "villacer",
      "ventanasantiruido",
      "antiruidopvc",
      "daesurmotors",
      "jcpingenieros",
      "ambientalpe",
      "firstautomation",
    ],
  },
  {
    label: "Hotelería, turismo y ocio",
    slugs: ["hotelesparaiso", "ghiperu", "lifetoursfl", "capptura"],
  },
  {
    label: "Organizaciones",
    slugs: ["favorygracia", "volveravivir", "toliveagain", "huarmis"],
  },
];

// Eje 3 — Tecnología. Cinco. Fuera «TypeScript», que duplicaba casi exactamente
// a Next.js sin decir nada distinto al cliente.
const TECH_FILTERS: { label: string; slugs: string[] }[] = [
  {
    label: "Next.js",
    slugs: [
      "rematch",
      "lumiolearn",
      "bookit",
      "vendiq",
      "aurore",
      "toliveagain",
      "volveravivir",
      "feniz",
      "maintech",
      "sportt",
      "clefast",
      "vitalchain",
      "redesvip",
      "hotelesparaiso",
      "lifetoursfl",
      "siclo",
      "financial-management",
      "moviflex",
      "capptura",
      "blendet",
      "jarumi",
      "qintitec",
      "cesaracosta",
    ],
  },
  {
    label: "WordPress",
    slugs: [
      "antiruidopvc",
      "daesurmotors",
      "enrafmedica",
      "firstautomation",
      "lujan",
      "podologiemtk",
      "transportesrumi",
      "ventanasantiruido",
      "villacer",
      "huarmis",
      "happyart",
      "jcpingenieros",
      "comunicarte",
      "ghiperu",
      "anjsports",
      "fenalsa",
      "ambientalpe",
    ],
  },
  {
    label: "WooCommerce",
    slugs: ["lujan", "happyart", "comunicarte", "anjsports", "ambientalpe"],
  },
  {
    label: "React",
    slugs: [
      "favorygracia",
      "feedback-management",
      "ambientalpe",
      "innersoulbright",
    ],
  },
  { label: "IA y datos", slugs: ["web-scraping-ai", "lumiolearn", "feniz"] },
];

type SortKey = "default" | "az" | "za";
type AxisKey = "service" | "industry" | "tech";

function getAllowedSlugs(
  active: Set<string>,
  filterList: { label: string; slugs: string[] }[]
): Set<string> | null {
  if (active.size === 0) return null;
  const s = new Set<string>();
  for (const lbl of active) {
    filterList.find((x) => x.label === lbl)?.slugs.forEach((sl) => s.add(sl));
  }
  return s;
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function PortfolioCard({
  caseItem,
  index,
  industryLabel,
  serviceLabel,
  slug,
}: {
  caseItem: { title: string; image: string; description?: string };
  index: number;
  industryLabel: string;
  serviceLabel?: string;
  slug: string;
}) {
  const { t } = useTranslation("landing");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.24) }}
    >
      <MagneticCursorArrow label={t("portfolio.verProyecto")}>
        <Link href={`/casos-de-exito/${slug}`} className="group block">
          <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-gray-100 mb-4">
            <Image
              src={caseItem.image}
              alt={caseItem.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              quality={85}
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-500 bg-white">
              {industryLabel}
            </span>
            {serviceLabel && serviceLabel !== industryLabel && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-500 bg-white">
                {serviceLabel}
              </span>
            )}
          </div>
          <h2 className="text-heading-2 text-[#060C20] group-hover:text-[#0072CF] transition-colors duration-200 leading-snug">
            {caseItem.title}
          </h2>
        </Link>
      </MagneticCursorArrow>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function PortfolioPageContent() {
  const cases = useCasesWithLocale();
  const { t } = useTranslation("landing");

  const [activeIndustry, setActiveIndustry] = useState<Set<string>>(new Set());
  const [activeService, setActiveService] = useState<Set<string>>(new Set());
  const [activeTech, setActiveTech] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const [openAxis, setOpenAxis] = useState<AxisKey | null>("service");

  const toggleFilter = (
    setter: (s: Set<string>) => void,
    current: Set<string>,
    label: string
  ) => {
    const next = new Set(current);
    if (next.has(label)) next.delete(label);
    else next.add(label);
    setter(next);
  };

  const industryAllowed = useMemo(
    () => getAllowedSlugs(activeIndustry, INDUSTRY_FILTERS),
    [activeIndustry]
  );
  const serviceAllowed = useMemo(
    () => getAllowedSlugs(activeService, SERVICE_FILTERS),
    [activeService]
  );
  const techAllowed = useMemo(
    () => getAllowedSlugs(activeTech, TECH_FILTERS),
    [activeTech]
  );

  const filtered = useMemo(() => {
    let list = cases.filter((c) => {
      const slug = getSlug(c.title, c.slug);
      if (industryAllowed && !industryAllowed.has(slug)) return false;
      if (serviceAllowed && !serviceAllowed.has(slug)) return false;
      if (techAllowed && !techAllowed.has(slug)) return false;
      return true;
    });
    if (sortKey === "az")
      list = [...list].sort((a, b) => a.title.localeCompare(b.title, "es"));
    if (sortKey === "za")
      list = [...list].sort((a, b) => b.title.localeCompare(a.title, "es"));
    return list;
  }, [cases, industryAllowed, serviceAllowed, techAllowed, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  /**
   * Al cambiar de página hay que volver al principio de la rejilla; si no, se
   * aterriza al final de las tarjetas nuevas. Hay que hacerlo DESPUÉS de repintar:
   * medir en el mismo clic da la posición vieja, y un desplazamiento suave lanzado
   * antes del repintado lo cancela el propio cambio de altura del documento.
   */
  const rejillaRef = useRef<HTMLDivElement | null>(null);
  const subirTrasPintar = useRef(false);
  const irAPagina = (n: number) => {
    subirTrasPintar.current = true;
    setCurrentPage(n);
  };
  // El salto ocurre cuando la página cambia y la rejilla ya se repintó.
  // biome-ignore lint/correctness/useExhaustiveDependencies: currentPage es el disparador, no se lee dentro
  useEffect(() => {
    if (!subirTrasPintar.current) return;
    subirTrasPintar.current = false;
    const caja = rejillaRef.current?.getBoundingClientRect();
    if (!caja) return;
    window.scrollTo({
      top: Math.max(0, window.scrollY + caja.top - 96),
      behavior: prefiereMenosMovimiento() ? "auto" : "smooth",
    });
  }, [currentPage]);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = useMemo(
    () => filtered.slice(start, start + ITEMS_PER_PAGE),
    [filtered, start]
  );

  // Reset to page 1 when filters or sort change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intent is to reset page when any of these change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeIndustry, activeService, activeTech, sortKey]);

  const hasFilters =
    activeIndustry.size > 0 || activeService.size > 0 || activeTech.size > 0;
  const resetAll = () => {
    setActiveIndustry(new Set());
    setActiveService(new Set());
    setActiveTech(new Set());
  };

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "default", label: t("portfolio.sortDefault") },
    { key: "az", label: t("portfolio.sortAZ") },
    { key: "za", label: t("portfolio.sortZA") },
  ];
  const sortLabel =
    SORT_OPTIONS.find((o) => o.key === sortKey)?.label ??
    t("portfolio.sortDefault");

  const AXES: {
    key: AxisKey;
    label: string;
    items: { label: string; slugs: string[] }[];
    active: Set<string>;
    onToggle: (label: string) => void;
  }[] = [
    {
      key: "service",
      label: t("portfolio.queHacemos"),
      items: SERVICE_FILTERS,
      active: activeService,
      onToggle: (l) => toggleFilter(setActiveService, activeService, l),
    },
    {
      key: "industry",
      label: t("portfolio.sector"),
      items: INDUSTRY_FILTERS,
      active: activeIndustry,
      onToggle: (l) => toggleFilter(setActiveIndustry, activeIndustry, l),
    },
    {
      key: "tech",
      label: t("portfolio.tecnologia"),
      items: TECH_FILTERS,
      active: activeTech,
      onToggle: (l) => toggleFilter(setActiveTech, activeTech, l),
    },
  ];

  const openAxisData = AXES.find((a) => a.key === openAxis);

  const activeChips: { axis: AxisKey; label: string }[] = [
    ...[...activeService].map((label) => ({
      axis: "service" as AxisKey,
      label,
    })),
    ...[...activeIndustry].map((label) => ({
      axis: "industry" as AxisKey,
      label,
    })),
    ...[...activeTech].map((label) => ({ axis: "tech" as AxisKey, label })),
  ];

  const removeChip = (axis: AxisKey, label: string) => {
    if (axis === "service")
      toggleFilter(setActiveService, activeService, label);
    if (axis === "industry")
      toggleFilter(setActiveIndustry, activeIndustry, label);
    if (axis === "tech") toggleFilter(setActiveTech, activeTech, label);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section
        id="page-hero"
        className="relative min-h-[40vh] flex flex-col justify-end pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/abs12.png')" }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container-section">
          <div className="content-section">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-overline text-white/80 mb-3 tracking-widest uppercase"
            >
              {t("portfolio.nuestroTrabajo")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-display text-white mb-3 max-w-2xl"
            >
              {t("portfolio.titulo")}{" "}
              <span className="text-white">{t("portfolio.tituloBold")}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-body text-white/70 max-w-xl"
            >
              {t("portfolio.subtitulo", {
                count: String(cases.length),
                industries: String(INDUSTRY_FILTERS.length),
              })}
            </motion.p>
          </div>
        </div>
      </section>

      <div className="container-section">
        <div className="content-section">
          {/* ─── Barra superior de filtros ─────────────────────────────────── */}
          <div className="border-b border-gray-200">
            {/* Fila 1: ejes + conteo */}
            <div className="flex items-center justify-between gap-4 pt-6 pb-3 md:pt-8">
              <div className="flex items-center gap-4 sm:gap-7 overflow-x-auto scrollbar-hide min-w-0 [mask-image:linear-gradient(to_right,black_calc(100%-24px),transparent)] sm:[mask-image:none]">
                <button
                  type="button"
                  onClick={() => {
                    resetAll();
                    setOpenAxis(null);
                  }}
                  className={`inline-flex min-h-6 min-w-6 shrink-0 items-center justify-center whitespace-nowrap border-b-2 pb-1 text-sm sm:text-base tracking-wide transition-colors ${
                    !hasFilters && openAxis === null
                      ? "border-[#060C20] text-[#060C20] font-semibold"
                      : "border-transparent text-gray-500 hover:text-[#060C20]"
                  }`}
                >
                  {t("portfolio.todos")}
                </button>
                {AXES.map((axis) => (
                  <button
                    key={axis.key}
                    type="button"
                    onClick={() =>
                      setOpenAxis((v) => (v === axis.key ? null : axis.key))
                    }
                    className={`shrink-0 whitespace-nowrap border-b-2 pb-1 text-sm sm:text-base tracking-wide transition-colors flex items-center gap-1.5 ${
                      openAxis === axis.key
                        ? "border-[#060C20] text-[#060C20] font-semibold"
                        : "border-transparent text-gray-500 hover:text-[#060C20]"
                    }`}
                  >
                    {axis.label}
                    {axis.active.size > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0072CF]" />
                    )}
                  </button>
                ))}
              </div>
              <p className="hidden sm:block shrink-0 text-sm text-gray-400 tabular-nums uppercase tracking-wider">
                {t("portfolio.mostrando")}{" "}
                <span className="text-[#060C20] font-semibold">
                  ({filtered.length}
                  {hasFilters ? ` / ${cases.length}` : ""})
                </span>
              </p>
            </div>

            {/* Fila 2: opciones del eje abierto */}
            {openAxisData && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 [mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent)] lg:flex-wrap lg:gap-y-2 lg:overflow-visible lg:[mask-image:none]">
                {openAxisData.items.map(({ label, slugs }) => {
                  const on = openAxisData.active.has(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => openAxisData.onToggle(label)}
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors ${
                        on
                          ? "bg-[#060C20] border-[#060C20] text-white"
                          : "bg-white border-gray-200 text-gray-600 hover:border-[#060C20] hover:text-[#060C20]"
                      }`}
                    >
                      {label}
                      <span
                        className={`text-[11px] tabular-nums ${on ? "text-white/60" : "text-gray-300"}`}
                      >
                        {slugs.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Fila 3: filtros activos + orden */}
            <div className="flex items-center justify-between gap-x-3 gap-y-2 pb-4 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <p className="sm:hidden shrink-0 text-xs text-gray-400 tabular-nums uppercase tracking-wider">
                  {t("portfolio.mostrando")}{" "}
                  <span className="text-[#060C20] font-semibold">
                    ({filtered.length}
                    {hasFilters ? ` / ${cases.length}` : ""})
                  </span>
                </p>
                {activeChips.map(({ axis, label }) => (
                  <button
                    key={`${axis}-${label}`}
                    type="button"
                    onClick={() => removeChip(axis, label)}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#060C20] text-white hover:opacity-90"
                  >
                    {label} <X className="w-3 h-3" />
                  </button>
                ))}
                {hasFilters && (
                  <button
                    type="button"
                    onClick={resetAll}
                    className="text-xs text-gray-400 hover:text-[#060C20] underline underline-offset-2"
                  >
                    {t("portfolio.limpiarTodo")}
                  </button>
                )}
              </div>
              <div className="relative shrink-0 ml-auto">
                <button
                  type="button"
                  onClick={() => setSortOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 border border-gray-200 bg-white hover:border-gray-300"
                >
                  {sortLabel}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform ${sortOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {sortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setSortOpen(false)}
                      onKeyDown={(e) =>
                        e.key === "Escape" && setSortOpen(false)
                      }
                      role="button"
                      tabIndex={-1}
                      aria-hidden
                    />
                    <div className="absolute right-0 top-full mt-1.5 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-40">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            setSortKey(opt.key);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            sortKey === opt.key
                              ? "bg-gradient-to-br from-slate-200/90 to-blue-100/70 text-slate-700 font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ─── Rejilla + paginación ──────────────────────────────────────── */}
          <div className="py-8 md:py-12">
            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-heading-3 text-gray-300 mb-2">
                  {t("portfolio.sinResultados")}
                </p>
                <p className="text-body text-gray-400 mb-4">
                  {t("portfolio.sinResultadosDesc")}
                </p>
                <button
                  type="button"
                  onClick={resetAll}
                  className="text-sm text-[#0072CF] underline"
                >
                  {t("portfolio.verTodos")}
                </button>
              </div>
            ) : (
              <>
                <div
                  ref={rejillaRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10"
                >
                  {pageItems.map((caseItem, idx) => {
                    const slug = getSlug(caseItem.title, caseItem.slug);
                    const industryLabel =
                      INDUSTRY_FILTERS.find((f) => f.slugs.includes(slug))
                        ?.label ?? caseItem.industry;
                    const serviceLabel = SERVICE_FILTERS.find((f) =>
                      f.slugs.includes(slug)
                    )?.label;
                    return (
                      <PortfolioCard
                        key={caseItem.title}
                        caseItem={caseItem}
                        index={idx}
                        industryLabel={industryLabel}
                        serviceLabel={serviceLabel}
                        slug={slug}
                      />
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      {t("portfolio.paginaDe", {
                        current: String(currentPage),
                        total: String(totalPages),
                      })}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => irAPagina(Math.max(1, currentPage - 1))}
                        disabled={currentPage <= 1}
                        className="gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        {t("portfolio.anterior")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          irAPagina(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage >= totalPages}
                        className="gap-1"
                      >
                        {t("portfolio.siguiente")}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <CaseContactCTA />
    </main>
  );
}

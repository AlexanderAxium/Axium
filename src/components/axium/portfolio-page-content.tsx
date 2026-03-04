"use client";

import { CaseContactCTA } from "@/components/axium/case-contact-cta";
import { MagneticCursorArrow } from "@/components/axium/magnetic-cursor-arrow";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslation } from "@/hooks/useTranslation";
import { useCasesWithLocale } from "@/lib/case-translations";
import { ChevronDown, LayoutGrid, List, Settings, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";

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
  "E-commerce & Inventory SaaS": "store-saas",
  "Financial Management System": "financial-management",
  "Feedback Management System": "feedback-management",
};

function getSlug(title: string, slug?: string) {
  return slug ?? slugMap[title] ?? title.toLowerCase().replace(/\s+/g, "-");
}

// ─── Filter definitions ───────────────────────────────────────────────────────
const INDUSTRY_FILTERS: { label: string; slugs: string[] }[] = [
  {
    label: "E-commerce",
    slugs: [
      "clefast",
      "sportt",
      "lujan",
      "happyart",
      "anjsports",
      "store-saas",
    ],
  },
  {
    label: "Salud",
    slugs: ["podologiemtk", "enrafmedica", "toliveagain", "innersoulbright"],
  },
  { label: "Educación", slugs: ["maintech", "vitalchain", "huarmis"] },
  {
    label: "Tecnología",
    slugs: ["feniz", "firstautomation", "redesvip", "siclo"],
  },
  { label: "Finanzas", slugs: ["financial-management"] },
  {
    label: "Experiencia de cliente",
    slugs: ["feedback-management"],
  },
  { label: "Medio ambiente", slugs: ["ambientalpe"] },
  {
    label: "Construcción",
    slugs: ["antiruidopvc", "ventanasantiruido", "villacer"],
  },
  { label: "Automotriz", slugs: ["daesurmotors"] },
  { label: "Logística", slugs: ["transportesrumi"] },
  { label: "Organizaciones", slugs: ["favorygracia"] },
  { label: "Hotelería", slugs: ["hotelesparaiso", "ghiperu"] },
  { label: "Ingeniería", slugs: ["jcpingenieros"] },
  { label: "Turismo", slugs: ["lifetoursfl"] },
  { label: "Editorial / Cultura", slugs: ["comunicarte"] },
];

const SERVICE_FILTERS: { label: string; slugs: string[] }[] = [
  {
    label: "Tienda Virtual",
    slugs: [
      "clefast",
      "sportt",
      "lujan",
      "happyart",
      "comunicarte",
      "anjsports",
      "store-saas",
    ],
  },
  { label: "E-Learning", slugs: ["maintech", "vitalchain"] },
  {
    label: "Branding",
    slugs: ["maintech", "happyart", "villacer", "innersoulbright"],
  },
  {
    label: "Web Informativa",
    slugs: [
      "antiruidopvc",
      "daesurmotors",
      "enrafmedica",
      "firstautomation",
      "podologiemtk",
      "toliveagain",
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
    ],
  },
  {
    label: "Dashboard / App",
    slugs: [
      "feniz",
      "lifetoursfl",
      "siclo",
      "financial-management",
      "feedback-management",
      "ambientalpe",
    ],
  },
  { label: "Donaciones", slugs: ["toliveagain", "huarmis", "favorygracia"] },
];

const TECH_FILTERS: { label: string; slugs: string[] }[] = [
  {
    label: "Next.js",
    slugs: [
      "feniz",
      "maintech",
      "sportt",
      "clefast",
      "vitalchain",
      "redesvip",
      "innersoulbright",
      "hotelesparaiso",
      "lifetoursfl",
      "siclo",
      "financial-management",
      "feedback-management",
      "ambientalpe",
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
      "toliveagain",
      "transportesrumi",
      "ventanasantiruido",
      "villacer",
      "huarmis",
      "happyart",
      "jcpingenieros",
      "comunicarte",
      "ghiperu",
      "anjsports",
    ],
  },
  {
    label: "WooCommerce",
    slugs: ["lujan", "happyart", "comunicarte", "anjsports"],
  },
  { label: "Blockchain", slugs: ["vitalchain"] },
  {
    label: "TypeScript",
    slugs: [
      "feniz",
      "maintech",
      "sportt",
      "clefast",
      "vitalchain",
      "redesvip",
      "innersoulbright",
      "hotelesparaiso",
      "lifetoursfl",
      "siclo",
    ],
  },
];

type SortKey = "default" | "az" | "za";
type ViewMode = "grid" | "list";

// ─── Grid card with magnetic cursor arrow ────────────────────────────────────
function GridCard({
  caseItem,
  idx,
  industryLabel,
  serviceLabel,
  slug,
}: {
  caseItem: { title: string; image: string; description?: string };
  idx: number;
  industryLabel: string;
  serviceLabel?: string;
  slug: string;
}) {
  const { t } = useTranslation("landing");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(idx * 0.04, 0.32),
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <MagneticCursorArrow label={t("portfolio.verProyecto")}>
        <Link href={`/casos-de-exito/${slug}`} className="group block">
          {/* Image */}
          <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-gray-100 mb-4 min-w-0">
            <img
              src={caseItem.image}
              alt={caseItem.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 max-w-full"
            />
          </div>

          {/* Tags */}
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

          {/* Title */}
          <h2 className="text-heading-2 text-[#060C20] group-hover:text-[#0072CF] transition-colors duration-200 leading-snug break-words">
            {caseItem.title}
          </h2>
        </Link>
      </MagneticCursorArrow>
    </motion.div>
  );
}

// ─── Accordion filter section ─────────────────────────────────────────────────
function FilterSection({
  title,
  items,
  activeLabels,
  onToggle,
}: {
  title: string;
  items: { label: string; slugs: string[] }[];
  activeLabels: Set<string>;
  onToggle: (label: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const hasActive = items.some((i) => activeLabels.has(i.label));

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-base font-semibold text-[#060C20] hover:text-[#0072CF] transition-colors"
      >
        <span className="flex items-center gap-2">
          {title}
          {hasActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#0072CF]" />
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="pb-3 flex flex-col gap-0.5">
          {items.map(({ label, slugs }) => {
            const active = activeLabels.has(label);
            return (
              <button
                key={label}
                type="button"
                onClick={() => onToggle(label)}
                className={`flex items-center justify-between w-full text-left px-2 py-2 rounded-lg text-sm transition-all ${
                  active
                    ? "bg-gradient-to-br from-slate-200/90 to-blue-100/70 text-slate-700 font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#060C20]"
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-xs tabular-nums ${active ? "text-slate-500" : "text-gray-300"}`}
                >
                  {slugs.length}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function PortfolioPageContent() {
  const cases = useCasesWithLocale();
  const { t } = useTranslation("landing");

  const [activeIndustry, setActiveIndustry] = useState<Set<string>>(new Set());
  const [activeService, setActiveService] = useState<Set<string>>(new Set());
  const [activeTech, setActiveTech] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  function toggle(
    set: Set<string>,
    setter: (s: Set<string>) => void,
    label: string
  ) {
    const next = new Set(set);
    if (next.has(label)) next.delete(label);
    else next.add(label);
    setter(next);
  }

  const resetAll = () => {
    setActiveIndustry(new Set());
    setActiveService(new Set());
    setActiveTech(new Set());
  };

  const hasFilters =
    activeIndustry.size > 0 || activeService.size > 0 || activeTech.size > 0;

  const industryAllowed = useMemo(() => {
    if (activeIndustry.size === 0) return null;
    const s = new Set<string>();
    for (const lbl of activeIndustry) {
      INDUSTRY_FILTERS.find((x) => x.label === lbl)?.slugs.forEach((sl) =>
        s.add(sl)
      );
    }
    return s;
  }, [activeIndustry]);

  const serviceAllowed = useMemo(() => {
    if (activeService.size === 0) return null;
    const s = new Set<string>();
    for (const lbl of activeService) {
      SERVICE_FILTERS.find((x) => x.label === lbl)?.slugs.forEach((sl) =>
        s.add(sl)
      );
    }
    return s;
  }, [activeService]);

  const techAllowed = useMemo(() => {
    if (activeTech.size === 0) return null;
    const s = new Set<string>();
    for (const lbl of activeTech) {
      TECH_FILTERS.find((x) => x.label === lbl)?.slugs.forEach((sl) =>
        s.add(sl)
      );
    }
    return s;
  }, [activeTech]);

  const filtered = useMemo(() => {
    const base = cases.filter((c) => {
      const slug = getSlug(c.title, c.slug);
      if (industryAllowed && !industryAllowed.has(slug)) return false;
      if (serviceAllowed && !serviceAllowed.has(slug)) return false;
      if (techAllowed && !techAllowed.has(slug)) return false;
      return true;
    });

    if (sortKey === "az")
      return [...base].sort((a, b) => a.title.localeCompare(b.title, "es"));
    if (sortKey === "za")
      return [...base].sort((a, b) => b.title.localeCompare(a.title, "es"));
    return base;
  }, [cases, industryAllowed, serviceAllowed, techAllowed, sortKey]);

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "default", label: t("portfolio.sortDefault") },
    { key: "az", label: t("portfolio.sortAZ") },
    { key: "za", label: t("portfolio.sortZA") },
  ];

  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.key === sortKey)?.label ??
    t("portfolio.sortDefault");

  return (
    <main className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#060C20] pt-24 pb-10 md:pt-28 md:pb-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0072CF]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 container-section">
          <div className="content-section">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-overline text-[#7ECFC3] mb-3 tracking-widest uppercase"
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
              <span className="text-[#0072CF]">
                {t("portfolio.tituloBold")}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-body text-white/55 max-w-xl"
            >
              {t("portfolio.subtitulo", {
                count: String(cases.length),
                industries: String(INDUSTRY_FILTERS.length),
              })}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Sidebar + Grid ───────────────────────────────────────── */}
      <div className="container-section overflow-x-hidden">
        <div className="content-section max-w-full">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 py-8 md:py-14 items-stretch lg:items-start">
            {/* ── Sidebar ─────────────────────────────────────────── */}
            <aside className="hidden lg:block w-56 xl:w-60 shrink-0 sticky top-20 self-start max-h-[calc(100vh-5rem)] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#d1d5db_transparent] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-1 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#060C20] tracking-tight">
                  {t("portfolio.filtros")}
                </h2>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={resetAll}
                    className="text-xs text-gray-400 hover:text-[#060C20] transition-colors underline underline-offset-2"
                  >
                    {t("portfolio.limpiarTodo")}
                  </button>
                )}
              </div>

              {/* Active chips */}
              {hasFilters && (
                <div className="flex flex-wrap gap-1.5 py-3 border-b border-gray-200">
                  {[...activeIndustry].map((lbl) => (
                    <button
                      type="button"
                      key={lbl}
                      onClick={() =>
                        toggle(activeIndustry, setActiveIndustry, lbl)
                      }
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#060C20] text-white hover:bg-[#060C20]/80"
                    >
                      {lbl} <X className="w-3 h-3" />
                    </button>
                  ))}
                  {[...activeService].map((lbl) => (
                    <button
                      type="button"
                      key={lbl}
                      onClick={() =>
                        toggle(activeService, setActiveService, lbl)
                      }
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#0072CF] text-white hover:bg-[#0072CF]/80"
                    >
                      {lbl} <X className="w-3 h-3" />
                    </button>
                  ))}
                  {[...activeTech].map((lbl) => (
                    <button
                      type="button"
                      key={lbl}
                      onClick={() => toggle(activeTech, setActiveTech, lbl)}
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#7ECFC3] text-teal-900 hover:bg-[#7ECFC3]/80"
                    >
                      {lbl} <X className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}

              {/* Accordions */}
              <div>
                <FilterSection
                  title={t("portfolio.industria")}
                  items={INDUSTRY_FILTERS}
                  activeLabels={activeIndustry}
                  onToggle={(lbl) =>
                    toggle(activeIndustry, setActiveIndustry, lbl)
                  }
                />
                <FilterSection
                  title={t("portfolio.servicios")}
                  items={SERVICE_FILTERS}
                  activeLabels={activeService}
                  onToggle={(lbl) =>
                    toggle(activeService, setActiveService, lbl)
                  }
                />
                <FilterSection
                  title={t("portfolio.tecnologia")}
                  items={TECH_FILTERS}
                  activeLabels={activeTech}
                  onToggle={(lbl) => toggle(activeTech, setActiveTech, lbl)}
                />
              </div>
            </aside>

            {/* ── Mobile filters: label + settings + badges ─────────── */}
            <div className="lg:hidden w-full shrink-0 order-first space-y-3 pb-4 border-b border-gray-200">
              <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-[#060C20]">
                    {t("portfolio.filtros")}
                  </span>
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-gray-100"
                    >
                      <Settings className="w-5 h-5 text-[#060C20]" />
                      <span className="sr-only">{t("portfolio.filtros")}</span>
                    </Button>
                  </SheetTrigger>
                </div>
                <SheetContent
                  side="right"
                  className="w-[85%] sm:max-w-md flex flex-col p-0 overflow-hidden"
                >
                  <SheetHeader className="p-4 pb-2 pr-14 border-b border-gray-100 shrink-0">
                    <SheetTitle className="text-xl font-bold text-[#060C20]">
                      {t("portfolio.filtros")}
                    </SheetTitle>
                    {hasFilters && (
                      <button
                        type="button"
                        onClick={() => {
                          resetAll();
                        }}
                        className="text-sm text-gray-500 hover:text-[#0072CF] transition-colors underline underline-offset-2 text-left"
                      >
                        {t("portfolio.limpiarTodo")}
                      </button>
                    )}
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 [scrollbar-width:thin] [scrollbar-color:theme(colors.gray.300)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
                    {/* Active chips */}
                    {hasFilters && (
                      <div className="flex flex-wrap gap-1.5 pb-3 border-b border-gray-100">
                        {[...activeIndustry].map((lbl) => (
                          <button
                            type="button"
                            key={lbl}
                            onClick={() =>
                              toggle(activeIndustry, setActiveIndustry, lbl)
                            }
                            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#060C20] text-white"
                          >
                            {lbl} <X className="w-3 h-3" />
                          </button>
                        ))}
                        {[...activeService].map((lbl) => (
                          <button
                            type="button"
                            key={lbl}
                            onClick={() =>
                              toggle(activeService, setActiveService, lbl)
                            }
                            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#0072CF] text-white"
                          >
                            {lbl} <X className="w-3 h-3" />
                          </button>
                        ))}
                        {[...activeTech].map((lbl) => (
                          <button
                            type="button"
                            key={lbl}
                            onClick={() =>
                              toggle(activeTech, setActiveTech, lbl)
                            }
                            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#7ECFC3] text-teal-900"
                          >
                            {lbl} <X className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Filter sections */}
                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 divide-y divide-gray-100 overflow-hidden">
                      <FilterSection
                        title={t("portfolio.industria")}
                        items={INDUSTRY_FILTERS}
                        activeLabels={activeIndustry}
                        onToggle={(lbl) =>
                          toggle(activeIndustry, setActiveIndustry, lbl)
                        }
                      />
                      <FilterSection
                        title={t("portfolio.servicios")}
                        items={SERVICE_FILTERS}
                        activeLabels={activeService}
                        onToggle={(lbl) =>
                          toggle(activeService, setActiveService, lbl)
                        }
                      />
                      <FilterSection
                        title={t("portfolio.tecnologia")}
                        items={TECH_FILTERS}
                        activeLabels={activeTech}
                        onToggle={(lbl) =>
                          toggle(activeTech, setActiveTech, lbl)
                        }
                      />
                    </div>
                    {/* Sort */}
                    <div className="pt-2">
                      <p className="text-sm font-semibold text-[#060C20] mb-2">
                        {t("portfolio.ordenar")}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setSortKey(opt.key)}
                            className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                              sortKey === opt.key
                                ? "bg-gradient-to-br from-slate-200/90 to-blue-100/70 text-slate-700 font-medium"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              {/* Applied filters as badges */}
              {hasFilters && (
                <div className="flex flex-wrap gap-1.5">
                  {[...activeIndustry].map((lbl) => (
                    <button
                      type="button"
                      key={lbl}
                      onClick={() =>
                        toggle(activeIndustry, setActiveIndustry, lbl)
                      }
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#060C20] text-white"
                    >
                      {lbl} <X className="w-3 h-3" />
                    </button>
                  ))}
                  {[...activeService].map((lbl) => (
                    <button
                      type="button"
                      key={lbl}
                      onClick={() =>
                        toggle(activeService, setActiveService, lbl)
                      }
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#0072CF] text-white"
                    >
                      {lbl} <X className="w-3 h-3" />
                    </button>
                  ))}
                  {[...activeTech].map((lbl) => (
                    <button
                      type="button"
                      key={lbl}
                      onClick={() => toggle(activeTech, setActiveTech, lbl)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#7ECFC3] text-teal-900"
                    >
                      {lbl} <X className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Main content ────────────────────────────────────── */}
            <div className="flex-1 min-w-0 w-full overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                {/* count */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={filtered.length}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-body-sm text-gray-400"
                  >
                    {hasFilters
                      ? t("portfolio.proyectosFiltrado", {
                          filtered: String(filtered.length),
                          total: String(cases.length),
                        })
                      : t("portfolio.proyectosCount", {
                          count: String(cases.length),
                        })}
                  </motion.p>
                </AnimatePresence>

                {/* Sort (desktop only) + view toggle (always) */}
                <div className="flex items-center gap-2">
                  {/* Sort dropdown - desktop only */}
                  <div className="relative hidden lg:block">
                    <button
                      type="button"
                      onClick={() => setSortOpen((v) => !v)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
                    >
                      {activeSortLabel}
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-gray-400 transition-transform ${sortOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {sortOpen && (
                      <>
                        {/* backdrop */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setSortOpen(false)}
                          onKeyDown={(e) =>
                            e.key === "Escape" && setSortOpen(false)
                          }
                          role="button"
                          tabIndex={0}
                          aria-label="Close sort menu"
                        />
                        <div className="absolute right-0 top-full mt-1.5 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-40 overflow-hidden">
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

                  {/* View toggle */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`p-2 transition-colors ${
                        viewMode === "grid"
                          ? "bg-gradient-to-br from-slate-200/90 to-blue-100/70 text-slate-700"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      }`}
                      title={t("portfolio.vistaGrid")}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`p-2 transition-colors ${
                        viewMode === "list"
                          ? "bg-gradient-to-br from-slate-200/90 to-blue-100/70 text-slate-700"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      }`}
                      title={t("portfolio.vistaLista")}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Cards */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${[...activeIndustry].join()}-${[...activeService].join()}-${[...activeTech].join()}-${sortKey}-${viewMode}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10 min-w-0"
                      : "flex flex-col gap-4 min-w-0"
                  }
                >
                  {filtered.map((caseItem, idx) => {
                    const slug = getSlug(caseItem.title, caseItem.slug);
                    const industryLabel =
                      INDUSTRY_FILTERS.find((f) => f.slugs.includes(slug))
                        ?.label ?? caseItem.industry;
                    const serviceLabel = SERVICE_FILTERS.find((f) =>
                      f.slugs.includes(slug)
                    )?.label;

                    if (viewMode === "list") {
                      return (
                        <motion.div
                          key={caseItem.title}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: Math.min(idx * 0.03, 0.2),
                          }}
                        >
                          <Link
                            href={`/casos-de-exito/${slug}`}
                            className="group flex gap-4 sm:gap-5 p-4 rounded-2xl border border-gray-100 hover:border-[#0072CF]/25 hover:shadow-md transition-all duration-300 bg-white min-w-0 overflow-hidden"
                          >
                            {/* image */}
                            <div className="shrink-0 w-36 h-28 sm:w-44 sm:h-32 rounded-xl overflow-hidden bg-gray-100">
                              <img
                                src={caseItem.image}
                                alt={caseItem.title}
                                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                              />
                            </div>
                            {/* text */}
                            <div className="flex flex-col justify-center gap-2 min-w-0">
                              <div className="flex flex-wrap gap-1.5">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-500 bg-white">
                                  {industryLabel}
                                </span>
                                {serviceLabel &&
                                  serviceLabel !== industryLabel && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 text-gray-500 bg-white">
                                      {serviceLabel}
                                    </span>
                                  )}
                              </div>
                              <h2 className="text-heading-3 text-[#060C20] group-hover:text-[#0072CF] transition-colors leading-snug truncate">
                                {caseItem.title}
                              </h2>
                              <p className="text-body-sm text-gray-400 line-clamp-2 hidden sm:block">
                                {caseItem.description}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    }

                    // Grid card
                    return (
                      <GridCard
                        key={caseItem.title}
                        caseItem={caseItem}
                        idx={idx}
                        industryLabel={industryLabel}
                        serviceLabel={serviceLabel}
                        slug={slug}
                      />
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Empty state */}
              {filtered.length === 0 && (
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
              )}
            </div>
          </div>
        </div>
      </div>

      <CaseContactCTA />
    </main>
  );
}

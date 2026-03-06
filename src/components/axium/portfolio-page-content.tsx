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
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Settings,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 20;

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
  { label: "Experiencia de cliente", slugs: ["feedback-management"] },
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

// ─── Active filter chips (reusable) ────────────────────────────────────────────
function ActiveFilterChips({
  activeIndustry,
  activeService,
  activeTech,
  onToggleIndustry,
  onToggleService,
  onToggleTech,
}: {
  activeIndustry: Set<string>;
  activeService: Set<string>;
  activeTech: Set<string>;
  onToggleIndustry: (lbl: string) => void;
  onToggleService: (lbl: string) => void;
  onToggleTech: (lbl: string) => void;
}) {
  const toggle = (
    label: string,
    _set: Set<string>,
    onToggle: (l: string) => void
  ) => {
    onToggle(label);
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {[...activeIndustry].map((lbl) => (
        <button
          key={`ind-${lbl}`}
          type="button"
          onClick={() => toggle(lbl, activeIndustry, onToggleIndustry)}
          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#060C20] text-white hover:opacity-90"
        >
          {lbl} <X className="w-3 h-3" />
        </button>
      ))}
      {[...activeService].map((lbl) => (
        <button
          key={`srv-${lbl}`}
          type="button"
          onClick={() => toggle(lbl, activeService, onToggleService)}
          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#0072CF] text-white hover:opacity-90"
        >
          {lbl} <X className="w-3 h-3" />
        </button>
      ))}
      {[...activeTech].map((lbl) => (
        <button
          key={`tech-${lbl}`}
          type="button"
          onClick={() => toggle(lbl, activeTech, onToggleTech)}
          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#7ECFC3] text-teal-900 hover:opacity-90"
        >
          {lbl} <X className="w-3 h-3" />
        </button>
      ))}
    </div>
  );
}

// ─── Filter accordion section ───────────────────────────────────────────────────
const FILTER_VISIBLE = 8;

function FilterSection({
  title,
  items,
  activeLabels,
  onToggle,
  defaultOpen = false,
}: {
  title: string;
  items: { label: string; slugs: string[] }[];
  activeLabels: Set<string>;
  onToggle: (label: string) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [showAll, setShowAll] = useState(false);
  const hasActive = items.some((i) => activeLabels.has(i.label));
  const visible =
    items.length > FILTER_VISIBLE && !showAll
      ? items.slice(0, FILTER_VISIBLE)
      : items;
  const hasMore = items.length > FILTER_VISIBLE;

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
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-3 flex flex-col gap-0.5">
          {visible.map(({ label, slugs }) => (
            <button
              key={label}
              type="button"
              onClick={() => onToggle(label)}
              className={`flex items-center justify-between w-full text-left px-2 py-2 rounded-lg text-sm transition-all ${
                activeLabels.has(label)
                  ? "bg-gradient-to-br from-slate-200/90 to-blue-100/70 text-slate-700 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#060C20]"
              }`}
            >
              <span>{label}</span>
              <span
                className={`text-xs tabular-nums ${activeLabels.has(label) ? "text-slate-500" : "text-gray-300"}`}
              >
                {slugs.length}
              </span>
            </button>
          ))}
          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="mt-1 px-2 py-1.5 text-xs text-[#0072CF] hover:text-[#005ba3] text-left"
            >
              {showAll
                ? "Ver menos"
                : `Ver ${items.length - FILTER_VISIBLE} más`}
            </button>
          )}
        </div>
      )}
    </div>
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
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

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

  const filterPanel = (
    <>
      <div className="rounded-xl border border-gray-100 bg-gray-50/50 overflow-hidden">
        <FilterSection
          title={t("portfolio.industria")}
          items={INDUSTRY_FILTERS}
          activeLabels={activeIndustry}
          defaultOpen
          onToggle={(lbl) =>
            toggleFilter(setActiveIndustry, activeIndustry, lbl)
          }
        />
        <FilterSection
          title={t("portfolio.servicios")}
          items={SERVICE_FILTERS}
          activeLabels={activeService}
          onToggle={(lbl) => toggleFilter(setActiveService, activeService, lbl)}
        />
        <FilterSection
          title={t("portfolio.tecnologia")}
          items={TECH_FILTERS}
          activeLabels={activeTech}
          onToggle={(lbl) => toggleFilter(setActiveTech, activeTech, lbl)}
        />
      </div>
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
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
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
    </>
  );

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
          {/* Mobile filters */}
          <div className="lg:hidden border-b border-gray-200 py-3 space-y-3">
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
                      onClick={resetAll}
                      className="text-sm text-gray-500 hover:text-[#0072CF] underline underline-offset-2 text-left"
                    >
                      {t("portfolio.limpiarTodo")}
                    </button>
                  )}
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {hasFilters && (
                    <div className="pb-3 border-b border-gray-100">
                      <ActiveFilterChips
                        activeIndustry={activeIndustry}
                        activeService={activeService}
                        activeTech={activeTech}
                        onToggleIndustry={(l) =>
                          toggleFilter(setActiveIndustry, activeIndustry, l)
                        }
                        onToggleService={(l) =>
                          toggleFilter(setActiveService, activeService, l)
                        }
                        onToggleTech={(l) =>
                          toggleFilter(setActiveTech, activeTech, l)
                        }
                      />
                    </div>
                  )}
                  {filterPanel}
                </div>
              </SheetContent>
            </Sheet>
            {hasFilters && (
              <ActiveFilterChips
                activeIndustry={activeIndustry}
                activeService={activeService}
                activeTech={activeTech}
                onToggleIndustry={(l) =>
                  toggleFilter(setActiveIndustry, activeIndustry, l)
                }
                onToggleService={(l) =>
                  toggleFilter(setActiveService, activeService, l)
                }
                onToggleTech={(l) => toggleFilter(setActiveTech, activeTech, l)}
              />
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 py-8 md:py-14">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-56 xl:w-60 shrink-0">
              <div className="flex items-center justify-between pb-4 mb-1 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#060C20] tracking-tight">
                  {t("portfolio.filtros")}
                </h2>
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
              {hasFilters && (
                <div className="flex flex-wrap gap-1.5 py-3 border-b border-gray-200">
                  <ActiveFilterChips
                    activeIndustry={activeIndustry}
                    activeService={activeService}
                    activeTech={activeTech}
                    onToggleIndustry={(l) =>
                      toggleFilter(setActiveIndustry, activeIndustry, l)
                    }
                    onToggleService={(l) =>
                      toggleFilter(setActiveService, activeService, l)
                    }
                    onToggleTech={(l) =>
                      toggleFilter(setActiveTech, activeTech, l)
                    }
                  />
                </div>
              )}
              {filterPanel}
            </aside>

            {/* Grid + pagination */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                <p className="text-body-sm text-gray-400">
                  {hasFilters
                    ? t("portfolio.proyectosFiltrado", {
                        filtered: String(filtered.length),
                        total: String(cases.length),
                      })
                    : t("portfolio.proyectosCount", {
                        count: String(cases.length),
                      })}
                </p>
                <div className="relative hidden lg:block">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
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
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
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
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
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
      </div>

      <CaseContactCTA />
    </main>
  );
}

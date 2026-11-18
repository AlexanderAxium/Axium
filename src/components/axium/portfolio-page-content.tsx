"use client";

import { CaseContactCTA } from "@/components/axium/case-contact-cta";
import { MagneticCursorArrow } from "@/components/axium/magnetic-cursor-arrow";
import { Button } from "@/components/ui/button";
import { titularDe } from "@/data/portafolio-titulares";
import { useTranslation } from "@/hooks/useTranslation";
import { useCasesWithLocale } from "@/lib/case-translations";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
      "fintrace",
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
      "fintrace",
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

type AxisKey = "service" | "industry";

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

// ─── Selector en píldora (modelo wacomms.com/case-studies) ───────────────────
function Selector({
  label,
  items,
  active,
  onToggle,
  onClear,
  open,
  onOpenChange,
  clearLabel,
}: {
  label: string;
  items: { label: string; slugs: string[] }[];
  active: Set<string>;
  onToggle: (label: string) => void;
  onClear: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clearLabel: string;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => onOpenChange(!open)}
        className={`inline-flex items-center gap-3 rounded-full border px-6 py-3 text-base tracking-wide transition-colors md:px-8 md:py-4 md:text-lg ${
          active.size > 0
            ? "border-[#060C20] bg-[#060C20] text-white"
            : "border-[#060C20] bg-white text-[#060C20] hover:bg-gray-50"
        }`}
      >
        {label}
        {active.size > 0 && (
          <span className="tabular-nums text-sm text-white/70">
            {active.size}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => onOpenChange(false)}
            onKeyDown={(e) => e.key === "Escape" && onOpenChange(false)}
            role="button"
            tabIndex={-1}
            aria-hidden
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
            <ul className="max-h-[60vh] overflow-y-auto">
              {items.map(({ label: l, slugs }) => {
                const on = active.has(l);
                return (
                  <li key={l}>
                    <button
                      type="button"
                      onClick={() => onToggle(l)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#060C20] hover:bg-gray-50"
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border ${
                          on
                            ? "border-[#060C20] bg-[#060C20]"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {on && (
                          <span className="h-1.5 w-1.5 rounded-[1px] bg-white" />
                        )}
                      </span>
                      <span className="flex-1">{l}</span>
                      <span className="tabular-nums text-xs text-gray-400">
                        {slugs.length}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {active.size > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="mt-1 w-full border-t border-gray-100 px-3 pt-2.5 pb-1.5 text-left text-xs text-gray-500 underline underline-offset-2 hover:text-[#060C20]"
              >
                {clearLabel}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
// Sin etiquetas: la empresa arriba en versalitas y debajo un titular corto que dice qué se hizo.
function PortfolioCard({
  caseItem,
  index,
  slug,
}: {
  caseItem: { title: string; image: string; description?: string };
  index: number;
  slug: string;
}) {
  const { t, locale } = useTranslation("landing");
  const titular = titularDe(slug, locale, caseItem.title);

  return (
    <div
      className="entra-css"
      style={
        {
          "--entra-retraso": `${Math.min(index * 0.03, 0.24)}s`,
        } as CSSProperties
      }
    >
      <MagneticCursorArrow label={t("portfolio.verProyecto")}>
        <Link href={`/casos-de-exito/${slug}`} className="group block">
          <div className="relative overflow-hidden rounded-[3px] aspect-[4/3] bg-gray-100 mb-5">
            <Image
              src={caseItem.image}
              alt={caseItem.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              quality={85}
            />
          </div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-gray-500">
            {caseItem.title}
          </p>
          <h2 className="text-xl font-medium leading-snug tracking-[-0.01em] text-[#060C20] transition-colors duration-200 group-hover:text-[#0072CF] sm:text-[1.375rem]">
            {titular}
          </h2>
        </Link>
      </MagneticCursorArrow>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
// Página en blanco, sin héroe con fondo (modelo wacomms.com/case-studies, 2026-11-18): el título con el total
// como superíndice y solo dos selectores, Sector y Qué hacemos.
export function PortfolioPageContent() {
  const cases = useCasesWithLocale();
  const { t } = useTranslation("landing");

  const [activeIndustry, setActiveIndustry] = useState<Set<string>>(new Set());
  const [activeService, setActiveService] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [openAxis, setOpenAxis] = useState<AxisKey | null>(null);

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

  const filtered = useMemo(
    () =>
      cases.filter((c) => {
        const slug = getSlug(c.title, c.slug);
        if (industryAllowed && !industryAllowed.has(slug)) return false;
        if (serviceAllowed && !serviceAllowed.has(slug)) return false;
        return true;
      }),
    [cases, industryAllowed, serviceAllowed]
  );

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

  // Reset to page 1 when filters change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intent is to reset page when any of these change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeIndustry, activeService]);

  const hasFilters = activeIndustry.size > 0 || activeService.size > 0;
  const resetAll = () => {
    setActiveIndustry(new Set());
    setActiveService(new Set());
  };

  const activeChips: { axis: AxisKey; label: string }[] = [
    ...[...activeIndustry].map((label) => ({
      axis: "industry" as AxisKey,
      label,
    })),
    ...[...activeService].map((label) => ({
      axis: "service" as AxisKey,
      label,
    })),
  ];

  const removeChip = (axis: AxisKey, label: string) => {
    if (axis === "service")
      toggleFilter(setActiveService, activeService, label);
    if (axis === "industry")
      toggleFilter(setActiveIndustry, activeIndustry, label);
  };

  return (
    <main className="min-h-screen bg-white">
      <section
        id="page-hero"
        data-nav-theme="light"
        className="container-section pt-32 pb-10 md:pt-44 md:pb-14"
      >
        <div className="content-section flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h1 className="entra-css text-[clamp(3rem,7vw,6.5rem)] font-normal leading-[0.95] tracking-[-0.02em] text-[#060C20]">
            {t("portfolio.nuestroTrabajo")}
            <sup className="ml-2 align-super text-[0.22em] font-normal tracking-normal text-[#060C20]">
              ({filtered.length})
            </sup>
          </h1>
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <Selector
              label={t("portfolio.sector")}
              items={INDUSTRY_FILTERS}
              active={activeIndustry}
              onToggle={(l) =>
                toggleFilter(setActiveIndustry, activeIndustry, l)
              }
              onClear={() => setActiveIndustry(new Set())}
              open={openAxis === "industry"}
              onOpenChange={(o) => setOpenAxis(o ? "industry" : null)}
              clearLabel={t("portfolio.limpiarTodo")}
            />
            <Selector
              label={t("portfolio.queHacemos")}
              items={SERVICE_FILTERS}
              active={activeService}
              onToggle={(l) => toggleFilter(setActiveService, activeService, l)}
              onClear={() => setActiveService(new Set())}
              open={openAxis === "service"}
              onOpenChange={(o) => setOpenAxis(o ? "service" : null)}
              clearLabel={t("portfolio.limpiarTodo")}
            />
          </div>
        </div>
        {hasFilters && (
          <div className="content-section mt-6 flex flex-wrap items-center gap-2">
            {activeChips.map(({ axis, label }) => (
              <button
                key={`${axis}-${label}`}
                type="button"
                onClick={() => removeChip(axis, label)}
                className="flex items-center gap-1 rounded-full bg-[#060C20] px-3 py-1 text-xs text-white hover:opacity-90"
              >
                {label} <X className="h-3 w-3" />
              </button>
            ))}
            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-gray-500 underline underline-offset-2 hover:text-[#060C20]"
            >
              {t("portfolio.limpiarTodo")}
            </button>
          </div>
        )}
      </section>

      <div data-nav-theme="light" className="container-section">
        <div className="content-section">
          {/* ─── Rejilla + paginación ──────────────────────────────────────── */}
          <div className="pb-8 md:pb-12">
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
                    return (
                      <PortfolioCard
                        key={caseItem.title}
                        caseItem={caseItem}
                        index={idx}
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

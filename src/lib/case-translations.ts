"use client";

import casesEn from "@/locales/en/cases.json";
import casesEs from "@/locales/es/cases.json";
import casesPt from "@/locales/pt/cases.json";
import { useMemo } from "react";
import type { CaseItem } from "~/data/cases-data";
import antiruidopvcData from "~/data/cases/antiruidopvc.json";
import clefastData from "~/data/cases/clefast.json";
import daesurmotorsData from "~/data/cases/daesurmotors.json";
import enrafmedicaData from "~/data/cases/enrafmedica.json";
import fenizData from "~/data/cases/feniz.json";
import firstautomationData from "~/data/cases/firstautomation.json";
import happyartData from "~/data/cases/happyart.json";
import innersoulbrightData from "~/data/cases/innersoulbright.json";
import lujanData from "~/data/cases/lujan.json";
import maintechData from "~/data/cases/maintech.json";
import podologiemtkData from "~/data/cases/podologiemtk.json";
import redesvipData from "~/data/cases/redesvip.json";
import sporttData from "~/data/cases/sportt.json";
import toliveagainData from "~/data/cases/toliveagain.json";
import transportesrumiData from "~/data/cases/transportesrumi.json";
import ventanasantiruidoData from "~/data/cases/ventanasantiruido.json";
import villacerData from "~/data/cases/villacer.json";
import vitalchainData from "~/data/cases/vitalchain.json";
import { useTranslation } from "~/hooks/useTranslation";
import { mapIcon } from "./case-translations-icons";

const casesByLocale: Record<string, Record<string, Record<string, unknown>>> = {
  es: casesEs as Record<string, Record<string, unknown>>,
  en: casesEn as Record<string, Record<string, unknown>>,
  pt: casesPt as Record<string, Record<string, unknown>>,
};

const baseCasesBySlug: Record<string, Record<string, unknown>> = {
  maintech: maintechData as Record<string, unknown>,
  vitalchain: vitalchainData as Record<string, unknown>,
  feniz: fenizData as Record<string, unknown>,
  innersoulbright: innersoulbrightData as Record<string, unknown>,
  clefast: clefastData as Record<string, unknown>,
  happyart: happyartData as Record<string, unknown>,
  redesvip: redesvipData as Record<string, unknown>,
  sportt: sporttData as Record<string, unknown>,
  lujan: lujanData as Record<string, unknown>,
  ventanasantiruido: ventanasantiruidoData as Record<string, unknown>,
  antiruidopvc: antiruidopvcData as Record<string, unknown>,
  transportesrumi: transportesrumiData as Record<string, unknown>,
  villacer: villacerData as Record<string, unknown>,
  daesurmotors: daesurmotorsData as Record<string, unknown>,
  firstautomation: firstautomationData as Record<string, unknown>,
  toliveagain: toliveagainData as Record<string, unknown>,
  podologiemtk: podologiemtkData as Record<string, unknown>,
  enrafmedica: enrafmedicaData as Record<string, unknown>,
};

const translatableFields = [
  "title",
  "industry",
  "description",
  "problem",
  "solution",
  "projectDescription",
  "secondaryIndustry",
  "forWhom",
  "services",
  "results",
  "client",
] as const;

/**
 * Merges base case data with locale-specific translations.
 * Non-translatable fields (image, technologyStack, duration, client, liveUrl, etc.) come from base.
 */
export function getCaseContent(slug: string, locale: string): CaseItem | null {
  const base = baseCasesBySlug[slug];
  if (!base) return null;

  const localeKey = ["es", "en", "pt"].includes(locale) ? locale : "es";
  const translated = casesByLocale[localeKey]?.[slug] as
    | Record<string, unknown>
    | undefined;

  const merged = { ...base, slug } as Record<string, unknown>;
  if (translated) {
    for (const field of translatableFields) {
      if (translated[field] !== undefined) {
        (merged as Record<string, unknown>)[field] = translated[field];
      }
    }
  }

  // Ensure results have icon mapped - base has icon, overlay metric/label from translated
  const baseResults = base.results as
    | Array<{ icon: string; metric: string; label: string }>
    | undefined;
  const translatedResults = translated?.results as
    | Array<{ metric: string; label: string }>
    | undefined;
  if (Array.isArray(baseResults)) {
    const finalResults = baseResults.map((baseR, i) => {
      const tr = Array.isArray(translatedResults)
        ? translatedResults[i]
        : undefined;
      return {
        icon: mapIcon(baseR.icon),
        metric: tr?.metric ?? baseR.metric,
        label: tr?.label ?? baseR.label,
      };
    });
    (merged as Record<string, unknown>).results = finalResults;
  }

  return merged as unknown as CaseItem;
}

/**
 * Returns all cases with translated content for the given locale.
 */
export function getAllCasesWithLocale(locale: string): CaseItem[] {
  const slugs = Object.keys(baseCasesBySlug);
  const cases: CaseItem[] = [];
  for (const slug of slugs) {
    const caseItem = getCaseContent(slug, locale);
    if (caseItem) cases.push(caseItem);
  }
  return cases;
}

/**
 * Hook to get case content with current locale.
 */
export function useCaseContent(slug: string): CaseItem | null {
  const { locale } = useTranslation("landing");
  return useMemo(() => getCaseContent(slug, locale), [slug, locale]);
}

/**
 * Hook to get all cases with current locale.
 */
export function useCasesWithLocale(): CaseItem[] {
  const { locale } = useTranslation("landing");
  return useMemo(() => getAllCasesWithLocale(locale), [locale]);
}

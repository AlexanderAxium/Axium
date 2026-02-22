"use client";

import { CasesSection } from "~/components/axium/cases-section";
import { useTranslation } from "~/hooks/useTranslation";

export interface CaseNextProjectProps {
  /** Slug del proyecto actual para excluirlo del carrusel */
  excludeSlug?: string;
}

export function CaseNextProject({ excludeSlug }: CaseNextProjectProps) {
  const { t } = useTranslation("landing");
  return (
    <CasesSection
      variant="light"
      title={t("caseDetail.masProyectos")}
      excludeSlug={excludeSlug}
    />
  );
}

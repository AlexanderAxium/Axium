"use client";

import type { CaseItem } from "~/data/cases-data";
import { useTranslation } from "~/hooks/useTranslation";
import { useCaseContent } from "~/lib/case-translations";

interface CasePageClientProps {
  slug: string;
  children: (data: CaseItem, t: (key: string) => string) => React.ReactNode;
}

/**
 * Wrapper that provides translated case data and t() to case page content.
 */
export function CasePageClient({ slug, children }: CasePageClientProps) {
  const data = useCaseContent(slug);
  const { t } = useTranslation("landing");

  if (!data) return null;

  return <>{children(data, (k) => t(k))}</>;
}

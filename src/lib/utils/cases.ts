import type { CaseItem } from "~/data/cases-data";
import { cases } from "~/data/cases-data";

/**
 * Generates a URL-friendly slug from a case title
 * Example: "Stark Research 4.0" → "stark-research-4-0"
 */
export function generateCaseSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
}

/**
 * Finds a case by its slug or title
 * Returns undefined if not found
 */
export function findCaseBySlug(slug: string): CaseItem | undefined {
  // Try to find by exact slug match first
  const caseBySlug = cases.find(
    (caseItem) => generateCaseSlug(caseItem.title) === slug.toLowerCase()
  );

  if (caseBySlug) {
    return caseBySlug;
  }

  // Fallback: try to find by title match (case-insensitive)
  return cases.find(
    (caseItem) => caseItem.title.toLowerCase() === slug.toLowerCase()
  );
}

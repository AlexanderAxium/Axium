import { CheckCircle2, Clock, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import breezyData from "./cases/breezy.json";
import edusuiteData from "./cases/edusuite-platform.json";
import fenizData from "./cases/feniz.json";
import innersoulbrightData from "./cases/innersoulbright.json";
// Import JSON files directly (Next.js supports JSON imports)
import maintechData from "./cases/maintech.json";
import medicareData from "./cases/medicare-emr.json";
import retailPlatformData from "./cases/retail-cloud-platform.json";
import sailicaData from "./cases/sailica-2-0.json";
import starkResearchData from "./cases/stark-research-4-0.json";
import vitalchainData from "./cases/vitalchain.json";

export type CaseResult = {
  icon: LucideIcon;
  metric: string;
  label: string;
};

export type CaseItem = {
  title: string;
  industry: string;
  image: string;
  location: string;
  services: string[];
  description: string;
  problem: string;
  solution: string;
  results: CaseResult[];
  // Optional fields for detail page
  platform?: string; // e.g., "Web", "Mobile", "Web & Mobile"
  duration?: string; // e.g., "Jul '24 – Apr '25"
  client?: string; // e.g., "Nashville"
  secondaryIndustry?: string;
  forWhom?: string; // e.g., "Journalists, media companies, social media users"
  technologyStack?: string[]; // e.g., ["React", "Next", "Node"]
  // New fields for detailed information
  projectDescription?: string; // Detailed project description
  skillsAndDeliverables?: string[]; // Technologies and skills used
  publishedDate?: string; // Publication date (e.g., "Oct 18, 2025")
};

// JSON types (icons as strings)
type CaseResultJSON = {
  icon: "Users" | "Clock" | "TrendingUp" | "CheckCircle2";
  metric: string;
  label: string;
};

type CaseItemJSON = Omit<CaseItem, "results"> & {
  results: CaseResultJSON[];
};

// Icon mapping from string to component
const iconMap: Record<string, LucideIcon> = {
  Users,
  Clock,
  TrendingUp,
  CheckCircle2,
};

/**
 * Maps icon string from JSON to LucideIcon component
 */
function mapIcon(iconName: string): LucideIcon {
  const Icon = iconMap[iconName];
  if (!Icon) {
    console.warn(`Icon "${iconName}" not found, using Clock as fallback`);
    return Clock;
  }
  return Icon;
}

/**
 * Converts a JSON case item to CaseItem with icon components
 */
function convertCaseFromJSON(caseJson: CaseItemJSON): CaseItem {
  const results: CaseResult[] = caseJson.results.map((result) => ({
    icon: mapIcon(result.icon),
    metric: result.metric,
    label: result.label,
  }));

  return {
    ...caseJson,
    results,
  };
}

// Load all JSON cases and convert them to CaseItem[]
const cases: CaseItem[] = [
  convertCaseFromJSON(maintechData as CaseItemJSON),
  convertCaseFromJSON(vitalchainData as CaseItemJSON),
  convertCaseFromJSON(fenizData as CaseItemJSON),
  convertCaseFromJSON(innersoulbrightData as CaseItemJSON),
  convertCaseFromJSON(breezyData as CaseItemJSON),
  convertCaseFromJSON(starkResearchData as CaseItemJSON),
  convertCaseFromJSON(sailicaData as CaseItemJSON),
  convertCaseFromJSON(retailPlatformData as CaseItemJSON),
  convertCaseFromJSON(edusuiteData as CaseItemJSON),
  convertCaseFromJSON(medicareData as CaseItemJSON),
];

export { cases };

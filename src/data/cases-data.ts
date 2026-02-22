import { CheckCircle2, Clock, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import antiruidopvcData from "./cases/antiruidopvc.json";
import clefastData from "./cases/clefast.json";
import daesurmotorsData from "./cases/daesurmotors.json";
import enrafmedicaData from "./cases/enrafmedica.json";
import fenizData from "./cases/feniz.json";
import firstautomationData from "./cases/firstautomation.json";
import happyartData from "./cases/happyart.json";
import innersoulbrightData from "./cases/innersoulbright.json";
import lujanData from "./cases/lujan.json";
import maintechData from "./cases/maintech.json";
import podologiemtkData from "./cases/podologiemtk.json";
import redesvipData from "./cases/redesvip.json";
import sporttData from "./cases/sportt.json";
import toliveagainData from "./cases/toliveagain.json";
import transportesrumiData from "./cases/transportesrumi.json";
import ventanasantiruidoData from "./cases/ventanasantiruido.json";
import villacerData from "./cases/villacer.json";
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
  liveUrl?: string; // URL del sitio en vivo (para botón "Ver en vivo")
  slug?: string; // URL slug (e.g., "maintech") for routing
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
  convertCaseFromJSON(clefastData as CaseItemJSON),
  convertCaseFromJSON(happyartData as CaseItemJSON),
  convertCaseFromJSON(redesvipData as CaseItemJSON),
  convertCaseFromJSON(sporttData as CaseItemJSON),
  convertCaseFromJSON(lujanData as CaseItemJSON),
  convertCaseFromJSON(ventanasantiruidoData as CaseItemJSON),
  convertCaseFromJSON(antiruidopvcData as CaseItemJSON),
  convertCaseFromJSON(transportesrumiData as CaseItemJSON),
  convertCaseFromJSON(villacerData as CaseItemJSON),
  convertCaseFromJSON(daesurmotorsData as CaseItemJSON),
  convertCaseFromJSON(firstautomationData as CaseItemJSON),
  convertCaseFromJSON(toliveagainData as CaseItemJSON),
  convertCaseFromJSON(podologiemtkData as CaseItemJSON),
  convertCaseFromJSON(enrafmedicaData as CaseItemJSON),
];

export { cases };

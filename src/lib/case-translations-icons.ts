import { CheckCircle2, Clock, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Users,
  Clock,
  TrendingUp,
  CheckCircle2,
};

export function mapIcon(iconName: string): LucideIcon {
  return iconMap[iconName] ?? Clock;
}

import type { Domain, EnvType } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const DOMAIN_STYLE: Record<Domain, "default" | "accent" | "warning"> = {
  PEOPLE: "default",
  PROCESS: "accent",
  BUSINESS_ENV: "warning",
};

export function DomainTag({ domain }: { domain: Domain }) {
  const labels: Record<Domain, string> = {
    PEOPLE: "People",
    PROCESS: "Process",
    BUSINESS_ENV: "Business Env.",
  };
  return <Badge variant={DOMAIN_STYLE[domain]}>{labels[domain]}</Badge>;
}

const ENV_LABEL: Record<EnvType, string> = {
  PREDICTIVE: "Predictive",
  AGILE: "Agile",
  HYBRID: "Hybrid",
};

export function CareerBadge({ envType }: { envType: EnvType }) {
  return <Badge variant="outline">{ENV_LABEL[envType]}</Badge>;
}
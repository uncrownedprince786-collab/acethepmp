// 2026 PMP Examination Content Outline — factual domain & task structure.
// Effective July 9, 2026. Task numbering follows the PMI Examination Content
// Outline. Used for mapping every question to a domain + task, curriculum, and
// SEO pages. Use the source of truth for tagging: prisma/eco-tags.ts.

import type { Domain, EnvType } from "@prisma/client";

export const DOMAIN_ORDER: Domain[] = ["PEOPLE", "PROCESS", "BUSINESS_ENV"];

export const DOMAIN_META: Record<
  Domain,
  {
    label: string;
    short: string;
    weight: number; // share of the 180-question exam
    blurb: string;
    color: string;
  }
> = {
  PEOPLE: {
    label: "People",
    short: "People",
    weight: 0.33,
    color: "#0F766E",
    blurb:
      "Leading a team, managing conflict, engaging and aligning stakeholders, and ensuring knowledge transfer — the human side of project leadership.",
  },
  PROCESS: {
    label: "Process",
    short: "Process",
    weight: 0.41,
    color: "#1E3A8A",
    blurb:
      "Planning, executing and closing work: integrated planning, scope, value, resources, finance, schedule, quality, and procurement.",
  },
  BUSINESS_ENV: {
    label: "Business Environment",
    short: "Business Env.",
    weight: 0.26,
    color: "#B45309",
    blurb:
      "Linking the project to the organization: governance, compliance, risk, change control, impediments and issues, continuous improvement, and external business changes.",
  },
};

export const TASKS: Record<Domain, { id: number; title: string; blurb: string }[]> = {
  PEOPLE: [
    { id: 1, title: "Develop a common vision", blurb: "Agree on one shared picture of success and keep it current and visible to everyone." },
    { id: 2, title: "Manage conflicts", blurb: "Address disagreement openly, find its real source, and protect working relationships." },
    { id: 3, title: "Lead the project team", blurb: "Set expectations, empower the team, clear obstacles, and match your leadership style to the team." },
    { id: 4, title: "Engage stakeholders", blurb: "Identify, analyze, and build trust with everyone who affects or is affected by the project." },
    { id: 5, title: "Align stakeholder expectations", blurb: "Surface differing expectations early and bring people to a shared understanding." },
    { id: 6, title: "Manage stakeholder expectations", blurb: "Keep checking what internal and external customers expect and respond as the project evolves." },
    { id: 7, title: "Help ensure knowledge transfer", blurb: "Capture knowledge critical to the project and create an environment where it is shared." },
    { id: 8, title: "Plan and manage communication", blurb: "Decide who needs what information, when, and how, and run a clear feedback loop." },
  ],
  PROCESS: [
    { id: 1, title: "Develop an integrated project management plan and plan delivery", blurb: "Assess the work, choose the delivery approach, and pull scope, schedule, cost, quality, and risk into one plan." },
    { id: 2, title: "Develop and manage project scope", blurb: "Define what is in and out, get agreement, and break the work down." },
    { id: 3, title: "Help ensure value-based delivery", blurb: "Agree what value means, prioritize by it, and deliver it incrementally." },
    { id: 4, title: "Plan and manage resources", blurb: "Define the people, skills, and materials needed and keep supply matched to demand." },
    { id: 5, title: "Plan and manage procurement", blurb: "Acquire goods and services from outside the organization and manage the contracts." },
    { id: 6, title: "Plan and manage finance", blurb: "Analyze funding needs, plan contingencies, and track spend and financial reporting." },
    { id: 7, title: "Plan and optimize quality of products/deliverables", blurb: "Prevent defects and verify deliverables meet agreed standards." },
    { id: 8, title: "Plan and manage schedule", blurb: "Sequence work, estimate durations, and track progress against the plan." },
    { id: 9, title: "Evaluate project status", blurb: "Measure performance and consolidate progress so decisions are based on facts." },
    { id: 10, title: "Manage project closure", blurb: "Confirm acceptance, close contracts and finances, release resources, and capture lessons." },
  ],
  BUSINESS_ENV: [
    { id: 1, title: "Define and establish project governance", blurb: "Establish structure, rules, decision rights, escalation paths, and success metrics." },
    { id: 2, title: "Plan and manage project compliance", blurb: "Meet legal, regulatory, and organizational requirements, including sustainability." },
    { id: 3, title: "Manage and control changes", blurb: "Run the change control process and keep documentation aligned with approved changes." },
    { id: 4, title: "Remove impediments and manage issues", blurb: "Clear blockers for the team and resolve problems that arise during delivery." },
    { id: 5, title: "Plan and manage risk", blurb: "Identify, analyze, and respond to uncertainty that could affect the project." },
    { id: 6, title: "Continuous improvement", blurb: "Use lessons learned and update organizational process assets." },
    { id: 7, title: "Support organizational change", blurb: "Assess culture and help the organization adopt what the project delivers." },
    { id: 8, title: "Evaluate external business environment changes", blurb: "Watch the external environment and assess the impact on scope and value." },
  ],
};

export const ENV_META: Record<EnvType, { label: string; blurb: string }> = {
  PREDICTIVE: {
    label: "Predictive (waterfall)",
    blurb: "Detailed up-front planning, sequential phases, controlled change.",
  },
  AGILE: {
    label: "Agile / adaptive",
    blurb: "Iterative delivery, fast feedback, cross-functional teams.",
  },
  HYBRID: {
    label: "Hybrid",
    blurb: "A blend of predictive and adaptive practices tailored to the context.",
  },
};

export const EXAM_CONFIG = {
  totalQuestions: 180, // 170 scored + 10 unscored pretest items
  durationMinutes: 240,
  // Two optional 10-minute breaks. On the 2026 exam the first break follows the
  // case-study section and the second falls around the midpoint of the remaining
  // questions. Time taken for a break is NOT counted against the 240 minutes.
  breakAfterQuestions: [60, 120],
  breakMinutes: 10,
  // PMI does not publish a passing score. This app does not assert a fixed pass
  // threshold; the readiness score is an informational estimate only.
} as const;

export function domainWeightPercent(d: Domain): number {
  return Math.round(DOMAIN_META[d].weight * 100);
}

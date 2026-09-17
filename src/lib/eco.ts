// 2026 PMP Examination Content Outline — factual domain & task structure.
// Task numbering follows the PMI Examination Content Outline. Used for
// mapping every question to a domain + task, curriculum, and SEO pages.

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
    weight: 0.42,
    color: "#0F766E",
    blurb:
      "Leading a team, managing conflict, coaching and mentoring, and supporting team performance — the human side of project leadership.",
  },
  PROCESS: {
    label: "Process",
    short: "Process",
    weight: 0.5,
    color: "#1E3A8A",
    blurb:
      "Planning, executing and closing work: schedule, budget, risk, scope, quality, communications, procurement, and governance.",
  },
  BUSINESS_ENV: {
    label: "Business Environment",
    short: "Business Env.",
    weight: 0.08,
    color: "#B45309",
    blurb:
      "Linking the project to the organization: compliance, benefits realization, external business changes, and organizational change.",
  },
};

export const TASKS: Record<Domain, { id: number; title: string; blurb: string }[]> = {
  PEOPLE: [
    { id: 1, title: "Manage conflict", blurb: "Resolve disagreement and friction in a way that protects relationships and project outcomes." },
    { id: 2, title: "Lead a team", blurb: "Set direction, energize the team, and hold everyone accountable without micromanaging." },
    { id: 3, title: "Support team performance", blurb: "Create conditions in which the team can focus and deliver at its best." },
    { id: 4, title: "Empower team members and stakeholders", blurb: "Delegate authority and decision rights so people can act." },
    { id: 5, title: "Ensure team members and stakeholders are adequately trained", blurb: "Close skill gaps with the right training at the right time." },
    { id: 6, title: "Build a team", blurb: "Form a group of people into a high-performing, trusting team." },
    { id: 7, title: "Engage and support virtual teams", blurb: "Keep distributed teams connected, informed, and productive." },
    { id: 8, title: "Define team ground rules", blurb: "Establish norms for behavior, communication, and decision making." },
    { id: 9, title: "Mentor relevant stakeholders", blurb: "Develop the capability of sponsors, team members, and colleagues." },
    { id: 10, title: "Promote team performance through emotional intelligence", blurb: "Use self-awareness and empathy to improve collaboration and decisions." },
  ],
  PROCESS: [
    { id: 1, title: "Execute project with the urgency required to deliver business value", blurb: "Keep momentum and focus delivery on value, not just activity." },
    { id: 2, title: "Manage communications", blurb: "Ensure the right information reaches the right people at the right time." },
    { id: 3, title: "Assess and manage risks", blurb: "Identify, analyze, and respond to uncertainty that could affect the project." },
    { id: 4, title: "Engage stakeholders", blurb: "Understand stakeholder expectations and influence to gain support." },
    { id: 5, title: "Plan and manage budget and resources", blurb: "Estimate, allocate, and monitor money and people." },
    { id: 6, title: "Plan and manage schedule", blurb: "Sequence work, estimate durations, and track progress over time." },
    { id: 7, title: "Plan and manage quality of products and deliverables", blurb: "Prevent defects and verify deliverables meet agreed standards." },
    { id: 8, title: "Plan and manage scope", blurb: "Define what is in and out, and manage change to the baseline." },
    { id: 9, title: "Integrate project planning activities", blurb: "Pull plans together into one coherent, achievable whole." },
    { id: 10, title: "Plan and manage procurement", blurb: "Acquire goods and services from outside the organization." },
    { id: 11, title: "Manage project artifacts", blurb: "Create, update, and control documents and deliverables needed for the project." },
    { id: 12, title: "Determine appropriate project methodology, methods, and practices", blurb: "Choose how the project will be run: predictive, agile, hybrid, or tailored." },
    { id: 13, title: "Establish project governance structure", blurb: "Define roles, decision rights, and escalation paths." },
    { id: 14, title: "Manage project issues", blurb: "Identify and resolve problems that arise during execution." },
    { id: 15, title: "Ensure knowledge transfer for project continuity", blurb: "Keep critical knowledge from walking out the door." },
    { id: 16, title: "Plan and manage project/phase closure or transitions", blurb: "Close cleanly, hand over deliverables, and capture lessons." },
  ],
  BUSINESS_ENV: [
    { id: 1, title: "Plan and manage project compliance", blurb: "Meet legal, regulatory, and organizational requirements." },
    { id: 2, title: "Evaluate and deliver project benefits and value", blurb: "Connect project outputs to realized business value." },
    { id: 3, title: "Evaluate and address external business environment changes for impact on scope", blurb: "React to market, regulatory, or competitive shifts." },
    { id: 4, title: "Support organizational change", blurb: "Help the organization adopt what the project delivers." },
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
  totalQuestions: 180,
  durationMinutes: 230,
  // Two optional 10-minute breaks after questions 60 and 120. Time to take a
  // break is NOT counted against the 230 minutes.
  breakAfterQuestions: [60, 120],
  breakMinutes: 10,
  passThresholdPercent: 59,
} as const;

export function domainWeightPercent(d: Domain): number {
  return Math.round(DOMAIN_META[d].weight * 100);
}
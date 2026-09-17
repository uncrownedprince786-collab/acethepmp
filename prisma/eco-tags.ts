// Authoritative 2026 ECO domain + task for every seeded question.
//
// Index-aligned with the `questions` array in prisma/seed.ts, in seed order.
// This is the single source of truth for question tagging: seed.ts applies it
// on insert and prisma/retag-eco.ts uses it to migrate existing rows. If you
// add, remove, or reorder questions in seed.ts, update this list to match — a
// length check in both entrypoints will fail loudly if they drift apart.

import type { Domain } from "@prisma/client";

export type EcoTag = { domain: Domain; task: number };

export const ECO_TAGS: EcoTag[] = [
  // ---------------------------------------------------------------- PEOPLE
  { domain: "PEOPLE", task: 2 }, // 1  sprint review disagreement
  { domain: "PEOPLE", task: 2 }, // 2  personality clash rework
  { domain: "PROCESS", task: 4 }, // 3  staffing: negotiate for resources
  { domain: "BUSINESS_ENV", task: 4 }, // 4  velocity drop: remove impediments
  { domain: "PEOPLE", task: 3 }, // 5  empowerment / hovering PM
  { domain: "PEOPLE", task: 3 }, // 6  close a training skill gap
  { domain: "PEOPLE", task: 3 }, // 7  newly formed team, team-building
  { domain: "PEOPLE", task: 8 }, // 8  virtual teams across time zones
  { domain: "PEOPLE", task: 2 }, // 9  agree on ground rules
  { domain: "PEOPLE", task: 5 }, // 10 mentor a junior on stakeholder comms
  { domain: "PEOPLE", task: 3 }, // 11 emotional intelligence under pressure
  { domain: "PEOPLE", task: 3 }, // 12 coach team into self-management

  // --------------------------------------------------------------- PROCESS
  { domain: "PROCESS", task: 8 }, // 13 crash the critical path
  { domain: "BUSINESS_ENV", task: 3 }, // 14 new feature: run change control
  { domain: "BUSINESS_ENV", task: 5 }, // 15 supplier risk: mitigate
  { domain: "BUSINESS_ENV", task: 5 }, // 16 discontinued API: reassess risk
  { domain: "PEOPLE", task: 4 }, // 17 power/interest stakeholder grid
  { domain: "PEOPLE", task: 8 }, // 18 status reports miss decisions
  { domain: "PROCESS", task: 6 }, // 19 earned value CPI/SPI
  { domain: "PROCESS", task: 8 }, // 20 critical path and float
  { domain: "PROCESS", task: 1 }, // 21 hybrid tailoring of approach
  { domain: "PROCESS", task: 7 }, // 22 cost of nonconformance
  { domain: "BUSINESS_ENV", task: 4 }, // 23 external dependency becomes an issue
  { domain: "BUSINESS_ENV", task: 1 }, // 24 change within delegated authority
  { domain: "PROCESS", task: 5 }, // 25 fixed-price nonconforming deliverable
  { domain: "PEOPLE", task: 7 }, // 26 knowledge transfer before departure
  { domain: "PROCESS", task: 1 }, // 27 tailor documents nobody reads
  { domain: "PROCESS", task: 10 }, // 28 project closure essentials

  // ------------------------------------------------------- BUSINESS ENV
  { domain: "BUSINESS_ENV", task: 2 }, // 29 new data-protection regulation
  { domain: "PROCESS", task: 3 }, // 30 benefits realization tracking
  { domain: "BUSINESS_ENV", task: 8 }, // 31 competitor changes the business case
  { domain: "BUSINESS_ENV", task: 7 }, // 32 reduce resistance to org change
];

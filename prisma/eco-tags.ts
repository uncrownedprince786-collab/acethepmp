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

  // ------------------------------------ added 2026-09 for ECO balance (Process depth)
  { domain: "PROCESS", task: 2 }, // 33 scope creep: route requests through change control
  { domain: "PROCESS", task: 9 }, // 34 evaluate true status with objective progress signals
  { domain: "PROCESS", task: 1 }, // 35 integrated planning: align approach before plan
  { domain: "PROCESS", task: 4 }, // 36 resolve resource over-allocation with leveling
  { domain: "PROCESS", task: 6 }, // 37 draw on contingency reserve via funding process
  { domain: "PROCESS", task: 3 }, // 38 prioritize scope by business value

  // ------------------------------------ added 2026-09 for ECO balance (Business Env task 6)
  { domain: "BUSINESS_ENV", task: 6 }, // 39 update process assets from recurring defect

  // ------------------------------------ added 2026-09 to cover remaining tasks
  { domain: "PEOPLE", task: 1 }, // 40 develop a shared vision and success criteria
  { domain: "PEOPLE", task: 6 }, // 41 manage a customer's inflated expectations
  { domain: "PROCESS", task: 5 }, // 42 match contract type to requirement certainty
  { domain: "PROCESS", task: 7 }, // 43 build quality in with prevention, not inspection
  { domain: "BUSINESS_ENV", task: 1 }, // 44 establish decision rights and escalation paths

  // ------------------------------------ added 2026-09 PEOPLE domain expansion
  { domain: "PEOPLE", task: 1 }, // 45 vision workshop for ambiguous done/success criteria
  { domain: "PEOPLE", task: 1 }, // 46 merging cultures after reorg into shared vision
  { domain: "PEOPLE", task: 1 }, // 47 charter kickoff: reconcile cost vs reliability priorities
  { domain: "PEOPLE", task: 1 }, // 48 strategic pivot: revisit and re-articulate vision
  { domain: "PEOPLE", task: 2 }, // 49 cross-team ownership conflict over cutover task
  { domain: "PEOPLE", task: 2 }, // 50 distributed team conflict over acceptance authority
  { domain: "PEOPLE", task: 2 }, // 51 personal conflict between BA and dev lead
  { domain: "PEOPLE", task: 3 }, // 52 sudden performance decline: private conversation
  { domain: "PEOPLE", task: 3 }, // 53 leading team through reorg uncertainty
  { domain: "PEOPLE", task: 3 }, // 54 recognizing team effort after high-strain sprint
  { domain: "PEOPLE", task: 3 }, // 55 delegating decision authority with clear boundaries
  { domain: "PEOPLE", task: 4 }, // 56 unengaged high-influence stakeholder discovered late
  { domain: "PEOPLE", task: 4 }, // 57 low adoption: engage real end users in reviews
  { domain: "PEOPLE", task: 4 }, // 58 reorg reveals new unlisted influential stakeholders
  { domain: "PEOPLE", task: 4 }, // 59 previously engaged stakeholder goes silent
  { domain: "PEOPLE", task: 5 }, // 60 conflicting sponsor priorities collide at decision point
  { domain: "PEOPLE", task: 5 }, // 61 misaligned definition of done between team and stakeholders
  { domain: "PEOPLE", task: 5 }, // 62 negotiating acceptance criteria between disagreeing stakeholders
  { domain: "PEOPLE", task: 6 }, // 63 scope cut communicated late: proactive follow-up
  { domain: "PEOPLE", task: 6 }, // 64 vendor delay: proactively inform sponsor before slip discovered
  { domain: "PEOPLE", task: 6 }, // 65 executive's unapproved feature expectation: clarify proactively
  { domain: "PEOPLE", task: 7 }, // 66 project closure: knowledge transfer plan to operations team
  { domain: "PEOPLE", task: 7 }, // 67 onboarding new developer via pairing mid-project
  { domain: "PEOPLE", task: 7 }, // 68 cross-team duplicated effort: knowledge-sharing forum
  { domain: "PEOPLE", task: 8 }, // 69 tailoring communications plan to mixed stakeholder needs
  { domain: "PEOPLE", task: 8 }, // 70 choosing push/pull/interactive methods for stakeholder types
  { domain: "PEOPLE", task: 8 }, // 71 information radiators and sprint review cadence
  { domain: "PEOPLE", task: 8 }, // 72 communication overload: consolidate channels and cadence

  // ------------------------------------ added 2026-09 BUSINESS_ENV domain expansion
  { domain: "BUSINESS_ENV", task: 1 }, // 73 phase-gate criteria and approval authority
  { domain: "BUSINESS_ENV", task: 1 }, // 74 governance layer for scaled agile teams
  { domain: "BUSINESS_ENV", task: 2 }, // 75 categorize compliance requirements with SMEs
  { domain: "BUSINESS_ENV", task: 2 }, // 76 compliance checkpoint before component acceptance
  { domain: "BUSINESS_ENV", task: 2 }, // 77 weigh compliance investment against consequences
  { domain: "BUSINESS_ENV", task: 3 }, // 78 unapproved feature routed through change control
  { domain: "BUSINESS_ENV", task: 3 }, // 79 negotiate mid-sprint scope swap with the team
  { domain: "BUSINESS_ENV", task: 3 }, // 80 configuration management across vendors
  { domain: "BUSINESS_ENV", task: 4 }, // 81 escalate a recurring organizational impediment
  { domain: "BUSINESS_ENV", task: 4 }, // 82 escalate a critical-path resource conflict
  { domain: "BUSINESS_ENV", task: 4 }, // 83 root-cause a repeatedly reopened issue
  { domain: "BUSINESS_ENV", task: 5 }, // 84 define risk thresholds with the sponsor
  { domain: "BUSINESS_ENV", task: 5 }, // 85 spike to investigate technical risk
  { domain: "BUSINESS_ENV", task: 5 }, // 86 secondary risk from a transfer response
  { domain: "BUSINESS_ENV", task: 6 }, // 87 track retrospective action items to closure
  { domain: "BUSINESS_ENV", task: 6 }, // 88 capture lessons learned continuously
  { domain: "BUSINESS_ENV", task: 6 }, // 89 investigate an in-control trend signal
  { domain: "BUSINESS_ENV", task: 7 }, // 90 sustain adoption after go-live
  { domain: "BUSINESS_ENV", task: 7 }, // 91 support stakeholders through agile transition
  { domain: "BUSINESS_ENV", task: 7 }, // 92 low post-launch adoption needs follow-up
  { domain: "BUSINESS_ENV", task: 8 }, // 93 tariff shock reassessed against business case
  { domain: "BUSINESS_ENV", task: 8 }, // 94 new industry-standard framework flagged upward
  { domain: "BUSINESS_ENV", task: 8 }, // 95 interest-rate shift triggers business case review

  // ------------------------------------ added 2026-09 PROCESS domain expansion
  { domain: "PROCESS", task: 1 }, // 96 reconcile conflicting subsidiary-plan assumptions
  { domain: "PROCESS", task: 1 }, // 97 select delivery approach for stable requirements
  { domain: "PROCESS", task: 1 }, // 98 baseline change bypassing integrated change control
  { domain: "PROCESS", task: 1 }, // 99 integrate hybrid workstream dependencies into one plan
  { domain: "PROCESS", task: 2 }, // 100 decompose an ambiguous WBS work package
  { domain: "PROCESS", task: 2 }, // 101 validate scope vs control quality
  { domain: "PROCESS", task: 2 }, // 102 write acceptance criteria and definition of done
  { domain: "PROCESS", task: 2 }, // 103 infeasible deliverable routed through change control
  { domain: "PROCESS", task: 3 }, // 104 value-vs-effort / WSJF backlog ranking
  { domain: "PROCESS", task: 3 }, // 105 balance technical debt against new features
  { domain: "PROCESS", task: 3 }, // 106 MVP validates value earlier
  { domain: "PROCESS", task: 4 }, // 107 resource smoothing within float for shared cranes
  { domain: "PROCESS", task: 4 }, // 108 RACI to clarify accountability
  { domain: "PROCESS", task: 4 }, // 109 negotiate with functional manager for delayed resources
  { domain: "PROCESS", task: 4 }, // 110 phase the release of departing specialists
  { domain: "PROCESS", task: 5 }, // 111 make-or-buy analysis before issuing an RFP
  { domain: "PROCESS", task: 5 }, // 112 weighted source-selection criteria
  { domain: "PROCESS", task: 5 }, // 113 procurement closure beyond deliverable acceptance
  { domain: "PROCESS", task: 6 }, // 114 funding limit reconciliation
  { domain: "PROCESS", task: 6 }, // 115 EAC trend signals a likely overrun
  { domain: "PROCESS", task: 6 }, // 116 contingency reserve vs management reserve authority
  { domain: "PROCESS", task: 6 }, // 117 track spend and value under fixed agile funding
  { domain: "PROCESS", task: 7 }, // 118 Pareto chart ranks defect categories
  { domain: "PROCESS", task: 7 }, // 119 expand definition of done after UAT failures
  { domain: "PROCESS", task: 7 }, // 120 quality audit: inspection criteria miss the failure mode
  { domain: "PROCESS", task: 8 }, // 121 finish-to-start dependency with a lead
  { domain: "PROCESS", task: 8 }, // 122 three-point (PERT) estimating
  { domain: "PROCESS", task: 8 }, // 123 rolling wave planning for a release cadence
  { domain: "PROCESS", task: 8 }, // 124 relative estimation and velocity calibration for a new team
  { domain: "PROCESS", task: 9 }, // 125 investigate a declining SPI trend before threshold breach
  { domain: "PROCESS", task: 9 }, // 126 rising cycle time with flat throughput signals a WIP problem
  { domain: "PROCESS", task: 9 }, // 127 status dashboard for the steering committee
  { domain: "PROCESS", task: 10 }, // 128 formal closure of a terminated project
  { domain: "PROCESS", task: 10 }, // 129 plan transition to operations before closure
  { domain: "PROCESS", task: 10 }, // 130 document lessons learned into process assets
];

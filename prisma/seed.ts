// Seed data for Ace the PMP.
// All questions are originally written for this platform and are mapped to
// the 2026 PMI Examination Content Outline (domain + task). Question scenario
// text is original; no content is copied from any commercial question bank.

import { PrismaClient, type EnvType, type Difficulty } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ECO_TAGS } from "./eco-tags";

export const prisma = new PrismaClient();

type Key = "A" | "B" | "C" | "D";

type SeedQuestion = {
  envType: EnvType;
  difficulty: Difficulty;
  stem: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctKey: Key;
  explanation: string;
};

// Question content. Domain + task are NOT stored here: ECO_TAGS
// (prisma/eco-tags.ts) is index-aligned with this array and is the single source
// of truth, applied at insert time and by the retag migration.
export const questions: SeedQuestion[] = [
  // ---------------------------------------------------------------- PEOPLE
  {
    envType: "AGILE",
    difficulty: "EASY",
    stem: "During a sprint review, two senior developers openly disagree about the best technical approach for the next feature. Voices are raised and the disagreement continues in the retrospective. Both approaches are technically sound. What should the project manager do first?",
    optionA:
      "Ask the two developers to settle the matter privately and report the outcome back to the team.",
    optionB:
      "Host a private meeting with only the two developers and decide the approach for them.",
    optionC:
      "Acknowledge the disagreement, steer the discussion toward objective criteria, and involve the whole team in a decision they can own.",
    optionD:
      "Escalate to the sponsor immediately, because the disagreement may delay the release.",
    correctKey: "C",
    explanation:
      "C is correct. The preferred approach to conflict is collaborative: address the issue directly, focus on the problem rather than personalities, agree on objective criteria, and let those closest to the work own the decision. A leaves the conflict to smolder and delays a team decision. B decides for the team and reduces ownership and buy-in, and it is not 'first' because the situation can and should be handled openly. D is premature escalation; the sponsor is needed only when the project manager cannot resolve the conflict or the impact is beyond the PM's authority.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "Two team members have a personality clash that is causing rework and missed handoffs. Attempts to avoid the issue have made it worse. Which approach best reflects the recommended technique for managing this conflict?",
    optionA:
      "Bring the parties together, let each side be heard, and work toward a resolution that preserves the working relationship.",
    optionB:
      "Separate the two members onto different tasks so they no longer have to interact.",
    optionC: "Document the underperformance of both members in their personnel records.",
    optionD:
      "Ask the functional managers to resolve the matter, since the project manager has no authority over them.",
    correctKey: "A",
    explanation:
      "A is correct. When conflict already exists, the project manager should use a collaborative stance: face-to-face discussion, listening to both perspectives, and focusing on the problem with the aim of preserving respect and the relationship. B is avoidance; separating people hides the conflict, which usually reappears elsewhere. C moves to punishment rather than resolution and damages trust. D abdicates the project manager's responsibility to manage the team's conflict; the PM is accountable for team dynamics regardless of who does the daily management.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A newly chartered project is about to start staffing. Several functional managers are reluctant to release their strongest people because of their own priorities. What should the project manager do first?",
    optionA:
      "Negotiate with the functional managers, using the staffing management plan and project priorities to make the case for the needed resources.",
    optionB: "Escalate to the sponsor and demand authority to take any employee needed.",
    optionC: "Assign whoever is currently available so the project does not slip.",
    optionD: "Immediately hire contractors for the entire team to avoid negotiation.",
    correctKey: "A",
    explanation:
      "A is correct. In a matrix organization the project manager acquires resources by negotiating with functional managers, supported by the resource management plan and the project's priority. B misuses escalation; the sponsor is a last resort when negotiation fails and decisions cannot be forced on functional managers. C risks a weak team and downstream quality and schedule problems. D is wasteful and unnecessary when capable internal resources exist; contracting is one option, not the first step.",
  },
  {
    envType: "AGILE",
    difficulty: "EASY",
    stem: "Team velocity has dropped for three consecutive sprints and leadership is asking for explanations. What should the project manager do first?",
    optionA: "Update the forecast and explain the current velocity drop to leadership.",
    optionB: "Ask the team what is impeding their performance and help remove the blockers.",
    optionC: "Add several new developers to the team so velocity recovers quickly.",
    optionD: "Require the team to work overtime until velocity returns to the baseline.",
    correctKey: "B",
    explanation:
      "B is correct. Supporting team performance starts with understanding the root cause; impediments are the team's main blockers, and it is the project manager's job to remove them. A communicates symptoms without addressing causes. C can actually reduce short-term velocity as new members take time to ramp up. D burns the team out, sacrifices quality, and treats the symptom rather than the cause.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "The project manager attends every daily stand-up and frequently reopens decisions the product owner has already made. The team has begun waiting for the project manager before acting. What should the project manager do?",
    optionA: "Keep attending every stand-up so nothing is missed.",
    optionB: "Let the team and the product owner own their decisions, and step back unless there is genuine risk.",
    optionC: "Take over the product owner's leadership duties to speed up decisions.",
    optionD: "Introduce a decision log that every decision must pass through before the team acts.",
    correctKey: "B",
    explanation:
      "B is correct. Empowerment means delegating decision rights to the people closest to the work and trusting the agile roles. Reopening decisions and hovering erodes empowerment and slows the team. A reinforces the dependency. C violates the roles of a self-managing team and concentrates authority unnecessarily. D adds bureaucracy and still keeps the project manager as the gate, which is the opposite of empowerment.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "This project will use a data-analytics platform the team has never used. The training budget is limited. What should the project manager do first to make sure the team can deliver?",
    optionA: "Delay any training until a real skill gap has been proven in practice.",
    optionB: "Identify the specific skill gap and arrange targeted training on the platform.",
    optionC: "Hire an outside expert to handle all analytics work for the project.",
    optionD: "Ask the customer to reduce the analytics scope of the project.",
    correctKey: "B",
    explanation:
      "B is correct. The project manager assesses the team's skills against what the work requires and provides the right training at the right time; targeted training closes the gap efficiently. A risks early failure and rework that training would have prevented. C may be unnecessary and is more expensive than developing the team. D changes scope to work around a training gap, harming the project's value rather than building capability.",
  },
  {
    envType: "HYBRID",
    difficulty: "EASY",
    stem: "A project team is being formed from people who have never worked together. Which activity does most to help the team become productive quickly?",
    optionA: "Assigning all work packages on day one so people focus on delivery.",
    optionB: "Holding team-building activities while agreeing on shared goals, roles, and working norms early.",
    optionC: "Depending on the organizational chart to define how team members interact.",
    optionD: "Letting the team find its own way without any structure or facilitation.",
    correctKey: "B",
    explanation:
      "B is correct. Teams go through forming, storming, norming, and performing; deliberate team-building and early agreement on goals, roles, and norms compress the time to performing. A skips relationship building, which usually surfaces later as conflict and rework. C describes reporting lines, not how a high-performing team actively works together. D leaves the team to struggle through ambiguity slowly.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "A project team is spread across four time zones. Recurring meetings always favor one region, and people in the other regions rarely speak. What is the most effective fix?",
    optionA: "Keep the current meeting time since some members join asynchronously anyway.",
    optionB: "Rotate meeting times and use asynchronous collaboration tools so all regions can contribute fairly.",
    optionC: "Move every meeting to the head-office time zone for consistency.",
    optionD: "Record the meetings and ask remote members to watch the recordings afterwards.",
    correctKey: "B",
    explanation:
      "B is correct. Virtual teams work best when time zones are balanced: rotating meeting times distributes the inconvenience, and asynchronous tools give every member a voice regardless of time. A preserves the bias and slowly disengages entire regions. C still favors the head office. D is one-way communication: recordings inform but do not allow contribution or discussion.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "EASY",
    stem: "Team members from different departments hold very different expectations about decision-making, working hours, and communication. To prevent friction, what should the project manager do early in the project?",
    optionA: "Agree on team ground rules with the whole team, including norms for decisions and communication.",
    optionB: "Set a private set of rules for each individual team member.",
    optionC: "Leave the rules to the functional managers to define per department.",
    optionD: "Write a detailed organizational chart and a role description for each task.",
    correctKey: "A",
    explanation:
      "A is correct. Ground rules are most effective when the team agrees on them together, creating shared ownership of behavior norms. B creates inconsistent expectations and misses the team-level agreement. C keeps departments siloed and invites conflicting norms. D defines roles, which is useful, but it is not the same as agreeing on how the team will work and behave together.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "A talented junior team member struggles with stakeholder communication. A critical sponsor update is due next week. What is the best use of the project manager's time?",
    optionA: "Write the update alone and keep the junior member away from the stakeholder for safety.",
    optionB: "Prepare the update together with the member, review it jointly, and coach them through delivery and follow-up.",
    optionC: "Enroll the junior member in a general communication course right away.",
    optionD: "Ask the functional manager to reassign the junior member to a more suitable role.",
    correctKey: "B",
    explanation:
      "B is correct. Mentoring is just-in-time development: working together on a real, high-stakes task and coaching through it builds capability faster than theory. A protects the outcome but denies the member the growth opportunity. C is generic and slow relative to the immediate deadline. D gives up on developing talent instead of developing it, and loses the member's value to the project.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "In a tense steering committee meeting, a stakeholder repeatedly interrupts the project manager. The project manager feels frustrated but needs the meeting to succeed. Which behavior best demonstrates emotional intelligence?",
    optionA: "Interrupt back firmly to reassert control of the meeting.",
    optionB: "Pause, acknowledge the stakeholder's concern, and gently steer the conversation back to the agenda.",
    optionC: "End the meeting early and reschedule to a less stressful day.",
    optionD: "Ask the sponsor to exclude the stakeholder from future meetings.",
    correctKey: "B",
    explanation:
      "B is correct. Emotional intelligence here means self-management under pressure plus relationship management: staying composed, validating the other person's feelings, and redirecting constructively. A escalates the tension and models the behavior being criticized. C avoids the difficult conversation instead of managing it. D removes the stakeholder from the process rather than repairing the relationship.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "The organization is adopting agile for the first time, and several team members from predictive projects are skeptical of self-organization. What should the project manager do to help the team become a self-managing unit?",
    optionA: "Explain the agile roles and coach the team through the transition while the product owner keeps the backlog prioritized.",
    optionB: "Keep assigning individual tasks as before so that delivery does not slow down.",
    optionC: "Remove the roles that are confusing people and let the team work informally.",
    optionD: "Leave the team completely alone until they ask for help.",
    correctKey: "A",
    explanation:
      "A is correct. Moving to self-management is a change effort: coaching, role clarity, and supportive structures (like a prioritized backlog) help the team build the capability gradually. B keeps the team dependent on the project manager and prevents self-management. C removes structure the team still needs while learning. D abandons the team with no support, which causes confusion and frustration rather than capability.",
  },

  // --------------------------------------------------------------- PROCESS
  {
    envType: "PREDICTIVE",
    difficulty: "HARD",
    stem: "Work on the critical path is running late and the project finish date is fixed. The cost contingency is limited. What should the project manager do first to recover the schedule?",
    optionA: "Crash critical-path activities, prioritizing those with the lowest cost per day saved.",
    optionB: "Fast-track every critical-path activity regardless of dependencies between them.",
    optionC: "Ask the sponsor to move the finish date out by the amount of the delay.",
    optionD: "Remove non-essential scope from the project without formal approval.",
    correctKey: "A",
    explanation:
      "A is correct. Crashing adds resources to critical-path activities and, when cost is constrained, the project manager crushes the activities with the best cost-time trade-off first. B is reckless: fast tracking runs activities in parallel, but only where dependencies allow, and it can introduce rework and risk. C gives up on the fixed date without trying schedule compression. D changes scope without approval, which bypasses change control.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "EASY",
    stem: "Two weeks before the planned end date, a customer requests a new feature. The feature is valuable but would add about three weeks of work. What should the project manager do first?",
    optionA: "Submit the request through change control so it can be evaluated against the baseline.",
    optionB: "Tell the customer the feature is impossible at this stage of the project.",
    optionC: "Start building the feature immediately to keep the customer satisfied.",
    optionD: "Update the schedule baseline to add three weeks, then inform the sponsor.",
    correctKey: "A",
    explanation:
      "A is correct. Scope changes are assessed through the integrated change control process, which evaluates impact, cost, schedule, risk, and value before approval. B rejects the request without evaluation, which may deny real value. C bypasses change control and quietly changes the baseline. D also bypasses approval; the baseline changes only after the change is approved.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "During risk identification, the team identifies that a key supplier may go out of business. The risk has a moderate probability and high impact. A second qualified supplier is available. Which risk response is most appropriate?",
    optionA: "Accept the risk, since nothing can change the supplier's situation.",
    optionB: "Mitigate the risk by arranging a backup supplier and dual-sourcing critical items.",
    optionC: "Transfer the risk to the customer through a contract clause.",
    optionD: "Avoid the risk by ending the use of the supplier immediately.",
    correctKey: "B",
    explanation:
      "B is correct. Mitigation reduces probability or impact; a pre-arranged backup supplier lowers the impact of losing the primary supplier. A acceptance is only appropriate for low-priority risks. C transfer shifts the risk to another party (for example through insurance or warranties), which does not fit this scenario. D is disproportionate: avoiding by dropping the supplier now still requires a replacement and may disrupt the project.",
  },
  {
    envType: "HYBRID",
    difficulty: "HARD",
    stem: "The project uses a third-party API for a critical integration. The team mitigates the risk of the API being discontinued by building a wrapper that can switch to an alternative. During development, the primary vendor announces it will end the API in six months. How should the project manager handle this?",
    optionA: "Treat this as a new risk event and reassess whether the current response strategy is still adequate.",
    optionB: "Immediately activate the contingency and switch over to the alternative API today.",
    optionC: "Accept the situation since the API will keep working for six months.",
    optionD: "Do nothing until the API actually stops working.",
    correctKey: "A",
    explanation:
      "A is correct. The announcement changes the risk picture: mitigation was planned for a possible discontinuation, but now the discontinuation is confirmed. The project manager re-evaluates the plan, cost, and schedule and decides the best response. B may be premature and expensive if the switch can be timed better. C ignores that the risk has actually materialized and the response plan needs revisiting. D delays action until it becomes an emergency.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "EASY",
    stem: "A stakeholder has high power but low interest in the project details. This stakeholder rarely attends meetings, yet can block an important approval when needed. Which stakeholder engagement strategy is most appropriate?",
    optionA: "Manage closely, involving them in every detail.",
    optionB: "Keep satisfied, monitoring their needs and engaging them at key decision points only.",
    optionC: "Keep informed with detailed weekly reports.",
    optionD: "Monitor, since low interest means no action is needed.",
    correctKey: "B",
    explanation:
      "B is correct. On the power-interest grid, high power and low interest maps to 'keep satisfied': they do not need detail, but they must be engaged at decision points so blockers never surprise them. A overwhelms a low-interest stakeholder with detail. C suits low-power, high-interest stakeholders who need information. D ignores that high-power stakeholders must be managed even when their interest is low.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "Status reports are being sent on schedule, yet stakeholders keep saying they cannot find key decisions and approvals. What is the most likely root cause and the best fix?",
    optionA: "The reports are too long, so stakeholders do not read them; shorten every report.",
    optionB: "There is no agreed communication plan that defines what is communicated, to whom, when, and through which channel.",
    optionC: "Stakeholders are not opening their email; send more reminders.",
    optionD: "Meetings are too infrequent; increase the meeting frequency.",
    correctKey: "B",
    explanation:
      "B is correct. Stakeholders missing decisions despite receiving reports points to a communications planning gap: the 'what, who, when, and how' were never agreed. A may help readability but does not address where decisions are published. C blames the audience and adds noise. D adds more meetings without fixing how decisions are captured and shared.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "At the status date, earned value is $106,000, actual cost is $98,000, and planned value is $100,000. Which statement about the project is correct?",
    optionA: "CPI is 1.08 and SPI is 1.06; the project is ahead of schedule and under budget.",
    optionB: "CPI is 0.92 and SPI is 0.94; the project is behind schedule and over budget.",
    optionC: "CPI is 1.08 and SPI is 0.94; the project is over budget but ahead of schedule.",
    optionD: "CPI is 0.92 and SPI is 1.06; the project is under budget but behind schedule.",
    correctKey: "A",
    explanation:
      "A is correct. CPI = EV/AC = 106/98 = 1.08 (above 1, meaning under budget) and SPI = EV/PV = 106/100 = 1.06 (above 1, meaning ahead of schedule). Options B, C and D misstate either formula or the interpretation of the index values.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "EASY",
    stem: "In a precedence diagram, the project manager identifies the longest path from start to finish. Which statement about activities on this path is true?",
    optionA: "They have zero total float and determine the earliest the project can finish.",
    optionB: "They have the most float of any activities in the schedule.",
    optionC: "They can be delayed without changing the project end date.",
    optionD: "They include only milestones, not work activities.",
    correctKey: "A",
    explanation:
      "A is correct. The critical path has the longest duration and the least float; any delay to a critical-path activity delays the project end date. B is the opposite of the truth. C describes non-critical activities with float. D is wrong; the critical path is made of activities (and can include milestones, but is not limited to them).",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "A project must deliver a fixed, well-defined regulatory deliverable as well as a product whose design benefits from frequent user feedback. Which approach is most suitable?",
    optionA: "Apply a fully predictive approach to the entire project for control.",
    optionB: "Use a hybrid approach: predictive for the regulatory deliverable and iterative delivery for the evolving design.",
    optionC: "Apply a fully agile approach to the entire project for speed.",
    optionD: "Do no planning until all requirements are completely known.",
    correctKey: "B",
    explanation:
      "B is correct. Tailoring matches the approach to the work: predictive control suits fixed, regulatory requirements, while iterative development suits uncertain, evolving design. A imposes a heavy process on the innovative part. C loses the control and traceability the regulatory part needs. D is not a real option; the right work still needs appropriate planning.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "EASY",
    stem: "Which of the following is an example of the cost of nonconformance (poor quality)?",
    optionA: "Training team members in quality techniques.",
    optionB: "Rework and scrap from defective deliverables.",
    optionC: "Inspecting deliverables before they are accepted.",
    optionD: "Preventive maintenance of production equipment.",
    correctKey: "B",
    explanation:
      "B is correct. The cost of poor quality (nonconformance) includes rework, scrap, warranty claims, and liability. A, C and D are all costs of conformance — the money invested to ensure work meets requirements (training, testing, inspection, prevention).",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "A critical external dependency has slipped, and a work package cannot proceed. The project manager learns of this during the progress meeting. What should the project manager do first?",
    optionA: "Document the problem as an issue, assess its impact, and develop response options.",
    optionB: "Update the schedule baseline immediately and inform all stakeholders.",
    optionC: "Wait until the dependency becomes available to measure the real impact.",
    optionD: "Report the external party to the sponsor for causing the delay.",
    correctKey: "A",
    explanation:
      "A is correct. Issues are logged, analyzed for impact, and resolved with a chosen response; managing issues this way keeps the project in control. B changes a baseline without completing an impact assessment or approval. C allows the problem to grow unresolved. D assigns blame instead of solving the problem.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "An urgent change falls within the decision authority the project governance has assigned to the project manager. What should the project manager do?",
    optionA: "Approve the change, document the decision and its rationale, and inform the appropriate governance body.",
    optionB: "Escalate every change to the steering committee, regardless of size.",
    optionC: "Wait for the next steering committee meeting even if that causes delay.",
    optionD: "Reject the change because the formal process is too slow for it.",
    correctKey: "A",
    explanation:
      "A is correct. Governance defines limits of authority; within those limits the project manager decides, but the decision must be documented and visible so the governance structure remains transparent. B grinds the project to a halt and contradicts the assigned authority. C puts procedure above the project's needs. D uses the process as an excuse to reject legitimate change.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A contractor's deliverable does not meet the acceptance criteria stated in a fixed-price contract. What is the most appropriate action for the project manager?",
    optionA: "Require the contractor to correct the work at the contractor's cost, consistent with the contract.",
    optionB: "Pay the contractor anyway to preserve the working relationship.",
    optionC: "Hire a second vendor to redo the deliverable at the project's expense.",
    optionD: "Negotiate to pay the contractor extra for the necessary corrections.",
    correctKey: "A",
    explanation:
      "A is correct. In a fixed-price contract the seller bears the cost of correcting nonconforming work; the buyer pays the agreed price only for work that meets acceptance criteria. B pays for unacceptable work and encourages further nonconformance. C and D move the financial consequence to the buyer despite the fixed-price arrangement.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A senior engineer who holds critical, undocumented knowledge about a core system is leaving in two weeks. What should the project manager do first?",
    optionA: "Arrange structured knowledge-transfer sessions now and document key decisions and undocumented details before the departure.",
    optionB: "Hire a replacement engineer before doing anything else.",
    optionC: "Ask the remaining team members to reconstruct the knowledge after the engineer leaves.",
    optionD: "Request that the engineer extend their notice period indefinitely.",
    correctKey: "A",
    explanation:
      "A is correct. Knowledge transfer protects project continuity: structured sessions and documentation capture the critical knowledge while the source is still available. B loses time; hiring first leaves a gap while the knowledge walks out the door. C risks losing details forever and is reactive. D is unrealistic and may not be possible; the project cannot rely on indefinitely keeping the individual.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "The team is spending many hours producing documents that nobody reads, although the governance structure lists them as required artifacts. What is the most effective approach?",
    optionA: "Keep producing all listed documents because governance requires them.",
    optionB: "Tailor the artifact list to the project's real needs and agree the tailored list with the stakeholders who need the information.",
    optionC: "Stop producing all documents until someone complains.",
    optionD: "Produce all documents only at the end of the project.",
    correctKey: "B",
    explanation:
      "B is correct. Tailoring is expected: the project manager adapts methods and artifacts to the project's size, risk, and stakeholder needs, and alignment with stakeholders keeps governance informed. A wastes effort on documents with no value. C risks losing important records and trust. D defeats the purpose of documentation, which supports decisions while the work is happening.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "EASY",
    stem: "As the project nears completion, the team is eager to move to their next assignments immediately. Before closing the project, what must the project manager ensure?",
    optionA: "Final deliverable acceptance, captured lessons learned, and handover of project records and remaining knowledge.",
    optionB: "Only that the final project invoice has been paid.",
    optionC: "A celebratory event with the whole team.",
    optionD: "A final status report sent to the sponsor.",
    correctKey: "A",
    explanation:
      "A is correct. Closure includes formal acceptance, lessons learned, final records, and archiving knowledge for future projects. B confuses financial settlement with project closure. C is a nice practice but not the essential requirement. D is useful but incomplete on its own; closure involves more than a report.",
  },

  // ------------------------------------------------------- BUSINESS ENV
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "Mid-project, the jurisdiction where the project processes customer data introduces a new data-protection regulation that affects deliverables. What should the project manager do first?",
    optionA: "Treat the new regulation as a compliance requirement, assess its impact on the deliverables, and update plans accordingly.",
    optionB: "Ignore it because the customer already approved the current scope.",
    optionC: "Ask the legal department to request a waiver from the new regulation.",
    optionD: "Suspend the project until the regulation is fully clarified.",
    correctKey: "A",
    explanation:
      "A is correct. Compliance is part of the business environment: when requirements change, the project manager assesses impact and integrates the needed changes into plans and change requests. B leaves the project non-compliant, exposing the organization to penalties. C is unlikely to succeed and is not a plan. D suspending is an overreaction before impact is understood.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "EASY",
    stem: "The business case for a new order-processing system promises a 15% reduction in order errors. To properly track benefits realization, what should the project manager do?",
    optionA: "Define measurable benefits and a timeline with the sponsor, and measure the benefit after the system is in use.",
    optionB: "Declare the benefit achieved as soon as the system is launched.",
    optionC: "Ask the IT support team to report how often the system is used.",
    optionD: "Measure the benefit only once, at the project closure meeting.",
    correctKey: "A",
    explanation:
      "A is correct. Benefits are realized over time after the change is adopted; the project manager defines how success will be measured and tracks it with the sponsor. B declares success before any evidence exists. C measures usage, not the promised business outcome. D measures once, too early and too late is impossible; benefits need tracking after go-live.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "While the project is underway, a competitor launches a similar product at half the price. The sponsor is concerned about the project's business case. What should the project manager do first?",
    optionA: "Analyze how the market change affects the project's expected value and discuss options with the sponsor.",
    optionB: "Immediately cut project scope to reduce costs.",
    optionC: "Accelerate delivery by skipping quality checks.",
    optionD: "Ignore the market change and deliver the original scope exactly as planned.",
    correctKey: "A",
    explanation:
      "A is correct. External business-environment changes are assessed for their impact on the project; the project manager evaluates consequences and brings options to the sponsor for a decision. B changes scope without analysis or approval. C trades quality, which damages the very value the project intends to deliver. D ignores information that could invalidate the business case.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A new system will automate a manual approval process. Employees who currently perform approvals will lose part of their responsibilities. How should the project manager reduce resistance to this organizational change?",
    optionA: "Communicate the change early, engage the affected employees, and involve them in designing the new process.",
    optionB: "Keep the change confidential until the system goes live.",
    optionC: "Leave all communication about the change to the HR department at launch time.",
    optionD: "Exclude affected employees from all discussions to avoid emotional reactions.",
    correctKey: "A",
    explanation:
      "A is correct. Organizational change succeeds when affected people are engaged early, understand the why, and have a voice in the solution; involvement reduces resistance. B surprises people at launch, guaranteeing resistance. C delegates away a project responsibility and acts too late. D excludes the very people who must adopt the new way of working.",
  },

  // ------------------------------ PROCESS (added 2026-09 for ECO balance)
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A key stakeholder keeps asking individual team members to add small features directly. The team has implemented several without telling the project manager, and the agreed scope baseline no longer reflects what is being built. What should the project manager do first?",
    optionA:
      "Instruct the team to stop all work until the scope baseline is rebuilt.",
    optionB:
      "Have the team log the requests and route them through integrated change control, then update the scope baseline only for approved changes.",
    optionC:
      "Add all the requests to the scope baseline because they are small and the stakeholder is influential.",
    optionD: "Escalate every request to the sponsor and let the sponsor decide.",
    correctKey: "B",
    explanation:
      "B is correct. Uncontrolled additions are scope creep; the fix is to bring the requests into the agreed change control process so their impact is evaluated and the baseline changes only when a change is approved. A halts delivery unnecessarily and does not establish control. C legitimizes scope creep and hides the true cost and schedule impact. D escalates work the project manager should manage; the sponsor decides only changes beyond the PM's authority.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "For several weeks the team has reported the same feature as '90% complete,' but the remaining work is not shrinking and the iteration goal keeps slipping. Which action best enables the project manager to evaluate the true status?",
    optionA:
      "Collect the percentage-complete figure from each team member and average it.",
    optionB:
      "Track objective progress signals such as a burn-down or burn-up chart and the amount of work actually accepted against the plan.",
    optionC: "Ask the sponsor to confirm the expected completion date.",
    optionD:
      "Increase the number of status meetings until the estimate improves.",
    correctKey: "B",
    explanation:
      "B is correct. Status should be evaluated from objective, trend-based measures — work completed and accepted, burn charts, earned value — not from subjective estimates that can plateau at '90%'. A reproduces the unreliable practice. C sets a date without measuring progress. D adds reporting overhead without producing better data.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "A project is about to begin with stakeholders who each assume a different delivery approach and different success measures. What should the project manager do first to establish an integrated plan?",
    optionA: "Build a detailed schedule and assign every task before any discussion.",
    optionB:
      "Facilitate a planning session with the key stakeholders to agree the delivery approach, objectives, and how progress will be measured, then develop the plan from that shared baseline.",
    optionC: "Start execution immediately and let the plan emerge from the work.",
    optionD:
      "Ask each team to write its own plan and combine the documents at the end.",
    correctKey: "B",
    explanation:
      "B is correct. Integrated planning starts by aligning stakeholders on the approach, objectives, and measures of success so the subsidiary plans fit together; the detailed plan then follows that agreement. A commits to a schedule before the approach is agreed, which invites rework. C reverses the order of planning and executing and risks uncoordinated effort. D produces disconnected plans that do not integrate scope, schedule, cost, and risk.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "HARD",
    stem: "Two critical activities are scheduled in the same week, but each needs the same scarce specialist, who cannot be cloned or replaced in time. What should the project manager do first?",
    optionA:
      "Use resource leveling to reschedule one activity within its available float and resolve the over-allocation.",
    optionB:
      "Require the specialist to work extended hours until both activities are complete.",
    optionC: "Remove one of the activities from the project scope.",
    optionD:
      "Escalate immediately to the functional manager to supply a second specialist.",
    correctKey: "A",
    explanation:
      "A is correct. Resource leveling resolves over-allocation by shifting activities within their float (or, if needed, extending the schedule); it is the first planning tool to apply. B risks burnout, errors, and quality problems. C changes scope without analysis or approval and may remove value. D may become necessary if leveling cannot work, but it is not the first step — optimize the plan before escalating.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "Mid-project, a risk that was identified and planned for occurs earlier than expected and requires an unbudgeted payment. The funding plan includes a contingency reserve. What should the project manager do?",
    optionA:
      "Draw on the contingency reserve following the documented funding and approval process.",
    optionB: "Use the management reserve without notifying the governance body.",
    optionC: "Ask the sponsor for new funding before checking the reserves.",
    optionD: "Reduce planned quality activities to free up the money.",
    correctKey: "A",
    explanation:
      "A is correct. The contingency reserve exists for identified risks (known unknowns) and is released through the agreed funding and approval process. B is wrong: the management reserve covers unknown unknowns and is controlled at a higher level, requiring authorization. C seeks additional funds before using the reserve that was set aside for exactly this. D sacrifices quality and transfers the cost to the product, creating future rework.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "Schedule pressure means the team cannot deliver all of the planned scope. The sponsor asks how to decide what still gets built. What should the project manager recommend first?",
    optionA:
      "Deliver the features in the original plan order to honor the approved baseline.",
    optionB:
      "Prioritize the work by business value with the product owner and stakeholders, and deliver the highest-value increments first.",
    optionC: "Trim the quality assurance activities so more features can be completed.",
    optionD: "Reduce status reporting to save the team time.",
    correctKey: "B",
    explanation:
      "B is correct. Value-based delivery means prioritizing by the benefit each increment delivers and completing the highest-value work first, especially when scope must be traded against time. A optimizes for the plan rather than the outcome and can deliver low-value scope while high-value work is cut. C trades away the quality of the deliverable and usually increases rework. D saves an insignificant amount of effort and does not address value at all.",
  },

  // ------------------------------ BUSINESS ENV (added 2026-09 for ECO balance)
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "A retrospective shows that the same integration defect has caused problems on several consecutive projects. What action best supports continuous improvement?",
    optionA: "Fix the defect on the current project and move on to the next deliverable.",
    optionB:
      "Document the root cause and update the organizational process assets and lessons learned so future projects can prevent it.",
    optionC:
      "Record which team member introduced the defect so it can be avoided in future assignments.",
    optionD: "Wait to see whether the defect recurs before taking any action.",
    correctKey: "B",
    explanation:
      "B is correct. Continuous improvement means feeding lessons back into the organization's process assets so the whole organization benefits, not just the current project. A resolves only the present symptom and guarantees the pattern continues. C turns a process problem into a personal one, which harms trust without preventing recurrence. D is reactive and allows the defect to recur while the evidence to fix it already exists.",
  },

  // ------------------------------ task-coverage gap fill (People 1, People 6, Process 5, Process 7, BE 1)
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "The project charter lists deliverables, but team members describe success in very different ways and pull in different directions. What should the project manager do first to create a common vision?",
    optionA:
      "Let each team member keep their own definition of success as long as the deliverables are met.",
    optionB:
      "Facilitate a session to agree a shared vision and success criteria, and make it visible so decisions align to it.",
    optionC: "Publish the charter and instruct the team to follow it without discussion.",
    optionD:
      "Ask the sponsor to personally direct the team's priorities each week.",
    correctKey: "B",
    explanation:
      "B is correct. A common vision is developed with the team, captures what success looks like, and is kept visible so daily decisions align to it. A leaves the project without alignment and invites conflicting priorities. C distributes a document but does not build shared understanding or commitment. D creates dependency on the sponsor and does not develop the team's ownership of the vision.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "An influential customer keeps assuming the release will include features that were never in scope, and becomes frustrated at each review. What should the project manager do?",
    optionA: "Add the features to scope so the customer is not disappointed.",
    optionB:
      "Proactively confirm the customer's expectations, clarify what is and is not in scope, and agree how changes will be handled.",
    optionC: "Avoid the customer until the release is ready to prevent further conflict.",
    optionD: "Let the customer raise the issue formally once the release ships.",
    correctKey: "B",
    explanation:
      "B is correct. Managing expectations is continuous: surface the mismatch, restate the agreed scope, and set a clear route for any change. A silently expands scope and damages the baseline. C avoids the relationship and lets frustration grow. D defers the problem to the worst possible moment and damages trust.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "HARD",
    stem: "The project needs a specialized vendor. Two suppliers can do the work, but the requirements are still uncertain. Which contract approach should the project manager prefer?",
    optionA: "Use a fixed-price contract regardless of the uncertainty to control cost.",
    optionB:
      "Match the contract type to the level of requirement certainty, using a cost-reimbursable or time-and-materials arrangement while scope is unclear.",
    optionC: "Award the work to the lowest bidder without regard to contract type.",
    optionD: "Avoid contracts entirely and have the internal team do the work.",
    correctKey: "B",
    explanation:
      "B is correct. Contract type follows the risk profile: when requirements are well defined, fixed-price shifts cost risk to the seller; when they are uncertain, cost-reimbursable or time-and-materials is more appropriate. A forces a fixed price onto unstable scope, inviting disputes and claims. C ignores capability, risk, and terms, focusing only on price. D may be impossible and skips the make-or-buy decision.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "A deliverable passes final inspection but customers report it is hard to use. Prevention-focused quality work was skipped under schedule pressure. What should the project manager do first?",
    optionA: "Increase inspection so more defects are caught at the end.",
    optionB:
      "Review the quality requirements and re-establish prevention activities such as reviews, prototypes, and acceptance criteria earlier in the work.",
    optionC: "Accept the deliverable since it technically passed inspection.",
    optionD: "Assign the usability complaints to the support team to handle after release.",
    correctKey: "B",
    explanation:
      "B is correct. Quality is built in, not inspected in: clarifying requirements and adding prevention (reviews, prototypes, acceptance criteria) addresses the root cause. A relies on inspection, which finds defects late and cannot fix poor usability. C ignores the real quality requirement, which is fitness for use. D pushes a project problem onto another team and leaves the customer dissatisfied.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "The project has no clear decision-making structure. Key decisions are made by different people at different times, escalation paths are unclear, and the resulting rework is delaying delivery. What should the project manager do?",
    optionA: "Make all decisions personally so they are at least consistent.",
    optionB:
      "Establish and agree a governance structure with clear decision rights, roles, and escalation paths, and communicate it to stakeholders.",
    optionC: "Wait for the steering committee to notice the problem and define the process.",
    optionD: "Let each workstream decide its own rules independently.",
    correctKey: "B",
    explanation:
      "B is correct. Establishing governance means defining who decides what, how decisions are made, and how issues escalate, then making that structure visible. A concentrates authority and creates a bottleneck rather than governance. C is passive and leaves the project unmanaged in the meantime. D produces inconsistent decision-making and conflicts at the seams.",
  },

  // ---------------------------------------------------- PEOPLE (2026-09 expansion)
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "A product owner and the development team are about to start a new agile initiative. Several team members privately describe different ideas of what 'done' and 'success' mean for the product, and backlog refinement sessions keep circling back to first principles. What should the project manager do first?",
    optionA: "Ask the product owner to finalize the backlog alone and distribute it to the team for execution.",
    optionB:
      "Facilitate a vision workshop with the product owner and team to co-create and document a shared product vision and success measures.",
    optionC: "Escalate the lack of alignment to the sponsor and request a directive to end debate.",
    optionD: "Move forward with sprint planning and let the vision emerge organically from delivered increments.",
    correctKey: "B",
    explanation:
      "B is correct. When team members hold different mental models of success, the project manager's role is to facilitate alignment, for example through a vision workshop that produces a shared, documented understanding the team can refer back to. A concentrates vision-setting in one person and skips the collaborative buy-in that makes a vision durable. C is premature escalation for something the PM can resolve through facilitation. D risks continued rework and disengagement because ambiguity about success criteria rarely resolves itself without deliberate alignment.",
  },
  {
    envType: "HYBRID",
    difficulty: "HARD",
    stem: "Two legacy teams are merged into a single delivery group after a reorganization. One team's identity was built around rigorous predictive planning and the other around agile experimentation, and members from each side quietly disparage the other's way of working in meetings. The project manager must unite them behind one project vision. Which action best addresses the root issue?",
    optionA: "Adopt the predictive team's planning artifacts wholesale, since they are more detailed, and ask the agile team to comply.",
    optionB: "Let each subgroup continue working the way it always has, as long as both hit their own deadlines.",
    optionC:
      "Run a facilitated session where both groups articulate what they value, then co-create a shared vision and working agreement that draws on strengths from each culture.",
    optionD: "Postpone any vision discussion until after the first joint milestone, so the teams have shared experience to build on.",
    correctKey: "C",
    explanation:
      "C is correct. Uniting teams with different cultures behind a common vision requires surfacing what each group values and co-creating an approach together, which builds ownership and respect on both sides. A imposes one culture on the other without buy-in and ignores real strengths in the agile team's practices. B avoids the underlying tension and lets a fractured identity persist, which undermines a shared vision. D delays the very alignment work needed to make a joint milestone successful, and the tension will likely surface as conflict before then.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "At the kickoff meeting for a new infrastructure project, the sponsor emphasizes cost control as the top priority, while the operations director who will accept the deliverable emphasizes system reliability above all else. Neither has stated their priority to the other directly. The project manager notices the charter is silent on this trade-off. What should the project manager do?",
    optionA:
      "Bring the sponsor and operations director together to reconcile priorities and capture an agreed statement of project success in the charter or a supporting document.",
    optionB: "Proceed with the sponsor's stated priority, since the sponsor signs the charter and holds formal authority.",
    optionC: "Let each stakeholder pursue their own priority through the requirements they submit and reconcile differences later during scope validation.",
    optionD: "Avoid raising the conflict directly, and instead try to satisfy both priorities equally throughout execution without a documented decision.",
    correctKey: "A",
    explanation:
      "A is correct. An undocumented conflict between two key stakeholders' definitions of success is a vision problem that should be surfaced and resolved early, with the agreed criteria captured so the team can plan and make trade-offs consistently. B ignores an important stakeholder's priority and risks acceptance problems later. C defers a foundational disagreement into detailed requirements, where it will be harder and costlier to resolve. D avoids the conversation and leaves the team without real guidance for trade-off decisions throughout the project.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "Midway through a hybrid product initiative, the organization announces a strategic pivot: the product will now target a different customer segment. The original vision statement, agreed six months earlier, no longer reflects where leadership wants the product to go, and the team is still operating against the old vision. What should the project manager do first?",
    optionA: "Keep executing against the original vision until the current release ships, then update it.",
    optionB: "Quietly adjust the backlog priorities to reflect the new direction without changing the documented vision.",
    optionC: "Ask the sponsor to issue a memo announcing the new direction and consider the vision updated.",
    optionD:
      "Convene the team and key stakeholders to revisit and re-articulate a shared vision that reflects the new strategic direction, then realign plans to it.",
    correctKey: "D",
    explanation:
      "D is correct. When the strategic context changes, the project manager should lead the team and stakeholders through revisiting the vision so everyone shares an accurate, current understanding before realigning plans. A lets the team keep working toward an obsolete target and wastes effort. B creates a mismatch between stated vision and actual priorities that will confuse the team and stakeholders. C treats vision-setting as a one-way announcement rather than a shared understanding the team helps shape and internalize.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "The infrastructure team and the applications team on a data migration project each claim ownership of the database cutover task and have each scheduled it independently, creating a scheduling conflict and mutual frustration. Both teams' leads have appealed to the project manager to rule in their favor. What is the best first step?",
    optionA: "Assign the task to whichever team proposed the more detailed cutover plan.",
    optionB: "Split the cutover task in half so each team owns part of it, to avoid taking sides.",
    optionC:
      "Bring both leads together to clarify roles based on the RACI/responsibility assignment matrix and resolve the scheduling conflict collaboratively.",
    optionD: "Direct both teams to perform the cutover independently and use whichever attempt succeeds first.",
    correctKey: "C",
    explanation:
      "C is correct. Ownership conflicts are best resolved by returning to the documented responsibility assignments and working collaboratively with both parties to clarify roles and reconcile the schedule. A rewards whoever prepared more without addressing the underlying ambiguity in role assignment. B introduces unnecessary complexity and risk by splitting a technical cutover without a clear ownership boundary. D is reckless, duplicative, and could cause a failed or conflicting cutover attempt on production systems.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "A distributed Scrum team disagrees sharply about who has authority to accept a story as 'done' when the product owner is unavailable during a different time zone's working hours. The disagreement has already caused two stories to be reopened after conflicting sign-offs. What should the project manager or Scrum Master do?",
    optionA:
      "Facilitate a team discussion to agree on and document a clear definition of done and a delegation rule for acceptance when the product owner is offline.",
    optionB: "Instruct the team to hold all acceptance decisions until the product owner is online, even if it delays the sprint review.",
    optionC: "Assign acceptance authority to the most senior developer on each shift without discussing it with the team.",
    optionD: "Ignore the disagreement since it will likely resolve itself once the team becomes more experienced.",
    correctKey: "A",
    explanation:
      "A is correct. A recurring authority conflict signals a missing team agreement; facilitating a session to define done and a clear delegation rule resolves the conflict at its source and prevents repeat rework. B creates delay and does not solve the underlying ambiguity, and it is impractical across time zones. C imposes a decision without team consensus, which is likely to reignite the disagreement. D leaves a demonstrated source of rework unaddressed and risks further reopened stories.",
  },
  {
    envType: "HYBRID",
    difficulty: "HARD",
    stem: "A business analyst and a development lead have opposing interpretations of an ambiguous requirement, and their disagreement has become personal, with each questioning the other's competence in stand-ups. The dispute is now affecting how other team members interact with both of them. What should the project manager do?",
    optionA: "Rewrite the requirement personally to end the debate, without involving either party.",
    optionB:
      "Meet with the analyst and lead separately first to understand each perspective, then bring them together to focus on the requirement itself and agree on clarification steps with the stakeholder.",
    optionC: "Tell the wider team to disregard the disagreement and continue working from their own interpretations until it is resolved.",
    optionD: "Recommend that one of the two be moved off the project, since the conflict has become personal.",
    correctKey: "B",
    explanation:
      "B is correct. When a technical disagreement has become personal, understanding each side individually first, then facilitating a discussion refocused on the requirement and a path to clarification (such as engaging the stakeholder), addresses both the interpersonal and technical issues. A bypasses the people involved and does not resolve the interpersonal tension. C allows the team to work from inconsistent requirements, risking further rework. D is a drastic response to a conflict that has not yet been given a chance to be resolved constructively.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A normally reliable team member has missed three consecutive deliverable deadlines over the past month, and the quality of their recent work has declined. Other team members have started quietly picking up the slack without saying anything to the project manager. What should the project manager do first?",
    optionA: "Reassign the team member's remaining work to others without discussion, to protect the schedule.",
    optionB: "Document the performance issue and send it to the functional manager for disciplinary action.",
    optionC: "Wait to see if performance improves on its own before taking any action.",
    optionD: "Have a private, direct conversation with the team member to understand the cause and agree on a plan for support.",
    correctKey: "D",
    explanation:
      "D is correct. A sudden, sustained drop in performance from a previously reliable contributor warrants a direct, private conversation to understand the cause, which may be personal, workload-related, or skill-related, before deciding on next steps. A removes the person's work without understanding the problem and can damage trust and morale. B escalates to discipline before even talking with the person, which is premature and can be counterproductive. C risks continued schedule and quality impact while other team members silently absorb extra work and build resentment.",
  },
  {
    envType: "HYBRID",
    difficulty: "HARD",
    stem: "An organizational restructuring announcement creates uncertainty about which teams will continue after the current project. Productivity has dropped as team members spend time speculating about their job security instead of focusing on deliverables, though no layoffs affecting this team have been confirmed. What is the project manager's best course of action?",
    optionA:
      "Acknowledge the uncertainty openly, share what is and is not known, and refocus the team on what they can control, while checking in individually with concerned members.",
    optionB: "Instruct the team to stop discussing the reorganization during work hours and focus only on deliverables.",
    optionC: "Reassure the team that their jobs are safe, even though this has not been confirmed by leadership.",
    optionD: "Escalate to HR and let them communicate directly with the team, staying out of it entirely as the project manager.",
    correctKey: "A",
    explanation:
      "A is correct. Leading a team through uncertainty calls for transparent communication about what is actually known, refocusing energy productively, and individual support, which rebuilds trust and engagement. B suppresses a legitimate concern rather than addressing it and is unlikely to actually restore focus. C risks giving false assurance that could backfire and damage the project manager's credibility if reality differs. D abdicates the project manager's leadership role for team morale and disengages from an issue clearly affecting performance.",
  },
  {
    envType: "AGILE",
    difficulty: "EASY",
    stem: "A cross-functional team just completed a difficult sprint that required significant extra effort to hit a customer commitment. Team energy is visibly low heading into the next sprint. What is the best action for the project manager to take?",
    optionA: "Immediately load the next sprint with the same level of ambition to maintain momentum.",
    optionB:
      "Publicly recognize the team's specific contributions and effort during the sprint review or retrospective, and factor the recent strain into next sprint's planning.",
    optionC:
      "Say nothing about the extra effort, since it was simply part of the job and calling attention to it may set an unwanted precedent.",
    optionD: "Offer only the top individual performer a reward, to incentivize similar effort from others.",
    correctKey: "B",
    explanation:
      "B is correct. Recognizing effort and contributions sustains motivation and engagement, and factoring recent strain into planning shows the team that sustainable pace matters, not just short-term output. A ignores signs of fatigue and risks burnout or declining quality. C misses an opportunity to reinforce positive behavior and can make people feel their effort goes unnoticed. D singles out one person in a team effort, which can undermine collaboration and demotivate the rest of the team.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A project manager has always approved every design decision personally, even minor ones, causing a bottleneck as the team waits for sign-off before proceeding. The team is experienced and has asked for more autonomy on routine decisions. What should the project manager do?",
    optionA: "Continue approving all decisions personally to maintain consistency and control across the project.",
    optionB: "Delegate all decisions, including major ones with significant budget or scope impact, to the team without any review.",
    optionC: "Define which categories of decisions the team can make independently and which still require project manager review, then communicate this clearly.",
    optionD: "Ask the sponsor to take over minor decision approvals instead of the project manager.",
    correctKey: "C",
    explanation:
      "C is correct. Effective leadership includes appropriately delegating decisions, using clear boundaries so the team gains autonomy on routine matters while decisions with significant risk or impact still get appropriate oversight. A perpetuates the bottleneck the team has specifically raised as a concern. B removes all oversight, including for decisions where project manager involvement is genuinely warranted, which is excessive delegation. D shifts a leadership responsibility to a stakeholder who is not positioned to make day-to-day team decisions.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "While reviewing the stakeholder register midway through a project, the project manager notices that a regional compliance officer with authority to block deployment has never attended a meeting or been contacted directly, despite being listed as a stakeholder from the start. What should the project manager do?",
    optionA:
      "Proactively reach out to the compliance officer to understand their interests and concerns, and update the stakeholder engagement approach accordingly.",
    optionB: "Leave the stakeholder register as is, since the officer has not raised any objections so far.",
    optionC: "Wait until the deployment phase to involve the compliance officer, since their input is only relevant at that stage.",
    optionD: "Ask a team member to represent the compliance officer's interests in meetings instead of engaging them directly.",
    correctKey: "A",
    explanation:
      "A is correct. An identified stakeholder with real authority who has never been engaged is a gap the project manager should close proactively, updating the engagement approach based on what is learned. B mistakes silence for lack of interest or influence, which is risky given the officer's power to block deployment. C waits until leverage to influence the project has been lost, since design and scope decisions may already be locked in. D substitutes assumption for direct engagement and risks misrepresenting the officer's actual concerns.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "A product team has been building features based on internal assumptions about what end users want, without ever involving actual end users in reviews. Adoption of recently released features has been lower than expected. The product owner asks the project manager for advice on how to change this going forward. What should the project manager recommend?",
    optionA: "Continue relying on internal assumptions but validate them more rigorously through additional internal workshops.",
    optionB: "Postpone user engagement until the product is more feature-complete, to avoid overwhelming users with an unfinished product.",
    optionC: "Survey a broad, anonymous sample of the general market instead of specific end users, to get more representative data.",
    optionD: "Invite representative end users into sprint reviews and ongoing feedback loops so their input shapes the backlog going forward.",
    correctKey: "D",
    explanation:
      "D is correct. Low adoption after assumption-driven development points to a stakeholder engagement gap; involving real end users early and continuously lets their feedback directly shape priorities and reduces the risk of building the wrong thing. A keeps decisions internal and does not address the root cause of low adoption. B continues to delay the very engagement that could correct course, compounding wasted effort. C is too broad and indirect to substitute for direct engagement with the actual user base of this product.",
  },
  {
    envType: "HYBRID",
    difficulty: "HARD",
    stem: "Following a reorganization, several stakeholders listed in the project's engagement plan have changed roles, and two new department heads now have influence over the project's outcome but were not part of the original stakeholder analysis. The project manager only learns this when a new department head objects to a decision already made. What should the project manager have done differently, and what should be done now?",
    optionA: "Nothing differently; unexpected stakeholder changes from reorganizations cannot reasonably be anticipated or planned for.",
    optionB:
      "Periodically reassess the stakeholder register and engagement plan throughout the project, and now engage the new department heads to understand their concerns and revisit the affected decision if warranted.",
    optionC: "Proceed with the original decision as planned, since it was made properly under the prior stakeholder structure.",
    optionD: "Ask the sponsor to inform the new department heads that the decision is final and not open for discussion.",
    correctKey: "B",
    explanation:
      "B is correct. Stakeholder engagement is not a one-time analysis; it should be revisited periodically, especially after organizational changes, and when a newly influential stakeholder raises a concern the project manager should engage them and reassess the decision if needed. A wrongly treats stakeholder analysis as static when it should be an ongoing process. C ignores new, relevant input from someone with genuine influence over the outcome. D shuts down engagement rather than opening it, which risks turning a new stakeholder into an opponent.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "EASY",
    stem: "A stakeholder who was actively engaged and attended every meeting during initiation has stopped responding to invitations and has not attended the last three status meetings, without explanation. What should the project manager do first?",
    optionA: "Remove the stakeholder from future meeting invitations, since they are clearly no longer interested.",
    optionB: "Escalate the disengagement to the sponsor immediately as a project risk.",
    optionC: "Reach out directly to the stakeholder to understand the reason for their disengagement and address any underlying concern.",
    optionD: "Continue sending the same meeting invitations and wait for the stakeholder to re-engage on their own.",
    correctKey: "C",
    explanation:
      "C is correct. A previously engaged stakeholder's sudden withdrawal is worth understanding directly, since the cause could range from a scheduling conflict to a concern with the project that needs addressing. A assumes disinterest without checking and could disengage someone whose influence still matters. B escalates before the project manager has even attempted to understand or resolve the issue directly. D passively hopes the issue resolves itself instead of taking ownership of re-engagement.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "HARD",
    stem: "The finance sponsor expects the project to stay within the original budget above all else, while the operations sponsor expects full scope to be delivered regardless of cost, and neither has acknowledged the other's priority. Both are due to sign off on an upcoming decision point where a trade-off is unavoidable. What should the project manager do?",
    optionA:
      "Facilitate a joint discussion with both sponsors to surface the trade-off explicitly and reach a documented, mutually understood decision on how to proceed.",
    optionB: "Make the trade-off decision independently based on the project manager's best judgment, to avoid putting the sponsors in an uncomfortable position.",
    optionC: "Proceed with whichever sponsor's request arrived most recently, since a decision is needed and both cannot be fully satisfied.",
    optionD: "Delay the decision point until both sponsors independently arrive at the same conclusion on their own.",
    correctKey: "A",
    explanation:
      "A is correct. When two key stakeholders hold conflicting expectations that will collide at a real decision point, the project manager's role is to make the trade-off explicit and facilitate a joint, documented resolution rather than deciding unilaterally or letting it go unaddressed. B takes a decision away from the stakeholders who own the competing priorities and risks it being reversed later. C is arbitrary and does not actually align expectations, just picks a side. D avoids the conversation and risks the decision point arriving with no resolution at all.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "At the start of a new agile project, the business stakeholders assume 'done' means fully tested and deployed to production, while the development team has been working under an internal assumption that 'done' only means code complete and peer reviewed. This gap only becomes apparent when a stakeholder is surprised that a 'completed' feature is not yet live. What should the project manager do?",
    optionA: "Let the team continue using their own definition of done, since changing it mid-project would disrupt their workflow.",
    optionB: "Tell the stakeholders that their expectation is incorrect and ask them to adjust to the team's definition.",
    optionC: "Address the specific incident with the affected stakeholder only, without changing anything for the rest of the team or stakeholders.",
    optionD: "Facilitate a session with the team and stakeholders to agree on and document a shared definition of done going forward.",
    correctKey: "D",
    explanation:
      "D is correct. A misalignment in what 'done' means is a foundational expectations gap; the project manager should bring both sides together to establish and document a shared definition that guides all future work. A leaves an already-demonstrated source of misunderstanding unresolved for future increments. B dismisses a legitimate stakeholder expectation instead of reconciling it collaboratively. C treats a systemic misalignment as an isolated incident and does nothing to prevent recurrence.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "Two key stakeholders on a hybrid project disagree about the acceptance criteria for an upcoming milestone: one wants strict performance benchmarks met before acceptance, while the other prioritizes an early release even if performance is only adequate. The disagreement is delaying finalization of the milestone plan. What is the project manager's best approach?",
    optionA: "Set the acceptance criteria personally, based on general industry standards, without further discussion.",
    optionB:
      "Facilitate a discussion between the two stakeholders to understand the reasoning behind each position and negotiate acceptance criteria both can support.",
    optionC: "Adopt the stricter of the two positions by default, since it is the more conservative and lower-risk choice.",
    optionD: "Postpone finalizing acceptance criteria until after the milestone is delivered, so the team can decide based on actual results.",
    correctKey: "B",
    explanation:
      "B is correct. Reconciling different stakeholder priorities into agreed acceptance criteria requires understanding the reasoning behind each position and facilitating a negotiated outcome both can live with. A bypasses the stakeholders' actual concerns and imposes an external standard without their input. C favors one stakeholder's priority without a real negotiation and may not reflect actual business needs. D leaves the team without approved acceptance criteria to plan and design against, increasing rework risk.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "Due to a corporate budget freeze, a planned scope item must be cut from the project. The stakeholder who requested that feature was not part of the decision to cut it and finds out only when they notice it missing from an updated project plan distributed to the wider group. What should the project manager have done, and what should be done now?",
    optionA:
      "Nothing needs to change; budget decisions are made at the corporate level and are outside the project manager's control to communicate proactively.",
    optionB: "Wait for the stakeholder to raise a formal complaint before addressing the situation.",
    optionC:
      "Proactively inform affected stakeholders of scope changes and the reasons behind them as soon as decisions are made, and now personally follow up with this stakeholder to explain the decision and its rationale.",
    optionD: "Direct the stakeholder to the corporate finance team for an explanation, since the decision originated there.",
    correctKey: "C",
    explanation:
      "C is correct. Managing stakeholder expectations means proactively communicating changes that affect them, including the reasoning, rather than letting them discover changes secondhand; a direct follow-up now helps repair the relationship. A wrongly assumes the project manager has no responsibility to communicate a decision that materially affects a stakeholder's interests. B waits for a complaint instead of addressing a known gap proactively. D deflects a communication responsibility that belongs with the project manager as the primary point of contact for this stakeholder.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "EASY",
    stem: "A key vendor has notified the project that a critical component will be delayed by three weeks, which will push back the overall project schedule. The project sponsor is expecting a status update in two days. What should the project manager do?",
    optionA: "Proactively inform the sponsor of the delay, its cause, and the impact and options, before the scheduled update if the impact is significant.",
    optionB: "Wait until the scheduled status update to mention the delay, since it is not yet officially confirmed as a change to the schedule.",
    optionC: "Withhold the delay from the sponsor until the project manager has personally resolved it with the vendor.",
    optionD: "Ask the vendor to communicate the delay directly to the sponsor, since they caused it.",
    correctKey: "A",
    explanation:
      "A is correct. Managing expectations means surfacing significant impacts as soon as they are known, with cause, impact, and options, rather than waiting or hiding the issue, especially when it affects the schedule the sponsor is relying on. B delays important information the sponsor needs to plan around, unnecessarily risking a loss of trust if discovered late. C tries to resolve a schedule-impacting issue without informing the person accountable for the project's outcome. D shifts the project manager's communication responsibility to an external party.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "An executive stakeholder mentions in a hallway conversation that they are looking forward to a feature that was discussed early on but was never approved for the current scope, and has not been added to the backlog or plan. The project manager realizes the executive believes it is already in progress. What should the project manager do?",
    optionA: "Add the feature to the backlog quietly to avoid an awkward conversation with the executive.",
    optionB: "Say nothing and hope the executive forgets about the feature before it becomes an issue.",
    optionC: "Wait until the executive formally asks about the feature's status before addressing the misunderstanding.",
    optionD:
      "Proactively clarify with the executive that the feature was not approved for current scope, explain why, and discuss how it could be considered through the appropriate process.",
    correctKey: "D",
    explanation:
      "D is correct. When the project manager becomes aware of a stakeholder's incorrect expectation, the proactive step is to clarify it directly and explain the path forward, preventing a bigger disappointment or conflict later. A commits scope without proper approval just to avoid a conversation, which undermines scope control. B and C both leave a known, incorrect expectation unaddressed, increasing the risk of a larger issue when the executive eventually discovers the feature was never planned.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "As a project nears closure, the deliverables and supporting systems will transition to a permanent operations team that had no involvement during execution. The project manager is focused on finishing remaining punch-list items and has not yet planned how the operations team will gain the knowledge needed to support the system. What should the project manager do?",
    optionA: "Hand over the final documentation set at project closure and consider the transition complete.",
    optionB:
      "Build a knowledge transfer plan that includes documentation, hands-on training sessions, and a period of shadowing or overlap with the operations team before closure.",
    optionC: "Leave the transition to the operations team's own manager, since supporting the product going forward is not the project's responsibility.",
    optionD: "Delay project closure indefinitely until the operations team feels fully confident, regardless of the impact on the project schedule.",
    correctKey: "B",
    explanation:
      "B is correct. Effective knowledge transfer to an operations team relies on more than documents alone; hands-on training and an overlap period let the receiving team build real capability before the project team is no longer available. A relies solely on documentation, which is often insufficient for a team with no prior exposure to the system. C abdicates a closure responsibility that is part of the project manager's role. D is impractical and does not appropriately scope a transition plan within a reasonable, planned timeframe.",
  },
  {
    envType: "AGILE",
    difficulty: "EASY",
    stem: "A new developer joins an established agile team mid-project. The team's existing conventions, undocumented architectural decisions, and the reasoning behind approaches that were tried and rejected earlier exist mostly in senior team members' memory rather than in writing. What is the best way to help the new developer become productive quickly?",
    optionA: "Pair the new developer with experienced team members for onboarding and gradually document key decisions and conventions as they come up.",
    optionB: "Give the new developer the existing codebase and let them learn entirely independently, to avoid slowing down the rest of the team.",
    optionC: "Have the new developer wait to take on real work until formal documentation of every past decision has been written.",
    optionD: "Assign the new developer only to entirely new features so they never need to understand past decisions.",
    correctKey: "A",
    explanation:
      "A is correct. Pairing and active mentoring transfers tacit knowledge quickly while it is being documented for future reference, which is far faster and more effective than relying on documentation alone. B leaves the new developer without access to important undocumented context and risks repeating past mistakes. C is impractical and would waste the new developer's available time on the project unnecessarily. D artificially limits their contribution and does not resolve the underlying gap in shared understanding of the existing system.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "A program spans three geographically distributed delivery teams that frequently solve similar problems independently, sometimes reinventing solutions that another team already built. Leadership asks the project manager to reduce this duplicated effort across the teams. What is the best long-term approach?",
    optionA: "Require every team to get approval from a central architecture board before starting any new work.",
    optionB: "Consolidate all three teams into a single location so knowledge sharing happens naturally.",
    optionC:
      "Establish a shared knowledge repository and a regular cross-team forum or community of practice where teams share solutions and lessons learned.",
    optionD: "Assign one team as the sole authority for all technical solutions and have the other two request permission before building anything.",
    correctKey: "C",
    explanation:
      "C is correct. A shared repository combined with a regular forum for teams to exchange solutions builds an ongoing knowledge-sharing habit that reduces duplicated effort without adding heavy process. A introduces a slow approval bottleneck that does not itself transfer knowledge between teams. B is usually impractical for distributed teams and does not address the underlying lack of a knowledge-sharing mechanism. D removes autonomy from two teams and creates a single point of dependency and delay.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A project has a broad mix of stakeholders: senior executives who want brief, high-level summaries; a technical working group that wants detailed weekly data; and external regulators who require formal, periodically archived reports. The project manager has been sending the same detailed weekly report to everyone. What should the project manager do?",
    optionA: "Continue sending one detailed report to all stakeholders, since consistency is more important than tailoring content.",
    optionB: "Reduce reporting to only what the regulators require, since their needs are formally mandated and the others are informal.",
    optionC: "Ask each stakeholder to opt out of updates they do not want, and keep sending the full report to everyone else.",
    optionD:
      "Develop a communications management plan that tailors the format, level of detail, and frequency of information to each stakeholder group's needs.",
    correctKey: "D",
    explanation:
      "D is correct. A communications management plan should tailor content, format, and frequency to what each audience actually needs, which is more effective than a one-size-fits-all report. A creates noise for executives and possibly insufficient formality for regulators. B under-serves the executives and the technical working group, who both have legitimate but different needs. C puts the burden of filtering on stakeholders instead of the project manager proactively designing communications that fit their needs.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A project manager needs to communicate a routine weekly status update to a large group of stakeholders who do not need to discuss it in real time, but also needs to walk the steering committee through a complex, contested budget change requiring immediate dialogue and questions. Which combination of communication methods best fits these two needs?",
    optionA:
      "Use pull communication, such as a posted status report stakeholders can access on demand, for the routine update, and interactive communication, such as a live meeting, for the contested budget change.",
    optionB: "Use interactive communication for both, to ensure every stakeholder engages fully with each item.",
    optionC: "Use push communication, such as a mass email, for both, to save time and ensure consistent messaging.",
    optionD: "Use pull communication for both, so stakeholders can review the budget change at their own convenience.",
    correctKey: "A",
    explanation:
      "A is correct. Routine information that does not require dialogue is well suited to pull communication, while a contested, complex decision benefits from interactive, real-time communication to surface and resolve questions. B is more effort than the routine update needs and would burden stakeholders with unnecessary meetings. C under-serves the budget discussion, which needs real dialogue that a one-way push cannot provide. D risks the contested budget change being misunderstood or unresolved without the chance for immediate clarification.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "An agile team's stakeholders complain they only find out about progress and blockers weeks after the fact, during formal steering committee meetings, and are frustrated by the lack of visibility in between. What should the project manager or Scrum Master introduce to improve this?",
    optionA: "Eliminate the steering committee meetings entirely and rely only on informal updates.",
    optionB:
      "Set up visible information radiators, such as a shared team board or burndown chart, along with a regular cadence of sprint reviews stakeholders can attend.",
    optionC: "Ask stakeholders to check in with individual developers directly whenever they want an update.",
    optionD: "Increase the frequency of formal written status reports without changing their content or format.",
    correctKey: "B",
    explanation:
      "B is correct. Information radiators combined with a regular, open cadence like sprint reviews give stakeholders ongoing visibility into progress and blockers between formal meetings, which is a core agile communication practice. A removes a venue for structured governance conversations. C creates inconsistent, unplanned interruptions for developers and inconsistent information for stakeholders. D increases the volume of the same low-visibility communication without solving the underlying transparency gap.",
  },
  {
    envType: "HYBRID",
    difficulty: "HARD",
    stem: "Stakeholders on a large hybrid program report feeling overwhelmed: they receive daily automated system notifications, weekly status emails, biweekly steering updates, and ad hoc messages from multiple team leads, and important decisions are getting lost in the volume. What should the project manager do?",
    optionA: "Add a daily summary email on top of the existing communications, to make sure nothing is missed.",
    optionB: "Instruct team leads to stop sending any updates directly to stakeholders, and route everything only through the project manager.",
    optionC:
      "Review and consolidate the communication channels and cadence with stakeholder input, eliminating redundant messages and clearly marking decisions that need attention.",
    optionD: "Leave the communication channels as they are, since stakeholders can choose which messages to read.",
    correctKey: "C",
    explanation:
      "C is correct. When communication volume is causing important information to be missed, the project manager should reassess the communications approach with stakeholder input, remove redundancy, and make critical decisions stand out clearly. A adds to an already excessive volume and would likely worsen the problem. B centralizes all communication through one person, creating a bottleneck and removing timely context from team leads who are closest to the work. D ignores a stated problem that stakeholders have raised and does nothing to fix the underlying noise.",
  },

  // ------------------------------------ added 2026-09 BUSINESS_ENV domain expansion
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A multi-phase infrastructure program has grown from one project to five, each led by a different project manager. There is no documented process for how a phase is approved to proceed to the next, and two sponsors have recently pushed work forward without formal sign-off. What should the program's lead project manager do first?",
    optionA: "Allow each project manager to keep using their own informal approval habits since the program is already underway.",
    optionB:
      "Define phase-gate criteria and named approval authorities for each transition, and document them in a governance plan endorsed by the sponsors.",
    optionC: "Ask the sponsors to stop attending phase-end meetings so their informal approvals cannot bypass the team.",
    optionD: "Escalate the sponsors' behavior to the PMO as a performance issue before any governance structure exists.",
    correctKey: "B",
    explanation:
      "B is correct. Establishing governance means defining, documenting, and gaining agreement on who approves what at each phase transition, closing the gap that let sponsors bypass the process. A lets an unmanaged, inconsistent practice continue across the program. C removes sponsors from oversight rather than channeling their authority through a defined process. D treats a structural gap as a personal failing before any structure has even been created to violate.",
  },
  {
    envType: "HYBRID",
    difficulty: "HARD",
    stem: "An organization is scaling from one agile team to six teams delivering against a single product roadmap. Each team runs its own daily stand-up and sprint review, but there is no shared forum for surfacing cross-team dependencies, and decisions affecting the whole program are made inconsistently by whichever team notices an issue first. What should the project manager do to establish appropriate governance?",
    optionA: "Require all six teams to merge into one large team with a single backlog to simplify decision-making.",
    optionB: "Leave governance to emerge organically, since imposing structure on agile teams contradicts agile values.",
    optionC:
      "Create a lightweight cross-team governance layer, such as a scrum-of-scrums forum with defined escalation paths and decision rights for program-level issues.",
    optionD: "Assign a single team's product owner to make all program-level decisions for the other five teams.",
    correctKey: "C",
    explanation:
      "C is correct. Scaled agile environments still need governance — a structured way to surface dependencies, escalate cross-team issues, and assign decision rights — even though it stays lightweight and team-empowering. A destroys the autonomy and focus that make small agile teams effective. B mistakes agile values for an absence of structure; agile frameworks explicitly define coordination mechanisms at scale. D concentrates authority in one team without the visibility or mandate to decide for the others.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A financial services project must comply with a newly issued anti-money-laundering reporting rule. The team is not sure which parts of the existing project plan are affected or how strictly each requirement applies. What should the project manager do first?",
    optionA:
      "Work with compliance subject matter experts to categorize the affected requirements and determine the degree to which each one applies to the project.",
    optionB: "Assume the strictest possible interpretation applies to every deliverable to avoid any risk of noncompliance.",
    optionC: "Wait for the next scheduled audit to identify which requirements are relevant.",
    optionD: "Delegate the entire compliance determination to the vendor supplying the reporting software.",
    correctKey: "A",
    explanation:
      "A is correct. Planning compliance starts with categorizing requirements and analyzing their applicability and threshold with the right subject matter experts, so the response is targeted rather than guessed. B may over-engineer some deliverables and still miss requirements that need a different treatment, wasting effort without confirming coverage. C is reactive and leaves the project noncompliant in the meantime. D transfers accountability for a regulatory obligation the project manager still owns.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "On a safety-critical construction project, an internal audit finds that structural components from a supplier are being installed before their required safety certifications are verified and filed. Installation has not yet caused any incident. What should the project manager do?",
    optionA: "Continue installations as scheduled and address the paperwork gap at project closeout.",
    optionB: "Instruct the site team to informally check certifications by eye without changing the acceptance process.",
    optionC:
      "Add a compliance checkpoint that requires verified certification documentation before any component is accepted and installed.",
    optionD: "Transfer responsibility for certification verification entirely to the supplier's quality department.",
    correctKey: "C",
    explanation:
      "C is correct. Managing compliance means building enforcement into the process itself — a checkpoint that blocks acceptance until proof of compliance exists — rather than relying on hope or memory. A lets a known compliance gap continue on a safety-critical project, which raises both risk and liability. B keeps the gap informal and unverifiable, offering no real control. D removes the project's own oversight of an obligation it remains accountable for.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "HARD",
    stem: "A project spans three countries with overlapping but not identical data-handling regulations. The compliance officer estimates that fully automating compliance verification would cost more than the fines the organization would likely face if a lower-severity violation occurred. The project manager must decide how much to invest in compliance tooling. What is the best approach?",
    optionA: "Automate compliance verification fully regardless of cost, since regulatory compliance can never be treated as optional.",
    optionB:
      "Analyze the likely consequences of noncompliance — financial, legal, and reputational — against the cost of stronger controls, and select the level of investment the sponsor formally accepts.",
    optionC: "Skip the investment entirely and rely on staff training alone, since audits have not found violations before.",
    optionD: "Let the project team in each country independently decide its own compliance investment level.",
    correctKey: "B",
    explanation:
      "B is correct. Managing compliance includes weighing the consequences of noncompliance against the cost of controls and getting that risk-based decision formally accepted by the sponsor, rather than treating the investment level as fixed or informal. A ignores that compliance investment should be proportionate to actual risk and cost. C accepts a known gap without analysis, and past clean audits do not guarantee future ones. D creates inconsistent compliance posture across the same project with no accountable decision.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A senior stakeholder emails a developer directly, asking for an additional report feature to be added to the current release, and the developer begins coding it immediately. The project manager learns of this two days later, mid-implementation. What should the project manager do?",
    optionA: "Let the developer finish the feature since stopping partially completed work would waste the effort already spent.",
    optionB: "Thank the stakeholder for the idea and quietly add it to a future release without further process.",
    optionC: "Reprimand the developer publicly to discourage the team from accepting requests outside proper channels.",
    optionD:
      "Pause the unapproved work, log the request as a formal change request, and route it through impact assessment and the change control board before resuming.",
    correctKey: "D",
    explanation:
      "D is correct. Any change outside the approved baseline needs to go through the change control process — impact assessment and authorization — even if work has already started, to protect scope, schedule, and cost integrity. A rewards bypassing the process and risks integrating unapproved, unassessed work. B skips the evaluation and authorization steps entirely. C addresses the symptom without fixing the process gap or evaluating the request itself.",
  },
  {
    envType: "AGILE",
    difficulty: "EASY",
    stem: "Midway through a two-week sprint, an executive asks the product owner to swap in a large new work item because of a client escalation. The product owner tells the developer sitting nearest to make the change right away. What is the most appropriate way to handle this request?",
    optionA:
      "Bring the request to the team, assess the impact on the current sprint commitment, and negotiate what to remove or defer if the item is added before any work begins on it.",
    optionB: "Refuse the request outright, since the sprint backlog was already committed and cannot be changed under any circumstances.",
    optionC: "Have the one developer absorb the new item on top of their existing sprint work without adjusting anything else.",
    optionD: "Escalate the request to a formal change control board before the team can even discuss it.",
    correctKey: "A",
    explanation:
      "A is correct. Agile change control happens through transparent negotiation with the whole team: understand the impact, and trade out lower-priority work if something urgent must be added mid-sprint, rather than acting unilaterally. B is overly rigid; sprint scope can be renegotiated for genuine urgency, ideally with team agreement. C silently overloads one person and hides the impact from the rest of the team and stakeholders. D imposes a heavyweight predictive mechanism the team does not use, delaying a response the team could reasonably self-manage.",
  },
  {
    envType: "HYBRID",
    difficulty: "HARD",
    stem: "A program uses three vendors that each build components integrating with a shared platform. One vendor's approved change to the shared component's interface is implemented without notifying the other two vendors, and their integrations later fail during system testing. What should the project manager have put in place to prevent this?",
    optionA: "A rule requiring all vendors to use the exact same development tools and language.",
    optionB:
      "A configuration management system that logs every approved change to shared components and automatically notifies all parties whose work depends on them.",
    optionC: "A contract clause preventing any vendor from ever changing a shared component after initial delivery.",
    optionD: "A quarterly all-vendor status meeting where changes could eventually be mentioned in passing.",
    correctKey: "B",
    explanation:
      "B is correct. Integrated change control across multiple parties depends on configuration management that tracks approved changes to shared items and actively communicates impact to every dependent party, not just the party that requested the change. A does not address change communication at all. C is impractical for a platform that must evolve and does not actually solve the notification gap. D is too infrequent and passive to prevent integration failures between updates.",
  },
  {
    envType: "AGILE",
    difficulty: "EASY",
    stem: "For the third day in a row, the daily stand-up surfaces the same blocker: the team cannot get IT to provision a test environment, and no one on the team has the authority to expedite it. What should the scrum master do?",
    optionA: "Note the blocker again in the stand-up notes and wait to see if IT responds on its own timeline.",
    optionB: "Ask the team to build their own temporary environment to work around the missing provisioning.",
    optionC: "Escalate directly to IT management to remove the organizational impediment, since the team cannot resolve it themselves.",
    optionD: "Remove the task from the sprint board so the blocker no longer shows up in daily stand-ups.",
    correctKey: "C",
    explanation:
      "C is correct. Removing impediments is a core part of the role, and when a blocker is outside the team's authority to resolve, the scrum master must escalate it to whoever can actually remove it. A lets a known, worsening impediment continue unaddressed. B may not be feasible or compliant and does not fix the underlying provisioning process. D hides the problem rather than solving it, and the dependency still blocks the work.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A critical-path activity stalls because a functional manager reassigned the only qualified resource to a different, higher-visibility project without telling the project manager. The delay threatens the project's committed finish date. What should the project manager do?",
    optionA:
      "Escalate promptly through the agreed escalation path to the resource's manager or sponsor to resolve the conflict and restore the needed resource or an equivalent.",
    optionB: "Silently extend the schedule baseline to absorb the delay so no one has to be informed of the conflict.",
    optionC: "Reassign the work to any available team member regardless of whether they have the required qualification.",
    optionD: "Wait until the next steering committee meeting, which is several weeks away, to raise the issue.",
    correctKey: "A",
    explanation:
      "A is correct. A critical-path impediment beyond the project manager's authority needs prompt escalation through the defined path so it can be resolved by someone with the authority to reallocate resources. B hides a real issue and unilaterally changes the baseline without authorization. C risks quality or safety problems on work that specifically required a qualified resource. D lets the delay grow for weeks when timely escalation could resolve it much sooner.",
  },
  {
    envType: "HYBRID",
    difficulty: "HARD",
    stem: "An issue in the issue log has been marked 'resolved' three separate times over three sprints, and each time the same underlying problem reappears within a week. The team closes it again the same way each time: reverting the immediate symptom. What should the project manager do differently this time?",
    optionA: "Close the issue a fourth time using the same fix, since it has worked temporarily every previous time.",
    optionB: "Remove the recurring issue from the log entirely so it stops affecting the team's reported issue count.",
    optionC: "Reassign the issue to a different team member without changing how it is being diagnosed or fixed.",
    optionD:
      "Investigate the underlying root cause rather than the symptom, and only close the issue once a fix addresses that cause.",
    correctKey: "D",
    explanation:
      "D is correct. An issue that keeps reopening after the same symptom-level fix signals the team is treating a recurring problem rather than truly resolving it; effective issue management requires identifying and addressing the root cause. A repeats a fix already proven not to last. B falsifies the record and abandons the underlying problem entirely. C changes who works on it without changing the diagnostic approach that has already failed three times.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "During a risk review, the team disagrees about whether a newly identified risk is serious enough to escalate to the sponsor or can be handled at the project level. The sponsor has never specified how much risk exposure the organization is willing to accept for this project. What should the project manager do?",
    optionA: "Let the team vote informally each time a new risk appears, since there is no other guidance available.",
    optionB:
      "Facilitate a session with the sponsor to define the organization's risk thresholds for the project, so escalation decisions can be made consistently going forward.",
    optionC: "Escalate every future risk regardless of size, since there is no defined threshold to filter by.",
    optionD: "Assume all risks should be handled at the project level unless they materialize into issues.",
    correctKey: "B",
    explanation:
      "B is correct. Planning risk management includes establishing risk thresholds with the sponsor so the team has a consistent basis for deciding which risks to escalate. A produces inconsistent, ad hoc decisions each time. C floods the sponsor with low-impact risks that do not need their attention, wasting escalation capacity for risks that matter. D ignores risks that may be significant enough to need sponsor awareness before they become issues.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "During backlog refinement, the team identifies significant technical uncertainty in the proposed approach for an upcoming epic; no one is confident the approach will actually work at the scale required. What is the most appropriate agile risk response?",
    optionA: "Commit the full epic to the next sprint and adjust the estimate later if problems appear.",
    optionB: "Skip the epic indefinitely until someone outside the team volunteers to research the approach.",
    optionC:
      "Create a timeboxed spike to investigate the approach and generate the information needed before committing significant story points to the epic.",
    optionD: "Escalate the technical uncertainty to the change control board for a formal risk ruling before any further discussion.",
    correctKey: "C",
    explanation:
      "C is correct. A timeboxed spike is the standard agile way to respond to significant uncertainty: it generates the missing information cheaply before committing substantial capacity, which is itself a risk response. A commits real capacity against unresolved uncertainty, risking wasted effort and unreliable estimates. B stalls the epic indefinitely without a plan to resolve the uncertainty. D applies a predictive change-control mechanism to what is fundamentally a risk-response decision the team can make itself.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "HARD",
    stem: "The project manager transfers a significant risk by purchasing insurance against it. Later, the team learns that if the insured event occurs, the insurer's claims process can take several months to pay out — long enough to stall the project if recovery funds are needed quickly to keep work moving. What should the project manager do?",
    optionA:
      "Document the claims delay as a secondary risk created by the risk transfer response, and plan a way to bridge the funding gap if the original risk occurs.",
    optionB: "Cancel the insurance policy, since any response that creates a new risk should be abandoned.",
    optionC: "Ignore the claims-process timeline, since the original risk has already been formally transferred to the insurer.",
    optionD: "Remove the original risk from the risk register entirely, since a response has already been selected for it.",
    correctKey: "A",
    explanation:
      "A is correct. A risk response can introduce a secondary risk, and identifying, documenting, and planning for it — here, a bridging funding plan for the claims delay — is a normal part of risk management, not a reason to reverse the original decision. B overreacts; transfer may still be the best available response despite the secondary risk. C ignores a real gap in the project's ability to continue operating if the risk occurs. D is premature and inconsistent with monitoring a risk until its response is proven effective.",
  },
  {
    envType: "AGILE",
    difficulty: "EASY",
    stem: "Every sprint retrospective generates a list of action items, but no one tracks whether they were actually implemented, and several of the same underlying problems keep resurfacing in different forms. What should the scrum master do to make retrospectives more effective?",
    optionA: "Stop generating action items in retrospectives, since they clearly are not being used anyway.",
    optionB: "Let the team decide informally, without any record, whether an old action item is still relevant.",
    optionC: "Extend every retrospective's length so more issues can be discussed, regardless of whether previous ones were closed.",
    optionD:
      "Maintain a visible action item log with owners and due dates, and review it at the start of each retrospective before adding new items.",
    correctKey: "D",
    explanation:
      "D is correct. Continuous improvement requires closing the loop: tracking whether improvement actions were actually implemented and following up, not just generating new ideas each sprint. A abandons the practice instead of fixing how it is tracked. B leaves outcomes unrecorded and inconsistent across the team. C adds more discussion time without addressing why previous actions were never followed through on.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "Midway through an eighteen-month project, the project manager notices that lessons learned are only being captured in a document at project closeout, based on whatever the team happens to remember by then. What should the project manager do?",
    optionA: "Leave the practice as is, since lessons learned are formally required only in the closing process.",
    optionB:
      "Begin capturing lessons learned throughout the project as they occur, and apply useful improvements to the current project while it is still underway.",
    optionC: "Assign lessons learned entirely to the PMO so the project team is not distracted from delivery work.",
    optionD: "Wait for the next phase gate review before recording any lessons, to avoid capturing incomplete information.",
    correctKey: "B",
    explanation:
      "B is correct. Continuous improvement works best when lessons are captured close to when they happen and applied while the project can still benefit, rather than reconstructed from memory at the very end. A treats a valuable practice as a paperwork formality rather than a tool for improving the current project. C removes the people with the most direct knowledge from the process. D delays capture and loses detail, and still only aligns lessons learned with the wrong trigger event.",
  },
  {
    envType: "HYBRID",
    difficulty: "HARD",
    stem: "A control chart tracking code review turnaround time shows several consecutive data points trending steadily upward, though all remain within the established control limits. The team lead concludes no action is needed because the process is technically still 'in control.' What should the project manager do?",
    optionA: "Agree that no action is needed until a data point actually falls outside the control limits.",
    optionB: "Widen the control limits so the trending points no longer stand out as unusual.",
    optionC: "Stop collecting turnaround data, since the metric is apparently not useful for decision-making.",
    optionD:
      "Treat the sustained upward trend as a signal worth investigating now, since a consistent trend can indicate an emerging special cause even before limits are breached.",
    correctKey: "D",
    explanation:
      "D is correct. A sustained trend within control limits is a recognized rule-of-thumb signal of a developing special cause, and treating it as a continuous improvement trigger catches problems before they breach limits and cause real harm. A waits for a threshold breach that a clear trend already warns is coming. B hides the signal by changing the measurement rather than investigating the process. C discards a useful early-warning tool instead of acting on what it is showing.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A new enterprise system goes live on schedule, and the project team plans to disband immediately after cutover since all deliverables are complete. Historical data at the organization shows adoption of similar systems typically drops off within weeks once the project team leaves. What should the project manager recommend?",
    optionA: "Disband the team as planned, since the deliverable has been accepted and formal project closure is due.",
    optionB: "Extend the project team's presence indefinitely until the organization decides adoption is acceptable.",
    optionC:
      "Put a short post-go-live sustainment plan in place — such as super-users, monitoring adoption metrics, and a defined handover point — before releasing the team.",
    optionD: "Transfer all sustainment responsibility to the help desk without any handover of context from the project.",
    correctKey: "C",
    explanation:
      "C is correct. Supporting organizational change includes planning how the change will be reinforced and sustained after go-live, not just delivering the technical output, especially when history shows adoption tends to fade without support. A ignores a known risk to benefits realization that the organization has already experienced before. B has no defined end point and is not a sustainable resourcing model. D hands off without the context needed to actually reinforce adoption, likely repeating the same failure pattern.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "An organization historically run on detailed upfront requirements documents is adopting agile delivery for the first time. Several senior managers continue to request comprehensive requirements specifications before any sprint starts, even though the new approach is meant to replace that step. What should the project manager do?",
    optionA: "Refuse to produce any requirements documentation, since agile delivery does not use it.",
    optionB: "Quietly produce the documents the managers want without discussing the change with them.",
    optionC: "Report the managers to their leadership for not following the new methodology.",
    optionD:
      "Engage the managers directly to understand their concerns, explain the rationale for the new approach, and adapt communication or artifacts enough to build their confidence during the transition.",
    correctKey: "D",
    explanation:
      "D is correct. Supporting organizational change means actively managing stakeholders through the transition — understanding resistance, explaining the 'why,' and adapting where reasonable — rather than forcing or ignoring it. A dismisses legitimate stakeholder concerns and risks losing their support entirely. B avoids the underlying change management need and does not build lasting understanding. C treats a normal transition reaction as a disciplinary matter, which is likely to increase resistance.",
  },
  {
    envType: "HYBRID",
    difficulty: "HARD",
    stem: "Two months after a new process rolled out, a survey shows only 40 percent of end users are actually using it; most reverted to the old spreadsheet-based workaround they used before. The technical deliverable was accepted and the project was formally closed on schedule. What should the project manager or organization now do?",
    optionA: "Consider the matter fully resolved, since project success is defined by delivering the agreed technical scope.",
    optionB: "Blame the end users for not following the new process as instructed and take no further action.",
    optionC: "Re-launch the exact same rollout communications a second time without investigating why adoption failed.",
    optionD:
      "Treat the low adoption rate as a matter to be revisited, since the deliverable being accepted does not mean the intended change was actually realized.",
    correctKey: "D",
    explanation:
      "D is correct. Supporting organizational change means the work is not finished when the deliverable is accepted; if the intended behavior change did not stick, the root cause of low adoption needs investigation and a corrective plan, even after formal project closure. A conflates output acceptance with outcome realization, which are different things. B assigns blame without investigating real barriers such as usability, training gaps, or incentives. C repeats an approach that has already been shown not to work without diagnosing why.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A new government tariff on imported hardware components significantly raises the cost of a key deliverable midway through the project, well beyond what the contingency reserve can absorb. The change also affects the assumptions behind the original business case. What should the project manager do?",
    optionA: "Absorb the increase silently within the existing budget by cutting scope on unrelated deliverables without informing the sponsor.",
    optionB:
      "Assess the impact on the business case and escalate to the sponsor or governance body to determine whether the project remains viable under the new cost structure.",
    optionC: "Continue exactly as planned, since tariffs are outside the project team's control and therefore not the project manager's concern.",
    optionD: "Cancel the project unilaterally, since the original business case assumptions no longer hold.",
    correctKey: "B",
    explanation:
      "B is correct. Evaluating external environment changes means assessing their effect on the business case and bringing significant impacts to the people with authority to decide whether the project remains a sound investment. A hides a material impact from the sponsor and makes unilateral scope decisions outside the project manager's authority. C ignores an external change that directly threatens project viability, which the role requires monitoring. D oversteps the project manager's authority to cancel a project without sponsor or governance involvement.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "Midway through development, a new technology framework rapidly becomes the emerging industry standard, and the architecture the team has been building risks feeling outdated by the time the product launches. What should the project manager do?",
    optionA:
      "Flag the external shift to the product owner and sponsor so they can weigh whether to adapt the approach or backlog, based on business impact rather than the project team's opinion alone.",
    optionB: "Have the team silently switch frameworks mid-development without informing the product owner or sponsor.",
    optionC: "Ignore the shift entirely, since agile teams are expected to focus only on the current sprint's committed work.",
    optionD: "Halt all development indefinitely until the industry fully settles on one dominant framework.",
    correctKey: "A",
    explanation:
      "A is correct. Evaluating external business environment changes means surfacing a relevant shift to the people who can weigh it against business priorities, letting them decide whether and how to respond. B makes a significant strategic and technical decision without stakeholder visibility or authorization. C dismisses an external change that could materially affect the product's competitiveness at launch. D stops all delivery on the uncertain chance the market fully settles, which may never happen, and abandons value delivery in the meantime.",
  },
  {
    envType: "HYBRID",
    difficulty: "HARD",
    stem: "A central bank raises interest rates significantly, increasing the cost of the financing arrangement that underpins the project's funding. The original business case assumed a much lower financing cost when calculating the expected return on investment. What should the project manager do?",
    optionA: "Continue relying on the original return-on-investment figures, since the project's technical scope has not changed.",
    optionB: "Independently recalculate the return on investment without involving finance or the sponsor, to save time.",
    optionC:
      "Request that the business case be reassessed with updated financial assumptions by the sponsor or finance owner to confirm the project remains a sound investment.",
    optionD: "Postpone any reassessment until the next annual budget cycle, regardless of how significant the rate change is.",
    correctKey: "C",
    explanation:
      "C is correct. A material shift in the external financial environment can invalidate the assumptions behind a business case, so the project manager should trigger a reassessment by the people accountable for the business case and financial approval. A treats an outdated financial assumption as still valid despite a clear signal it may not be. B bypasses the people with the authority and expertise to properly revise financial assumptions. D delays addressing a significant issue for a fixed cycle instead of responding to its urgency.",
  },

  // ---------------------------------------------------- PROCESS (2026-09 expansion)
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "While integrating the subsidiary plans for a plant-upgrade project, the project manager finds that the risk management plan assumes a six-week vendor lead time for a critical valve, while the schedule management plan was built around a four-week lead time supplied by procurement. No one caught the mismatch until the integration review. What should the project manager do first?",
    optionA:
      "Reconcile the conflicting lead-time assumption with procurement and risk before the project management plan is baselined.",
    optionB: "Use the schedule management plan's four-week figure since the schedule was baselined first.",
    optionC:
      "Let each functional lead keep their own assumption, since the plans are only used by their respective teams.",
    optionD: "Escalate the discrepancy to the sponsor and ask them to pick a figure.",
    correctKey: "A",
    explanation:
      "A is correct. Integration means the subsidiary plans must be consistent with one another before they are baselined; a lead-time conflict between the risk and schedule plans has to be resolved with the people who own the data so the plan reflects one reality. B arbitrarily favors one unverified figure without confirming it. C leaves the plans internally inconsistent, which will surface later as a schedule or risk surprise. D escalates a working-level data conflict the project manager is equipped to resolve directly.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "EASY",
    stem: "A project has stable, fully documented requirements, a team experienced with sequential delivery, and a customer who wants a single formal deliverable at the end rather than incremental releases. During integrated planning, which delivery approach should the project manager select?",
    optionA: "An iterative approach with short feedback loops on undefined requirements.",
    optionB: "A predictive approach with a detailed plan and a single scope baseline.",
    optionC: "A fully agile approach with self-organizing sprint teams.",
    optionD: "No formal approach, allowing the plan to emerge as work proceeds.",
    correctKey: "B",
    explanation:
      "B is correct. When requirements are stable and well understood, the team is experienced with sequential work, and the customer wants a single end-point acceptance, a predictive approach fits best because it plans in detail up front. A and C fit uncertain or evolving requirements, which is not the case here. D abandons planning altogether and is not a viable option for delivering a defined deliverable.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "The project management plan, including the cost baseline, was formally approved last month. The sponsor now asks the project manager to quietly adjust the cost baseline to reflect a new vendor quote, saying it is 'just a formality' and does not need to go through the change process. What should the project manager do?",
    optionA: "Make the adjustment since the sponsor has the authority to approve it verbally.",
    optionB: "Refuse to discuss the vendor quote until the sponsor puts the request in writing.",
    optionC:
      "Explain that baseline changes must go through integrated change control regardless of who requests them, and submit the vendor quote's impact as a change request.",
    optionD: "Update the baseline now and inform the change control board at the next scheduled meeting.",
    correctKey: "C",
    explanation:
      "C is correct. Once baselined, the project management plan is only changed through integrated change control, which evaluates impact before approval; this holds even when the sponsor is the one asking, because bypassing it undermines the baseline's integrity for everyone. A allows an informal, undocumented change to a controlled baseline. B is unnecessarily obstructive when the real issue is the missing change request, not the format of the ask. D still changes the baseline before the change is evaluated and approved.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "A program combines a hardware workstream planned in detail up front with a software workstream delivered in iterations. Three weeks into execution, the project manager finds that the integrated project management plan was never updated to show how the two workstreams' milestones depend on each other; each workstream lead has only been tracking their own plan. What should the project manager do?",
    optionA:
      "Ask each workstream lead to keep managing their own plan independently, since the workstreams use different approaches.",
    optionB: "Force the software workstream to adopt the hardware workstream's detailed upfront planning to simplify integration.",
    optionC: "Wait until both workstreams report a milestone conflict before creating any integrated view.",
    optionD:
      "Build and maintain an integrated view of the plan that shows the cross-workstream dependencies and milestones, and keep it current as both workstreams progress.",
    correctKey: "D",
    explanation:
      "D is correct. Integration is the project manager's core responsibility: even in a hybrid delivery model, the plan must show how the workstreams' dependencies and milestones connect, and it must be actively maintained. A leaves the dependencies invisible until they cause a problem. B erases the rationale for tailoring the software workstream to an iterative approach. C is reactive and allows a preventable conflict to occur before acting.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A work package in the WBS is described only as 'build the reporting module,' with no further breakdown. Estimators disagree by a factor of three on how long the work will take, and two team members are already interpreting the deliverable differently. What should the project manager do?",
    optionA:
      "Decompose the work package further into smaller components with clear deliverables until estimates can be made with confidence.",
    optionB: "Ask the two most senior estimators to average their estimates and proceed.",
    optionC: "Assign the work package to whichever team member gave the lowest estimate.",
    optionD: "Leave the work package as is, since further decomposition adds unnecessary documentation.",
    correctKey: "A",
    explanation:
      "A is correct. A wide estimate spread and differing interpretations are signs a work package is decomposed at too high a level; breaking it down into smaller, clearly defined components is how the WBS resolves ambiguity and improves estimate reliability. B masks the disagreement instead of resolving its cause. C rewards the least-informed estimate rather than fixing the underlying ambiguity. D leaves the scope ambiguous, risking rework and disputes over what was actually meant.",
  },
  {
    envType: "HYBRID",
    difficulty: "EASY",
    stem: "A deliverable has just been completed and the team believes it meets all documented requirements. Before the customer can be asked to formally accept it, which process must occur?",
    optionA: "Control quality, to verify the deliverable is complete and correct against requirements.",
    optionB:
      "Validate scope, formally confirming the completed deliverable meets the acceptance criteria with the customer or sponsor.",
    optionC: "Control quality only, since validating scope is the same activity as inspecting quality.",
    optionD: "Close procurements, since acceptance is a contract administration matter.",
    correctKey: "B",
    explanation:
      "B is correct. Validate scope is the process for obtaining the customer's or sponsor's formal acceptance of completed deliverables against acceptance criteria; it typically happens after quality control confirms correctness. A describes control quality, which checks correctness internally but does not produce formal acceptance. C incorrectly merges two distinct processes. D applies only when a deliverable comes from a contracted seller, and even then, acceptance criteria still apply through validate scope.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "During backlog refinement, the team keeps disagreeing about whether a story is 'done' because the acceptance criteria were never written down, only discussed verbally in a hallway conversation. This has caused repeated rework late in the sprint. What should the product owner and team do?",
    optionA: "Rely on team memory of the hallway conversation for future refinement sessions.",
    optionB: "Skip acceptance criteria for small stories to save refinement time.",
    optionC:
      "Write and agree explicit acceptance criteria and a definition of done for stories before they are pulled into a sprint.",
    optionD: "Let each developer decide individually what 'done' means for their own stories.",
    correctKey: "C",
    explanation:
      "C is correct. Managing scope in an agile environment depends on clear, written acceptance criteria and a shared definition of done, agreed before work starts, so everyone builds to the same understanding. A relies on unreliable memory and causes exactly the rework already occurring. B removes the safeguard that prevents this problem, even for small stories. D produces inconsistent expectations across the team's output.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "Midway through the project, the team discovers that a deliverable specified in the scope baseline is technically infeasible as written; a workable alternative exists but changes what will be delivered to the customer. What should the project manager do first?",
    optionA: "Deliver the alternative and mention the substitution in the next status report.",
    optionB: "Have the team quietly build the alternative, since it is the only feasible option.",
    optionC: "Cancel the deliverable entirely rather than propose an alternative.",
    optionD:
      "Document the infeasibility and the proposed alternative, and submit it through change control before any rework begins.",
    correctKey: "D",
    explanation:
      "D is correct. A change to what will be delivered, even one driven by technical necessity, is a scope change and must be evaluated and approved through change control before the baseline is updated or work proceeds. A and B build and inform after the fact, bypassing approval and risking rejection of already-completed work. C removes value from the project without exploring or proposing the viable alternative.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "A product backlog contains twenty items competing for the next release. Leadership wants the release scoped to maximize business value delivered per unit of effort, given a fixed release window. Which technique should the product owner and team use to rank the backlog?",
    optionA:
      "Use a value-versus-effort or weighted-shortest-job-first ranking that favors high-value, low-effort items first.",
    optionB: "Rank items strictly by the order they were first requested.",
    optionC: "Rank items alphabetically by feature name for consistency.",
    optionD: "Let the most senior stakeholder in the room decide the order informally each time.",
    correctKey: "A",
    explanation:
      "A is correct. Maximizing value delivered within a constrained window calls for a prioritization technique that weighs value against effort or cost of delay, such as weighted-shortest-job-first, so the release captures the most benefit for the investment. B ignores value and effort entirely. C is arbitrary and unrelated to value. D produces inconsistent, undocumented prioritization driven by influence rather than value.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "A cross-functional team has accumulated significant technical debt while rushing features to market. The product owner wants to keep adding new features every release, but engineers warn that the debt is now slowing every subsequent release and risking future value delivery. What should the project manager recommend?",
    optionA: "Continue prioritizing new features exclusively, since customers only value visible functionality.",
    optionB:
      "Balance the backlog by allocating capacity to reduce the highest-impact technical debt alongside high-value features, based on its effect on future delivery speed.",
    optionC: "Stop all feature work indefinitely until every piece of technical debt is eliminated.",
    optionD: "Let the engineering team address technical debt informally, off the books, without visibility to the product owner.",
    correctKey: "B",
    explanation:
      "B is correct. Value-based delivery takes a whole-of-product view: technical debt that measurably slows future value delivery must be weighed against new features so the backlog balances short-term output with sustained delivery capacity. A optimizes only for visible short-term value while degrading future throughput. C halts all value delivery, which is disproportionate to the risk. D hides real work from prioritization and removes the product owner's ability to make an informed trade-off.",
  },
  {
    envType: "AGILE",
    difficulty: "EASY",
    stem: "Instead of building a fully featured product before the first release, the team plans to release a minimum viable product with the smallest set of features that lets real users validate the core assumption behind the product. What is the main value-based reason for this approach?",
    optionA: "It reduces the total documentation the team needs to produce.",
    optionB: "It removes the need for acceptance criteria on future releases.",
    optionC:
      "It lets the organization deliver and validate value earlier, with the option to adjust direction based on real feedback before investing further.",
    optionD: "It guarantees the product will require no further changes after release.",
    correctKey: "C",
    explanation:
      "C is correct. A minimum viable product delivers value sooner and tests the riskiest assumptions with real users, so further investment is guided by evidence rather than upfront assumptions, which is the core of value-based delivery. A is a side effect at best, not the purpose. B is unrelated; acceptance criteria are still needed for later releases. D is false; an MVP is expected to change based on feedback.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A construction project needs three cranes at overlapping times, but the site can only accommodate two cranes safely at once due to space constraints. All three crane-dependent activities have some schedule float. What resourcing technique should the project manager apply first?",
    optionA: "Hire a third crane immediately regardless of cost, to avoid any scheduling adjustment.",
    optionB: "Remove one of the three crane-dependent activities from the project scope.",
    optionC: "Ignore the constraint since all three activities have float and float means no conflict exists.",
    optionD:
      "Use resource smoothing, adjusting activities only within their float so the crane count never exceeds two, without changing the project end date.",
    correctKey: "D",
    explanation:
      "D is correct. Resource smoothing adjusts activities only within their available float to keep resource usage within a defined limit, such as a maximum of two cranes, without pushing out the finish date, which fits this exact constraint. A adds unplanned cost before trying to solve the problem within the existing plan. B removes scope without analysis or approval. C misunderstands float; float allows scheduling flexibility but does not eliminate a physical resource-availability conflict.",
  },
  {
    envType: "HYBRID",
    difficulty: "EASY",
    stem: "A new project is forming a team drawn from three different departments. Team members are unsure who is accountable for which decisions and who simply needs to be consulted or informed. What tool should the project manager create to clarify this?",
    optionA:
      "A responsibility assignment matrix (such as a RACI chart) that defines who is responsible, accountable, consulted, and informed for key activities.",
    optionB: "A detailed Gantt chart showing task durations only.",
    optionC: "A risk register listing potential resource risks.",
    optionD: "A stakeholder register listing names and contact information.",
    correctKey: "A",
    explanation:
      "A is correct. A responsibility assignment matrix such as RACI is specifically designed to clarify who is responsible, accountable, consulted, and informed, resolving exactly this kind of role confusion. B shows timing, not accountability. C addresses risk, not role clarity. D lists who the stakeholders are but not their decision-making roles on specific activities.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "The resource management plan calls for two data engineers starting in month three, but the functional manager who supplies them says their team is fully booked on another initiative until month five. The delay would affect the critical path. What should the project manager do first?",
    optionA: "Accept the two-month delay without discussion, since functional managers control their own staff.",
    optionB:
      "Negotiate with the functional manager using the project's priority and the resource management plan, and explore options such as partial allocation or a later start with schedule adjustment.",
    optionC: "Recruit two new external contractors immediately without informing the functional manager.",
    optionD: "Escalate directly to executive leadership before attempting to resolve it with the functional manager.",
    correctKey: "B",
    explanation:
      "B is correct. Acquiring resources in a matrix organization starts with negotiation, using the resource plan and project priority to find a workable solution, such as partial availability or an adjusted schedule. A accepts an avoidable delay without exploring options. C bypasses negotiation and may duplicate cost unnecessarily. D escalates before the normal negotiation path has been tried, which should be the first step.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "As the project nears its final iteration, several specialists are scheduled to roll off the team to join other projects. Two of the remaining stories depend on knowledge only those specialists have. What should the project manager do to plan the transition?",
    optionA: "Let the specialists leave on the original date and hope the remaining team can manage without them.",
    optionB: "Ask the product owner to remove the dependent stories from scope entirely so the specialists can leave on time.",
    optionC:
      "Coordinate with the specialists' functional managers to phase their release, allowing time to pair with the remaining team on the dependent stories before they exit.",
    optionD: "Extend every team member's assignment to the project regardless of the other project's need for them.",
    correctKey: "C",
    explanation:
      "C is correct. Managing resources includes planning the release of team members so it does not strand dependent work; negotiating a phased release protects both the remaining scope and the other project's need for the specialists. A risks losing critical knowledge and failing the dependent stories. B removes value from the release to solve a staffing problem instead of managing the staffing. D ignores the other project's legitimate need and is not a sustainable resourcing decision.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "Before issuing a request for proposal for a specialized component, the project manager discovers the internal team could build it with a modest schedule extension and lower total cost, though with less proven expertise than an external supplier. What should the project manager do first?",
    optionA: "Issue the RFP immediately, since external suppliers are always more capable than internal teams.",
    optionB: "Split the work in half, building part internally and buying part externally, without further analysis.",
    optionC: "Ask the sponsor to make the decision without any supporting analysis.",
    optionD:
      "Conduct a make-or-buy analysis weighing cost, schedule, expertise, and risk before deciding whether to procure externally.",
    correctKey: "D",
    explanation:
      "D is correct. A make-or-buy analysis is the tool for deciding whether to build internally or procure externally, weighing cost, schedule, expertise, and risk before committing to a procurement path. A assumes external is automatically superior without evidence. B splits the work without any analysis to justify the split. C asks for a decision without giving the sponsor the information needed to make it well.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "HARD",
    stem: "Three vendors submit proposals for a critical subsystem. One proposes the lowest price but has a thin track record with similar systems; another has strong experience but a higher price; a third offers a mid-range price with an unusually short proposed schedule that the team's engineers doubt is realistic. How should the evaluation team select a vendor?",
    optionA:
      "Score each proposal against pre-defined, weighted source-selection criteria covering price, technical capability, experience, and schedule credibility.",
    optionB: "Automatically select the lowest-priced proposal to minimize cost.",
    optionC: "Automatically select the shortest proposed schedule to minimize project duration.",
    optionD: "Select the vendor the project manager has worked with most recently, regardless of the proposals submitted.",
    correctKey: "A",
    explanation:
      "A is correct. Source selection should apply criteria defined before the proposals were even received, weighing price alongside technical capability, past performance, and the credibility of the proposed schedule, so the decision is objective and defensible. B ignores capability and risk. C rewards an implausible schedule without scrutiny. D substitutes personal familiarity for a structured evaluation.",
  },
  {
    envType: "HYBRID",
    difficulty: "EASY",
    stem: "A contracted vendor has delivered all agreed work, and the deliverables have been formally accepted. What must the project manager still do to properly close out this procurement?",
    optionA: "Nothing further; formal acceptance of deliverables is the only requirement for procurement closure.",
    optionB:
      "Complete the formal procurement closure activities, including verifying all contract terms were met, documenting performance, and archiving records.",
    optionC: "Immediately begin a new contract negotiation with the same vendor for future work.",
    optionD: "Wait for the vendor to initiate the closure paperwork on their own timeline.",
    correctKey: "B",
    explanation:
      "B is correct. Procurement closure includes verifying that all contract obligations were fulfilled, documenting vendor performance for future reference, and archiving procurement records, not just accepting the final deliverable. A stops short of the administrative closure the contract requires. C is unrelated to closing the current contract. D passes a project manager responsibility to the vendor and risks incomplete records.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "The project's approved budget is $2.4 million, but the organization's funding process only releases money in quarterly increments tied to a funding limit reconciliation. The project's cost baseline shows spending of $900,000 in the second quarter, exceeding that quarter's funding release of $650,000. What should the project manager do?",
    optionA: "Spend against the cost baseline as planned and let accounts payable resolve any funding shortfall later.",
    optionB: "Ask the finance department to release the full annual budget immediately to avoid the issue.",
    optionC:
      "Reconcile the cost baseline against the funding limits by re-sequencing planned expenditures or activities to fit within each period's released funds.",
    optionD: "Reduce the project's quality activities in the second quarter to lower spending.",
    correctKey: "C",
    explanation:
      "C is correct. Funding limit reconciliation is done specifically to align planned spending in the cost baseline with the funding that will actually be available in each period, which may mean re-sequencing work rather than changing scope or quality. A risks a funding shortfall the organization cannot cover. B ignores the organization's funding process and is unlikely to succeed. D cuts quality to solve a timing mismatch, which is the wrong lever and creates a different problem.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "HARD",
    stem: "At the midpoint of the project, the estimate at completion (EAC) calculated from current cost performance is significantly higher than the original budget at completion (BAC), even though the remaining scope has not changed. What does this most likely indicate, and what should the project manager do?",
    optionA: "The variance is normal and requires no action since the BAC is only an initial estimate.",
    optionB: "The cost performance to date is unlikely to be representative of the remainder of the project, so the EAC should be ignored.",
    optionC: "The finance department made an error, since EAC should always equal BAC when scope is unchanged.",
    optionD:
      "Current cost performance suggests the project will overrun if the trend continues; the project manager should investigate the cause and consider corrective action or a documented rebaseline.",
    correctKey: "D",
    explanation:
      "D is correct. An EAC materially above the BAC, driven by actual cost performance, signals a likely overrun if trends continue; the project manager should investigate root causes and decide whether corrective action or a formally approved rebaseline is warranted. A dismisses a real forecasting signal. B rejects a standard forecasting technique without justification. C is incorrect; EAC reflects performance-based forecasting and is not required to equal BAC.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "During financial planning, the project manager sets aside a contingency reserve for identified risks and, separately, recommends that the organization hold a management reserve for unforeseen work. A stakeholder asks why the two amounts are not combined into a single reserve line that the project manager alone controls. What should the project manager explain?",
    optionA:
      "The contingency reserve covers known risks and is part of the cost baseline under the project manager's control, while the management reserve covers unknown unknowns and is held and authorized above the project manager's baseline authority.",
    optionB: "Both reserves are functionally identical and could be merged without any change in how they are used.",
    optionC: "Only the management reserve is a legitimate financial planning tool; contingency reserve is an outdated practice.",
    optionD: "The distinction is only relevant for agile projects and does not apply here.",
    correctKey: "A",
    explanation:
      "A is correct. Contingency reserve addresses identified risks and sits inside the cost baseline that the project manager manages, while management reserve covers unforeseeable work and is controlled and authorized at a level above the project manager. B misstates that they work the same way. C dismisses a standard and still-relevant financial planning tool. D is false; the distinction applies regardless of delivery approach whenever reserves are used.",
  },
  {
    envType: "AGILE",
    difficulty: "EASY",
    stem: "A product team funds its work through a fixed quarterly budget rather than a project-specific cost baseline, and the backlog is re-prioritized every iteration based on value. When planning finance for this team, what is most important for the project manager or team lead to track?",
    optionA: "A detailed earned value calculation identical to a traditional predictive project, updated every iteration.",
    optionB:
      "Spend against the fixed budget period over period, alongside the value being delivered, so funding decisions can be made at the next funding cycle.",
    optionC: "Nothing; agile teams funded by a fixed budget do not need any financial tracking.",
    optionD: "Only the number of story points completed, since points are a proxy for cost.",
    correctKey: "B",
    explanation:
      "B is correct. In incrementally funded agile work, financial planning means tracking actual spend against the period's fixed budget together with the value delivered, so the organization can decide whether to keep funding the team at each cycle. A applies a heavier technique than the funding model calls for. C ignores financial accountability that still exists under fixed funding. D confuses a velocity measure with a cost measure; story points are not a reliable proxy for money spent.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "A manufacturing project has experienced several types of defects across recent production runs. Before deciding where to focus quality improvement effort, the quality lead wants to identify which few defect categories account for most of the total defects. Which tool is most appropriate?",
    optionA: "A fishbone (cause-and-effect) diagram to list every possible cause.",
    optionB: "A control chart to check whether the process is within control limits.",
    optionC:
      "A Pareto chart to rank defect categories by frequency and identify the vital few contributing most of the problem.",
    optionD: "A checklist to make sure inspectors do not skip steps.",
    correctKey: "C",
    explanation:
      "C is correct. A Pareto chart ranks categories by frequency so the team can focus on the vital few contributing most of the defects, which is exactly the decision being made here. A is used to explore causes of a single problem already identified, not to rank multiple categories by frequency. B monitors process stability over time rather than ranking defect types. D supports consistent execution but does not analyze which defects matter most.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "A team's definition of done currently requires only that code compiles and passes unit tests. Several stories marked done have since failed in user acceptance testing because of missed edge cases and inconsistent handling of invalid input. What should the team do to plan quality more effectively going forward?",
    optionA: "Add more unit tests written by the same developers who wrote the original code, without changing the definition of done.",
    optionB: "Move all testing to a separate quality assurance team at the very end of the release.",
    optionC: "Lower the bar further by removing unit tests, since they did not catch the issues anyway.",
    optionD:
      "Expand the definition of done to include criteria such as edge-case testing, code review, and acceptance criteria verification before a story can be called complete.",
    correctKey: "D",
    explanation:
      "D is correct. Planning quality proactively means strengthening the definition of done with criteria that actually catch the gaps observed, such as edge-case coverage, peer review, and acceptance criteria checks, before work is considered complete. A keeps the same blind spot by relying on the same narrow testing and the same author. B reintroduces a late-stage, inspection-only model that agile definitions of done are meant to avoid. C removes an existing safeguard instead of strengthening quality planning.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "HARD",
    stem: "A quality audit of a supplier's process finds that inspection records are complete and every batch passed inspection, yet the field failure rate for the supplied part has been rising for two months. What should the project manager conclude and do?",
    optionA:
      "Conclude the inspection criteria themselves may not be catching the real failure mode, and investigate the root cause of field failures with the supplier, updating inspection or process criteria as needed.",
    optionB: "Conclude the process is fine because all inspections passed, and take no further action.",
    optionC: "Immediately terminate the supplier contract without further investigation.",
    optionD: "Conclude the field failures are unrelated to the supplier, since inspection records show no defects.",
    correctKey: "A",
    explanation:
      "A is correct. Passing inspection does not guarantee fitness for use if the inspection criteria do not test for the actual failure mode; the audit finding calls for root-cause investigation and possibly revised criteria or process changes with the supplier. B relies on a passing inspection that has already been shown not to predict field performance. C is a disproportionate reaction before the cause is even understood. D assumes the conclusion without evidence, when the correlation between rising field failures and the supplied part needs investigation, not dismissal.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "While building the network diagram, the project manager specifies that activity B cannot start until activity A is 50% complete, rather than waiting for A to fully finish. Which type of dependency relationship, with a lead, does this represent?",
    optionA: "A finish-to-start relationship with a lag.",
    optionB: "A finish-to-start relationship with a lead, allowing B to start before A fully finishes.",
    optionC: "A start-to-start relationship with a lag on activity B's start relative to A's start.",
    optionD: "A finish-to-finish relationship requiring both activities to end together.",
    correctKey: "B",
    explanation:
      "B is correct. Allowing the successor to start before the predecessor fully finishes describes a finish-to-start dependency with a lead (a negative lag) applied to compress the schedule. A describes a lag that delays the start further, the opposite effect. C describes two activities starting relative to each other's start dates, not one finishing before the other starts. D ties the finish dates together, which is unrelated to this scenario.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "EASY",
    stem: "For a new activity with significant uncertainty, the project manager asks the team to provide an optimistic, most likely, and pessimistic duration estimate, which are then combined into a single weighted estimate. Which estimating technique is being used?",
    optionA: "Analogous estimating based on a similar past activity.",
    optionB: "Parametric estimating using a fixed unit rate.",
    optionC: "Three-point (PERT) estimating, which produces a weighted average that accounts for uncertainty.",
    optionD: "Bottom-up estimating by summing estimates for even smaller sub-activities.",
    correctKey: "C",
    explanation:
      "C is correct. Combining optimistic, most likely, and pessimistic estimates into a weighted duration is three-point (PERT) estimating, specifically used to account for uncertainty in the estimate. A uses historical data from a similar activity, not three separate values. B applies a statistical relationship between variables and a unit rate, not three duration points. D decomposes the activity into smaller pieces and sums them, which is a different technique entirely.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "A program is releasing a product every six weeks, but detailed requirements for work more than two releases out are still evolving and would be wasted effort to plan in full detail now. What scheduling technique should the project manager use to plan the work across the whole program?",
    optionA: "Plan every future release in full detail today, so nothing is left undefined.",
    optionB: "Refuse to schedule any release beyond the current one until all requirements across the program are finalized.",
    optionC: "Assign a fixed, unchangeable date to every future release regardless of requirement maturity.",
    optionD:
      "Use rolling wave planning: plan the near-term release in detail and keep far-term releases at a higher, less-detailed level until they are closer and better understood.",
    correctKey: "D",
    explanation:
      "D is correct. Rolling wave planning matches the level of scheduling detail to how well the work is understood: near-term work is planned in detail, and work further out stays at a summary level until it becomes clearer, avoiding wasted planning effort. A wastes effort detailing work that is likely to change. B refuses to schedule at all, which is unnecessary and unhelpful for a program with a known release cadence. C commits to dates without the detail needed to make them credible.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "A newly formed agile team is planning its first few sprints. Historical velocity does not yet exist, and the team's estimates of story points vary widely between members during planning poker. What should the project manager or scrum master recommend to improve estimate reliability over the first several sprints?",
    optionA:
      "Use relative estimation techniques such as planning poker with reference stories, and let the team calibrate its own velocity over the first few sprints as actual data accumulates.",
    optionB: "Assign story points based solely on the most experienced developer's opinion in every session.",
    optionC: "Skip estimation entirely and commit to whatever fits in a fixed number of days.",
    optionD: "Demand the team match an external benchmark velocity from an unrelated project.",
    correctKey: "A",
    explanation:
      "A is correct. Early in a new team's life, relative estimation with reference stories helps calibrate a shared understanding of size, and velocity naturally stabilizes as the team accumulates its own completed-work data over a few sprints. B silences the team's collective judgment, which is the point of collaborative estimation. C removes estimation as a planning input entirely. D applies another team's context, which is not a valid basis for this team's capacity.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "The project's cost and schedule variances have both stayed within the approved control thresholds for several reporting periods, but the project manager notices the trend line for the schedule performance index has been declining steadily each period even though it remains within threshold. What should the project manager do?",
    optionA: "Take no action, since the SPI remains within the approved threshold and thresholds define when action is required.",
    optionB:
      "Investigate the underlying cause of the declining trend now, since a steady negative trend can predict a future threshold breach even while still compliant today.",
    optionC: "Wait until the threshold is actually breached before beginning any investigation.",
    optionD: "Immediately declare the project in crisis and escalate to the sponsor without further analysis.",
    correctKey: "B",
    explanation:
      "B is correct. Evaluating status well means reading trends, not just point-in-time compliance; a steadily declining SPI is a leading indicator that can forecast a future breach, and investigating early allows corrective action while options are still cheap. A treats the threshold as the only signal that matters and ignores a clear trend. C waits until the problem is harder and more expensive to fix. D escalates without the analysis needed to inform the sponsor or justify the severity.",
  },
  {
    envType: "AGILE",
    difficulty: "MEDIUM",
    stem: "A team's cycle time (the time from starting an item to delivering it) has been steadily increasing over the last five iterations, even though the team's throughput (items completed per iteration) has stayed roughly the same. What does this combination most likely indicate, and what should the project manager investigate?",
    optionA: "Nothing of concern; stable throughput means the team's status is healthy regardless of cycle time.",
    optionB: "The team's velocity in story points must be miscalculated, since cycle time and throughput cannot move independently.",
    optionC:
      "The team is taking on more work in parallel than it can efficiently finish, causing items to sit longer before completion; the project manager should investigate work-in-progress levels and bottlenecks.",
    optionD: "The increase in cycle time is purely a reporting artifact and does not need investigation.",
    correctKey: "C",
    explanation:
      "C is correct. Rising cycle time with flat throughput often points to too much work in progress or a bottleneck stretching out how long each item takes to finish, even though the same number complete each iteration; investigating WIP and flow is the right next step. A ignores a real flow-health signal. B confuses unrelated metrics; cycle time and throughput can diverge for legitimate flow reasons. D dismisses a trend without any basis for calling it an artifact.",
  },
  {
    envType: "HYBRID",
    difficulty: "EASY",
    stem: "At the monthly status meeting, the project manager wants to give the steering committee a clear, at-a-glance view of cost, schedule, risk, and quality health without walking through every underlying report. What is the most effective way to present this?",
    optionA: "Distribute all the detailed underlying reports and let the committee draw their own conclusions.",
    optionB: "Read the full risk register aloud during the meeting.",
    optionC: "Skip the meeting and send a single-line email stating the project is on track.",
    optionD:
      "Use a summary dashboard with a small set of key indicators (such as red/yellow/green status) for each area, supported by the detail available on request.",
    correctKey: "D",
    explanation:
      "D is correct. A concise status dashboard gives decision-makers a fast, accurate read on each area's health while keeping supporting detail available if they want to dig in, which fits the stated need for an at-a-glance view. A overwhelms the audience with unfiltered detail. B is inefficient and not a status summary. C omits the actual status information the committee needs to make decisions.",
  },
  {
    envType: "PREDICTIVE",
    difficulty: "MEDIUM",
    stem: "Midway through execution, the sponsor decides to cancel the project because a strategic priority shift makes the business case no longer viable. Significant work is already in progress. What must the project manager still do before the project can be considered closed?",
    optionA:
      "Perform closure activities appropriate to a terminated project: document the reason for cancellation, formalize acceptance or disposition of completed work, close out contracts, release resources, and capture lessons learned.",
    optionB: "Simply stop all work and notify the team; no further action is required for a cancelled project.",
    optionC: "Continue working on remaining deliverables informally, since the cancellation was a business decision, not a project one.",
    optionD: "Wait for a future project to resume the work before performing any closure steps.",
    correctKey: "A",
    explanation:
      "A is correct. Even a cancelled or terminated project must be formally closed: the reason is documented, completed work is dispositioned or accepted, procurements are closed, resources are released, and lessons learned are captured for the organization. B skips the administrative and contractual closure the project still requires. C continues work against a decision that has already been made and lacks authorization. D delays closure indefinitely on an uncertain future event.",
  },
  {
    envType: "HYBRID",
    difficulty: "MEDIUM",
    stem: "A project is complete and its final deliverables have been accepted by the customer. The support and operations team that will run the product day to day was not involved during the project and has not received any documentation, training, or access to the systems being handed over. What should the project manager ensure before closing the project?",
    optionA: "Close the project immediately since customer acceptance is the only closure requirement that matters.",
    optionB:
      "Plan and execute a formal transition to operations, including documentation, training, and access handover, as part of project closure.",
    optionC: "Leave the transition to operations to happen informally after closure, since it is outside the project's scope.",
    optionD: "Ask the customer to hire and train their own operations team after the project team disbands.",
    correctKey: "B",
    explanation:
      "B is correct. Closure includes transitioning the product to the group that will sustain it, which means documentation, knowledge transfer, training, and access handover are completed before the project team disperses. A treats acceptance as sufficient on its own and ignores operational readiness. C assumes the handover is not the project's responsibility, when a smooth transition is part of delivering the intended value. D pushes an obligation the project should fulfill onto the customer.",
  },
  {
    envType: "AGILE",
    difficulty: "EASY",
    stem: "As the project closes, the project manager gathers the team to discuss what went well, what did not, and what should be done differently next time. Several useful insights emerge about a recurring estimating error. What should the project manager do with these insights to provide the most long-term value?",
    optionA: "Keep informal notes for personal reference only, in case a similar project comes up.",
    optionB: "Mention the insights briefly in the final status report and take no further action.",
    optionC:
      "Record the insights formally as lessons learned and submit them to the organization's process assets so future projects can benefit.",
    optionD: "Share the insights verbally with the immediate team only, since the project is now closed.",
    correctKey: "C",
    explanation:
      "C is correct. Lessons learned deliver the most value when they are documented and fed into the organization's process assets, making them available to future projects rather than staying with one person or team. A limits the benefit to the project manager's own memory. B buries the insight in a report that is unlikely to be consulted by future project teams. D confines valuable knowledge to people who are dispersing after closure, defeating the purpose of capturing it.",
  },
];

export async function main() {
  console.log("Seeding database...");

  if (ECO_TAGS.length !== questions.length) {
    throw new Error(
      `ECO_TAGS has ${ECO_TAGS.length} entries but questions has ${questions.length}. They must stay index-aligned.`
    );
  }

  const rows = questions.map((q, i) => ({
    ...q,
    domain: ECO_TAGS[i].domain,
    task: ECO_TAGS[i].task,
    status: "PUBLISHED" as const,
  }));

  // Idempotent: only insert questions whose stem is not already in the bank, so
  // the seed can be re-run to add new items without duplicating existing ones.
  const existingStems = new Set(
    (await prisma.question.findMany({ select: { stem: true } })).map((q) => q.stem)
  );
  const toInsert = rows.filter((q) => !existingStems.has(q.stem));
  const skipped = rows.length - toInsert.length;

  if (toInsert.length > 0) {
    const { count } = await prisma.question.createMany({ data: toInsert });
    console.log(`Inserted ${count} questions (${skipped} already present).`);
  } else {
    console.log(`No new questions to insert (${skipped} already present).`);
  }

  const existing = await prisma.user.findUnique({
    where: { email: "demo@acethepmp.com" },
  });
  if (!existing) {
    const passwordHash = await bcrypt.hash("password123", 10);
    await prisma.user.create({
      data: {
        email: "demo@acethepmp.com",
        name: "Demo Learner",
        passwordHash,
      },
    });
    console.log("Created demo user: demo@acethepmp.com / password123");
  }

  console.log("Seed complete.");
}

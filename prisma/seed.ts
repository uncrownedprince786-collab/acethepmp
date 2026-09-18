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

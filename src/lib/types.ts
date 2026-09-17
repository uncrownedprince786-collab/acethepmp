import type { Domain, EnvType, Difficulty } from "@prisma/client";

export type Options = { A: string; B: string; C: string; D: string };

export type QuestionData = {
  id: string;
  stem: string;
  options: Options;
  domain: Domain;
  task: number;
  envType: EnvType;
  difficulty: Difficulty;
  usedOnce?: boolean;
};

export type AnswerFeedback = {
  ok: boolean;
  attemptId: string;
  isCorrect: boolean;
  correctKey: "A" | "B" | "C" | "D";
  explanation: string;
  domain: Domain;
  domainLabel: string;
  task: number;
  envType: EnvType;
  progress: {
    timesSeen: number;
    timesRight: number;
    timesWrong: number;
    streak: number;
  };
};

export type AssessmentResult = {
  ok: boolean;
  mode: "diagnostic" | "simulator";
  readiness: number;
  label: string;
  totalCorrect: number;
  total: number;
  pct: number;
  domainScores: Partial<
    Record<Domain, { accuracy: number | null }>
  >;
  needs: string[];
};
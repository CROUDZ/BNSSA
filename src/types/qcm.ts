export type AnswerKey = "A" | "B" | "C" | "D" | "E";

export type Question = {
  id: string;
  sourceQcm: number;
  sourceQuestionId: number;
  tags: string[];
  question: string;
  answers: Partial<Record<AnswerKey, string>>;
  correctAnswers: AnswerKey[];
};

export type QcmData = {
  id: number;
  title: string;
  description: string;
  questions: Question[];
};

// Per-question result stored in session
export type QuestionResult = {
  questionId: string;
  selectedAnswers: AnswerKey[];
  correct: boolean;
  answeredAt?: string;
};

// Per-QCM progress stored in sessionStorage
export type QcmProgress = {
  qcmId: number;
  results: QuestionResult[];
  answeredQuestionIds?: string[];
  completedAt: string | null;
  score: number;
  total: number;
};

export type SessionData = {
  [qcmId: number]: QcmProgress;
};

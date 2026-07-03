export type AnswerKey = "A" | "B" | "C" | "D" | "E";

export type QcmMode = "training" | "exam";

export type Question = {
  id: string;
  sourceQuestionId: number;
  tags: string[];
  question: string;
  answers: Partial<Record<AnswerKey, string>>;
  correctAnswers: AnswerKey[];
};

export type QcmData = {
  id: QcmMode;
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

// Per-mode progress stored in sessionStorage
export type QcmProgress = {
  qcmId: QcmMode;
  results: QuestionResult[];
  answeredQuestionIds?: string[];
  completedAt: string | null;
  score: number;
  total: number;
};

export type SessionData = Partial<Record<QcmMode, QcmProgress>>;

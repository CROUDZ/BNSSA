export type AnswerKey = 'A' | 'B' | 'C' | 'D' | 'E';

export type Question = {
  id: number;
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
  questionId: number;
  selectedAnswers: AnswerKey[];
  correct: boolean;
};

// Per-QCM progress stored in sessionStorage
export type QcmProgress = {
  qcmId: number;
  results: QuestionResult[];
  completedAt: string | null;
  score: number;
  total: number;
};

export type SessionData = {
  [qcmId: number]: QcmProgress;
};
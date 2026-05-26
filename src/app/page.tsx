'use client';

import { useMemo, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';

type AnswerKey = 'A' | 'B' | 'C' | 'D' | 'E';

type Question = {
  id: number;
  question: string;
  answers: Record<AnswerKey, string>;
  correct: AnswerKey;
};

type Quiz = {
  id: number;
  title: string;
  description: string;
  questions: Question[];
};

const createQuestions = (quizId: number): Question[] => {
  return Array.from({ length: 40 }, (_, index) => ({
    id: index + 1,
    question: `Question ${index + 1} du QCM ${quizId}`,
    answers: {
      A: 'Réponse A',
      B: 'Réponse B',
      C: 'Réponse C',
      D: 'Réponse D',
      E: 'Réponse E',
    },
    correct: 'A',
  }));
};

const quizzes: Quiz[] = [
  {
    id: 1,
    title: 'QCM 1',
    description: 'Révision générale',
    questions: createQuestions(1),
  },
  {
    id: 2,
    title: 'QCM 2',
    description: 'Réglementation',
    questions: createQuestions(2),
  },
  {
    id: 3,
    title: 'QCM 3',
    description: 'Secourisme',
    questions: createQuestions(3),
  },
  {
    id: 4,
    title: 'QCM 4',
    description: 'Surveillance',
    questions: createQuestions(4),
  },
];

export default function HomePage() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerKey>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = selectedQuiz?.questions[currentQuestionIndex];

  const score = useMemo(() => {
    if (!selectedQuiz) return 0;

    return selectedQuiz.questions.filter(
      (question) => answers[question.id] === question.correct,
    ).length;
  }, [answers, selectedQuiz]);

  const handleSelectAnswer = (answer: AnswerKey) => {
    if (!currentQuestion) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const nextQuestion = () => {
    if (!selectedQuiz) return;

    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      return;
    }

    setShowResults(true);
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
  };

  if (!selectedQuiz) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h1 className="text-5xl font-black tracking-tight">
              Révision BNSSA
            </h1>

            <p className="mt-3 text-zinc-400 text-lg">
              Sélectionne un QCM pour commencer.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {quizzes.map((quiz) => (
              <m.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                key={quiz.id}
                onClick={() => setSelectedQuiz(quiz)}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-left transition hover:border-zinc-700 hover:bg-zinc-800"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm font-semibold">
                    40 Questions
                  </span>

                  <span className="text-zinc-500">#{quiz.id}</span>
                </div>

                <h2 className="text-2xl font-bold">{quiz.title}</h2>

                <p className="mt-2 text-sm text-zinc-400">
                  {quiz.description}
                </p>

                <div className="mt-8">
                  <div className="rounded-2xl bg-white px-4 py-3 text-center font-semibold text-black">
                    Commencer
                  </div>
                </div>
              </m.button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (showResults) {
    const percentage = Math.round(
      (score / selectedQuiz.questions.length) * 100,
    );

    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-white">
        <m.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900 p-8"
        >
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              {percentage >= 50 ? (
                <FaCheckCircle className="text-7xl text-green-500" />
              ) : (
                <FaTimesCircle className="text-7xl text-red-500" />
              )}
            </div>

            <h1 className="text-4xl font-black">Résultats</h1>

            <p className="mt-4 text-zinc-400">
              Tu as obtenu :
            </p>

            <div className="mt-6 text-7xl font-black">
              {score}
              <span className="text-3xl text-zinc-500">
                /{selectedQuiz.questions.length}
              </span>
            </div>

            <div className="mt-3 text-2xl font-bold">
              {percentage}%
            </div>

            <button
              onClick={resetQuiz}
              className="mt-10 rounded-2xl bg-white px-6 py-4 font-bold text-black transition hover:scale-[1.02]"
            >
              Retour aux QCM
            </button>
          </div>
        </m.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <button
            onClick={resetQuiz}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 font-medium transition hover:bg-zinc-800"
          >
            Retour
          </button>

          <div className="text-right">
            <p className="text-sm text-zinc-500">
              Question
            </p>

            <p className="text-2xl font-black">
              {currentQuestionIndex + 1}
              <span className="text-zinc-500">
                /{selectedQuiz.questions.length}
              </span>
            </p>
          </div>
        </div>

        <div className="mb-6 h-3 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{
              width: `${
                ((currentQuestionIndex + 1) /
                  selectedQuiz.questions.length) *
                100
              }%`,
            }}
          />
        </div>

        <AnimatePresence mode="wait">
          <m.div
            key={currentQuestion?.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8"
          >
            <div className="mb-8">
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm font-semibold">
                {selectedQuiz.title}
              </span>

              <h1 className="mt-6 text-3xl font-black leading-tight">
                {currentQuestion?.question}
              </h1>
            </div>

            <div className="grid gap-4">
              {(
                Object.entries(currentQuestion?.answers || {}) as [
                  AnswerKey,
                  string,
                ][]
              ).map(([key, value]) => {
                const selected =
                  answers[currentQuestion!.id] === key;

                return (
                  <button
                    key={key}
                    onClick={() => handleSelectAnswer(key)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      selected
                        ? 'border-white bg-white text-black'
                        : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                          selected
                            ? 'bg-black text-white'
                            : 'bg-zinc-800'
                        }`}
                      >
                        {key}
                      </div>

                      <span className="font-medium">{value}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex items-center justify-between">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 rounded-2xl border border-zinc-800 px-5 py-3 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaArrowLeft />
                Précédent
              </button>

              <button
                onClick={nextQuestion}
                disabled={!answers[currentQuestion!.id]}
                className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {currentQuestionIndex ===
                selectedQuiz.questions.length - 1
                  ? 'Terminer'
                  : 'Suivant'}

                <FaArrowRight />
              </button>
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
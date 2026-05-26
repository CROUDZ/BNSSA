"use client";

import { useState, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { AnswerButton } from "@/components/AnswerButton";
import type { QcmData, AnswerKey, QuestionResult } from "@/types/qcm";

type Props = {
  quiz: QcmData;
  questionIds?: number[]; // if set, only show those question ids (retry mode)
  mode?: "all" | "retry" | "exam";
  revealAnswers?: boolean;
  onComplete: (results: QuestionResult[]) => void;
  onBack: () => void;
};

type AnswerState = "idle" | "selected" | "correct" | "wrong" | "missed";

export function QuizSession({
  quiz,
  questionIds,
  mode = "all",
  revealAnswers = true,
  onComplete,
  onBack,
}: Props) {
  const questions = questionIds
    ? quiz.questions.filter((q) => questionIds.includes(q.id))
    : quiz.questions;

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<AnswerKey[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [direction, setDirection] = useState(1);
  const [examAnswers, setExamAnswers] = useState<
    Record<number, AnswerKey[]>
  >({});
  const [explanations, setExplanations] = useState<Record<number, string>>({});
  const [explainErrors, setExplainErrors] = useState<Record<number, string>>(
    {},
  );
  const [explainLoadingId, setExplainLoadingId] = useState<number | null>(null);

  const question = questions[index];
  const answerKeys = Object.keys(question.answers) as AnswerKey[];
  const canConfirm = selected.length > 0 && !confirmed;
  const answeredCount = questions.reduce(
    (count, q) => count + ((examAnswers[q.id] ?? []).length > 0 ? 1 : 0),
    0,
  );

  const getState = useCallback(
    (key: AnswerKey): AnswerState => {
      if (!confirmed) {
        return selected.includes(key) ? "selected" : "idle";
      }
      if (!revealAnswers) {
        return selected.includes(key) ? "selected" : "idle";
      }
      const isCorrect = question.correctAnswers.includes(key);
      const wasSelected = selected.includes(key);
      if (isCorrect && wasSelected) return "correct";
      if (!isCorrect && wasSelected) return "wrong";
      if (isCorrect && !wasSelected) return "missed";
      return "idle";
    },
    [confirmed, selected, question.correctAnswers, revealAnswers],
  );

  const handleSelect = (key: AnswerKey) => {
    if (confirmed) return;
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleExamSelect = (questionId: number, key: AnswerKey) => {
    setExamAnswers((prev) => {
      const current = prev[questionId] ?? [];
      const next = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key];
      return { ...prev, [questionId]: next };
    });
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
    setConfirmed(true);
  };

  const handleNext = () => {
    // Save result
    const correct =
      selected.length === question.correctAnswers.length &&
      selected.every((k) => question.correctAnswers.includes(k));

    const newResults = [
      ...results,
      { questionId: question.id, selectedAnswers: selected, correct },
    ];

    if (index < questions.length - 1) {
      setDirection(1);
      setResults(newResults);
      setIndex((i) => i + 1);
      setSelected([]);
      setConfirmed(false);
    } else {
      onComplete(newResults);
    }
  };

  const handlePrev = () => {
    if (index === 0) return;
    setDirection(-1);
    setIndex((i) => i - 1);
    // Restore previous answer if available
    const prev = results[index - 1];
    if (prev) {
      setSelected(prev.selectedAnswers);
      setConfirmed(true);
    } else {
      setSelected([]);
      setConfirmed(false);
    }
    // Pop last result
    setResults((r) => r.slice(0, -1));
  };

  const progress =
    mode === "exam"
      ? questions.length
        ? (answeredCount / questions.length) * 100
        : 0
      : ((index + (confirmed ? 1 : 0)) / questions.length) * 100;
  const canExplain = revealAnswers && confirmed && mode !== "exam";
  const currentExplanation = explanations[question.id];
  const currentExplainError = explainErrors[question.id];
  const isExplainLoading = explainLoadingId === question.id;

  const handleExplain = async () => {
    if (!canExplain || isExplainLoading) return;
    setExplainLoadingId(question.id);
    setExplainErrors((prev) => ({ ...prev, [question.id]: "" }));

    const answerPayload = answerKeys.reduce<Record<AnswerKey, string>>(
      (acc, key) => {
        const value = question.answers[key];
        if (value) acc[key] = value;
        return acc;
      },
      {} as Record<AnswerKey, string>,
    );

    try {
      const response = await fetch("/api/qcm-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizTitle: quiz.title,
          question: question.question,
          answers: answerPayload,
          correctAnswers: question.correctAnswers,
          selectedAnswers: selected,
        }),
      });

      if (!response.ok) {
        throw new Error("Explain request failed");
      }

      const data = (await response.json()) as { explanation?: string };
      const explanation = data.explanation?.trim();
      if (!explanation) {
        throw new Error("Missing explanation");
      }

      setExplanations((prev) => ({ ...prev, [question.id]: explanation }));
    } catch {
      setExplainErrors((prev) => ({
        ...prev,
        [question.id]: "Impossible d'obtenir une explication pour le moment.",
      }));
    } finally {
      setExplainLoadingId(null);
    }
  };

  if (mode === "exam") {
    const remainingCount = questions.length - answeredCount;
    const canSubmit = remainingCount === 0 && questions.length > 0;

    return (
      <main className="min-h-screen bg-background p-4 text-foreground md:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-2xl border border-soft bg-surface-strong px-4 py-2.5 text-sm font-medium transition hover:bg-surface-veil"
            >
              <FaArrowLeft className="text-xs" />
              Retour
            </button>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">
                Mode examen
              </span>
              <span className="font-mono text-sm text-muted">
                {answeredCount}
                <span className="text-muted-strong">/{questions.length}</span>
              </span>
            </div>
          </div>

          <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-surface-strong">
            <m.div
              className="h-full rounded-full bg-foreground"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
          </div>

          <div className="flex flex-col gap-6">
            {questions.map((item) => {
              const itemKeys = Object.keys(item.answers) as AnswerKey[];
              const itemSelected = examAnswers[item.id] ?? [];

              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-soft bg-surface-strong p-6"
                >
                  <h2 className="text-xl font-black leading-snug md:text-2xl">
                    {item.id}) {item.question}
                  </h2>

                  <div className="mt-4 flex flex-col gap-3">
                    {itemKeys.map((key) => (
                      <AnswerButton
                        key={key}
                        answerKey={key}
                        value={item.answers[key]!}
                        state={itemSelected.includes(key) ? "selected" : "idle"}
                        onClick={() => handleExamSelect(item.id, key)}
                        disabled={false}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {remainingCount > 0 && (
              <p className="text-center text-sm text-muted">
                {remainingCount} question{remainingCount > 1 ? "s" : ""}
                {" "}restante{remainingCount > 1 ? "s" : ""} avant de
                valider.
              </p>
            )}
            <button
              onClick={() => {
                if (!canSubmit) return;
                const newResults = questions.map((item) => {
                  const selectedAnswers = examAnswers[item.id] ?? [];
                  const correct =
                    selectedAnswers.length === item.correctAnswers.length &&
                    selectedAnswers.every((k) =>
                      item.correctAnswers.includes(k),
                    );
                  return {
                    questionId: item.id,
                    selectedAnswers,
                    correct,
                  };
                });
                onComplete(newResults);
              }}
              disabled={!canSubmit}
              className="w-full rounded-2xl bg-foreground px-5 py-4 text-sm font-bold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Valider l'examen
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 text-foreground md:p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-2xl border border-soft bg-surface-strong px-4 py-2.5 text-sm font-medium transition hover:bg-surface-veil"
          >
            <FaArrowLeft className="text-xs" />
            Retour
          </button>

          <div className="flex items-center gap-3">
            {mode !== "all" && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  mode === "retry"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-amber-500/20 text-amber-300"
                }`}
              >
                {mode === "retry" ? "Mode erreurs" : "Mode examen"}
              </span>
            )}
            <span className="font-mono text-sm text-muted">
              {index + 1}
              <span className="text-muted-strong">/{questions.length}</span>
            </span>
                            <span className="rounded-full bg-surface-veil px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted">
                  {quiz.title}
                </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-surface-strong">
          <m.div
            className="h-full rounded-full bg-foreground"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          />
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait" custom={direction}>
          <m.div
            key={question.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.2 }}
          >
              <h2 className="text-xl font-black leading-snug md:text-2xl mb-5 rounded-3xl border border-soft bg-surface-strong p-6">
                {question.id}) {question.question}
              </h2>

            {/* Answers */}
            <div className="flex flex-col gap-3">
              {answerKeys.map((key) => (
                <AnswerButton
                  key={key}
                  answerKey={key}
                  value={question.answers[key]!}
                  state={getState(key)}
                  onClick={() => handleSelect(key)}
                  disabled={confirmed}
                />
              ))}
            </div>

            {/* Feedback */}
            {revealAnswers && (
              <AnimatePresence>
                {confirmed && (
                  <m.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-4 rounded-2xl border px-5 py-4 text-sm font-semibold ${
                      results.length > 0 ||
                      (selected.every((k) =>
                        question.correctAnswers.includes(k),
                      ) &&
                        selected.length === question.correctAnswers.length)
                        ? (() => {
                            const correct =
                              selected.length ===
                                question.correctAnswers.length &&
                              selected.every((k) =>
                                question.correctAnswers.includes(k),
                              );
                            return correct
                              ? "border-emerald-700 bg-emerald-900/30 text-emerald-300"
                              : "border-red-700 bg-red-900/30 text-red-300";
                          })()
                        : "border-emerald-700 bg-emerald-900/30 text-emerald-300"
                    }`}
                  >
                    {(() => {
                      const correct =
                        selected.length === question.correctAnswers.length &&
                        selected.every((k) =>
                          question.correctAnswers.includes(k),
                        );
                      return correct
                        ? "✓ Bonne réponse !"
                        : `✗ Mauvaise réponse. La bonne réponse était : ${question.correctAnswers.join(", ")}`;
                    })()}
                  </m.div>
                )}
              </AnimatePresence>
            )}

            {canExplain && (
              <div className="mt-4 rounded-2xl border border-soft bg-surface-veil px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Explication IA
                  </span>
                  <button
                    onClick={handleExplain}
                    disabled={isExplainLoading}
                    className="rounded-full border border-soft px-3 py-1 text-xs font-semibold text-muted-strong transition hover:border-emerald-300/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {currentExplanation
                      ? "Regenerer"
                      : "Demander une explication"}
                  </button>
                </div>

                {isExplainLoading && (
                  <p className="mt-3 text-sm text-muted">Analyse en cours...</p>
                )}

                {currentExplainError && (
                  <p className="mt-3 text-sm text-red-300">
                    {currentExplainError}
                  </p>
                )}

                {currentExplanation && (
                  <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">
                    {currentExplanation}
                  </p>
                )}
              </div>
            )}
          </m.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={index === 0}
            className="flex items-center gap-2 rounded-2xl border border-soft px-5 py-3 text-sm transition hover:bg-surface-veil disabled:cursor-not-allowed disabled:opacity-30"
          >
            <FaArrowLeft className="text-xs" />
            Précédent
          </button>

          {!confirmed ? (
            <button
              onClick={handleConfirm}
              disabled={selected.length === 0}
              className="flex-1 rounded-2xl bg-foreground px-5 py-3 text-sm font-bold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Valider
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-sm font-bold text-background transition hover:opacity-90"
            >
              {index === questions.length - 1
                ? "Voir les résultats"
                : "Suivant"}
              <FaArrowRight className="text-xs" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

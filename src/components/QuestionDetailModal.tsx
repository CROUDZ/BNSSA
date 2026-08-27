"use client";

import { useEffect } from "react";
import type { AnswerKey, Question, QuestionResult } from "@/types/qcm";

type Props = {
  question: Question;
  result: QuestionResult;
  title: string;
  onClose: () => void;
};

function getAnswerStatus({
  isSelected,
  isCorrect,
}: {
  isSelected: boolean;
  isCorrect: boolean;
}) {
  if (isSelected && isCorrect) return "Bonne, cochée";
  if (isCorrect) return "Bonne, non cochée";
  if (isSelected) return "Fausse, cochée";
  return null;
}

function getAnswerBadgeStyle({
  isSelected,
  isCorrect,
}: {
  isSelected: boolean;
  isCorrect: boolean;
}) {
  if (isSelected && isCorrect) {
    return "border-emerald-300 bg-emerald-300 text-emerald-950";
  }

  if (isCorrect) {
    return "border-emerald-400/80 text-emerald-300";
  }

  if (isSelected) {
    return "border-red-300 bg-red-300 text-red-950";
  }

  return "";
}

function getAnswerCardStyle({
  isSelected,
  isCorrect,
}: {
  isSelected: boolean;
  isCorrect: boolean;
}) {
  if (isSelected && isCorrect) {
    return "border-emerald-400/70 bg-emerald-500/10";
  }

  if (isCorrect) {
    return "border-emerald-500/50 border-dashed bg-emerald-500/5";
  }

  if (isSelected) {
    return "border-red-400/70 bg-red-500/10";
  }

  return "border-soft bg-surface-strong";
}

function getAnswerKeyStyle({
  isSelected,
  isCorrect,
}: {
  isSelected: boolean;
  isCorrect: boolean;
}) {
  if (isSelected && isCorrect) {
    return "border-emerald-300 bg-emerald-300/10 text-emerald-200";
  }

  if (isCorrect) {
    return "border-emerald-500/70 text-emerald-300";
  }

  if (isSelected) {
    return "border-red-300 bg-red-300/10 text-red-200";
  }

  return "border-soft text-muted-strong";
}

function formatAnswerKeys(keys: AnswerKey[]) {
  return keys.length ? keys.join(", ") : "Aucune";
}

export function QuestionDetailModal({ question, result, title, onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const answerKeys = Object.keys(question.answers) as AnswerKey[];
  const selectedAnswerKeys = result.selectedAnswers ?? [];
  const correctAnswerKeys = question.correctAnswers ?? [];
  const missingAnswerKeys = correctAnswerKeys.filter(
    (key) => !selectedAnswerKeys.includes(key),
  );
  const extraAnswerKeys = selectedAnswerKeys.filter(
    (key) => !correctAnswerKeys.includes(key),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="question-detail-title"
      onClick={onClose}
    >
      <div
        className="max-h-full w-full max-w-2xl overflow-y-auto rounded-3xl border border-soft bg-surface p-5 shadow-hero md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted">
              {title}
            </p>
            <h2
              id="question-detail-title"
              className="mt-3 text-xl font-black leading-snug"
            >
              {question.question}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-soft px-3 py-1 text-xs font-bold text-muted-strong transition hover:border-emerald-300/40 hover:text-foreground"
          >
            Fermer
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-soft bg-surface-strong px-5 py-4 text-foreground">
          <p className="text-base font-black">
            {result.correct
              ? "Correct: ta sélection correspond à toutes les bonnes réponses."
              : "Erreur: compare ta sélection avec les réponses attendues."}
          </p>
          <p className="mt-2 text-sm text-muted-strong">
            Cochée:{" "}
            <span className="font-black text-foreground">
              {formatAnswerKeys(selectedAnswerKeys)}
            </span>{" "}
            · Attendue:{" "}
            <span className="font-black text-foreground">
              {formatAnswerKeys(correctAnswerKeys)}
            </span>
          </p>
          {!result.correct && (
            <div className="mt-2 space-y-1 text-sm text-muted-strong">
              {missingAnswerKeys.length > 0 && (
                <p>
                  Réponse oubliée:{" "}
                  <span className="font-black text-foreground">
                    {formatAnswerKeys(missingAnswerKeys)}
                  </span>
                </p>
              )}
              {extraAnswerKeys.length > 0 && (
                <p>
                  Réponse cochée en trop:{" "}
                  <span className="font-black text-foreground">
                    {formatAnswerKeys(extraAnswerKeys)}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {answerKeys.map((key) => {
            const answer = question.answers[key];
            if (!answer) return null;

            const isSelected = selectedAnswerKeys.includes(key);
            const isCorrect = question.correctAnswers.includes(key);
            const status = getAnswerStatus({ isSelected, isCorrect });
            const cardStyle = getAnswerCardStyle({ isSelected, isCorrect });
            const keyStyle = getAnswerKeyStyle({ isSelected, isCorrect });

            return (
              <div
                key={key}
                className={`rounded-2xl border p-4 text-foreground ${cardStyle}`}
              >
                <div className="flex gap-4">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-black ${keyStyle}`}
                  >
                    {key}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug">{answer}</p>
                    {status && (
                      <span
                        className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-black uppercase tracking-widest ${getAnswerBadgeStyle(
                          { isSelected, isCorrect },
                        )}`}
                      >
                        {status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

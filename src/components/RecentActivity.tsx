"use client";

import { useEffect, useMemo, useState } from "react";
import type { AnswerKey, Question, QuestionResult } from "@/types/qcm";

export type RecentActivityItem = {
  id: string;
  question: Question | null;
  modeLabel: string;
  dateLabel: string;
  result: QuestionResult;
};

type Props = {
  items: RecentActivityItem[];
};

type SortKey = "question" | "mode" | "date" | "status";
type SortDirection = "asc" | "desc";

const columns: { key: SortKey; label: string; className?: string }[] = [
  { key: "question", label: "N°" },
  { key: "mode", label: "Type" },
  { key: "date", label: "Date" },
  { key: "status", label: "Résultat", className: "text-right" },
];

function getQuestionNumber(item: RecentActivityItem) {
  return item.question?.sourceQuestionId ?? Number.MAX_SAFE_INTEGER;
}

function getModeTag(item: RecentActivityItem) {
  if (item.question?.tags.includes("examen")) return "Examen";
  if (item.modeLabel.toLowerCase().includes("examen")) return "Examen";
  return "Entraînement";
}

function getAnsweredTime(item: RecentActivityItem) {
  const date = new Date(item.result.answeredAt ?? 0).getTime();
  return Number.isNaN(date) ? 0 : date;
}

function formatRecentDate(value: string | undefined) {
  if (!value) return "Pas encore";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Pas encore";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

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

export function RecentActivity({ items }: Props) {
  const [activeItem, setActiveItem] = useState<RecentActivityItem | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  }>({ key: "date", direction: "desc" });
  const question = activeItem?.question;
  const answerKeys = question
    ? (Object.keys(question.answers) as AnswerKey[])
    : [];
  const selectedAnswerKeys = activeItem?.result.selectedAnswers ?? [];
  const correctAnswerKeys = question?.correctAnswers ?? [];
  const missingAnswerKeys = correctAnswerKeys.filter(
    (key) => !selectedAnswerKeys.includes(key),
  );
  const extraAnswerKeys = selectedAnswerKeys.filter(
    (key) => !correctAnswerKeys.includes(key),
  );
  const sortedItems = useMemo(() => {
    const direction = sortConfig.direction === "asc" ? 1 : -1;

    return [...items].sort((a, b) => {
      let comparison = 0;

      if (sortConfig.key === "question") {
        comparison = getQuestionNumber(a) - getQuestionNumber(b);
      }

      if (sortConfig.key === "mode") {
        comparison = getModeTag(a).localeCompare(getModeTag(b), "fr");
      }

      if (sortConfig.key === "date") {
        comparison = getAnsweredTime(a) - getAnsweredTime(b);
      }

      if (sortConfig.key === "status") {
        comparison = Number(a.result.correct) - Number(b.result.correct);
      }

      return comparison * direction;
    });
  }, [items, sortConfig]);

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  useEffect(() => {
    if (!activeItem) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveItem(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItem]);

  return (
    <section className="rounded-3xl border border-soft bg-surface p-6 shadow-hero">
      <p className="text-xs uppercase tracking-[0.25em] text-muted">
        Activité récente
      </p>
      <div className="mt-4 overflow-x-auto">
        {items.length ? (
          <div className="min-w-lg overflow-hidden rounded-2xl border border-soft">
            <div className="grid grid-cols-[0.7fr_1fr_1.2fr_0.8fr] bg-surface px-4 py-3 text-xs font-black uppercase tracking-widest text-muted">
              {columns.map((column) => (
                <button
                  key={column.key}
                  type="button"
                  onClick={() => handleSort(column.key)}
                  className={`text-left transition hover:text-foreground ${column.className ?? ""}`}
                >
                  {column.label}
                  {sortConfig.key === column.key && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="divide-y divide-recessed">
              {sortedItems.map((item) => {
                const content = (
                  <>
                    <span className="font-mono text-sm font-black">
                      {item.question?.sourceQuestionId ?? "?"}
                    </span>
                    <span className="text-sm font-semibold">
                      {getModeTag(item)}
                    </span>
                    <span className="text-xs text-muted">
                      {formatRecentDate(item.result.answeredAt)}
                    </span>
                    <span
                      className={`text-right text-xs font-black ${
                        item.result.correct
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {item.result.correct ? "Correct" : "Erreur"}
                    </span>
                  </>
                );

                if (!item.question) {
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[0.7fr_1fr_1.2fr_0.8fr] items-center gap-3 bg-surface-veil px-4 py-3"
                    >
                      {content}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveItem(item)}
                    className="grid w-full grid-cols-[0.7fr_1fr_1.2fr_0.8fr] items-center gap-3 bg-surface-veil px-4 py-3 text-left transition hover:bg-surface-strong focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-300/40"
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="rounded-2xl border border-soft bg-surface-veil p-4 text-sm text-muted">
            Lance un entraînement pour commencer à construire tes stats.
          </p>
        )}
      </div>

      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="recent-question-title"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="max-h-full w-full max-w-2xl overflow-y-auto rounded-3xl border border-soft bg-surface p-5 shadow-hero md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted">
                  {getModeTag(activeItem)} · Question n°
                  {question?.sourceQuestionId ?? "?"} ·{" "}
                  {formatRecentDate(activeItem.result.answeredAt)}
                </p>
                <h2
                  id="recent-question-title"
                  className="mt-3 text-xl font-black leading-snug"
                >
                  {question?.question ?? "Question introuvable"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="rounded-full border border-soft px-3 py-1 text-xs font-bold text-muted-strong transition hover:border-emerald-300/40 hover:text-foreground"
              >
                Fermer
              </button>
            </div>

            {question ? (
              <>
                <div className="mt-5 rounded-2xl border border-soft bg-surface-strong px-5 py-4 text-foreground">
                  <p className="text-base font-black">
                    {activeItem.result.correct
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
                  {!activeItem.result.correct && (
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
                    const cardStyle = getAnswerCardStyle({
                      isSelected,
                      isCorrect,
                    });
                    const keyStyle = getAnswerKeyStyle({
                      isSelected,
                      isCorrect,
                    });

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
                                  {
                                    isSelected,
                                    isCorrect,
                                  },
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
              </>
            ) : (
              <p className="mt-5 rounded-2xl border border-soft bg-surface-veil p-4 text-sm text-muted">
                Cette question n'est plus disponible dans la banque actuelle.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

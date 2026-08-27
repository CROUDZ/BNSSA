"use client";

import { useMemo, useState } from "react";
import type { Question, QuestionResult } from "@/types/qcm";
import { QuestionDetailModal } from "@/components/QuestionDetailModal";

export type RecentActivityItem = {
  id: string;
  question: Question | null;
  modeLabel: string;
  dateLabel: string;
  result: QuestionResult;
};

type Props = {
  recentItems: RecentActivityItem[];
  allItems: RecentActivityItem[];
};

type SortKey = "question" | "mode" | "date" | "status";
type SortDirection = "asc" | "desc";

const PAGE_SIZE = 40;

const columns: { key: SortKey; label: string; className?: string }[] = [
  { key: "question", label: "N°" },
  { key: "mode", label: "Type" },
  { key: "date", label: "Date" },
  { key: "status", label: "Résultat", className: "text-right" },
];

function getQuestionNumber(item: RecentActivityItem) {
  return parseInt(item.question?.id ?? "0", 10) || Number.MAX_SAFE_INTEGER;
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

function sortItems(
  items: RecentActivityItem[],
  sortConfig: { key: SortKey; direction: SortDirection },
) {
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
}

export function RecentActivity({ recentItems, allItems }: Props) {
  const [activeItem, setActiveItem] = useState<RecentActivityItem | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  }>({ key: "date", direction: "desc" });

  const baseItems = showAll ? allItems : recentItems;
  const sortedItems = useMemo(
    () => sortItems(baseItems, sortConfig),
    [baseItems, sortConfig],
  );
  const totalPages = showAll
    ? Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE))
    : 1;
  const currentPage = Math.min(page, totalPages);
  const pageItems = showAll
    ? sortedItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : sortedItems;

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const toggleShowAll = () => {
    setShowAll((current) => !current);
    setPage(1);
  };

  return (
    <section className="rounded-3xl border border-soft bg-surface p-6 shadow-hero">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">
          {showAll ? "Toutes mes questions" : "Activité récente"}
        </p>
        {allItems.length > recentItems.length && (
          <button
            type="button"
            onClick={toggleShowAll}
            className="rounded-full border border-soft px-3 py-1 text-xs font-bold text-muted-strong transition hover:border-emerald-300/40 hover:text-foreground"
          >
            {showAll
              ? "Revenir à l'activité récente"
              : `Voir toutes mes questions (${allItems.length})`}
          </button>
        )}
      </div>
      <div className="mt-4 overflow-x-auto">
        {pageItems.length ? (
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
              {pageItems.map((item) => {
                const content = (
                  <>
                    <span className="font-mono text-sm font-black">
                      {item.question?.id ?? "?"}
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

      {showAll && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="rounded-full border border-soft px-3 py-1 text-xs font-bold text-muted-strong transition hover:border-emerald-300/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Précédent
          </button>
          <p className="text-xs text-muted">
            Page {currentPage} / {totalPages}
          </p>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="rounded-full border border-soft px-3 py-1 text-xs font-bold text-muted-strong transition hover:border-emerald-300/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      )}

      {activeItem && activeItem.question && (
        <QuestionDetailModal
          question={activeItem.question}
          result={activeItem.result}
          title={`${getModeTag(activeItem)} · Question n°${activeItem.question.id} · ${formatRecentDate(activeItem.result.answeredAt)}`}
          onClose={() => setActiveItem(null)}
        />
      )}
    </section>
  );
}

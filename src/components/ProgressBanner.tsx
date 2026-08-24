"use client";

import type { SessionData } from "@/types/qcm";
import { EXAM_QCM_ID, TRAINING_QCM_ID } from "@/lib/qcmModes";

type Props = {
  session: SessionData;
  onClearAll: () => void;
};

export function ProgressBanner({ session, onClearAll }: Props) {
  const trainingProgress = session[TRAINING_QCM_ID];
  const examProgress = session[EXAM_QCM_ID];
  const attempts = trainingProgress?.results.length ?? 0;
  const examPct = examProgress?.completedAt
    ? Math.round((examProgress.score / examProgress.total) * 100)
    : null;

  if (attempts === 0 && examPct === null) return null;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-8">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Entraînement
          </p>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {attempts}
            <span className="ml-1 text-sm font-medium text-muted-foreground">réponses</span>
          </p>
        </div>
        {examPct !== null && (
          <>
            <div className="hidden h-10 w-px bg-border sm:block" />
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Dernier examen
              </p>
              <p
                className={`text-2xl font-bold tracking-tight ${
                  examPct >= 75 ? "text-success" : "text-destructive"
                }`}
              >
                {examPct}%
              </p>
            </div>
          </>
        )}
      </div>
      <button
        onClick={onClearAll}
        className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        Tout réinitialiser
      </button>
    </div>
  );
}

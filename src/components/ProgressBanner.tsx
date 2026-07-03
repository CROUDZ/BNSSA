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
    <div className="flex flex-col gap-4 rounded-3xl border border-soft bg-surface-veil px-6 py-5 shadow-hero backdrop-blur md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            Entraînement
          </p>
          <p className="text-lg font-black text-foreground">
            {attempts}
            <span className="text-muted-strong"> réponses</span>
          </p>
        </div>
        {examPct !== null && (
          <>
            <div className="hidden h-10 w-px bg-border sm:block" />
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">
                Dernier examen
              </p>
              <p
                className={`text-lg font-black ${
                  examPct >= 75 ? "text-emerald-300" : "text-rose-300"
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
        className="rounded-xl border border-soft bg-surface px-4 py-2 text-xs font-semibold text-muted transition hover:border-emerald-300/40 hover:text-foreground"
      >
        Tout réinitialiser
      </button>
    </div>
  );
}

"use client";

import type { SessionData } from "@/types/qcm";
import type { QcmData } from "@/types/qcm";

type Props = {
  session: SessionData;
  quizzes: QcmData[];
  onClearAll: () => void;
};

export function ProgressBanner({ session, quizzes, onClearAll }: Props) {
  const completed = Object.values(session).filter((p) => p.completedAt).length;
  const total = quizzes.length;
  if (completed === 0) return null;

  const allScores = Object.values(session)
    .filter((p) => p.completedAt)
    .map((p) => Math.round((p.score / p.total) * 100));
  const avg = Math.round(
    allScores.reduce((a, b) => a + b, 0) / allScores.length,
  );

  return (
    <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-soft bg-surface-veil px-6 py-5 shadow-hero backdrop-blur md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            Progression
          </p>
          <p className="text-lg font-black text-slate-100">
            {completed}
            <span className="text-slate-400">/{total} QCM</span>
          </p>
        </div>
        <div className="hidden h-10 w-px bg-white/10 sm:block" />
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            Moyenne
          </p>
          <p
            className={`text-lg font-black ${
              avg >= 75 ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {avg}%
          </p>
        </div>
      </div>
      <button
        onClick={onClearAll}
        className="rounded-xl border border-soft bg-surface px-4 py-2 text-xs font-semibold text-muted transition hover:border-emerald-300/40 hover:text-slate-100"
      >
        Tout réinitialiser
      </button>
    </div>
  );
}

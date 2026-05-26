"use client";

import { m } from "framer-motion";
import type { QcmData } from "@/types/qcm";
import type { QcmProgress } from "@/types/qcm";

type Props = {
  quiz: QcmData;
  progress: QcmProgress | null;
  onStart: (mode: "all" | "retry" | "exam") => void;
  onReset: () => void;
};

export function QcmCard({ quiz, progress, onStart, onReset }: Props) {
  const isCompleted = !!progress?.completedAt;
  const hasWrong = isCompleted && progress.results.some((r) => !r.correct);
  const pct = isCompleted
    ? Math.round((progress.score / progress.total) * 100)
    : null;
  const passed = pct !== null && pct >= 75;

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-soft bg-surface p-6 shadow-hero transition hover:-translate-y-1 hover:shadow-glow"
    >
      {/* accent top bar */}
      <div
        className={`absolute inset-x-0 top-0 h-1 rounded-t-3xl ${
          isCompleted
            ? passed
              ? "bg-linear-to-r from-emerald-400 via-teal-300 to-amber-300"
              : "bg-linear-to-r from-rose-400 to-amber-300"
            : "bg-slate-700/80"
        }`}
      />

      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full border border-soft bg-surface-veil px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted">
          {quiz.questions.length} questions
        </span>
        <span className="text-xs font-mono text-slate-400">#{quiz.id}</span>
      </div>

      <h2 className="font-display text-2xl font-black tracking-tight">
        {quiz.title}
      </h2>
      <p className="mt-1 text-sm text-muted">{quiz.description}</p>

      {isCompleted && pct !== null && (
        <div className="mt-5">
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-xs text-muted">Score</span>
            <span
              className={`text-sm font-bold ${passed ? "text-emerald-300" : "text-rose-300"}`}
            >
              {progress.score}/{progress.total} — {pct}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
            <div
              className={`h-full rounded-full transition-all ${
                passed ? "bg-emerald-300" : "bg-rose-300"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <m.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onStart("all")}
          className="w-full rounded-2xl bg-emerald-300 px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-emerald-200"
        >
          {isCompleted ? "Recommencer" : "Commencer"}
        </m.button>

        <m.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onStart("exam")}
          className="w-full rounded-2xl border border-soft px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-300/40 hover:text-white"
        >
          Mode examen
        </m.button>

        {isCompleted && hasWrong && (
          <m.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onStart("retry")}
            className="w-full rounded-2xl border border-soft px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-rose-300/40 hover:text-white"
          >
            Revoir les erreurs
            <span className="ml-2 rounded-full bg-rose-500/20 px-2 py-0.5 text-xs text-rose-200">
              {progress.results.filter((r) => !r.correct).length}
            </span>
          </m.button>
        )}

        {isCompleted && (
          <button
            onClick={onReset}
            className="w-full rounded-2xl border border-soft px-4 py-2.5 text-xs text-muted transition hover:border-white/20 hover:text-slate-200"
          >
            Réinitialiser ce QCM
          </button>
        )}
      </div>
    </m.div>
  );
}

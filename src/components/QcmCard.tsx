'use client';

import { m } from 'framer-motion';
import type { QcmData } from '@/types/qcm';
import type { QcmProgress } from '@/types/qcm';

type Props = {
  quiz: QcmData;
  progress: QcmProgress | null;
  onStart: (mode: 'all' | 'retry' | 'exam') => void;
  onReset: () => void;
};

export function QcmCard({ quiz, progress, onStart, onReset }: Props) {
  const isCompleted = !!progress?.completedAt;
  const hasWrong =
    isCompleted && progress.results.some((r) => !r.correct);
  const pct = isCompleted
    ? Math.round((progress.score / progress.total) * 100)
    : null;
  const passed = pct !== null && pct >= 75;

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col rounded-3xl border border-zinc-800 bg-zinc-900 p-6 overflow-hidden"
    >
      {/* accent top bar */}
      <div
        className={`absolute inset-x-0 top-0 h-1 rounded-t-3xl ${
          isCompleted
            ? passed
              ? 'bg-emerald-500'
              : 'bg-red-500'
            : 'bg-zinc-700'
        }`}
      />

      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold tracking-widest text-zinc-400 uppercase">
          {quiz.questions.length} questions
        </span>
        <span className="text-xs text-zinc-600 font-mono">#{quiz.id}</span>
      </div>

      <h2 className="text-2xl font-black tracking-tight">{quiz.title}</h2>
      <p className="mt-1 text-sm text-zinc-500">{quiz.description}</p>

      {isCompleted && pct !== null && (
        <div className="mt-5">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs text-zinc-500">Score</span>
            <span
              className={`text-sm font-bold ${passed ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {progress.score}/{progress.total} — {pct}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all ${passed ? 'bg-emerald-500' : 'bg-red-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-auto pt-6 flex flex-col gap-3">
        <m.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onStart('all')}
          className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
        >
          {isCompleted ? 'Recommencer' : 'Commencer'}
        </m.button>

        <m.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onStart('exam')}
          className="w-full rounded-2xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
        >
          Mode examen
        </m.button>

        {isCompleted && hasWrong && (
          <m.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onStart('retry')}
            className="w-full rounded-2xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
          >
            Revoir les erreurs
            <span className="ml-2 rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
              {progress.results.filter((r) => !r.correct).length}
            </span>
          </m.button>
        )}

        {isCompleted && (
          <button
            onClick={onReset}
            className="w-full rounded-2xl border border-zinc-800 px-4 py-2.5 text-xs text-zinc-500 transition hover:border-zinc-600 hover:text-zinc-300"
          >
            Réinitialiser ce QCM
          </button>
        )}
      </div>
    </m.div>
  );
}

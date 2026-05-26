'use client';

import type { SessionData } from '@/types/qcm';
import type { QcmData } from '@/types/qcm';

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
  const avg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);

  return (
    <div className="mb-8 flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 px-5 py-4 backdrop-blur">
      <div className="flex items-center gap-6">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Progression</p>
          <p className="text-lg font-black">
            {completed}
            <span className="text-zinc-600">/{total} QCM</span>
          </p>
        </div>
        <div className="h-10 w-px bg-zinc-800" />
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Moyenne</p>
          <p
            className={`text-lg font-black ${
              avg >= 75 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {avg}%
          </p>
        </div>
      </div>
      <button
        onClick={onClearAll}
        className="rounded-xl border border-zinc-800 px-3 py-2 text-xs text-zinc-500 transition hover:border-zinc-600 hover:text-zinc-300"
      >
        Tout réinitialiser
      </button>
    </div>
  );
}

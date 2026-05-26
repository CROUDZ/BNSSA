"use client";

import { m } from "framer-motion";
import type { QcmData, QuestionResult } from "@/types/qcm";

type Props = {
  quiz: QcmData;
  results: QuestionResult[];
  onRetry: () => void;
  onRetryWrong: () => void;
  onHome: () => void;
};

export function ResultsScreen({
  quiz,
  results,
  onRetry,
  onRetryWrong,
  onHome,
}: Props) {
  const score = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 75;
  const wrongCount = results.filter((r) => !r.correct).length;

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-white">
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
      >
        {/* Score circle */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div
            className={`flex h-36 w-36 items-center justify-center rounded-full border-4 ${
              passed ? "border-emerald-500" : "border-red-500"
            }`}
          >
            <div>
              <div className="text-5xl font-black">{pct}%</div>
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-black">
            {passed ? "✓ Réussi !" : "✗ Insuffisant"}
          </h1>
          <p className="mt-2 text-zinc-400">
            {score}/{total} bonnes réponses sur {quiz.title}
          </p>
          <p
            className={`mt-1 text-sm font-semibold ${passed ? "text-emerald-400" : "text-red-400"}`}
          >
            {passed ? "Seuil de 75% atteint" : "Seuil de 75% non atteint"}
          </p>
        </div>

        {/* Per-question breakdown */}
        <div className="mb-6 rounded-3xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800 overflow-hidden">
          {results.map((r, i) => (
            <div
              key={r.questionId}
              className="flex items-center justify-between px-5 py-3"
            >
              <span className="text-sm text-zinc-400">Q{i + 1}</span>
              <span
                className={`text-xs font-bold ${r.correct ? "text-emerald-400" : "text-red-400"}`}
              >
                {r.correct ? "✓ Correct" : "✗ Incorrect"}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {wrongCount > 0 && (
            <button
              onClick={onRetryWrong}
              className="w-full rounded-2xl bg-white px-5 py-4 font-bold text-black transition hover:bg-zinc-200"
            >
              Revoir les {wrongCount} erreur{wrongCount > 1 ? "s" : ""}
            </button>
          )}
          <button
            onClick={onRetry}
            className="w-full rounded-2xl border border-zinc-700 px-5 py-4 font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
          >
            Tout recommencer
          </button>
          <button
            onClick={onHome}
            className="w-full rounded-2xl px-5 py-4 text-sm text-zinc-500 transition hover:text-zinc-300"
          >
            ← Retour aux QCM
          </button>
        </div>
      </m.div>
    </main>
  );
}

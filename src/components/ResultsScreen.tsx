"use client";

import { m } from "framer-motion";
import type { QcmData, QuestionResult } from "@/types/qcm";
import { FaCheckCircle, FaTimesCircle, FaArrowLeft } from "react-icons/fa";

type Props = {
  quiz: QcmData;
  results: QuestionResult[];
  onRetry: () => void;
  onHome: () => void;
};

export function ResultsScreen({ results, onRetry, onHome }: Props) {
  const score = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 75;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg space-y-8"
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`relative flex h-32 w-32 items-center justify-center rounded-full border-8 ${
              passed ? "border-success" : "border-destructive"
            }`}
          >
            <div className="text-4xl font-extrabold tracking-tight">{pct}%</div>
            <div className="absolute -bottom-2 -right-2 rounded-full bg-background p-1">
              {passed ? (
                <FaCheckCircle className="h-8 w-8 text-success" />
              ) : (
                <FaTimesCircle className="h-8 w-8 text-destructive" />
              )}
            </div>
          </div>
          
          <div className="mt-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {passed ? "Examen réussi" : "Examen échoué"}
            </h1>
            <p className="text-muted-foreground">
              Vous avez répondu correctement à {score} questions sur {total}.
            </p>
            <p
              className={`text-sm font-medium ${passed ? "text-success" : "text-destructive"}`}
            >
              {passed ? "Seuil de 75% atteint" : "Le seuil de 75% n'a pas été atteint"}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border bg-muted/50 px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Détail des résultats</h2>
          </div>
          <div className="divide-y divide-border">
            {results.map((r, i) => (
              <div
                key={r.questionId}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="text-sm font-medium text-foreground">Question {i + 1}</span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${r.correct ? "text-success" : "text-destructive"}`}
                >
                  {r.correct ? (
                    <><FaCheckCircle /> Correct</>
                  ) : (
                    <><FaTimesCircle /> Incorrect</>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-8 font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Refaire l'examen
          </button>
          <button
            onClick={onHome}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-8 font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <FaArrowLeft className="h-3 w-3" />
            Retour à l'accueil
          </button>
        </div>
      </m.div>
    </main>
  );
}

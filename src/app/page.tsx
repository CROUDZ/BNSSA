"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { useQcmSession } from "@/hooks/useQcmSession";
import { QcmCard } from "@/components/QcmCard";
import { ProgressBanner } from "@/components/ProgressBanner";
import { QuizSession } from "@/components/QuizSession";
import { ResultsScreen } from "@/components/ResultsScreen";
import { qcm1 } from "@/data/qcm1";
import { qcm2 } from "@/data/qcm2";
import { qcm3 } from "@/data/qcm3";
import { qcm4 } from "@/data/qcm4";
import type { QcmData, QuestionResult } from "@/types/qcm";

const quizzes: QcmData[] = [
  {
    id: 1,
    title: "QCM 1",
    description: "Connaissance du milieu · Diplômes · Organisation",
    questions: qcm1,
  },
  {
    id: 2,
    title: "QCM 2",
    description: "Milieu · Compétences · Contexte juridique",
    questions: qcm2,
  },
  {
    id: 3,
    title: "QCM 3",
    description: "Réglementation · Surveillance · Secourisme",
    questions: qcm3,
  },
  {
    id: 4,
    title: "QCM 4",
    description: "Milieu · Administration · Activités spécifiques",
    questions: qcm4,
  },
];

type ActiveSession = {
  quiz: QcmData;
  mode: "all" | "retry" | "exam";
};

type Screen = "home" | "quiz" | "results";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

export default function HomePage() {
  const organization: Record<string, unknown> = {
    "@type": "Organization",
    name: "BNSSA QCM",
    description:
      "Site cree pour reviser le BNSSA avec la FNMNS. Les 4 QCM sont ceux de l'examen officiel FNMNS du BNSSA.",
  };
  const website: Record<string, unknown> = {
    "@type": "WebSite",
    name: "BNSSA QCM",
    inLanguage: "fr-FR",
  };

  if (siteUrl) {
    organization.url = siteUrl;
    website.url = siteUrl;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organization, website],
  };

  const { session, getProgress, saveProgress, clearProgress, clearAll } =
    useQcmSession();
  const [screen, setScreen] = useState<Screen>("home");
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(
    null,
  );
  const [pendingResults, setPendingResults] = useState<QuestionResult[]>([]);

  const handleStart = (quiz: QcmData, mode: "all" | "retry" | "exam") => {
    if (mode === "all" || mode === "exam") {
      clearProgress(quiz.id);
    }
    setActiveSession({ quiz, mode });
    setScreen("quiz");
  };

  const handleComplete = (results: QuestionResult[]) => {
    if (!activeSession) return;

    const { quiz, mode } = activeSession;
    const existing = getProgress(quiz.id);

    // Merge retry results with previous full run if applicable
    let allResults: QuestionResult[];
    if (mode === "retry" && existing) {
      // replace only the retried questions
      allResults = existing.results.map(
        (r) => results.find((nr) => nr.questionId === r.questionId) ?? r,
      );
    } else {
      allResults = results;
    }

    const score = allResults.filter((r) => r.correct).length;

    saveProgress({
      qcmId: quiz.id,
      results: allResults,
      completedAt: new Date().toISOString(),
      score,
      total: quiz.questions.length,
    });

    setPendingResults(results); // show only current run in results screen
    setScreen("results");
  };

  const handleHome = () => {
    setScreen("home");
    setActiveSession(null);
    setPendingResults([]);
  };

  const handleRetry = () => {
    if (!activeSession) return;
    clearProgress(activeSession.quiz.id);
    setActiveSession({
      quiz: activeSession.quiz,
      mode: activeSession.mode === "exam" ? "exam" : "all",
    });
    setPendingResults([]);
    setScreen("quiz");
  };

  const handleRetryWrong = () => {
    if (!activeSession) return;
    setActiveSession({ quiz: activeSession.quiz, mode: "retry" });
    setPendingResults([]);
    setScreen("quiz");
  };

  // ── Quiz screen ────────────────────────────────────────────────────
  if (screen === "quiz" && activeSession) {
    const wrongIds =
      activeSession.mode === "retry"
        ? (getProgress(activeSession.quiz.id)?.results ?? [])
            .filter((r) => !r.correct)
            .map((r) => r.questionId)
        : undefined;

    return (
      <QuizSession
        quiz={activeSession.quiz}
        questionIds={wrongIds}
        mode={activeSession.mode}
        revealAnswers={activeSession.mode !== "exam"}
        onComplete={handleComplete}
        onBack={handleHome}
      />
    );
  }

  // ── Results screen ─────────────────────────────────────────────────
  if (screen === "results" && activeSession) {
    return (
      <ResultsScreen
        quiz={activeSession.quiz}
        results={pendingResults}
        onRetry={handleRetry}
        onRetryWrong={handleRetryWrong}
        onHome={handleHome}
      />
    );
  }

  // ── Home screen ────────────────────────────────────────────────────
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="relative min-h-screen overflow-hidden bg-hero text-foreground">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-105 w-105 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-[140px]" />
        <div className="pointer-events-none absolute top-24 right-30 h-90 w-90 rounded-full bg-amber-300/20 blur-[130px]" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-14 pt-10 md:px-6">
          <m.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-veil px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-muted">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              FNMNS · QCM officiels
            </div>

            <div className="max-w-3xl">
              <h1 className="font-display text-4xl leading-none md:text-6xl">
                QCM officiels
                <br />
                <span className="text-accent">BNSSA</span> (FNMNS)
              </h1>
              <p className="mt-4 text-base text-muted md:text-lg">
                Site créé pour réviser le BNSSA avec la FNMNS. Les 4 QCM sont
                ceux de l'examen officiel FNMNS du BNSSA.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full border border-soft bg-surface-veil px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
                  {quizzes.length} QCM
                </span>
                <span className="rounded-full border border-soft bg-surface-veil px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
                  100 questions
                </span>
                <span className="rounded-full border border-soft bg-surface-veil px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
                  Seuil 75%
                </span>
                <span className="rounded-full border border-soft bg-surface-veil px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
                  3 modes
                </span>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#qcm-grid"
                  className="rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-slate-900 shadow-glow transition hover:bg-emerald-200"
                >
                  Choisir un QCM
                </a>
                <div className="rounded-2xl border border-soft bg-surface-veil px-4 py-3 text-xs text-muted">
                  Sauvegarde locale automatique
                </div>
              </div>
            </div>
          </m.div>

          <section id="qcm-grid" className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">
                  Choix rapide
                </p>
                <h2 className="mt-2 font-display text-3xl">Choisis ton QCM</h2>
                <p className="mt-2 text-sm text-muted">
                  Clique et lance une session.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-veil px-3 py-1 text-xs text-muted">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Reprise automatique de ta progression
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {quizzes.map((quiz, i) => (
                <m.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <QcmCard
                    quiz={quiz}
                    progress={getProgress(quiz.id)}
                    onStart={(mode) => handleStart(quiz, mode)}
                    onReset={() => clearProgress(quiz.id)}
                  />
                </m.div>
              ))}
            </div>
          </section>
          <ProgressBanner
            session={session}
            quizzes={quizzes}
            onClearAll={clearAll}
          />
        </div>
      </main>
    </>
  );
}

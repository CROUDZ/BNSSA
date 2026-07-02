"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import { ProgressBanner } from "@/components/ProgressBanner";
import { QuizSession } from "@/components/QuizSession";
import { ResultsScreen } from "@/components/ResultsScreen";
import examQuestions from "@/data/exam.json";
import trainingQuestions from "@/data/training.json";
import { useQcmSession } from "@/hooks/useQcmSession";
import type { QcmData, Question, QuestionResult } from "@/types/qcm";

const TRAINING_QCM_ID = 1;
const EXAM_QCM_ID = 2;

const examBank = examQuestions as Question[];
const trainingBank = trainingQuestions as Question[];

const trainingQuiz: QcmData = {
  id: TRAINING_QCM_ID,
  title: "Entraînement",
  description: "Questions aléatoires avec correction immédiate",
  questions: [
    ...trainingBank,
    ...examBank.map((question) => ({
      ...question,
      tags: [...new Set([...question.tags, "examen"])],
    })),
  ],
};

const examQuiz: QcmData = {
  id: EXAM_QCM_ID,
  title: "QCM d'examen",
  description: "Le QCM 4 conservé comme véritable examen",
  questions: examBank,
};

type ActiveSession = {
  quiz: QcmData;
  mode: "training" | "exam" | "review";
};

type Screen = "home" | "quiz" | "results";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

export default function HomePage() {
  const organization: Record<string, unknown> = {
    "@type": "Organization",
    name: "BNSSA QCM",
    description:
      "Site cree pour reviser le BNSSA avec un entrainement infini et un QCM d'examen officiel FNMNS.",
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
  const autoStartRef = useRef(false);

  const trainingProgress = getProgress(TRAINING_QCM_ID);
  const examProgress = getProgress(EXAM_QCM_ID);

  const startTraining = useCallback(() => {
    setActiveSession({ quiz: trainingQuiz, mode: "training" });
    setPendingResults([]);
    setScreen("quiz");
  }, []);

  const startFailedReview = useCallback(
    (questionIds: string[]) => {
      const questions = questionIds
        .map((id) =>
          trainingQuiz.questions.find((question) => question.id === id),
        )
        .filter((question): question is Question => Boolean(question));

      if (!questions.length) {
        startTraining();
        return;
      }

      setActiveSession({
        quiz: {
          ...trainingQuiz,
          title: "Révision des erreurs",
          description: "Questions échouées à retravailler",
          questions,
        },
        mode: "review",
      });
      setPendingResults([]);
      setScreen("quiz");
    },
    [startTraining],
  );

  useEffect(() => {
    const handleStartTraining = () => startTraining();

    window.addEventListener("bnssa:start-training", handleStartTraining);

    if (!autoStartRef.current) {
      autoStartRef.current = true;
      const params = new URLSearchParams(window.location.search);

      if (params.get("review") === "failed") {
        startFailedReview(
          (params.get("ids") ?? "")
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean),
        );
      } else if (params.get("start") === "training") {
        startTraining();
      }
    }

    return () =>
      window.removeEventListener("bnssa:start-training", handleStartTraining);
  }, [startFailedReview, startTraining]);

  const startExam = () => {
    clearProgress(EXAM_QCM_ID);
    setActiveSession({ quiz: examQuiz, mode: "exam" });
    setPendingResults([]);
    setScreen("quiz");
  };

  const handleTrainingAnswer = (
    result: QuestionResult,
    answeredQuestionIds: string[],
  ) => {
    const existing = getProgress(TRAINING_QCM_ID);
    const results = [...(existing?.results ?? []), result];

    saveProgress({
      qcmId: TRAINING_QCM_ID,
      results,
      answeredQuestionIds,
      completedAt: null,
      score: results.filter((item) => item.correct).length,
      total: trainingQuiz.questions.length,
    });
  };

  const handleComplete = (results: QuestionResult[]) => {
    if (!activeSession) return;

    const score = results.filter((result) => result.correct).length;

    if (activeSession.mode === "review") {
      setPendingResults(results);
      setScreen("results");
      return;
    }

    saveProgress({
      qcmId: activeSession.quiz.id,
      results,
      answeredQuestionIds: results.map((result) => result.questionId),
      completedAt: new Date().toISOString(),
      score,
      total: activeSession.quiz.questions.length,
    });

    setPendingResults(results);
    setScreen("results");
  };

  const handleHome = () => {
    setScreen("home");
    setActiveSession(null);
    setPendingResults([]);
  };

  if (screen === "quiz" && activeSession) {
    return (
      <QuizSession
        quiz={activeSession.quiz}
        mode={activeSession.mode}
        initialProgress={
          activeSession.mode === "training" ? trainingProgress : null
        }
        revealAnswers={activeSession.mode !== "exam"}
        onAnswer={handleTrainingAnswer}
        onComplete={handleComplete}
        onBack={handleHome}
      />
    );
  }

  if (screen === "results" && activeSession) {
    return (
      <ResultsScreen
        quiz={activeSession.quiz}
        results={pendingResults}
        onRetry={
          activeSession.mode === "exam"
            ? startExam
            : () =>
                startFailedReview(
                  activeSession.quiz.questions.map((question) => question.id),
                )
        }
        onHome={handleHome}
      />
    );
  }

  const trainingAttemptCount = trainingProgress?.results.length ?? 0;
  const examPct = examProgress?.completedAt
    ? Math.round((examProgress.score / examProgress.total) * 100)
    : null;

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
              BNSSA · Entraînement et examen
            </div>

            <div className="max-w-3xl">
              <h1 className="font-display text-4xl leading-none md:text-6xl">
                QCM BNSSA
                <br />
                <span className="text-accent">entraînement infini</span>
              </h1>
              <p className="mt-4 text-base text-muted md:text-lg">
                Une banque d'entraînement aléatoire pour réviser à ton rythme.
                Le QCM 4 reste disponible comme examen officiel.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full border border-soft bg-surface-veil px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
                  {trainingQuiz.questions.length} questions en entraînement
                </span>
                <span className="rounded-full border border-soft bg-surface-veil px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
                  {examQuiz.questions.length} questions examen
                </span>
                <span className="rounded-full border border-soft bg-surface-veil px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
                  Sauvegarde si connecté
                </span>
              </div>
            </div>
          </m.div>

          <section className="grid gap-5 lg:grid-cols-2">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col rounded-3xl border border-soft bg-surface p-6 shadow-hero"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full border border-soft bg-surface-veil px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted">
                  Mode principal
                </span>
              </div>
              <h2 className="font-display text-3xl font-black">Entraînement</h2>
              <p className="mt-2 text-sm text-muted">
                Les questions sortent dans un ordre aléatoire, avec correction
                immédiate après validation.
              </p>
              {trainingAttemptCount > 0 && (
                <p className="mt-5 rounded-2xl border border-soft bg-surface-veil px-4 py-3 text-sm text-muted">
                  {trainingAttemptCount} réponse
                  {trainingAttemptCount > 1 ? "s" : ""} enregistrée
                  {trainingAttemptCount > 1 ? "s" : ""}.
                </p>
              )}
              <button
                onClick={startTraining}
                className="mt-auto w-full rounded-2xl bg-emerald-300 px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-emerald-200"
              >
                Lancer l'entraînement
              </button>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 }}
              className="flex flex-col rounded-3xl border border-soft bg-surface p-6 shadow-hero"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full border border-amber-300/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-200">
                  Examen
                </span>
                <span className="font-mono text-xs text-muted-strong">
                  QCM 4
                </span>
              </div>
              <h2 className="font-display text-3xl font-black">QCM d'examen</h2>
              <p className="mt-2 text-sm text-muted">
                Le vrai QCM d'examen est conservé séparément, sans correction
                immédiate, avec résultat final.
              </p>
              {examPct !== null && (
                <p className="mt-5 rounded-2xl border border-soft bg-surface-veil px-4 py-3 text-sm text-muted">
                  Dernier score:{" "}
                  <span className="font-bold text-foreground">{examPct}%</span>
                </p>
              )}
              <button
                onClick={startExam}
                className="mt-auto w-full rounded-2xl border border-soft px-4 py-3 text-sm font-semibold text-foreground transition hover:border-emerald-300/40"
              >
                Lancer l'examen
              </button>
            </m.div>
          </section>

          <ProgressBanner session={session} onClearAll={clearAll} />
        </div>
      </main>
    </>
  );
}

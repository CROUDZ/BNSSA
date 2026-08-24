"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import { ProgressBanner } from "@/components/ProgressBanner";
import { QuizSession } from "@/components/QuizSession";
import { ResultsScreen } from "@/components/ResultsScreen";
import examQuestions from "@/data/exam.json";
import trainingQuestions from "@/data/training.json";
import { useQcmSession } from "@/hooks/useQcmSession";
import { EXAM_QCM_ID, TRAINING_QCM_ID } from "@/lib/qcmModes";
import type { QcmData, Question, QuestionResult } from "@/types/qcm";

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
  description: "Questions d'examen conservées séparément",
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

  const examPct = examProgress?.completedAt
    ? Math.round((examProgress.score / examProgress.total) * 100)
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="relative min-h-screen bg-background">
        <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 pb-14 pt-16 md:px-6 md:pt-24">
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-secondary-foreground">
              BNSSA · Entraînement et examen
            </div>

            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                QCM BNSSA
                <br />
                <span className="text-muted-foreground">entraînement infini</span>
              </h1>
              <p className="mx-auto max-w-xl text-base text-muted-foreground md:text-lg">
                Une banque d'entraînement aléatoire pour réviser à ton rythme.
                Les questions d'examen restent disponibles dans un mode séparé.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                {trainingQuiz.questions.length} questions en entraînement
              </span>
              <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                {examQuiz.questions.length} questions examen
              </span>
            </div>
          </m.div>

          <section className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-2">
            <m.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4">
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  Mode principal
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Entraînement</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Les questions sortent dans un ordre aléatoire, avec correction
                immédiate après validation.
              </p>
              <button
                onClick={startTraining}
                className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Lancer l'entraînement
              </button>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4">
                <span className="inline-flex items-center rounded-md border border-transparent bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                  Examen
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">QCM d'examen</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Le vrai QCM d'examen est conservé séparément, sans correction
                immédiate, avec résultat final.
              </p>
              
              <div className="mt-auto pt-6 flex flex-col gap-3">
                {examPct !== null && (
                  <div className="flex items-center justify-between rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm">
                    <span className="text-muted-foreground">Dernier score</span>
                    <span className="font-semibold text-foreground">{examPct}%</span>
                  </div>
                )}
                <button
                  onClick={startExam}
                  className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Lancer l'examen
                </button>
              </div>
            </m.div>
          </section>

          <div className="mx-auto w-full max-w-4xl pt-8">
            <ProgressBanner session={session} onClearAll={clearAll} />
          </div>
        </div>
      </main>
    </>
  );
}

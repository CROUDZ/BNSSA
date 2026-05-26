'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import { useQcmSession } from '@/hooks/useQcmSession';
import { QcmCard } from '@/components/QcmCard';
import { ProgressBanner } from '@/components/ProgressBanner';
import { QuizSession } from '@/components/QuizSession';
import { ResultsScreen } from '@/components/ResultsScreen';
import { qcm1 } from '@/data/qcm1';
import { qcm2 } from '@/data/qcm2';
import { qcm3 } from '@/data/qcm3';
import { qcm4 } from '@/data/qcm4';
import type { QcmData, QuestionResult } from '@/types/qcm';

const quizzes: QcmData[] = [
  { id: 1, title: 'QCM 1', description: 'Connaissance du milieu · Diplômes · Organisation', questions: qcm1 },
  { id: 2, title: 'QCM 2', description: 'Milieu · Compétences · Contexte juridique', questions: qcm2 },
  { id: 3, title: 'QCM 3', description: 'Réglementation · Surveillance · Secourisme', questions: qcm3 },
  { id: 4, title: 'QCM 4', description: 'Milieu · Administration · Activités spécifiques', questions: qcm4 },
];

type ActiveSession = {
  quiz: QcmData;
  mode: 'all' | 'retry';
};

type Screen = 'home' | 'quiz' | 'results';

export default function HomePage() {
  const { session, getProgress, saveProgress, clearProgress, clearAll } = useQcmSession();
  const [screen, setScreen] = useState<Screen>('home');
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [pendingResults, setPendingResults] = useState<QuestionResult[]>([]);

  const handleStart = (quiz: QcmData, mode: 'all' | 'retry') => {
    if (mode === 'all') {
      clearProgress(quiz.id);
    }
    setActiveSession({ quiz, mode });
    setScreen('quiz');
  };

  const handleComplete = (results: QuestionResult[]) => {
    if (!activeSession) return;

    const { quiz, mode } = activeSession;
    const existing = getProgress(quiz.id);

    // Merge retry results with previous full run if applicable
    let allResults: QuestionResult[];
    if (mode === 'retry' && existing) {
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
    setScreen('results');
  };

  const handleHome = () => {
    setScreen('home');
    setActiveSession(null);
    setPendingResults([]);
  };

  const handleRetry = () => {
    if (!activeSession) return;
    clearProgress(activeSession.quiz.id);
    setActiveSession({ quiz: activeSession.quiz, mode: 'all' });
    setPendingResults([]);
    setScreen('quiz');
  };

  const handleRetryWrong = () => {
    if (!activeSession) return;
    setActiveSession({ quiz: activeSession.quiz, mode: 'retry' });
    setPendingResults([]);
    setScreen('quiz');
  };

  // ── Quiz screen ────────────────────────────────────────────────────
  if (screen === 'quiz' && activeSession) {
    const wrongIds =
      activeSession.mode === 'retry'
        ? (getProgress(activeSession.quiz.id)?.results ?? [])
            .filter((r) => !r.correct)
            .map((r) => r.questionId)
        : undefined;

    return (
      <QuizSession
        quiz={activeSession.quiz}
        questionIds={wrongIds}
        onComplete={handleComplete}
        onBack={handleHome}
      />
    );
  }

  // ── Results screen ─────────────────────────────────────────────────
  if (screen === 'results' && activeSession) {
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
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            BNSSA · Préparation examen
          </div>
          <h1 className="mt-3 text-5xl font-black tracking-tight md:text-6xl">
            Révision
            <br />
            <span className="text-zinc-500">BNSSA</span>
          </h1>
          <p className="mt-3 text-zinc-400">
            Maîtrise les 4 QCM. Seuil de réussite : 75% (30/40).
          </p>
        </m.div>

        {/* Global progress */}
        <ProgressBanner session={session} quizzes={quizzes} onClearAll={clearAll} />

        {/* QCM grid */}
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
              />
            </m.div>
          ))}
        </div>
      </div>
    </main>
  );
}
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
  mode: 'all' | 'retry' | 'exam';
};

type Screen = 'home' | 'quiz' | 'results';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';

export default function HomePage() {
  const faqItems = [
    {
      question: "Qu'est-ce que le BNSSA ?",
      answer:
        "Le BNSSA (Brevet National de Securite et de Sauvetage Aquatique) certifie la capacite a surveiller et secourir en piscine ou plan d'eau.",
    },
    {
      question: 'Combien de QCM pour preparer l\'examen BNSSA ?',
      answer:
        'Quatre QCM complementaires couvrent la reglementation, la surveillance et le secourisme pour la formation BNSSA.',
    },
    {
      question: 'Quel est le seuil de reussite au BNSSA ?',
      answer:
        "Le seuil est generalement fixe a 75% de bonnes reponses. Les modes examen et erreurs aident a s'y preparer.",
    },
    {
      question: 'Ces QCM sont-ils alignes avec la formation FNMNS ?',
      answer:
        "Ils reprennent les themes courants de la formation BNSSA (surveillance, reglementation, secours) souvent travailles dans les supports FNMNS.",
    },
  ];

  const organization: Record<string, unknown> = {
    '@type': 'Organization',
    name: 'BNSSA QCM',
    description: "QCM BNSSA et preparation a l'examen.",
  };
  const website: Record<string, unknown> = {
    '@type': 'WebSite',
    name: 'BNSSA QCM',
    inLanguage: 'fr-FR',
  };

  if (siteUrl) {
    organization.url = siteUrl;
    website.url = siteUrl;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      website,
      {
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };

  const { session, getProgress, saveProgress, clearProgress, clearAll } = useQcmSession();
  const [screen, setScreen] = useState<Screen>('home');
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [pendingResults, setPendingResults] = useState<QuestionResult[]>([]);
  const totalQuestions = quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
  const completedCount = Object.values(session).filter((progress) => progress.completedAt).length;
  const completionPct = quizzes.length
    ? Math.round((completedCount / quizzes.length) * 100)
    : 0;

  const handleStart = (quiz: QcmData, mode: 'all' | 'retry' | 'exam') => {
    if (mode === 'all' || mode === 'exam') {
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
    setActiveSession({
      quiz: activeSession.quiz,
      mode: activeSession.mode === 'exam' ? 'exam' : 'all',
    });
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
        mode={activeSession.mode}
        revealAnswers={activeSession.mode !== 'exam'}
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="relative min-h-screen overflow-hidden bg-hero text-slate-50">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-400/20 blur-[140px]" />
        <div className="pointer-events-none absolute top-24 right-[-120px] h-[360px] w-[360px] rounded-full bg-amber-300/20 blur-[130px]" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-16 pt-12 md:px-6">
          <m.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-veil px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-muted">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              BNSSA · préparation examen
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <h1 className="font-display text-5xl leading-[0.95] md:text-6xl">
                  QCM
                  <br />
                  <span className="text-emerald-200">BNSSA</span> pour réussir
                </h1>
                <p className="mt-4 max-w-xl text-lg text-muted">
                  Révise la formation BNSSA avec des QCM ciblés (surveillance, réglementation,
                  secourisme), suis ta progression et vise le seuil de réussite de 75%.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full border border-soft bg-surface-veil px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
                    {quizzes.length} QCM
                  </span>
                  <span className="rounded-full border border-soft bg-surface-veil px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
                    {totalQuestions} questions
                  </span>
                  <span className="rounded-full border border-soft bg-surface-veil px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted">
                    Seuil 75%
                  </span>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-3">
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

              <div className="rounded-3xl border border-soft bg-surface-veil p-6 shadow-hero backdrop-blur">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-muted">
                  <span>Feuille de route</span>
                  <span className="text-emerald-200">Seuil 75%</span>
                </div>
                <h2 className="mt-4 font-display text-2xl">Plan de révision clair</h2>
                <p className="mt-2 text-sm text-muted">
                  Trois modes pour alterner répétition, examen et correction ciblée.
                </p>
                <div className="mt-4 grid gap-3 text-sm">
                  <div className="rounded-2xl border border-soft bg-surface px-4 py-3">
                    <p className="font-semibold text-slate-100">Mode classique</p>
                    <p className="text-xs text-muted">Toutes les questions avec correction.</p>
                  </div>
                  <div className="rounded-2xl border border-soft bg-surface px-4 py-3">
                    <p className="font-semibold text-slate-100">Mode examen</p>
                    <p className="text-xs text-muted">Simule la pression sans révéler immédiatement.</p>
                  </div>
                  <div className="rounded-2xl border border-soft bg-surface px-4 py-3">
                    <p className="font-semibold text-slate-100">Mode erreurs</p>
                    <p className="text-xs text-muted">Revois uniquement ce qui bloque.</p>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border border-soft bg-surface px-4 py-3">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>Progression</span>
                    <span className="font-semibold text-slate-100">
                      {completedCount}/{quizzes.length} QCM
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800/70">
                    <div
                      className="h-full rounded-full bg-emerald-300"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </m.div>

          <ProgressBanner session={session} quizzes={quizzes} onClearAll={clearAll} />

          <section id="qcm-grid" className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Choix rapide</p>
                <h2 className="mt-2 font-display text-3xl">Choisis ton QCM</h2>
                <p className="mt-2 text-sm text-muted">
                  Lance une session, suis ta progression et repasse sur les points faibles.
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

          <section id="bnssa-infos" className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Infos BNSSA</p>
              <h2 className="mt-2 font-display text-3xl">
                Préparation BNSSA, QCM et formation FNMNS
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-muted">
                Cette plateforme t'aide a preparer l'examen BNSSA avec des QCM progressifs,
                des retours precis et des rappels sur la reglementation, la surveillance en
                piscine et le secourisme. Idéal pour completer ta formation BNSSA et
                reviser les supports FNMNS.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-soft bg-surface-veil p-4">
                <p className="text-sm font-semibold text-slate-100">QCM réalistes</p>
                <p className="mt-2 text-xs text-muted">
                  Des series qui couvrent le milieu aquatique, la reglementation et les
                  gestes de secours.
                </p>
              </div>
              <div className="rounded-2xl border border-soft bg-surface-veil p-4">
                <p className="text-sm font-semibold text-slate-100">Suivi de progression</p>
                <p className="mt-2 text-xs text-muted">
                  Visualise tes scores, repere les lacunes et reviens sur les notions clés.
                </p>
              </div>
              <div className="rounded-2xl border border-soft bg-surface-veil p-4">
                <p className="text-sm font-semibold text-slate-100">Mode examen</p>
                <p className="mt-2 text-xs text-muted">
                  Entraine-toi en conditions proches de l'examen BNSSA.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-soft bg-surface-veil p-6">
              <h3 className="font-display text-2xl">FAQ BNSSA</h3>
              <dl className="mt-4 grid gap-4">
                {faqItems.map((item) => (
                  <div key={item.question} className="rounded-2xl border border-soft bg-surface px-4 py-3">
                    <dt className="text-sm font-semibold text-slate-100">{item.question}</dt>
                    <dd className="mt-1 text-xs text-muted">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
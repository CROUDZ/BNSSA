import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import examQuestions from "@/data/exam.json";
import trainingQuestions from "@/data/training.json";
import { EXAM_QCM_ID, QCM_MODE_DB_IDS, TRAINING_QCM_ID } from "@/lib/qcmModes";
import { prisma } from "@/lib/prisma";
import type { Question, QuestionResult } from "@/types/qcm";

export const metadata = {
  title: "Mon compte",
};

const examBank = examQuestions as Question[];
const trainingBank = trainingQuestions as Question[];
const trainingQuestionsWithExam = [
  ...trainingBank,
  ...examBank.map((question) => ({
    ...question,
    tags: [...new Set([...question.tags, "examen"])],
  })),
];
const questionById = new Map(
  [...trainingQuestionsWithExam, ...examBank].map((question) => [
    question.id,
    question,
  ]),
);

type ProgressRow = Awaited<
  ReturnType<typeof prisma.userQcmProgress.findMany>
>[number];

type TopicStat = {
  label: string;
  total: number;
  correct: number;
  wrong: number;
  pct: number;
};

type DailyStat = {
  date: string;
  label: string;
  total: number;
  correct: number;
  wrong: number;
  pct: number;
};

function toResults(row: ProgressRow | undefined) {
  return (row?.results ?? []) as QuestionResult[];
}

function percent(correct: number, total: number) {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "Pas encore";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function buildTopicStats(
  results: QuestionResult[],
  getLabels: (q: Question) => string[],
) {
  const stats = new Map<string, { total: number; correct: number }>();

  for (const result of results) {
    const question = questionById.get(result.questionId);
    if (!question) continue;

    for (const label of getLabels(question)) {
      const current = stats.get(label) ?? { total: 0, correct: 0 };
      current.total += 1;
      current.correct += result.correct ? 1 : 0;
      stats.set(label, current);
    }
  }

  return [...stats.entries()]
    .map<TopicStat>(([label, item]) => ({
      label,
      total: item.total,
      correct: item.correct,
      wrong: item.total - item.correct,
      pct: percent(item.correct, item.total),
    }))
    .sort((a, b) => b.wrong - a.wrong || a.pct - b.pct || b.total - a.total);
}

function buildQuestionStats(results: QuestionResult[]) {
  const stats = new Map<
    string,
    {
      total: number;
      correct: number;
      lastSelected: QuestionResult["selectedAnswers"];
    }
  >();

  for (const result of results) {
    const current = stats.get(result.questionId) ?? {
      total: 0,
      correct: 0,
      lastSelected: [],
    };
    current.total += 1;
    current.correct += result.correct ? 1 : 0;
    current.lastSelected = result.selectedAnswers;
    stats.set(result.questionId, current);
  }

  return [...stats.entries()]
    .map(([questionId, item]) => {
      const question = questionById.get(questionId);

      return {
        questionId,
        question,
        total: item.total,
        correct: item.correct,
        wrong: item.total - item.correct,
        pct: percent(item.correct, item.total),
        lastSelected: item.lastSelected,
      };
    })
    .filter((item) => item.question && item.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong || a.pct - b.pct || b.total - a.total);
}

function buildDailyStats(results: QuestionResult[]) {
  const stats = new Map<string, { total: number; correct: number }>();

  for (const result of results) {
    if (!result.answeredAt) continue;

    const date = new Date(result.answeredAt);
    if (Number.isNaN(date.getTime())) continue;

    const key = date.toISOString().slice(0, 10);
    const current = stats.get(key) ?? { total: 0, correct: 0 };
    current.total += 1;
    current.correct += result.correct ? 1 : 0;
    stats.set(key, current);
  }

  return [...stats.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map<DailyStat>(([date, item]) => ({
      date,
      label: formatDate(date),
      total: item.total,
      correct: item.correct,
      wrong: item.total - item.correct,
      pct: percent(item.correct, item.total),
    }));
}

function getStreak(results: QuestionResult[]) {
  let streak = 0;

  for (let index = results.length - 1; index >= 0; index -= 1) {
    if (!results[index]?.correct) break;
    streak += 1;
  }

  return streak;
}

function getQuestionModeLabel(question: Question | undefined) {
  if (!question) return "Question";
  return question.tags.includes("examen")
    ? "Question d'examen"
    : "Question d'entraînement";
}

export default async function ComptePage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/connexion");
  }

  const userRecord = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      accounts: {
        select: {
          provider: true,
          type: true,
        },
      },
      qcmProgresses: {
        orderBy: { updatedAt: "desc" },
      },
      sessions: {
        select: {
          expires: true,
        },
        orderBy: { expires: "desc" },
        take: 1,
      },
    },
  });

  if (!userRecord) {
    redirect("/connexion");
  }

  const trainingProgress = userRecord.qcmProgresses.find(
    (progress) => progress.qcmId === QCM_MODE_DB_IDS[TRAINING_QCM_ID],
  );
  const examProgress = userRecord.qcmProgresses.find(
    (progress) => progress.qcmId === QCM_MODE_DB_IDS[EXAM_QCM_ID],
  );
  const trainingResults = toResults(trainingProgress);
  const examResults = toResults(examProgress);
  const allResults = [...trainingResults, ...examResults];
  const correctCount = allResults.filter((result) => result.correct).length;
  const globalPct = percent(correctCount, allResults.length);
  const trainingPct = percent(
    trainingResults.filter((result) => result.correct).length,
    trainingResults.length,
  );
  const examPct = examProgress?.completedAt
    ? percent(examProgress.score, examProgress.total)
    : null;
  const tagStats = buildTopicStats(allResults, (question) => question.tags);
  const questionStats = buildQuestionStats(allResults);
  const weakQuestions = questionStats.slice(0, 6);
  const failedQuestionIds = questionStats.map((item) => item.questionId);
  const dailyStats = buildDailyStats(allResults);
  const recentResults = [...allResults]
    .sort(
      (a, b) =>
        new Date(b.answeredAt ?? 0).getTime() -
        new Date(a.answeredAt ?? 0).getTime(),
    )
    .slice(0, 8);
  const lastActivity = allResults
    .map((result) => result.answeredAt)
    .filter(Boolean)
    .sort()
    .at(-1);
  const bestWeakTag = tagStats.find((tag) => tag.wrong > 0);
  const accountProvider = userRecord.accounts[0]?.provider ?? "Google";

  return (
    <main className="relative min-h-screen overflow-hidden bg-hero px-4 py-10 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6">
        <section className="flex flex-col gap-6 rounded-3xl border border-soft bg-surface-veil p-6 shadow-hero backdrop-blur md:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Tableau de bord
              </p>
              <h1 className="mt-3 font-display text-4xl">Mon compte</h1>
              <p className="mt-3 max-w-2xl text-sm text-muted">
                Suivi détaillé de ta progression BNSSA, de tes erreurs
                récurrentes et des thèmes à retravailler en priorité.
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-soft bg-surface px-4 py-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full border border-soft"
                />
              ) : null}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">
                  Connecté avec {accountProvider}
                </p>
                <p className="text-xl font-black text-foreground">
                  {user.name ?? "Utilisateur"}
                </p>
                <p className="text-sm text-muted">{user.email}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Réussite globale"
            value={`${globalPct}%`}
            detail={`${correctCount}/${allResults.length || 0} bonnes réponses`}
          />
          <StatCard
            label="Questions vues"
            value={`${new Set(allResults.map((result) => result.questionId)).size}`}
            detail={`${trainingQuestionsWithExam.length} en entraînement`}
          />
          <StatCard
            label="Erreurs à revoir"
            value={`${failedQuestionIds.length}`}
            detail="Questions à retravailler"
          />
          <StatCard
            label="Série correcte"
            value={`${getStreak(allResults)}`}
            detail="Bonnes réponses d'affilée"
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-soft bg-surface p-6 shadow-hero">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted">
                  Progression
                </p>
                <h2 className="mt-2 font-display text-3xl">
                  Où tu en es vraiment
                </h2>
              </div>
              <p className="text-sm text-muted">
                Dernière activité: {formatDate(lastActivity)}
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ProgressMeter
                label="Entraînement"
                value={trainingPct}
                detail={`${trainingResults.length} réponses enregistrées`}
              />
              <ProgressMeter
                label="Dernier examen"
                value={examPct ?? 0}
                detail={
                  examPct === null
                    ? "Aucun examen validé"
                    : `${examProgress?.score}/${examProgress?.total} le ${formatDate(examProgress?.completedAt)}`
                }
              />
            </div>

            <div className="mt-6 rounded-2xl border border-soft bg-surface-veil p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-muted">
                Priorité d'apprentissage
              </p>
              <p className="mt-2 text-lg font-black">
                {bestWeakTag
                  ? `Retravailler: ${bestWeakTag.label}`
                  : "Continue, aucune faiblesse nette pour l'instant"}
              </p>
              <p className="mt-1 text-sm text-muted">
                {bestWeakTag
                  ? `${bestWeakTag.wrong} erreur${bestWeakTag.wrong > 1 ? "s" : ""} repérée${bestWeakTag.wrong > 1 ? "s" : ""} sur ce thème.`
                  : "Plus tu réponds, plus les recommandations deviennent précises."}
              </p>
            </div>

            {failedQuestionIds.length > 0 && (
              <Link
                href={{
                  pathname: "/",
                  query: {
                    review: "failed",
                    ids: failedQuestionIds.join(","),
                  },
                }}
                className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-200"
              >
                Relancer un QCM avec mes erreurs
              </Link>
            )}
          </div>

          <div className="rounded-3xl border border-soft bg-surface p-6 shadow-hero">
            <p className="text-xs uppercase tracking-[0.25em] text-muted">
              Données compte
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <InfoRow
                label="Compte créé"
                value={formatDate(userRecord.createdAt)}
              />
              <InfoRow
                label="Dernière sauvegarde"
                value={formatDate(userRecord.qcmProgresses[0]?.updatedAt)}
              />
              <InfoRow
                label="Session active jusqu'au"
                value={formatDate(userRecord.sessions[0]?.expires)}
              />
              <InfoRow
                label="Sauvegardes"
                value={`${userRecord.qcmProgresses.length}`}
              />
            </dl>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <DailySuccessChart stats={dailyStats} />
          <StatsTable title="Erreurs par thème" stats={tagStats.slice(0, 8)} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-soft bg-surface p-6 shadow-hero">
            <p className="text-xs uppercase tracking-[0.25em] text-muted">
              Questions à cibler
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {weakQuestions.length ? (
                weakQuestions.map((item) => (
                  <div
                    key={item.questionId}
                    className="rounded-2xl border border-soft bg-surface-veil p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted">
                        {getQuestionModeLabel(item.question)}{" "}
                        {item.question?.sourceQuestionId}
                      </span>
                      <span className="text-xs font-bold text-red-400">
                        {item.wrong} erreur{item.wrong > 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold">
                      {item.question?.question}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      Dernier choix: {item.lastSelected.join(", ") || "aucun"} ·
                      Bonne réponse: {item.question?.correctAnswers.join(", ")}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-soft bg-surface-veil p-4 text-sm text-muted">
                  Pas encore assez d'erreurs pour identifier des questions
                  prioritaires.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-soft bg-surface p-6 shadow-hero">
            <p className="text-xs uppercase tracking-[0.25em] text-muted">
              Activité récente
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {recentResults.length ? (
                recentResults.map((result) => {
                  const question = questionById.get(result.questionId);

                  return (
                    <div
                      key={`${result.questionId}-${result.answeredAt}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-soft bg-surface-veil px-4 py-3 text-sm"
                    >
                      <div>
                        <p className="font-semibold">
                          {getQuestionModeLabel(question)}{" "}
                          {question?.sourceQuestionId ?? "?"}
                        </p>
                        <p className="text-xs text-muted">
                          {formatDate(result.answeredAt)}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-black ${
                          result.correct ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {result.correct ? "Correct" : "Erreur"}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="rounded-2xl border border-soft bg-surface-veil p-4 text-sm text-muted">
                  Lance un entraînement pour commencer à construire tes stats.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-soft bg-surface p-5 shadow-hero">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-3 text-4xl font-black">{value}</p>
      <p className="mt-1 text-sm text-muted">{detail}</p>
    </div>
  );
}

function ProgressMeter({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-soft bg-surface-veil p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold">{label}</p>
        <p className="font-mono text-sm text-muted-strong">{value}%</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-emerald-300"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted">{detail}</p>
    </div>
  );
}

function DailySuccessChart({ stats }: { stats: DailyStat[] }) {
  const width = 640;
  const height = 220;
  const padding = 34;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const points = stats.map((stat, index) => {
    const x =
      padding +
      (stats.length <= 1
        ? chartWidth / 2
        : (index / (stats.length - 1)) * chartWidth);
    const y = padding + chartHeight - (stat.pct / 100) * chartHeight;

    return { ...stat, x, y };
  });
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <div className="rounded-3xl border border-soft bg-surface p-6 shadow-hero">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">
            Réussite quotidienne
          </p>
          <h2 className="mt-2 font-display text-2xl">
            Bonnes réponses par jour
          </h2>
        </div>
        <p className="text-sm text-muted">Survole un point pour le détail</p>
      </div>

      {points.length ? (
        <div className="mt-5 overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Pourcentage de bonnes réponses par jour"
            className="min-w-[520px]"
          >
            {[0, 25, 50, 75, 100].map((tick) => {
              const y = padding + chartHeight - (tick / 100) * chartHeight;

              return (
                <g key={tick}>
                  <line
                    x1={padding}
                    x2={width - padding}
                    y1={y}
                    y2={y}
                    className="stroke-white/10"
                  />
                  <text
                    x={8}
                    y={y + 4}
                    className="fill-current text-[10px] text-muted"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}
            {path && (
              <path
                d={path}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-300"
              />
            )}
            {points.map((point) => (
              <g key={point.date}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="7"
                  className="fill-emerald-300 stroke-slate-950"
                  strokeWidth="3"
                >
                  <title>
                    {`${point.label}: ${point.pct}% - ${point.correct} correctes, ${point.wrong} incorrectes`}
                  </title>
                </circle>
                <text
                  x={point.x}
                  y={height - 8}
                  textAnchor="middle"
                  className="fill-current text-[10px] text-muted"
                >
                  {point.label.slice(0, 6)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      ) : (
        <p className="mt-5 rounded-2xl border border-soft bg-surface-veil p-4 text-sm text-muted">
          Réponds à quelques questions pour faire apparaître le graphe.
        </p>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-soft pb-3 last:border-b-0 last:pb-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  );
}

function StatsTable({ title, stats }: { title: string; stats: TopicStat[] }) {
  return (
    <div className="rounded-3xl border border-soft bg-surface p-6 shadow-hero">
      <p className="text-xs uppercase tracking-[0.25em] text-muted">{title}</p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-soft">
        {stats.length ? (
          stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`grid grid-cols-[1fr_auto] gap-4 px-4 py-3 text-sm ${
                index < stats.length - 1 ? "border-b border-soft" : ""
              }`}
            >
              <div>
                <p className="font-bold">{stat.label}</p>
                <p className="text-xs text-muted">
                  {stat.correct}/{stat.total} correctes
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono font-black">{stat.pct}%</p>
                <p className="text-xs text-red-400">
                  {stat.wrong} erreur{stat.wrong > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-muted">
            Aucune donnée pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}

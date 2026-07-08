"use client";

import { useCallback, useMemo, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronDown,
  FaChevronUp,
  FaCopy,
  FaRedo,
} from "react-icons/fa";
import { SiAnthropic, SiGooglegemini, SiOpenai } from "react-icons/si";
import { AnswerButton } from "@/components/AnswerButton";
import { CopilotIcon, GrokIcon, MistralIcon } from "@/components/BrandIcons";
import type {
  AnswerKey,
  QcmData,
  QcmProgress,
  Question,
  QuestionResult,
} from "@/types/qcm";

type Props = {
  quiz: QcmData;
  mode: "training" | "exam" | "review";
  initialProgress?: QcmProgress | null;
  revealAnswers?: boolean;
  onAnswer?: (result: QuestionResult, answeredQuestionIds: string[]) => void;
  onComplete: (results: QuestionResult[]) => void;
  onBack: () => void;
};

type AnswerState = "idle" | "selected" | "correct" | "wrong" | "missed";

const COUNTER_ROUND_SIZE = 40;

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function buildTrainingOrder(
  questions: Question[],
  answeredQuestionIds: string[],
) {
  const answered = new Set(answeredQuestionIds);
  const remaining = questions.filter((question) => !answered.has(question.id));
  return shuffle(remaining.length ? remaining : questions);
}

const buildPrompt = ({
  quizTitle,
  questionText,
  answersText,
  correctAnswers,
  selectedAnswers,
}: {
  quizTitle: string;
  questionText: string;
  answersText: string;
  correctAnswers: string[];
  selectedAnswers: string[];
}) => {
  const correct = correctAnswers.join(", ");
  const selected = selectedAnswers.length
    ? selectedAnswers.join(", ")
    : "Aucune";

  return (
    "Tu es un formateur BNSSA. Tu tutoies l'utilisateur et tu reponds en francais.\n\n" +
    `Contexte:\nQCM: ${quizTitle}\nQuestion: ${questionText}\nPropositions:\n${answersText}\n\n` +
    `Bonnes reponses: ${correct}\nReponse utilisateur: ${selected}\n\n` +
    "Consignes:\n" +
    "- Explique pourquoi chaque bonne reponse est correcte.\n" +
    "- Explique pourquoi chaque reponse choisie incorrecte est fausse.\n" +
    "- Si une bonne reponse manque, explique le manque.\n" +
    "- Reste clair et court (4 a 6 phrases max).\n" +
    "- N'invente aucune information absente de l'enonce ou des propositions.\n"
  );
};

export function QuizSession({
  quiz,
  mode,
  initialProgress,
  revealAnswers = true,
  onAnswer,
  onComplete,
  onBack,
}: Props) {
  const isTrainingLike = mode === "training" || mode === "review";
  const initialAnsweredQuestionIds =
    initialProgress?.answeredQuestionIds?.filter((id) =>
      quiz.questions.some((question) => question.id === id),
    ) ?? [];
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState(
    initialAnsweredQuestionIds.length >= quiz.questions.length
      ? []
      : initialAnsweredQuestionIds,
  );
  const [trainingOrder, setTrainingOrder] = useState(() =>
    buildTrainingOrder(quiz.questions, initialAnsweredQuestionIds),
  );
  const questions = mode === "training" ? trainingOrder : quiz.questions;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<AnswerKey[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [examAnswers, setExamAnswers] = useState<Record<string, AnswerKey[]>>(
    {},
  );
  const [reviewResults, setReviewResults] = useState<QuestionResult[]>([]);
  const [counterResults, setCounterResults] = useState<QuestionResult[]>([]);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [openPromptId, setOpenPromptId] = useState<string | null>(null);

  const question = questions[index] ?? questions[0];
  const answerKeys = Object.keys(question.answers) as AnswerKey[];
  const canConfirm = selected.length > 0 && !confirmed;
  const answeredCount = quiz.questions.reduce(
    (count, item) => count + ((examAnswers[item.id] ?? []).length > 0 ? 1 : 0),
    0,
  );
  const progress =
    mode === "exam"
      ? quiz.questions.length
        ? (answeredCount / quiz.questions.length) * 100
        : 0
      : mode === "review"
        ? quiz.questions.length
          ? ((index + (confirmed ? 1 : 0)) / quiz.questions.length) * 100
          : 0
        : ((answeredQuestionIds.length + (confirmed ? 1 : 0)) /
            quiz.questions.length) *
          100;

  const canExplain = revealAnswers && confirmed && isTrainingLike;
  const answersText = answerKeys
    .map((key) => `${key}: ${question.answers[key] ?? ""}`)
    .join("\n");
  const promptText = canExplain
    ? buildPrompt({
        quizTitle: quiz.title,
        questionText: question.question,
        answersText,
        correctAnswers: question.correctAnswers,
        selectedAnswers: selected,
      })
    : "";
  const promptQuery = encodeURIComponent(promptText);
  const currentAnswerCorrect =
    selected.length === question.correctAnswers.length &&
    selected.every((key) => question.correctAnswers.includes(key));
  const displayedCounterResults = confirmed
    ? [
        ...counterResults,
        {
          questionId: question.id,
          selectedAnswers: selected,
          correct: currentAnswerCorrect,
        },
      ]
    : counterResults;
  const counterTotal = displayedCounterResults.length;
  const counterScore = displayedCounterResults.filter(
    (result) => result.correct,
  ).length;
  const counterPct = counterTotal
    ? Math.round((counterScore / counterTotal) * 100)
    : 0;
  const isCounterSuccess = counterTotal > 0 && counterPct >= 75;
  const isCounterDanger = counterTotal > 0 && counterPct < 75;
  const counterColor = isCounterSuccess
    ? "#34d399"
    : isCounterDanger
      ? "#f87171"
      : "var(--muted)";
  const roundAnswered =
    counterTotal > 0 && counterTotal % COUNTER_ROUND_SIZE === 0
      ? COUNTER_ROUND_SIZE
      : counterTotal % COUNTER_ROUND_SIZE;
  const roundPct = (roundAnswered / COUNTER_ROUND_SIZE) * 100;
  const providers = useMemo(
    () => [
      {
        id: "chatgpt",
        label: "ChatGPT",
        href: `https://chatgpt.com/?q=${promptQuery}`,
        Icon: SiOpenai,
      },
      {
        id: "gemini",
        label: "Gemini",
        href: `https://gemini.google.com/app?prompt=${promptQuery}`,
        Icon: SiGooglegemini,
      },
      {
        id: "claude",
        label: "Claude",
        href: `https://claude.ai/new?q=${promptQuery}`,
        Icon: SiAnthropic,
      },
      {
        id: "grok",
        label: "Grok",
        href: `https://grok.com/?q=${promptQuery}`,
        Icon: GrokIcon,
      },
      {
        id: "mistral",
        label: "Mistral",
        href: `https://chat.mistral.ai/chat?prompt=${promptQuery}`,
        Icon: MistralIcon,
      },
      {
        id: "copilot",
        label: "Copilot",
        href: `https://copilot.microsoft.com/?q=${promptQuery}`,
        Icon: CopilotIcon,
      },
    ],
    [promptQuery],
  );
  const isPromptOpen = openPromptId === question.id;
  const promptDetailsId = `prompt-details-${question.id}`;

  const getState = useCallback(
    (key: AnswerKey): AnswerState => {
      if (!confirmed) {
        return selected.includes(key) ? "selected" : "idle";
      }
      if (!revealAnswers) {
        return selected.includes(key) ? "selected" : "idle";
      }
      const isCorrect = question.correctAnswers.includes(key);
      const wasSelected = selected.includes(key);
      if (isCorrect && wasSelected) return "correct";
      if (!isCorrect && wasSelected) return "wrong";
      if (isCorrect && !wasSelected) return "missed";
      return "idle";
    },
    [confirmed, question.correctAnswers, revealAnswers, selected],
  );

  const handleSelect = (key: AnswerKey) => {
    if (confirmed) return;
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const handleExamSelect = (questionId: string, key: AnswerKey) => {
    setExamAnswers((prev) => {
      const current = prev[questionId] ?? [];
      const next = current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key];
      return { ...prev, [questionId]: next };
    });
  };

  const handleCopyPrompt = async () => {
    if (!promptText) return;
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPromptId(question.id);
      window.setTimeout(() => {
        setCopiedPromptId((prev) => (prev === question.id ? null : prev));
      }, 1600);
    } catch {
      setCopiedPromptId(null);
    }
  };

  const handleResetCounter = () => {
    setCounterResults([]);
    setSelected([]);
    setConfirmed(false);
    setCopiedPromptId(null);
    setOpenPromptId(null);
  };

  const handleNextTrainingQuestion = () => {
    const result: QuestionResult = {
      questionId: question.id,
      selectedAnswers: selected,
      correct: currentAnswerCorrect,
      answeredAt: new Date().toISOString(),
    };
    const currentAnsweredIds = [...answeredQuestionIds, question.id];
    const uniqueAnsweredIds = [...new Set(currentAnsweredIds)];
    const nextAnsweredQuestionIds =
      uniqueAnsweredIds.length >= quiz.questions.length
        ? []
        : uniqueAnsweredIds;

    onAnswer?.(result, nextAnsweredQuestionIds);
    setAnsweredQuestionIds(nextAnsweredQuestionIds);
    setReviewResults((current) => [...current, result]);
    setCounterResults((current) => [...current, result]);
    setSelected([]);
    setConfirmed(false);
    setCopiedPromptId(null);
    setOpenPromptId(null);

    if (mode === "review") {
      const nextResults = [...reviewResults, result];

      if (index < questions.length - 1) {
        setIndex((current) => current + 1);
        return;
      }

      onComplete(nextResults);
      return;
    }

    if (index < questions.length - 1) {
      setIndex((current) => current + 1);
      return;
    }

    setTrainingOrder(
      buildTrainingOrder(quiz.questions, nextAnsweredQuestionIds),
    );
    setIndex(0);
  };

  if (mode === "exam") {
    const remainingCount = quiz.questions.length - answeredCount;
    const canSubmit = remainingCount === 0 && quiz.questions.length > 0;

    return (
      <main className="min-h-screen bg-background p-4 text-foreground md:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-2xl border border-soft bg-surface-strong px-4 py-2.5 text-sm font-medium transition hover:bg-surface-veil"
            >
              <FaArrowLeft className="text-xs" />
              Retour
            </button>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">
                Examen
              </span>
              <span className="font-mono text-sm text-muted">
                {answeredCount}
                <span className="text-muted-strong">
                  /{quiz.questions.length}
                </span>
              </span>
            </div>
          </div>

          <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-surface-strong">
            <m.div
              className="h-full rounded-full bg-foreground"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
          </div>

          <div className="flex flex-col gap-6">
            {quiz.questions.map((item) => {
              const itemKeys = Object.keys(item.answers) as AnswerKey[];
              const itemSelected = examAnswers[item.id] ?? [];

              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-soft bg-surface-strong p-6"
                >
                  <h2 className="text-xl font-black leading-snug md:text-2xl">
                    {item.sourceQuestionId}) {item.question}
                  </h2>
                  <div className="mt-4 flex flex-col gap-3">
                    {itemKeys.map((key) => (
                      <AnswerButton
                        key={key}
                        answerKey={key}
                        value={item.answers[key]!}
                        state={itemSelected.includes(key) ? "selected" : "idle"}
                        onClick={() => handleExamSelect(item.id, key)}
                        disabled={false}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {remainingCount > 0 && (
              <p className="text-center text-sm text-muted">
                {remainingCount} question{remainingCount > 1 ? "s" : ""}{" "}
                restante{remainingCount > 1 ? "s" : ""} avant de valider.
              </p>
            )}
            <button
              onClick={() => {
                if (!canSubmit) return;
                const newResults = quiz.questions.map((item) => {
                  const selectedAnswers = examAnswers[item.id] ?? [];
                  const correct =
                    selectedAnswers.length === item.correctAnswers.length &&
                    selectedAnswers.every((key) =>
                      item.correctAnswers.includes(key),
                    );
                  return {
                    questionId: item.id,
                    selectedAnswers,
                    correct,
                    answeredAt: new Date().toISOString(),
                  };
                });
                onComplete(newResults);
              }}
              disabled={!canSubmit}
              className="w-full rounded-2xl bg-foreground px-5 py-4 text-sm font-bold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Valider l'examen
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 text-foreground md:p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-2xl border border-soft bg-surface-strong px-4 py-2.5 text-sm font-medium transition hover:bg-surface-veil"
          >
            <FaArrowLeft className="text-xs" />
            Retour
          </button>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
              {mode === "review" ? "Révision" : "Entraînement"}
            </span>
            {mode === "review" && (
              <span className="font-mono text-sm text-muted">
                {index + 1}
                <span className="text-muted-strong">
                  /{quiz.questions.length}
                </span>
              </span>
            )}
          </div>
        </div>

        {mode === "review" && (
          <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-surface-strong">
            <m.div
              className="h-full rounded-full bg-foreground"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
          </div>
        )}

        <div
          className="mb-6 flex justify-center"
          aria-label="Compteur de réussite"
        >
          <div className="relative h-36 w-36 rounded-full p-2">
            <button
              onClick={handleResetCounter}
              className="absolute left-1/2 top-0 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-soft bg-surface-strong text-foreground shadow-hero transition hover:bg-surface-veil"
              title="Réinitialiser le compteur"
              aria-label="Réinitialiser le compteur"
            >
              <FaRedo className="text-sm" />
            </button>
            <div
              className="absolute inset-0 rounded-full transition-all duration-500"
              style={{
                background: `conic-gradient(${counterColor} ${roundPct * 3.6}deg, rgba(148, 163, 184, 0.2) 0deg)`,
              }}
            />
            <div className="relative flex h-full w-full flex-col items-center justify-center rounded-full border border-soft bg-surface-strong text-center">
              <m.span
                key={`${counterScore}-${counterTotal}`}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-mono text-3xl font-black leading-none"
                style={{ color: counterColor }}
              >
                {counterScore}/{counterTotal}
              </m.span>
              <span className="mt-1 text-xs font-bold text-muted">
                {counterPct}% réussi
              </span>
              <span className="mt-1 font-mono text-[0.65rem] font-bold uppercase tracking-widest text-muted">
                {roundAnswered}/{COUNTER_ROUND_SIZE}
              </span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <m.div
            key={question.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-5 rounded-3xl border border-soft bg-surface-strong p-6">
              <div className="mb-3 flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-soft bg-surface-veil px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-black leading-snug md:text-2xl">
                {question.question}
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {answerKeys.map((key) => (
                <AnswerButton
                  key={key}
                  answerKey={key}
                  value={question.answers[key]!}
                  state={getState(key)}
                  onClick={() => handleSelect(key)}
                  disabled={confirmed}
                />
              ))}
            </div>

            <AnimatePresence>
              {confirmed && (
                <m.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 rounded-2xl border px-5 py-4 text-sm font-semibold ${
                    currentAnswerCorrect
                      ? "border-emerald-700 bg-emerald-900/30 text-emerald-300"
                      : "border-red-700 bg-red-900/30 text-red-300"
                  }`}
                >
                  {currentAnswerCorrect
                    ? "✓ Bonne réponse !"
                    : `✗ Mauvaise réponse. La bonne réponse était : ${question.correctAnswers.join(", ")}`}
                </m.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex items-center gap-3">
              {!confirmed ? (
                <button
                  onClick={() => setConfirmed(true)}
                  disabled={!canConfirm}
                  className="w-full rounded-2xl bg-foreground px-5 py-3 text-sm font-bold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Valider
                </button>
              ) : (
                <button
                  onClick={handleNextTrainingQuestion}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-sm font-bold text-background transition hover:opacity-90"
                >
                  Question suivante
                  <FaArrowRight className="text-xs" />
                </button>
              )}
            </div>

            {canExplain && (
              <div className="mt-4 rounded-2xl border border-soft bg-surface-veil px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Lancer une discussion
                  </span>
                  <button
                    onClick={handleCopyPrompt}
                    className="inline-flex items-center gap-2 rounded-full border border-soft px-3 py-1 text-xs font-semibold text-muted-strong transition hover:border-emerald-300/40 hover:text-foreground"
                    aria-label="Copier le prompt"
                    title="Copier le prompt"
                  >
                    <FaCopy className="text-xs" />
                    {copiedPromptId === question.id ? "Copie" : "Copier"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted">
                  Choisis une IA pour ouvrir la discussion avec le prompt.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {providers.map(({ id, label, href, Icon }) => (
                    <a
                      key={id}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-soft bg-surface-strong px-3 py-2 text-xs font-semibold text-foreground transition hover:border-emerald-300/40 hover:bg-surface-veil"
                      aria-label={`Ouvrir ${label} avec le prompt`}
                      title={`Ouvrir ${label}`}
                    >
                      <Icon className="text-base" />
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setOpenPromptId((prev) =>
                      prev === question.id ? null : question.id,
                    )
                  }
                  className="mt-3 flex w-full items-center justify-between rounded-xl border border-soft bg-surface-strong px-3 py-2 text-xs font-semibold text-muted-strong transition hover:border-emerald-300/40 hover:text-foreground"
                  aria-expanded={isPromptOpen}
                  aria-controls={promptDetailsId}
                >
                  <span>Voir le prompt</span>
                  {isPromptOpen ? (
                    <FaChevronUp className="text-xs" />
                  ) : (
                    <FaChevronDown className="text-xs" />
                  )}
                </button>
                {isPromptOpen && (
                  <div
                    id={promptDetailsId}
                    className="mt-3 max-h-64 overflow-auto rounded-xl border border-soft bg-surface-strong p-4 text-xs text-foreground"
                  >
                    <pre className="whitespace-pre-wrap font-mono">
                      {promptText}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </m.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

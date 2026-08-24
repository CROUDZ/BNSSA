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
import { SiAnthropic, SiGooglegemini, SiOpenAI } from "react-icons/si";
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
        Icon: SiOpenAI,
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
      <main className="min-h-screen bg-background p-4 text-foreground md:p-6 md:pt-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <FaArrowLeft className="h-3 w-3" />
              Retour
            </button>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-md border border-border bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                Examen
              </span>
              <span className="font-mono text-sm font-medium text-foreground">
                {answeredCount}
                <span className="text-muted-foreground">
                  /{quiz.questions.length}
                </span>
              </span>
            </div>
          </div>

          <div className="mb-10 h-1.5 overflow-hidden rounded-full bg-secondary">
            <m.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
          </div>

          <div className="flex flex-col gap-8">
            {quiz.questions.map((item) => {
              const itemKeys = Object.keys(item.answers) as AnswerKey[];
              const itemSelected = examAnswers[item.id] ?? [];

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8"
                >
                  <h2 className="text-xl font-bold tracking-tight md:text-2xl">
                    <span className="text-muted-foreground mr-2">{item.id}.</span> 
                    {item.question}
                  </h2>
                  <div className="mt-6 flex flex-col gap-3">
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

          <div className="mt-12 flex flex-col gap-4">
            {remainingCount > 0 && (
              <p className="text-center text-sm font-medium text-muted-foreground">
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
              className="inline-flex h-12 w-full items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              Valider l'examen
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 text-foreground md:p-6 md:pt-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <FaArrowLeft className="h-3 w-3" />
            Retour
          </button>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-md border border-border bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
              {mode === "review" ? "Révision" : "Entraînement"}
            </span>
            {mode === "review" && (
              <span className="font-mono text-sm font-medium text-foreground">
                {index + 1}
                <span className="text-muted-foreground">
                  /{quiz.questions.length}
                </span>
              </span>
            )}
          </div>
        </div>

        {mode === "review" && (
          <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-secondary">
            <m.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
          </div>
        )}

        <div
          className="mb-8 flex justify-center"
          aria-label="Compteur de réussite"
        >
          <div className="relative h-32 w-32 rounded-full p-1.5">
            <button
              onClick={handleResetCounter}
              className="absolute left-1/2 top-0 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition hover:bg-accent hover:text-accent-foreground"
              title="Réinitialiser le compteur"
              aria-label="Réinitialiser le compteur"
            >
              <FaRedo className="h-3 w-3" />
            </button>
            <div
              className="absolute inset-0 rounded-full transition-all duration-500"
              style={{
                background: `conic-gradient(${counterColor} ${roundPct * 3.6}deg, var(--secondary) 0deg)`,
              }}
            />
            <div className="relative flex h-full w-full flex-col items-center justify-center rounded-full border border-border bg-card text-center shadow-sm">
              <m.span
                key={`${counterScore}-${counterTotal}`}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-black tracking-tight"
                style={{ color: counterColor }}
              >
                {counterScore}/{counterTotal}
              </m.span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {counterPct}% réussi
              </span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <m.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
              <div className="mb-4 flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-bold tracking-tight md:text-2xl">
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
                  className={`mt-4 rounded-lg border p-4 text-sm font-medium ${
                    currentAnswerCorrect
                      ? "border-success/50 bg-success/10 text-success"
                      : "border-destructive/50 bg-destructive/10 text-destructive"
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
                  className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
                >
                  Valider
                </button>
              ) : (
                <button
                  onClick={handleNextTrainingQuestion}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Question suivante
                  <FaArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>

            {canExplain && (
              <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Explications avec l'IA
                  </span>
                  <button
                    onClick={handleCopyPrompt}
                    className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    aria-label="Copier le prompt"
                    title="Copier le prompt"
                  >
                    <FaCopy className="h-3 w-3" />
                    {copiedPromptId === question.id ? "Copié !" : "Copier le prompt"}
                  </button>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {providers.map(({ id, label, href, Icon }) => (
                    <a
                      key={id}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                      aria-label={`Ouvrir ${label}`}
                      title={`Ouvrir ${label}`}
                    >
                      <Icon className="h-3 w-3" />
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
                  className="mt-4 flex w-full items-center justify-between rounded-md border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-expanded={isPromptOpen}
                  aria-controls={promptDetailsId}
                >
                  <span>Voir le prompt généré</span>
                  {isPromptOpen ? (
                    <FaChevronUp className="h-3 w-3" />
                  ) : (
                    <FaChevronDown className="h-3 w-3" />
                  )}
                </button>
                {isPromptOpen && (
                  <div
                    id={promptDetailsId}
                    className="mt-2 max-h-64 overflow-auto rounded-md border border-border bg-muted/30 p-4 text-xs font-mono text-muted-foreground"
                  >
                    <pre className="whitespace-pre-wrap">{promptText}</pre>
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

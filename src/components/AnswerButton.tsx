"use client";

import { m } from "framer-motion";
import type { AnswerKey } from "@/types/qcm";

type Props = {
  answerKey: AnswerKey;
  value: string;
  state: "idle" | "selected" | "correct" | "wrong" | "missed";
  onClick: () => void;
  disabled: boolean;
};

const baseButtonStyles =
  "border-soft bg-surface-strong hover:border-emerald-300/30 hover:bg-surface-veil";

const stateStyles: Record<Props["state"], string> = {
  idle: baseButtonStyles,
  selected: baseButtonStyles,
  correct: baseButtonStyles,
  wrong: baseButtonStyles,
  missed: baseButtonStyles,
};

const badgeStyles: Record<Props["state"], string> = {
  idle: "text-muted-strong",
  selected:
    "border-transparent ring-2 ring-[color:var(--foreground)] text-foreground",
  correct: "border-transparent ring-2 ring-emerald-400 text-emerald-200",
  wrong: "border-transparent ring-2 ring-red-400 text-red-200",
  missed: "border-transparent ring-2 ring-emerald-600 text-emerald-300",
};

export function AnswerButton({
  answerKey,
  value,
  state,
  onClick,
  disabled,
}: Props) {
  return (
    <m.button
      whileTap={disabled ? {} : { scale: 0.99 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${stateStyles[state]} ${disabled && state === "idle" ? "cursor-default opacity-40" : ""}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-md font-black transition-all duration-200 ${badgeStyles[state]}`}
        >
          {answerKey}
        </div>
        <span className="font-medium leading-snug">{value}</span>
      </div>
    </m.button>
  );
}

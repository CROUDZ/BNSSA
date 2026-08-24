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
  "border-border bg-card hover:border-border hover:bg-accent hover:text-accent-foreground";

const stateStyles: Record<Props["state"], string> = {
  idle: baseButtonStyles,
  selected: "border-primary bg-primary/5 shadow-sm",
  correct: "border-success bg-success/5 text-success shadow-sm",
  wrong: "border-destructive bg-destructive/5 text-destructive shadow-sm",
  missed: "border-success border-dashed bg-success/5 text-success",
};

const badgeStyles: Record<Props["state"], string> = {
  idle: "border-border text-muted-foreground",
  selected: "border-primary bg-primary text-primary-foreground",
  correct: "border-success bg-success text-success-foreground",
  wrong: "border-destructive bg-destructive text-destructive-foreground",
  missed: "border-success bg-success text-success-foreground",
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
      whileTap={disabled ? {} : { scale: 0.995 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-lg border p-4 text-left transition-all duration-200 ${stateStyles[state]} ${disabled && state === "idle" ? "cursor-default opacity-50" : ""}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-sm font-bold transition-all duration-200 ${badgeStyles[state]}`}
        >
          {answerKey}
        </div>
        <span className={`font-medium leading-relaxed ${state === "idle" ? "text-foreground" : ""}`}>
          {value}
        </span>
      </div>
    </m.button>
  );
}

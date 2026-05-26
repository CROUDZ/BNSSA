'use client';

import { m } from 'framer-motion';
import type { AnswerKey } from '@/types/qcm';

type Props = {
  answerKey: AnswerKey;
  value: string;
  state: 'idle' | 'selected' | 'correct' | 'wrong' | 'missed';
  onClick: () => void;
  disabled: boolean;
};

const stateStyles: Record<Props['state'], string> = {
  idle: 'border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-900',
  selected: 'border-white bg-white text-black',
  correct: 'border-emerald-500 bg-emerald-500/10 text-emerald-300',
  wrong: 'border-red-500 bg-red-500/10 text-red-300',
  missed: 'border-emerald-700 bg-emerald-900/20 text-emerald-500',
};

const badgeStyles: Record<Props['state'], string> = {
  idle: 'bg-zinc-800 text-zinc-300',
  selected: 'bg-black text-white',
  correct: 'bg-emerald-500 text-black',
  wrong: 'bg-red-500 text-white',
  missed: 'bg-emerald-700 text-white',
};

export function AnswerButton({ answerKey, value, state, onClick, disabled }: Props) {
  return (
    <m.button
      whileTap={disabled ? {} : { scale: 0.99 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${stateStyles[state]} ${disabled && state === 'idle' ? 'cursor-default opacity-40' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${badgeStyles[state]}`}
        >
          {answerKey}
        </div>
        <span className="font-medium leading-snug">{value}</span>
      </div>
    </m.button>
  );
}

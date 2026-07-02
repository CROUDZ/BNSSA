"use client";

import { useFormStatus } from "react-dom";

type Props = {
  children: React.ReactNode;
  className: string;
  pendingLabel?: string;
};

export function AuthSubmitButton({ children, className, pendingLabel }: Props) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? (pendingLabel ?? "Chargement...") : children}
    </button>
  );
}

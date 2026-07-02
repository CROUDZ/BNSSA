"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";

export function StartTrainingButton() {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("bnssa:start-training"));

    if (pathname !== "/") {
      router.push("/?start=training");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Lancer l'entraînement"
      title="Lancer l'entraînement"
      className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-300 text-sm text-slate-950 transition hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300/60 focus:ring-offset-2 focus:ring-offset-background"
    >
      <FaPlay aria-hidden="true" className="ml-0.5" />
    </button>
  );
}

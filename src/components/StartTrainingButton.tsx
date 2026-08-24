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
      className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    >
      <FaPlay aria-hidden="true" className="mr-2 h-3 w-3" />
      Entraînement
    </button>
  );
}

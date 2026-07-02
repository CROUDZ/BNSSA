import Link from "next/link";
import { AuthButtons } from "@/components/AuthButtons";
import { StartTrainingButton } from "@/components/StartTrainingButton";
import ThemeToggle from "@/components/ThemeToggle";

export async function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur">
      <div className="mx-auto grid min-h-16 w-full max-w-6xl grid-cols-3 items-center px-4 py-2 md:px-6">
        <Link
          href="/"
          className="justify-self-start font-display text-xl font-bold leading-none text-foreground transition hover:text-accent"
        >
          BNSSA QCM
        </Link>

        <div className="flex justify-center">
          <StartTrainingButton />
        </div>

        <div className="flex items-center justify-end gap-2">
          <AuthButtons variant="compact" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

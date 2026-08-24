import Link from "next/link";
import { AuthButtons } from "@/components/AuthButtons";
import { StartTrainingButton } from "@/components/StartTrainingButton";
import ThemeToggle from "@/components/ThemeToggle";

export async function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight transition-colors hover:text-primary"
          >
            BNSSA QCM
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <nav className="flex items-center gap-4">
            <StartTrainingButton />
            <div className="h-4 w-px bg-border hidden sm:block" />
            <AuthButtons variant="compact" />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}

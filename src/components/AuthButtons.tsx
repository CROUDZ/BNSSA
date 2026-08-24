import Image from "next/image";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { AuthSubmitButton } from "@/components/AuthSubmitButton";
import { FaUser } from "react-icons/fa";

type AuthButtonsProps = {
  variant?: "default" | "compact";
};

export async function AuthButtons({ variant = "default" }: AuthButtonsProps) {
  const session = await auth();
  const user = session?.user;
  const isCompact = variant === "compact";

  if (!user) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/compte" });
        }}
      >
        <AuthSubmitButton
          className={
            isCompact
              ? "inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
              : "inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
          }
          pendingLabel={isCompact ? "..." : "Connexion..."}
        >
          {isCompact ? (
            <FaUser aria-hidden="true" className="h-4 w-4" />
          ) : (
            "Se connecter avec Google"
          )}
        </AuthSubmitButton>
      </form>
    );
  }

  if (isCompact) {
    return (
      <Link
        href="/compte"
        aria-label="Mon compte"
        title={user.name ?? "Mon compte"}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-background transition-colors hover:border-primary/50"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt=""
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs font-semibold text-foreground">
            {(user.name?.charAt(0) ?? "U").toUpperCase()}
          </span>
        )}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2 shadow-sm">
      {user.image ? (
        <Image
          src={user.image}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 rounded-full border border-border"
        />
      ) : null}
      <Link href="/compte" className="text-sm font-medium hover:underline">
        {user.name ?? "Mon compte"}
      </Link>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
        className="ml-auto"
      >
        <AuthSubmitButton
          className="inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
          pendingLabel="..."
        >
          Déconnexion
        </AuthSubmitButton>
      </form>
    </div>
  );
}

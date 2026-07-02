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
              ? "flex h-10 w-10 items-center justify-center rounded-full text-sm text-muted transition hover:bg-surface-veil hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
              : "rounded-2xl border border-soft bg-surface-veil px-4 py-2 text-sm font-semibold text-foreground shadow-hero transition hover:border-emerald-300/50 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
          }
          pendingLabel="Connexion..."
        >
          {isCompact ? (
            <FaUser aria-hidden="true" />
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
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-sm font-black text-foreground transition hover:bg-surface-veil"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt=""
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        ) : (
          (user.name?.charAt(0) ?? "U").toUpperCase()
        )}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-soft bg-surface-veil px-3 py-2 shadow-hero">
      {user.image ? (
        <Image
          src={user.image}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 rounded-full border border-soft"
        />
      ) : null}
      <Link href="/compte" className="text-sm font-semibold text-foreground">
        {user.name ?? "Mon compte"}
      </Link>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <AuthSubmitButton
          className="rounded-xl border border-soft bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          pendingLabel="..."
        >
          Se déconnecter
        </AuthSubmitButton>
      </form>
    </div>
  );
}

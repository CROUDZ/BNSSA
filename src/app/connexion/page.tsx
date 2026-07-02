import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthButtons } from "@/components/AuthButtons";

export const metadata = {
  title: "Connexion",
};

export default async function ConnexionPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/compte");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-hero px-4 py-16 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08]" />
      <section className="relative mx-auto flex max-w-xl flex-col gap-6 rounded-3xl border border-soft bg-surface-veil p-8 shadow-hero backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Connexion
          </p>
          <h1 className="mt-3 font-display text-4xl">Compte BNSSA</h1>
          <p className="mt-3 text-sm text-muted">
            Connecte-toi avec Google pour sauvegarder ta progression QCM en base
            de données. Aucun mot de passe ni formulaire email n’est ajouté au
            site.
          </p>
        </div>
        <AuthButtons />
      </section>
    </main>
  );
}

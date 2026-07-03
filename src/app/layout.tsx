import type { Metadata } from "next";
import ClientProviders from "@/components/ClientProviders";
import { Header } from "@/components/Header";
import "@/styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.URL ??
  "http://localhost:3000"
)
  .trim()
  .replace(/\/$/, "");
const defaultTitle = "BNSSA - QCM officiels FNMNS";
const defaultDescription =
  "Site cree pour reviser le BNSSA avec la FNMNS : questions d'entrainement, mode examen et suivi de progression.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | BNSSA QCM",
  },
  description: defaultDescription,
  applicationName: "BNSSA QCM",
  keywords: [
    "BNSSA",
    "QCM BNSSA",
    "formation BNSSA",
    "examen BNSSA",
    "secourisme",
    "surveillance baignade",
    "FNMNS",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "BNSSA QCM",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "education",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var stored=sessionStorage.getItem("bnssa-theme");if(stored==="light"||stored==="dark"){document.documentElement.dataset.theme=stored;}}catch(e){}})();`,
          }}
        />
        <SpeedInsights />
        <Analytics />
        <ClientProviders>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <footer className="border-t border-soft bg-surface-veil">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-muted opacity-90 sm:text-sm md:flex-row md:items-center md:justify-between md:gap-6 md:px-6">
                <div className="flex flex-col gap-1">
                  <p>Site non officiel indépendant de la FNMNS</p>
                  <p>
                    Les contenus pédagogiques restent la propriété de leurs
                    auteurs respectifs
                  </p>
                  <p>
                    Projet open source disponible sur{" "}
                    <a
                      href="https://github.com/CROUDZ/BNSSA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-accent transition hover:text-foreground"
                    >
                      GitHub
                    </a>
                  </p>
                </div>

                <a
                  href="https://formation.fnmns.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent transition hover:text-foreground"
                >
                  Pour la formation officielle
                </a>
              </div>
            </footer>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "@/styles/globals.css";
import ClientProviders from "@/components/ClientProviders";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.URL ??
  "http://localhost:3000"
)
  .trim()
  .replace(/\/$/, "");
const defaultTitle = "BNSSA - QCM officiels FNMNS";
const defaultDescription =
  "Site cree pour reviser le BNSSA avec la FNMNS : 4 QCM officiels de l'examen, mode examen et suivi de progression.";

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
  themeColor: "#0b1220",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

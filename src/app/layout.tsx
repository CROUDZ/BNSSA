import type { Metadata } from 'next';
import '@/styles/globals.css';
import ClientProviders from '@/components/ClientProviders';

export const metadata: Metadata = {
  title: 'BNSSA - QCM de revision',
  description: "Prepare l'examen BNSSA avec 4 QCM et un suivi de progression clair.",
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

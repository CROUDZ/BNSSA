"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion, domAnimation } from "framer-motion";
import { useEffect, useState } from "react";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    console.log(
      "%cCréer par giovweb : https://giovweb.com",
      "font-size: 20px; font-weight: 900; color: #10b981; text-shadow: 0 0 6px rgba(16, 185, 129, 0.75);",
    );
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </LazyMotion>
  );
}

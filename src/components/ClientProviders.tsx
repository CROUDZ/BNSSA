'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LazyMotion, domAnimation } from 'framer-motion';
import { useState } from 'react';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <LazyMotion features={domAnimation}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </LazyMotion>
  );
}

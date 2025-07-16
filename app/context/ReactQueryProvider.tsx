'use client'
import { QueryClient, QueryClientProvider, QueryClientConfig } from '@tanstack/react-query';
import { useState } from 'react';

export function ReactQueryProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          suspense: true,
          staleTime: Infinity,
          // refetchOnMount: false,
          // refetchOnReconnect: false,
          // refetchOnWindowFocus: false,
          // retry: false // Don't retry failed requests
        },
      },
    } as QueryClientConfig)
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
'use client';

import { Suspense } from 'react';
import Loading from './loading';
import { GameProvider } from '@/context';

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RoundLayout({
  children,
}: LayoutProps) {
  return (
    <Suspense fallback={<Loading />}>
      <GameProvider>{children}</GameProvider>
    </Suspense>
  );
}

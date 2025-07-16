'use client';

import { Suspense } from 'react';
import Loading from './loading';

type CreateRoundLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function CreateRoundLayout({
  children,
}: CreateRoundLayoutProps) {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
}

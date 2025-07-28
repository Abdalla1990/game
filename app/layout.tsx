
import './styles/globals.css';
import { AuthProvider } from './context/AuthContext';
import { ReactQueryProvider } from './context/ReactQueryProvider';
import { GameProvider } from './context';
import { Suspense } from 'react';
import Loading from './account/loading';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';

export const metadata = {
  title: 'Trivia Game',
  description: 'Trivia game with rounds and categories',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  // Determine RTL based on environment variable or locale
  const isRTL = process.env.NEXT_PUBLIC_RTL === 'true' || locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={isRTL ? 'font-arabic' : ''}>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <ReactQueryProvider>
              <Suspense fallback={<Loading />}>
                {children}
              </Suspense>
            </ReactQueryProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

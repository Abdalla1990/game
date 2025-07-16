
import './styles/globals.css';
import { AuthProvider } from './context/AuthContext';
import { ReactQueryProvider } from './context/ReactQueryProvider';
import { GameProvider } from './context';
import { Suspense } from 'react';
import Loading from './account/loading';

export const metadata = {
  title: 'Trivia Game',
  description: 'Trivia game with rounds and categories',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ReactQueryProvider>
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

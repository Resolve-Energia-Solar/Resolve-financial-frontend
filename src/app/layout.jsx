import React from 'react';
import { Providers } from '@/store/providers';
import MyApp from './app';
import './global.css';
import ErrorBoundary from './components/ErrorBoundary';

export const metadata = {
  title: 'Resolve ERP',
  description: 'Resolve ERP',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body>
        <ErrorBoundary>
          <Providers>
            <MyApp>{children}</MyApp>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

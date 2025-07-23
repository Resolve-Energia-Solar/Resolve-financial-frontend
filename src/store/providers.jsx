"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { persistor, store } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
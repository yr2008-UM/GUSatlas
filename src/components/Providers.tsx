'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '../../store';
import { CssVarsProvider } from '@mui/joy/styles';
import { CssBaseline } from '@mui/joy';
import theme from '@/theme/theme';
import NavBar from '@/components/NavBar/NavBar';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CssVarsProvider
          defaultMode="light"
          disableTransitionOnChange
          theme={theme}
        >
          <CssBaseline />
          <div style={{ minHeight: '100vh' }}>
            <NavBar />
            <main>{children}</main>
          </div>
        </CssVarsProvider>
      </PersistGate>
    </Provider>
  );
}

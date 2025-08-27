'use client';

import { CssVarsProvider } from '@mui/joy/styles';
import { CssBaseline } from '@mui/joy';
import theme from '@/theme/theme';
import NavBar from '@/components/NavBar/NavBar';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CssVarsProvider
      defaultMode="light"
      disableTransitionOnChange
      theme={theme}
    >
      <CssBaseline />
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#000000'
      }}>
        <NavBar />
        <main>{children}</main>
      </div>
    </CssVarsProvider>
  );
}

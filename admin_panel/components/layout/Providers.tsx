'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import React, { useMemo } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    const theme = useMemo(() => createTheme({
        palette: {
            primary: {
                main: '#182BA1',
                dark: '#0c1865',
            },
            secondary: {
                main: '#f97316',
            },
            background: {
                default: '#F8FAFC',
            },
        },
        typography: {
            fontFamily: 'inherit', // Використовуємо шрифт з body
            h1: { fontWeight: 900 },
            button: { textTransform: 'none', fontWeight: 600 },
        },
        shape: {
            borderRadius: 12,
        },
    }), []);

    return (
        <AppRouterCacheProvider>
            {/* ДОДАНО SessionProvider */}
            <SessionProvider basePath="/admin/api/auth">
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </SessionProvider>
        </AppRouterCacheProvider>
    );
}
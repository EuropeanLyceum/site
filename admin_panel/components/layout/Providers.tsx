'use client';

import {SessionProvider} from 'next-auth/react';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v16-appRouter';
import React, {useMemo} from 'react';

export default function Providers({children}: { children: React.ReactNode }) {
    // Створюємо кастомну тему MUI
    const theme = useMemo(() => createTheme({
        palette: {
            primary: {
                main: '#182BA1', // Ваш основний синій
                dark: '#0c1865',
            },
            secondary: {
                main: '#f97316', // Ваш акцентний помаранчевий
            },
            background: {
                default: '#F8FAFC', // Світлий фон як у прикладах
            },
        },
        typography: {
            // Підключаємо шрифт, який ми налаштували в Layout
            fontFamily: 'var(--font-montserrat-alternates), system-ui, sans-serif',
            h1: {fontWeight: 900},
            h2: {fontWeight: 800},
            h3: {fontWeight: 800},
            button: {textTransform: 'none', fontWeight: 600},
        },
        shape: {
            borderRadius: 12, // Закруглені кути для всіх елементів
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8, // Індивідуальне налаштування для кнопок
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // М'які тіні
                    },
                },
            },
        },
    }), []);

    return (
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}
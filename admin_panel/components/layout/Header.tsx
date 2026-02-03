'use client';

import { useRouter } from 'next/navigation';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    alpha
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function Header() {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            // Викликаємо API для виходу
            await fetch('/admin/api/auth/logout', {
                method: 'POST',
            });

            // Використовуємо replace, щоб очистити історію переходів
            window.location.replace('/login');
        } catch (error) {
            console.error('Logout error:', error);
            window.location.replace('/login');
        }
    };

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: '#fff',
                borderBottom: '1px solid',
                borderColor: '#e2e8f0',
                color: '#0c1865'
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                {/* Ліва частина: Привітання та Аватар */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{
                        bgcolor: alpha('#182BA1', 0.1),
                        color: '#182BA1',
                        width: 45,
                        height: 45
                    }}>
                        <AdminPanelSettingsIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" sx={{
                            fontWeight: 800,
                            lineHeight: 1.2,
                            fontFamily: 'var(--font-montserrat-alternates), sans-serif'
                        }}>
                            Вітаємо, Адміністратор
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                            Панель керування ліцеєм
                        </Typography>
                    </Box>
                </Box>

                {/* Права частина: Кнопка виходу */}
                <Button
                    onClick={handleSignOut}
                    variant="contained"
                    startIcon={<LogoutIcon />}
                    sx={{
                        bgcolor: alpha('#ef4444', 0.1),
                        color: '#ef4444',
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: 3,
                        px: 3,
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: '#ef4444',
                            color: '#fff',
                            boxShadow: '0 8px 16px rgba(239, 68, 68, 0.2)'
                        }
                    }}
                >
                    Вийти
                </Button>
            </Toolbar>
        </AppBar>
    );
}
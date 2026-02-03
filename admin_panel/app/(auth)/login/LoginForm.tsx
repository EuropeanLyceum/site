'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, FormEvent } from 'react';
import {
    Box, TextField, Button, Typography, Paper,
    CircularProgress, Container, Stack
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorParam = searchParams?.get('error');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/admin/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Сервер повернув некоректну відповідь.');
            }

            const data = await response.json();

            if (response.ok && data.success) {
                router.push('/dashboard');
            } else {
                router.push('/login?error=1');
            }
        } catch (error) {
            console.error('Login error:', error);
            router.push('/login?error=1');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #FFCB8B 0%, #D7DCE8 50%, #182BA1 100%)',
                px: 2
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={10}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        textAlign: 'center',
                        bgcolor: 'rgba(255, 255, 255, 0.92)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                >
                    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{
                            bgcolor: '#182BA1',
                            color: 'white',
                            p: 1.5,
                            borderRadius: '50%',
                            mb: 1,
                            display: 'flex',
                            boxShadow: '0 4px 12px rgba(24, 42, 161, 0.3)'
                        }}>
                            <LockOutlinedIcon />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#182BA1', letterSpacing: 1 }}>
                            ADMIN <span style={{ color: '#f97316' }}>PANEL</span>
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                            Європейський ліцей
                        </Typography>
                    </Box>

                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#334155' }}>
                        Вхід для адміністратора
                    </Typography>

                    {/* Відображення помилки на основі існуючої логіки редіректу */}
                    {errorParam && (
                        <Typography variant="body2" sx={{ color: '#d32f2f', mb: 2, fontWeight: 600 }}>
                            Неправильний логін або пароль
                        </Typography>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="Логін"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={isLoading}
                                autoComplete="username"
                            />
                            <TextField
                                fullWidth
                                label="Пароль"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={isLoading}
                                sx={{
                                    py: 1.6,
                                    mt: 1,
                                    bgcolor: '#182BA1',
                                    fontWeight: 800,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    '&:hover': { bgcolor: '#0c1865' }
                                }}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Увійти'}
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
}
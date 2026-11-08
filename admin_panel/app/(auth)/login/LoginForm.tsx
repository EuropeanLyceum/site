'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import {
    Box, Typography, TextField, Button, Paper,
    InputAdornment, IconButton, Alert, CircularProgress, alpha
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(
        searchParams?.get('error') ? 'Неправильний логін або пароль' : null
    );

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);

        try {
            // NextAuth v5 handles the POST request internally
            const result = await signIn('credentials', {
                username,
                password,
                redirect: false, // We handle redirection manually for a better UX
            });

            if (result?.error) {
                setErrorMsg('Неправильний логін або пароль');
                setIsLoading(false);
            } else {
                router.push('/dashboard');
                router.refresh(); // Ensure session state is updated
            }
        } catch (err) {
            setErrorMsg('Сталася помилка при вході. Спробуйте пізніше.');
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #FFCB8B 0%, #D7DCE8 50%, #182BA1 100%)',
            p: 3
        }}>
            <Paper elevation={0} sx={{
                p: { xs: 4, md: 6 },
                width: '100%',
                maxWidth: 450,
                borderRadius: 8,
                bgcolor: alpha('#fff', 0.92),
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.3)'
            }}>
                <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{
                        width: 60, height: 60,
                        bgcolor: '#182BA1',
                        borderRadius: 4,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mb: 2,
                        boxShadow: '0 10px 20px rgba(24, 43, 161, 0.3)'
                    }}>
                        <LoginIcon sx={{ color: '#fff', fontSize: 32 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#0c1865' }}>
                        ADMIN <span style={{ color: '#f97316' }}>PANEL</span>
                    </Typography>
                    <Typography sx={{ color: '#64748b', mt: 0.5, fontSize: '0.9rem' }}>
                        Європейський ліцей
                    </Typography>
                </Box>

                {errorMsg && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontWeight: 500 }}>
                        {errorMsg}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        placeholder="Логін"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                        required
                        sx={{ mb: 2.5 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon sx={{ color: '#182BA1' }} />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 4, bgcolor: '#fff' }
                        }}
                    />

                    <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                        sx={{ mb: 4 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon sx={{ color: '#182BA1' }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 4, bgcolor: '#fff' }
                        }}
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                            py: 1.8,
                            borderRadius: 4,
                            bgcolor: '#182BA1',
                            fontSize: '1rem',
                            fontWeight: 800,
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#0c1865' },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Увійти до системи'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}

export default function LoginForm() {
    return (
        <Suspense fallback={
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8fafc' }}>
                <CircularProgress />
            </Box>
        }>
            <LoginContent />
        </Suspense>
    );
}
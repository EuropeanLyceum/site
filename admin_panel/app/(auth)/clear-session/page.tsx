'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, Container } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export default function LogoutPage() {
    useEffect(() => {
        // Невелика затримка, щоб користувач зрозумів, що відбувається вихід
        const timer = setTimeout(() => {
            signOut({ callbackUrl: '/login' });
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 4,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                        width: '100%'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 3,
                            color: '#182BA1'
                        }}
                    >
                        <ExitToAppIcon sx={{ fontSize: 60 }} />
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#0f172a' }}>
                        Вихід із системи
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
                        Будь ласка, зачекайте. Ми завершуємо вашу сесію та готуємо перехід до сторінки входу.
                    </Typography>

                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                            size={50}
                            thickness={4}
                            sx={{ color: '#182BA1' }}
                        />
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
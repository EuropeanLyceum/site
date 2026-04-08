'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, Container, alpha } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export default function LogoutPage() {
    useEffect(() => {
        // We use a slight delay just for visual feedback
        const performLogout = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await signOut({ callbackUrl: '/login' });
        };

        performLogout();
    }, []);

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#f1f5f9'
        }}>
            <Container maxWidth="xs">
                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        textAlign: 'center',
                        borderRadius: 6,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)'
                    }}
                >
                    <Box sx={{
                        width: 70, height: 70,
                        bgcolor: alpha('#182BA1', 0.1),
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mx: 'auto', mb: 3
                    }}>
                        <ExitToAppIcon sx={{ fontSize: 40, color: '#182BA1' }} />
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: '#0f172a' }}>
                        Вихід із системи
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
                        Завершуємо вашу сесію. <br />Це займе лише мить...
                    </Typography>

                    <CircularProgress size={32} thickness={5} sx={{ color: '#182BA1' }} />
                </Paper>
            </Container>
        </Box>
    );
}
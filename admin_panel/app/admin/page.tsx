'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography, Container } from '@mui/material';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Невелике затримання можна прибрати, але воно допомагає уникнути блимання
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
      <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#F8FAFC'
          }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center' }}>
            {/* Використовуємо фірмовий синій колір для лоадера */}
            <CircularProgress
                size={60}
                thickness={4}
                sx={{ color: '#182BA1', mb: 4 }}
            />

            <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#475569',
                  fontFamily: 'var(--font-montserrat-alternates), sans-serif'
                }}
            >
              Перенаправлення на сторінку входу...
            </Typography>

            <Typography
                variant="body2"
                sx={{ color: '#94a3b8', mt: 1 }}
            >
              Будь ласка, зачекайте секунду
            </Typography>
          </Box>
        </Container>
      </Box>
  );
}
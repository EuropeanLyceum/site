'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import React from 'react';
import {
  Box, Typography, TextField, Button, Paper,
  InputAdornment, IconButton, Alert, CircularProgress, alpha
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';

// Окремий компонент форми для використання всередині Suspense
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push('/dashboard');
      } else {
        router.push('/login?error=1');
      }
    } catch (err) {
      console.error('Login error:', err);
      router.push('/login?error=1');
    } finally {
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
          bgcolor: alpha('#fff', 0.9),
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}>
          {/* Логотипна частина */}
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
            <Typography variant="h5" sx={{
              fontWeight: 900,
              color: '#0c1865',
              fontFamily: 'var(--font-montserrat-alternates), sans-serif'
            }}>
              Європейський
            </Typography>
            <Typography sx={{ color: '#64748b', mt: 1 }}>
              Вхід для адміністратора
            </Typography>
          </Box>

          {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                Неправильний логін або пароль
              </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
                fullWidth
                placeholder="Логін"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                required
                sx={{ mb: 3 }}
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
                variant="outlined"
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
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#0c1865' },
                  boxShadow: '0 10px 20px rgba(24, 43, 161, 0.2)'
                }}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Увійти до панелі'}
            </Button>
          </form>
        </Paper>
      </Box>
  );
}

export default function LoginForm() {
  return (
      <Suspense fallback={
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      }>
        <LoginContent />
      </Suspense>
  );
}
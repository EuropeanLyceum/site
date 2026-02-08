'use client';

import Link from 'next/link';
import {
  Box, Typography, Container, Grid, Paper, Button,
  alpha, Stack, SxProps, Theme
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import React from 'react';

// Визначаємо інтерфейс для карток
interface InfoCard {
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  link: string;
  btnText: string;
}

export default function HomePage() {

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>

        {/* HERO SECTION */}
        <Box sx={{
          position: 'relative',
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #0c1865 0%, #182BA1 100%)',
          color: '#fff',
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)',
          mb: 6
        }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 300, opacity: 0.9, mb: 1 }}>
                  Ліцей
                </Typography>
                <Typography variant="h1" sx={{
                  fontSize: { xs: 42, md: 72 },
                  fontWeight: 900,
                  fontFamily: "'Montserrat Alternates', sans-serif",
                  lineHeight: 1.1
                }}>
                  ЄВРОПЕЙСЬКИЙ <span style={{ color: '#f97316' }}>.</span>
                </Typography>
                <Typography sx={{ mt: 3, fontSize: '1.2rem', maxWidth: 600, opacity: 0.8 }}>
                  Творимо майбутнє разом: якісна освіта, сучасні підходи та розвиток особистості.
                </Typography>
              </Box>

              <Button
                  component={Link}
                  href="/admin"
                  variant="outlined"
                  startIcon={<AdminPanelSettingsIcon />}
                  sx={{
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': { borderColor: '#f97316', color: '#f97316' }
                  }}
              >
                Адмін
              </Button>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: -4, pb: 10 }}>
          <Paper sx={{
            mt: 10,
            p: { xs: 4, md: 8 },
            borderRadius: 8,
            bgcolor: '#fff',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 4, color: '#0c1865' }}>
              Про наш ліцей
            </Typography>
            <Typography sx={{
              fontSize: '1.1rem',
              color: '#475569',
              lineHeight: 1.8,
              maxWidth: 800,
              mx: 'auto'
            }}>
              Ліцей "Європейський" — це простір, де кожен учень знаходить свій шлях.
              Ми поєднуємо класичні академічні знання з інноваційними методиками навчання.
              Наші випускники успішно вступають до провідних університетів світу,
              зберігаючи цінності поваги, критичного мислення та відповідальності.
            </Typography>
          </Paper>
        </Container>

        {/* ФУТЕР */}
        <Box component="footer" sx={{ bgcolor: '#0c1865', color: 'rgba(255,255,255,0.6)', py: 6 }}>
          <Container maxWidth="lg">
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
              <Typography variant="body2">
                © {new Date().getFullYear()} Ліцей "Європейський". Всі права захищені.
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>
  );
}
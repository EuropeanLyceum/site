'use client';

import Link from 'next/link';
import {
  Box, Typography, Container, Grid, Paper, Button,
  alpha, Stack, SxProps, Theme
} from '@mui/material';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SchoolIcon from '@mui/icons-material/School';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
  const cards: InfoCard[] = [
    {
      title: 'Новини',
      desc: 'Останні новини та події нашого ліцею',
      icon: <NewspaperIcon sx={{ fontSize: 40 }} />,
      color: '#182BA1',
      link: '/news',
      btnText: 'Переглянути новини'
    },
    {
      title: 'Педагоги',
      desc: 'Знайомство з нашими вчителями та адміністрацією',
      icon: <PeopleAltIcon sx={{ fontSize: 40 }} />,
      color: '#f97316',
      link: '/teachers',
      btnText: 'Колектив'
    },
    {
      title: 'Про ліцей',
      desc: 'Інформація про наш сучасний навчальний заклад',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      color: '#10b981',
      link: '/about',
      btnText: 'Дізнатися більше'
    }
  ];

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
          {/* КАРТКИ ШВИДКОГО ДОСТУПУ */}
          <Grid container spacing={4}>
            {cards.map((card, index) => (
                <Grid size={{xs: 12, md: 4}} key={index}>
                  <Paper sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }
                  }}>
                    <Box sx={{
                      width: 70, height: 70,
                      borderRadius: 4,
                      bgcolor: alpha(card.color, 0.1),
                      color: card.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      mb: 3
                    }}>
                      {card.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                      {card.title}
                    </Typography>
                    <Typography sx={{ color: '#64748b', mb: 4, flexGrow: 1 }}>
                      {card.desc}
                    </Typography>
                    <Button
                        component={Link}
                        href={card.link}
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          justifyContent: 'flex-start',
                          p: 0,
                          color: card.color,
                          fontWeight: 700,
                          '&:hover': { bgcolor: 'transparent', opacity: 0.8 }
                        }}
                    >
                      {card.btnText}
                    </Button>
                  </Paper>
                </Grid>
            ))}
          </Grid>

          {/* СЕКЦІЯ ПРО НАС */}
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
              <Stack direction="row" spacing={3}>
                <MuiLink href="#">Контакти</MuiLink>
                <MuiLink href="#">Статут</MuiLink>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
  );
}

// Типізація пропсів для допоміжного компонента
interface MuiLinkProps {
  children: React.ReactNode;
  href: string;
  sx?: SxProps<Theme>;
}

function MuiLink({ children, href, sx }: MuiLinkProps) {
  return (
      <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Typography
            variant="body2"
            sx={{
              cursor: 'pointer',
              '&:hover': { color: '#f97316' },
              ...sx
            }}
        >
          {children}
        </Typography>
      </Link>
  );
}
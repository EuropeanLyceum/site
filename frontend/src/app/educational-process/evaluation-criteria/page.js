'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Container, Grid, Paper,
  Collapse, alpha, CircularProgress, Link as MuiLink,
  TextField, InputAdornment
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';

export default function EvaluationCriteria() {
  const { t, locale } = useTranslation("evaluationCriteria");
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const isEn = locale === 'en';

  // 1. Функція завантаження з параметром пошуку
  const loadSubjects = useCallback(async (query = "") => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        search: query // Передаємо запит на сервер
      });

      const res = await fetch(`/admin/api/admin/discipline?${params}`);
      if (res.ok) {
        const json = await res.json();
        setSubjects(json.data || json);
      }
    } catch (error) {
      console.error("Error loading subjects:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Дебаунс для пошуку (щоб не "бити" по API на кожну літеру)
  useEffect(() => {
    const handler = setTimeout(() => {
      loadSubjects(searchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery, loadSubjects]);

  const toggleSubject = (id) => {
    setExpandedSubject(expandedSubject === id ? null : id);
  };

  const getLocalizedName = (subject) => {
    return isEn ? (subject.nameEn || subject.name) : subject.name;
  };

  return (
      <Box sx={{
        minHeight: '100vh',
        position: 'relative',
        pb: 10,
        background: 'linear-gradient(180deg, #F5F7FA 0%, #E8ECF2 100%)'
      }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 4, md: 6 }, pt: { xs: 6, md: 8 }, textAlign: 'center' }}>
          <Typography variant="h1" sx={{
            fontSize: { xs: 32, md: 58 },
            color: '#182BA1',
            fontWeight: 900,
            fontFamily: "'Montserrat Alternates', sans-serif",
            textTransform: 'uppercase',
            px: 2
          }}>
            {t("evaluationCriteria")}
          </Typography>
          <Box sx={{ width: 80, height: 5, bgcolor: '#f97316', mx: 'auto', mt: 2, borderRadius: 2 }} />
        </Box>

        <Container maxWidth="lg">
          {/* ПОЛЕ ПОШУКУ */}
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder={isEn ? "Search subjects..." : "Пошук предметів..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  maxWidth: 600,
                  bgcolor: '#fff',
                  borderRadius: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    fontWeight: 600,
                    '& fieldset': { borderColor: alpha('#182BA1', 0.2) },
                    '&:hover fieldset': { borderColor: '#182BA1' },
                  }
                }}
                InputProps={{
                  startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#182BA1' }} />
                      </InputAdornment>
                  ),
                }}
            />
          </Box>

          {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress sx={{ color: '#182BA1' }} />
              </Box>
          ) : (
              <Grid container spacing={3}>
                {subjects.map((subject) => {
                  const localizedName = getLocalizedName(subject);
                  const isExpanded = expandedSubject === subject.id;

                  return (
                      <Grid item xs={12} sm={6} md={4} key={subject.id}>
                        <Paper
                            elevation={0}
                            sx={{
                              borderRadius: 4,
                              overflow: 'hidden',
                              border: `1px solid ${alpha('#182BA1', 0.1)}`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: `0 12px 30px ${alpha('#182BA1', 0.15)}`
                              }
                            }}
                        >
                          <Box
                              component={subject.hasSubItems ? 'div' : 'a'}
                              href={!subject.hasSubItems ? subject.url : undefined}
                              target={!subject.hasSubItems ? "_blank" : undefined}
                              rel={!subject.hasSubItems ? "noopener noreferrer" : undefined}
                              onClick={subject.hasSubItems ? () => toggleSubject(subject.id) : undefined}
                              sx={{
                                p: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                textDecoration: 'none',
                                color: 'inherit',
                                bgcolor: '#fff',
                              }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{
                                width: 50, height: 50, borderRadius: '12px',
                                bgcolor: subject.color || '#182BA1',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: 22, fontWeight: 800,
                                boxShadow: `0 4px 12px ${alpha(subject.color || '#182BA1', 0.4)}`,
                                fontFamily: "'Montserrat Alternates', sans-serif"
                              }}>
                                {localizedName.charAt(0)}
                              </Box>
                              <Typography sx={{
                                fontWeight: 700, color: '#1e2b8d',
                                fontFamily: "'Montserrat Alternates', sans-serif", fontSize: 16
                              }}>
                                {localizedName}
                              </Typography>
                            </Box>

                            {subject.hasSubItems ? (
                                <ExpandMoreIcon sx={{
                                  color: '#182BA1',
                                  transform: isExpanded ? 'rotate(180deg)' : 'none',
                                  transition: '0.3s'
                                }} />
                            ) : (
                                <LaunchIcon sx={{ fontSize: 18, color: alpha('#182BA1', 0.5) }} />
                            )}
                          </Box>

                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2, bgcolor: alpha('#F5F7FA', 0.8), borderTop: `1px solid ${alpha('#182BA1', 0.05)}` }}>
                              <Grid container spacing={1}>
                                {subject.subItems?.map((sub) => (
                                    <Grid item xs={12} key={sub.id}>
                                      <MuiLink
                                          href={sub.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          sx={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            p: 1.5, px: 2, bgcolor: '#fff', borderRadius: 2,
                                            textDecoration: 'none', color: '#333', fontSize: 14, fontWeight: 500,
                                            transition: '0.2s',
                                            '&:hover': { bgcolor: '#182BA1', color: '#fff', '& .sub-icon': { color: '#fff' } }
                                          }}
                                      >
                                        {sub.name}
                                        <LaunchIcon className="sub-icon" sx={{ fontSize: 14, color: alpha('#182BA1', 0.4) }} />
                                      </MuiLink>
                                    </Grid>
                                ))}
                              </Grid>
                            </Box>
                          </Collapse>
                        </Paper>
                      </Grid>
                  );
                })}
              </Grid>
          )}

          {!isLoading && subjects.length === 0 && (
              <Typography sx={{ textAlign: 'center', mt: 10, color: 'text.secondary', fontSize: 18 }}>
                {isEn ? "No subjects found" : "Предметів не знайдено"}
              </Typography>
          )}
        </Container>
      </Box>
  );
}
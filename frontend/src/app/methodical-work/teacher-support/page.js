'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Box, Typography, Container, Accordion, AccordionSummary,
  AccordionDetails, Link as MuiLink, CircularProgress, alpha, Grid, Paper, Stack,
  TextField, InputAdornment
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SearchIcon from '@mui/icons-material/Search';

import firebird from '@/assets/photos/firebird/firebird2.png';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';

export default function TeacherHelpPage() {
  const { t, locale } = useTranslation("teacherHelp");
  const [data, setData] = useState({
    section: null,      // Hero дані
    articles: [],       // Поради (Content)
    externalLinks: [],  // Корисні ресурси (ExternalLink)
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const isEn = locale === 'en';
  const l = (uk, en) => (isEn ? en || uk : uk);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoading(true);
        const [secRes, artRes, linkRes] = await Promise.all([
          fetch('/admin/api/admin/pageSection?type=TEACHERS_INFO'),
          fetch('/admin/api/admin/content?type=FOR_TEACHERS'),
          fetch('/admin/api/admin/externalLink?pageKey=TEACHER')
        ]);

        const sectionJson = await secRes.json();
        const articlesJson = await artRes.json();
        const linksJson = await linkRes.json();

        setData({
          section: sectionJson.data?.[0] || null,
          articles: articlesJson.data || [],
          externalLinks: linksJson.data || []
        });
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, [locale]);

  // Фільтрація порад на основі пошуку
  const filteredArticles = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return data.articles.filter(item =>
        item.titleUk?.toLowerCase().includes(query) ||
        item.titleEn?.toLowerCase().includes(query) ||
        item.textUk?.toLowerCase().includes(query) ||
        item.textEn?.toLowerCase().includes(query)
    );
  }, [data.articles, searchQuery]);

  if (isLoading) return <Box sx={{ py: 20, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 10 }}>

        {/* 1. HERO SECTION */}
        <Box sx={{
          position: 'relative', py: { xs: 10, md: 15 },
          background: 'linear-gradient(135deg, #0c1865 0%, #182BA1 100%)',
          color: '#fff', overflow: 'hidden',
          clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0% 100%)'
        }}>
          <Container maxWidth="lg">
            <Typography variant="h1" sx={{
              fontSize: { xs: 36, md: 64 },
              fontWeight: 900,
              fontFamily: "'Montserrat Alternates', sans-serif",
              mb: 2,
              textTransform: 'uppercase'
            }}>
              TEACHER <span style={{ color: '#f97316' }}>SUPPORT</span>
            </Typography>
            <Typography sx={{ maxWidth: '700px', fontSize: '1.2rem', opacity: 0.9, fontWeight: 500 }}>
              {l(data.section?.contentUk, data.section?.contentEn)}
            </Typography>
          </Container>

          <Box sx={{ position: 'absolute', right: '-5%', bottom: '10%', width: '400px', opacity: 0.2, pointerEvents: 'none' }}>
            <Image src={firebird} alt="" style={{ width: '100%', height: 'auto' }} />
          </Box>
        </Box>

        <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 10 }}>

          {/* 2. EXTERNAL LINKS (Тепер спочатку) */}
          <Box sx={{ mb: 10 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, color: '#fff', textAlign: { xs: 'center', md: 'left' }, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              {t("usefulResourcesTitle") || "Корисні ресурси"}
            </Typography>
            <Grid container spacing={2}>
              {data.externalLinks.map((link) => (
                  <Grid key={link.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Paper
                        component="a"
                        href={link.url}
                        target="_blank"
                        sx={{
                          p: 3, borderRadius: 5, display: 'flex', alignItems: 'center', gap: 2,
                          textDecoration: 'none', border: '1px solid #e2e8f0', transition: '0.3s',
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          '&:hover': { bgcolor: '#182BA1', '& .icon': { color: '#fff' }, '& .txt': { color: '#fff' } }
                        }}
                    >
                      <LaunchIcon className="icon" sx={{ color: '#f97316' }} />
                      <Typography className="txt" sx={{ fontWeight: 700, color: '#0c1865', textAlign: 'left' }}>
                        {l(link.titleUk, link.titleEn)}
                      </Typography>
                    </Paper>
                  </Grid>
              ))}
            </Grid>
          </Box>

          {/* 3. SEARCH & DYNAMIC ARTICLES */}
          <Box sx={{ mb: 4 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: 'Montserrat Alternates', color: '#0c1865' }}>
                {t("methodologicalRecommendations") || "Методичні поради"}
              </Typography>

              <TextField
                  placeholder={t("searchPlaceholder") || "Пошук порад..."}
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    width: { xs: '100%', md: '300px' },
                    bgcolor: '#fff',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                  }}
                  InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#182BA1' }} />
                        </InputAdornment>
                    ),
                  }}
              />
            </Stack>

            <Grid container spacing={3}>
              {filteredArticles.map((item) => (
                  <Grid key={item.id} size={{ xs: 12, md: 6 }}>
                    <Paper sx={{
                      p: 4, height: '100%', borderRadius: 6, display: 'flex', flexDirection: 'column',
                      transition: '0.3s', border: '1px solid #e2e8f0', boxShadow: 'none',
                      '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 30px rgba(0,0,0,0.05)', borderColor: '#182BA1' }
                    }}>
                      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                        <Box sx={{ p: 1, bgcolor: alpha('#182BA1', 0.1), borderRadius: 2, display: 'flex' }}>
                          <LightbulbIcon sx={{ color: '#182BA1' }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0c1865' }}>
                          {l(item.titleUk, item.titleEn)}
                        </Typography>
                      </Box>

                      <Typography sx={{ whiteSpace: 'pre-wrap', color: '#475569', mb: 3, lineHeight: 1.7 }}>
                        {l(item.textUk, item.textEn)}
                      </Typography>

                      {item.photoGallery?.length > 0 && (
                          <Box sx={{ mt: 'auto', pt: 2 }}>
                            <Grid container spacing={1}>
                              {item.photoGallery.slice(0, 3).map((img, i) => (
                                  <Grid key={i} size={{ xs: 4 }}>
                                    <Box sx={{ position: 'relative', height: 80, borderRadius: 2, overflow: 'hidden' }}>
                                      <Image src={img} alt="" fill style={{ objectFit: 'cover' }} />
                                    </Box>
                                  </Grid>
                              ))}
                            </Grid>
                          </Box>
                      )}
                    </Paper>
                  </Grid>
              ))}
            </Grid>

            {filteredArticles.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                  <Typography variant="h6" color="text.secondary">
                    {t("noResults") || "Нічого не знайдено за вашим запитом"}
                  </Typography>
                </Box>
            )}
          </Box>

        </Container>
      </Box>
  );
}
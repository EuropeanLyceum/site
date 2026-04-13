'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Box, Typography, Container, CircularProgress, Grid, Paper, Stack,
  TextField, InputAdornment, Pagination, alpha, Link as MuiLink
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LaunchIcon from '@mui/icons-material/Launch';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';

export default function QualificationImprovementPage() {
  const { locale } = useTranslation("qualification");

  // Статичні дані (Hero та документація)
  const [staticData, setStaticData] = useState({ section: null, externalLinks: [] });
  const [isLoadingStatic, setIsLoadingStatic] = useState(true);

  // Динамічні статті з пошуком
  const [articles, setArticles] = useState([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const isEn = locale === 'en';
  const l = (uk, en) => (isEn ? en || uk : uk);

  // 1. Завантаження статичного контенту (1 раз)
  useEffect(() => {
    const loadStatic = async () => {
      try {
        const [secRes, linkRes] = await Promise.all([
          fetch('/admin/api/admin/pageSection?type=QUALIFICATION'),
          fetch('/admin/api/admin/externalLink?pageKey=QUALIFICATION')
        ]);

        const sJson = await secRes.json();
        const lJson = await linkRes.json();

        setStaticData({
          section: sJson.data?.[0] || null,
          externalLinks: lJson.data || []
        });
      } catch (err) {
        console.error("Static data fetch error:", err);
      } finally {
        setIsLoadingStatic(false);
      }
    };
    loadStatic();
  }, []);

  // 2. Функція серверного завантаження статей
  const fetchArticles = useCallback(async (search, currentPage) => {
    setIsLoadingArticles(true);
    try {
      const params = new URLSearchParams({
        type: 'QUALIFICATION',
        limit: itemsPerPage.toString(),
        page: currentPage.toString(),
        search: search || ''
      });

      const res = await fetch(`/admin/api/admin/content?${params}`);
      const json = await res.json();

      setArticles(json.data || []);
      setTotalArticles(json.meta?.total || 0);
    } catch (err) {
      console.error("Articles fetch error:", err);
    } finally {
      setIsLoadingArticles(false);
    }
  }, []);

  // 3. Дебаунс для пошуку
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchArticles(searchQuery, page);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, page, fetchArticles]);

  if (isLoadingStatic) return <Box sx={{ py: 20, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 10 }}>
        {/* HERO SECTION */}
        <Box sx={{
          position: 'relative', py: { xs: 10, md: 15 },
          background: 'linear-gradient(135deg, #0c1865 0%, #182BA1 100%)',
          color: '#fff', overflow: 'hidden', clipPath: 'polygon(0 0, 100% 0, 100% 95%, 0% 100%)'
        }}>
          <Container maxWidth="lg">
            <Typography variant="h1" sx={{
              fontSize: { xs: 32, md: 56 },
              fontWeight: 900,
              fontFamily: "'Montserrat Alternates', sans-serif",
              mb: 2,
              textTransform: 'uppercase'
            }}>
              {l(staticData.section?.titleUk, staticData.section?.titleEn) || "Qualification Improvement"}
            </Typography>
            <Typography sx={{ maxWidth: '800px', fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6 }}>
              {l(staticData.section?.contentUk, staticData.section?.contentEn)}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 5 }}>
          {/* SEARCH & TITLE */}
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0c1865', fontFamily: "'Montserrat Alternates', sans-serif" }}>
              {l(staticData.section?.subTitleUk, staticData.section?.subTitleEn) || "Materials & Reports"}
            </Typography>
            <TextField
                size="small"
                placeholder={isEn ? "Search materials..." : "Пошук матеріалів..."}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#182BA1' }} /></InputAdornment> }}
                sx={{ width: { xs: '100%', md: 350 }, bgcolor: '#fff', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            />
          </Stack>

          {/* CONTENT LIST */}
          {isLoadingArticles ? (
              <Box sx={{ py: 10, textAlign: 'center' }}><CircularProgress /></Box>
          ) : (
              <>
                <Grid container spacing={4}>
                  {articles.map((item) => (
                      <Grid item xs={12} key={item.id}>
                        <Paper sx={{
                          p: { xs: 3, md: 5 },
                          borderRadius: 8,
                          borderLeft: '8px solid #f97316',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                          transition: '0.3s',
                          '&:hover': { transform: 'translateX(10px)' }
                        }}>
                          <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: '#0c1865' }}>
                            {l(item.titleUk, item.titleEn)}
                          </Typography>

                          <Typography sx={{ whiteSpace: 'pre-wrap', color: '#475569', lineHeight: 1.8, fontSize: '1.1rem', mb: 4 }}>
                            {l(item.textUk, item.textEn)}
                          </Typography>

                          {item.photoGallery?.length > 0 && (
                              <Grid container spacing={2}>
                                {item.photoGallery.map((img, i) => (
                                    <Grid item xs={12} sm={6} md={4} key={i}>
                                      <Box sx={{ position: 'relative', height: 250, borderRadius: 4, overflow: 'hidden' }}>
                                        <Image src={img} alt="" fill style={{ objectFit: 'cover' }} />
                                      </Box>
                                    </Grid>
                                ))}
                              </Grid>
                          )}

                          {item.videoUrl && (
                              <Box sx={{ mt: 3, color: '#182BA1', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LaunchIcon fontSize="small" />
                                <MuiLink href={item.videoUrl} target="_blank" sx={{ fontWeight: 700 }}>
                                  {isEn ? "Watch Video Materials" : "Переглянути відеоматеріали"}
                                </MuiLink>
                              </Box>
                          )}
                        </Paper>
                      </Grid>
                  ))}
                </Grid>

                {articles.length === 0 && (
                    <Typography sx={{ textAlign: 'center', py: 10, color: 'text.secondary', fontStyle: 'italic' }}>
                      {isEn ? "No results found" : "Нічого не знайдено"}
                    </Typography>
                )}

                {totalArticles > itemsPerPage && (
                    <Stack alignItems="center" sx={{ mt: 6 }}>
                      <Pagination
                          count={Math.ceil(totalArticles / itemsPerPage)}
                          page={page}
                          onChange={(_, v) => {
                            setPage(v);
                            window.scrollTo({ top: 400, behavior: 'smooth' });
                          }}
                          color="primary"
                      />
                    </Stack>
                )}
              </>
          )}

          {/* DOCUMENTATION SECTION */}
          <Box sx={{
            mt: 12, p: { xs: 4, md: 8 }, borderRadius: 10,
            bgcolor: '#fff', border: '2px solid #e2e8f0'
          }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 5 }}>
              <AssignmentIcon sx={{ color: '#f97316', fontSize: 40 }} />
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#0c1865' }}>
                {isEn ? "Documentation" : "Документація"}
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              {staticData.externalLinks.map((link) => (
                  <Grid item xs={12} md={6} key={link.id}>
                    <Paper
                        component="a"
                        href={link.url}
                        target="_blank"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 3,
                          borderRadius: 4,
                          textDecoration: 'none',
                          border: '1px solid #f1f5f9',
                          transition: '0.3s',
                          '&:hover': {
                            bgcolor: alpha('#182BA1', 0.05),
                            borderColor: '#182BA1',
                            '& .doc-icon': { color: '#182BA1' }
                          }
                        }}
                    >
                      <Typography sx={{ fontWeight: 700, color: '#334155' }}>
                        {l(link.titleUk, link.titleEn)}
                      </Typography>
                      <LaunchIcon className="doc-icon" sx={{ color: '#cbd5e1', fontSize: 20 }} />
                    </Paper>
                  </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
  );
}
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Container, Grid, Paper,
  alpha, CircularProgress, Link as MuiLink, Stack,
  Pagination, TextField, InputAdornment, IconButton, Button
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard.jsx";

export default function PsychologicalSupport() {
  const { t, locale } = useTranslation("psychological");

  // Статичні дані (Hero, Психолог, Посилання)
  const [staticData, setStaticData] = useState({
    hero: null,
    psychologist: null,
    links: []
  });

  // Динамічні статті з пошуком
  const [articles, setArticles] = useState([]);
  const [totalArticles, setTotalArticles] = useState(0);

  const [isLoadingStatic, setIsLoadingStatic] = useState(true);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [expandedItem, setExpandedItem] = useState(null);
  const [gallery, setGallery] = useState({ open: false, images: [], index: 0 });

  const isEn = locale === 'en';
  const l = (uk, en) => (isEn ? en || uk : uk);

  // 1. Завантаження статичного контенту (1 раз)
  useEffect(() => {
    const loadStatic = async () => {
      try {
        const [heroRes, personRes, linkRes] = await Promise.all([
          fetch('/admin/api/admin/pageSection?type=PSYCHOLOGICAL'),
          fetch('/admin/api/admin/person?type=PSYCHOLOGIST&limit=1'),
          fetch('/admin/api/admin/externalLink?pageKey=PSYCHOLOGICAL')
        ]);

        const heroJson = await heroRes.json();
        const personJson = await personRes.json();
        const linkJson = await linkRes.json();

        setStaticData({
          hero: heroJson.data?.[0] || null,
          psychologist: personJson.data?.[0] || null,
          links: linkJson.data || []
        });
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
        type: 'PSYCHOLOGICAL',
        limit: itemsPerPage.toString(),
        page: currentPage.toString(),
        search: search || ''
      });

      const res = await fetch(`/admin/api/admin/content?${params}`);
      const json = await res.json();

      const formatted = (json.data || []).map(item => ({
        ...item,
        title: item.titleUk,
        titleEn: item.titleEn,
        text: item.textUk,
        textEn: item.textEn,
        images: item.photoGallery || [],
        date: item.publicationDate ? new Date(item.publicationDate).toLocaleDateString(isEn ? 'en-GB' : 'uk-UA') : ''
      }));

      setArticles(formatted);
      setTotalArticles(json.meta?.total || 0);
    } catch (err) {
      console.error("Articles fetch error:", err);
    } finally {
      setIsLoadingArticles(false);
    }
  }, [isEn]);

  // Дебаунс для пошуку
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchArticles(searchQuery, page);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, page, fetchArticles]);

  const handleImageClick = (images, index) => {
    setGallery({ open: true, images, index });
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setGallery({ open: false, images: [], index: 0 });
    document.body.style.overflow = 'unset';
  };

  if (isLoadingStatic) return <Box sx={{ py: 20, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F5F7FA', pb: 10 }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 600, background: 'linear-gradient(180deg, rgba(24, 43, 161, 0.08) 0%, rgba(245,247,250,0) 100%)', zIndex: 0 }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: 8 }}>

          {/* --- HERO --- */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: 34, md: 54 }, color: '#182BA1', fontWeight: 900, mb: 2, fontFamily: "'Montserrat Alternates', sans-serif" }}>
              {staticData.hero ? l(staticData.hero.titleUk, staticData.hero.titleEn) : t("psychologicalSupport")}
            </Typography>
            <Box sx={{ width: 60, height: 4, bgcolor: '#f97316', mx: 'auto', mb: 3, borderRadius: 2 }} />
            {staticData.hero?.contentUk && (
                <Typography sx={{ maxWidth: 800, mx: 'auto', color: '#475569', fontSize: 18, lineHeight: 1.6 }}>
                  {l(staticData.hero.contentUk, staticData.hero.contentEn)}
                </Typography>
            )}
          </Box>

          {/* --- PSYCHOLOGIST CARD --- */}
          {staticData.psychologist && (
              <Paper elevation={0} sx={{ borderRadius: 8, overflow: 'hidden', bgcolor: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.03)', mb: 10 }}>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ position: 'relative', height: { xs: 400, md: '100%' }, minHeight: 450 }}>
                      <Image src={staticData.psychologist.photo} alt="Psychologist" fill style={{ objectFit: 'cover' }} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8} sx={{ p: { xs: 4, md: 6 } }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#0c1865', mb: 1 }}>{l(staticData.psychologist.fullNameUk, staticData.psychologist.fullNameEn)}</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#f97316', fontWeight: 700, mb: 3 }}>{l(staticData.psychologist.positionUk, staticData.psychologist.positionEn)}</Typography>
                    <Typography sx={{ mb: 4, color: '#475569', lineHeight: 1.8 }}>{l(staticData.psychologist.descriptionUk, staticData.psychologist.descriptionEn)}</Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={1.5} alignItems="center" mb={1}><SchoolIcon sx={{ color: '#182BA1' }} /><Typography fontWeight={700}>{t("specialization")}</Typography></Stack>
                        <Typography variant="body2">{l(staticData.psychologist.specializationUk, staticData.psychologist.specializationEn)}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={1.5} alignItems="center" mb={1}><ContactSupportIcon sx={{ color: '#182BA1' }} /><Typography fontWeight={700}>{t("howToContact")}</Typography></Stack>
                        <Typography variant="body2">Email: <b>{staticData.psychologist.email}</b></Typography>
                        <Typography variant="body2">Тел: <b>{staticData.psychologist.phone}</b></Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
          )}

          {/* --- LINKS SECTION --- */}
          <Box sx={{ mb: 12 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, color: '#0c1865', textAlign: 'center' }}>{t("usefulResources")}</Typography>
            <Grid container spacing={2}>
              {staticData.links.map((link) => (
                  <Grid item xs={12} sm={6} md={4} key={link.id}>
                    <Paper component="a" href={link.url} target="_blank" sx={{ p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none', transition: '0.3s', border: '1px solid #e2e8f0', '&:hover': { transform: 'translateY(-5px)', borderColor: '#182BA1' } }}>
                      <LaunchIcon sx={{ color: '#f97316' }} />
                      <Typography fontWeight={700} color="#0c1865">{l(link.titleUk, link.titleEn)}</Typography>
                    </Paper>
                  </Grid>
              ))}
            </Grid>
          </Box>

          {/* --- ARTICLES SECTION (SEARCH + CARDS) --- */}
          <Box id="articles-section">
            <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 900, mb: 4, color: '#0c1865', fontFamily: "'Montserrat Alternates', sans-serif" }}>
              {t("usefulArticles")}
            </Typography>

            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
              <TextField
                  fullWidth placeholder={t('searchPlaceholder') || "Пошук статтей..."}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  sx={{ maxWidth: 600, bgcolor: '#fff', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment> }}
              />
            </Box>

            {isLoadingArticles ? (
                <Box sx={{ py: 10, textAlign: 'center' }}><CircularProgress /></Box>
            ) : (
                <Stack spacing={4}>
                  {articles.map(item => (
                      <UndefinedNewsCard
                          key={item.id}
                          item={item}
                          locale={locale}
                          t={t}
                          isExpanded={expandedItem === item.id}
                          onReadMore={(id) => setExpandedItem(expandedItem === id ? null : id)}
                          onImageClick={handleImageClick}
                      />
                  ))}
                  {articles.length === 0 && <Typography sx={{ textAlign: 'center', py: 5 }}>Нічого не знайдено</Typography>}
                </Stack>
            )}

            {totalArticles > itemsPerPage && (
                <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                      count={Math.ceil(totalArticles / itemsPerPage)}
                      page={page}
                      onChange={(e, v) => { setPage(v); window.scrollTo({ top: 1000, behavior: 'smooth' }); }}
                      color="primary"
                      size="large"
                  />
                </Box>
            )}
          </Box>
        </Container>
      </Box>
  );
}
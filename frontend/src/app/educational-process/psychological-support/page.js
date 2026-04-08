'use client';

import { useState, useEffect, useMemo } from 'react';
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

const ITEMS_PER_PAGE = 5;

export default function PsychologicalSupport() {
  const { t, locale } = useTranslation("psychological");

  const [data, setData] = useState({
    hero: null,
    psychologist: null,
    articles: [],
    links: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItem, setExpandedItem] = useState(null);
  const [gallery, setGallery] = useState({ open: false, images: [], index: 0 });

  const isEn = locale === 'en';
  const l = (uk, en) => (isEn ? en || uk : uk);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [heroRes, personRes, contentRes, linkRes] = await Promise.all([
          fetch('/admin/api/admin/pageSection?type=PSYCHOLOGICAL'),
          fetch('/admin/api/admin/person?type=PSYCHOLOGIST&limit=1'),
          fetch('/admin/api/admin/content?type=PSYCHOLOGICAL'),
          fetch('/admin/api/admin/externalLink?pageKey=PSYCHOLOGICAL')
        ]);

        const heroData = await heroRes.json();
        const personData = await personRes.json();
        const contentData = await contentRes.json();
        const linkData = await linkRes.json();

        setData({
          hero: heroData.data?.[0] || null,
          psychologist: personData.data?.[0] || null,
          articles: (contentData.data || []).map(item => ({
            ...item,
            // Мапінг під формат UndefinedNewsCard
            title: item.titleUk,
            titleEn: item.titleEn,
            text: item.textUk,
            textEn: item.textEn,
            images: item.photoGallery || [],
            date: item.publicationDate ? new Date(item.publicationDate).toLocaleDateString(locale === 'en' ? 'en-GB' : 'uk-UA') : ''
          })),
          links: linkData.data || []
        });
      } catch (err) {
        console.error("Failed to fetch psychological data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [locale]);

  // --- Логіка галереї ---
  const handleImageClick = (images, index) => {
    setGallery({ open: true, images, index });
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setGallery({ open: false, images: [], index: 0 });
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction) => {
    const newIndex = (gallery.index + direction + gallery.images.length) % gallery.images.length;
    setGallery(prev => ({ ...prev, index: newIndex }));
  };

  // --- Пошук та Пагінація ---
  const filteredArticles = useMemo(() => {
    return data.articles.filter(item => {
      const search = searchQuery.toLowerCase();
      return (
          item.titleUk?.toLowerCase().includes(search) ||
          item.titleEn?.toLowerCase().includes(search) ||
          item.textUk?.toLowerCase().includes(search) ||
          item.textEn?.toLowerCase().includes(search)
      );
    });
  }, [data.articles, searchQuery]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (isLoading) return <Box sx={{ py: 20, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F5F7FA', pb: 10 }}>
        {/* Hero Background */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 600, background: 'linear-gradient(180deg, rgba(24, 43, 161, 0.08) 0%, rgba(245,247,250,0) 100%)', zIndex: 0 }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: 8 }}>

          {/* --- HERO --- */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: 34, md: 54 }, color: '#182BA1', fontWeight: 900, mb: 2, fontFamily: "'Montserrat Alternates', sans-serif" }}>
              {data.hero ? l(data.hero.titleUk, data.hero.titleEn) : t("psychologicalSupport")}
            </Typography>
            <Box sx={{ width: 60, height: 4, bgcolor: '#f97316', mx: 'auto', mb: 3, borderRadius: 2 }} />
            {data.hero?.contentUk && (
                <Typography sx={{ maxWidth: 800, mx: 'auto', color: '#475569', fontSize: 18, lineHeight: 1.6 }}>
                  {l(data.hero.contentUk, data.hero.contentEn)}
                </Typography>
            )}
          </Box>

          {/* --- PSYCHOLOGIST CARD --- */}
          {data.psychologist && (
              <Paper elevation={0} sx={{ borderRadius: 8, overflow: 'hidden', bgcolor: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.03)', mb: 10 }}>
                <Grid container>
                  <Grid item size={{xs: 12, md: 4}}>
                    <Box sx={{ position: 'relative', height: { xs: 400, md: '100%' }, minHeight: 450 }}>
                      <Image src={data.psychologist.photo} alt="Psychologist" fill style={{ objectFit: 'cover' }} />
                    </Box>
                  </Grid>
                  <Grid item size={{xs: 12, md: 8}} sx={{ p: { xs: 4, md: 6 } }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#0c1865', mb: 1 }}>{l(data.psychologist.fullNameUk, data.psychologist.fullNameEn)}</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#f97316', fontWeight: 700, mb: 3 }}>{l(data.psychologist.positionUk, data.psychologist.positionEn)}</Typography>
                    <Typography sx={{ mb: 4, color: '#475569', lineHeight: 1.8 }}>{l(data.psychologist.descriptionUk, data.psychologist.descriptionEn)}</Typography>

                    <Grid container spacing={3}>
                      <Grid item size={{xs: 12, sm: 6}}>
                        <Stack direction="row" spacing={1.5} alignItems="center" mb={1}><SchoolIcon sx={{ color: '#182BA1' }} /><Typography fontWeight={700}>{t("specialization")}</Typography></Stack>
                        <Typography variant="body2">{l(data.psychologist.specializationUk, data.psychologist.specializationEn)}</Typography>
                      </Grid>
                      <Grid item size={{xs: 12, sm: 6}}>
                        <Stack direction="row" spacing={1.5} alignItems="center" mb={1}><ContactSupportIcon sx={{ color: '#182BA1' }} /><Typography fontWeight={700}>{t("howToContact")}</Typography></Stack>
                        <Typography variant="body2">Email: <b>{data.psychologist.email}</b></Typography>
                        <Typography variant="body2">Тел: <b>{data.psychologist.phone}</b></Typography>
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
              {data.links.map((link) => (
                  <Grid item size={{xs: 12, sm: 6, md: 4}} key={link.id}>
                    <Paper component="a" href={link.url} target="_blank" sx={{ p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none', transition: '0.3s', border: '1px solid #e2e8f0', '&:hover': { transform: 'translateY(-5px)', borderColor: '#182BA1', boxShadow: '0 10px 20px rgba(24, 43, 161, 0.05)' } }}>
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
                  sx={{ maxWidth: 600, bgcolor: '#fff', borderRadius: 4, '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment> }}
              />
            </Box>

            <Stack spacing={4}>
              {paginatedArticles.map(item => (
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
            </Stack>

            {totalPages > 1 && (
                <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                  <Pagination count={totalPages} page={page} onChange={(e, v) => { setPage(v); document.getElementById('articles-section').scrollIntoView({ behavior: 'smooth' }); }} color="primary" size="large" />
                </Box>
            )}
          </Box>
        </Container>

        {/* --- GALLERY MODAL --- */}
        {gallery.open && (
            <Box onClick={closeGallery} sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
              <IconButton onClick={closeGallery} sx={{ position: 'absolute', top: 20, right: 20, color: '#fff' }}><CloseIcon fontSize="large" /></IconButton>
              <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'relative', width: '100%', maxWidth: 1000, height: '70vh' }}>
                <Image src={gallery.images[gallery.index]} alt="Gallery" fill style={{ objectFit: 'contain' }} />
                {gallery.images.length > 1 && (
                    <>
                      <Button onClick={() => navigateImage(-1)} sx={{ position: 'absolute', left: -60, color: '#fff', fontSize: 40 }}>❮</Button>
                      <Button onClick={() => navigateImage(1)} sx={{ position: 'absolute', right: -60, color: '#fff', fontSize: 40 }}>❯</Button>
                    </>
                )}
              </Box>
            </Box>
        )}
      </Box>
  );
}
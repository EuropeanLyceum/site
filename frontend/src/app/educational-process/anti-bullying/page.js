'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Box, Typography, Container, Grid, Paper,
  Button, CircularProgress, alpha, Stack, TextField, InputAdornment, IconButton, Pagination
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DescriptionIcon from '@mui/icons-material/Description';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import firebird3 from '@/assets/photos/firebird/firebird3.png';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard.jsx";

const ITEMS_PER_PAGE = 5;

export default function Antibullying() {
  const { t, locale } = useTranslation("anti");

  const [data, setData] = useState({
    section: null,      // Hero дані
    articles: [],       // Статті (Content)
    externalLinks: [],  // Документи (ExternalLink)
  });

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItem, setExpandedItem] = useState(null);
  const [gallery, setGallery] = useState({ open: false, images: [], index: 0 });

  const isEn = locale === 'en';
  const l = (uk, en) => (isEn ? en || uk : uk);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoading(true);
        const [secRes, artRes, linkRes] = await Promise.all([
          fetch('/admin/api/admin/pageSection?type=ANTI_BULLYING'),
          fetch('/admin/api/admin/content?type=ANTI_BULLYING'),
          fetch('/admin/api/admin/externalLink?pageKey=BULLYING')
        ]);

        const sectionJson = await secRes.json();
        const articlesJson = await artRes.json();
        const linksJson = await linkRes.json();

        setData({
          section: sectionJson.data?.[0] || null,
          articles: (articlesJson.data || []).map(item => ({
            ...item,
            title: item.titleUk,
            titleEn: item.titleEn,
            text: item.textUk,
            textEn: item.textEn,
            images: item.photoGallery || [],
            date: item.publicationDate ? new Date(item.publicationDate).toLocaleDateString(locale === 'en' ? 'en-GB' : 'uk-UA') : ''
          })),
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

        {/* 1. HERO SECTION */}
        <Box sx={{
          position: 'relative', mb: 6, p: { xs: 4, md: 10 }, overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(24, 43, 161, 0.08) 0%, rgba(245,247,250,0) 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}>
          <Typography variant="h1" sx={{
            fontFamily: 'Montserrat Alternates, sans-serif', fontWeight: 900,
            fontSize: { xs: '32px', md: '52px' }, color: '#182BA1', zIndex: 2, mb: 2
          }}>
            {l(data.section?.titleUk, data.section?.titleEn) || t("antiBullying")}
          </Typography>
          <Box sx={{ width: 80, height: 4, bgcolor: '#f97316', mb: 3, borderRadius: 2, zIndex: 2 }} />
          <Typography sx={{ maxWidth: '800px', color: '#475569', zIndex: 2, fontSize: '1.1rem', lineHeight: 1.8 }}>
            {l(data.section?.contentUk, data.section?.contentEn)}
          </Typography>

          <Box sx={{ position: 'absolute', top: '10%', right: '-5%', width: { xs: '200px', md: '350px' }, opacity: 0.1, zIndex: 1 }}>
            <Image src={firebird3} alt="" priority style={{ width: '100%', height: 'auto' }} />
          </Box>
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>

          {/* 2. CHATBOT CARD */}
          <Paper elevation={0} sx={{
            p: { xs: 4, md: 6 }, borderRadius: 8, mb: 10, color: '#fff',
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            position: 'relative', overflow: 'hidden', textAlign: 'center',
            boxShadow: '0 20px 40px rgba(234, 88, 12, 0.2)'
          }}>
            <Stack spacing={3} sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <SmartToyIcon sx={{ fontSize: 50 }} />
                <Typography variant="h3" sx={{ fontWeight: 900, fontFamily: 'Montserrat Alternates' }}>
                  {t("schoolChatbot")}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 500, maxWidth: 700, mx: 'auto' }}>
                {t("chatbotDescription")}
              </Typography>
              <Box>
                <Button variant="contained" href="http://t.me/ProBullyingBot" target="_blank"
                        sx={{ bgcolor: '#fff', color: '#ea580c', fontWeight: 900, px: 6, py: 2, fontSize: '1.1rem', borderRadius: 10, '&:hover': { bgcolor: '#f1f1f1', transform: 'scale(1.05)' }, transition: '0.3s' }}>
                  @ProBullyingBot
                </Button>
              </Box>
            </Stack>
            <SmartToyIcon sx={{ position: 'absolute', left: -40, bottom: -40, fontSize: 250, opacity: 0.1, transform: 'rotate(15deg)' }} />
          </Paper>

          <Grid container spacing={6}>
            {/* 3. EXTERNAL LINKS (Корисні документи) */}
            <Grid item size={{xs: 12, md: 4}}>
              <Box sx={{ position: 'sticky', top: 100 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0c1865', mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <DescriptionIcon sx={{ color: '#f97316' }} /> {t("usefulDocuments")}
                </Typography>
                <Stack spacing={2}>
                  {data.externalLinks.map((link) => (
                      <Paper key={link.id} component="a" href={link.url} target="_blank"
                             sx={{
                               p: 3, borderRadius: 4, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2,
                               border: '1px solid #e2e8f0', bgcolor: '#fff', transition: '0.3s',
                               '&:hover': { borderColor: '#182BA1', transform: 'translateX(8px)', boxShadow: '0 8px 20px rgba(24,43,161,0.08)' }
                             }}>
                        <LaunchIcon sx={{ color: '#182BA1', fontSize: 20 }} />
                        <Typography sx={{ color: '#334155', fontWeight: 700 }}>
                          {l(link.titleUk, link.titleEn)}
                        </Typography>
                      </Paper>
                  ))}
                </Stack>
              </Box>
            </Grid>

            {/* 4. DYNAMIC ARTICLES (Пошук + Картки) */}
            <Grid item size={{xs: 12, md: 8}}>
              <Box id="articles-section">
                <Box sx={{ mb: 6 }}>
                  <TextField
                      fullWidth placeholder={t('searchPlaceholder') || "Пошук статтей..."}
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                      sx={{ bgcolor: '#fff', borderRadius: 4, '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
                      InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment> }}
                  />
                </Box>

                <Stack spacing={4}>
                  {paginatedArticles.map(article => (
                      <UndefinedNewsCard
                          key={article.id}
                          item={article}
                          locale={locale}
                          t={t}
                          isExpanded={expandedItem === article.id}
                          onReadMore={(id) => setExpandedItem(expandedItem === id ? null : id)}
                          onImageClick={handleImageClick}
                      />
                  ))}
                  {paginatedArticles.length === 0 && (
                      <Typography sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
                        За вашим запитом нічого не знайдено
                      </Typography>
                  )}
                </Stack>

                {totalPages > 1 && (
                    <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                      <Pagination
                          count={totalPages}
                          page={page}
                          onChange={(e, v) => { setPage(v); document.getElementById('articles-section').scrollIntoView({ behavior: 'smooth' }); }}
                          color="primary"
                          size="large"
                      />
                    </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* 5. GALLERY MODAL */}
        {gallery.open && (
            <Box onClick={closeGallery} sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.92)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
              <IconButton onClick={closeGallery} sx={{ position: 'absolute', top: 20, right: 20, color: '#fff' }}><CloseIcon fontSize="large" /></IconButton>
              <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'relative', width: '100%', maxWidth: 1000, height: '75vh' }}>
                <Image src={gallery.images[gallery.index]} alt="Gallery" fill style={{ objectFit: 'contain' }} />
                {gallery.images.length > 1 && (
                    <>
                      <Button onClick={() => navigateImage(-1)} sx={{ position: 'absolute', left: { xs: 0, md: -70 }, color: '#fff', fontSize: 50 }}>❮</Button>
                      <Button onClick={() => navigateImage(1)} sx={{ position: 'absolute', right: { xs: 0, md: -70 }, color: '#fff', fontSize: 50 }}>❯</Button>
                    </>
                )}
              </Box>
            </Box>
        )}
      </Box>
  );
}
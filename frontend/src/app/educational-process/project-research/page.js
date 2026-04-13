'use client';
import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Container, CircularProgress, IconButton, Grid } from '@mui/material';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import UnifiedNewsLayout from "@/components/shared/UnifiedNewsLayout";

export default function ProjectResearchPage() {
  const { t, locale } = useTranslation('projects');
  const [loadingSection, setLoadingSection] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);

  // Стан для збільшення головного фото
  const [isPhotoExpanded, setIsPhotoExpanded] = useState(false);

  // 1. Завантаження статичної секції
  useEffect(() => {
    const fetchSection = async () => {
      try {
        const res = await fetch(`/admin/api/admin/pageSection?type=PROJECT_RESEARCH`);
        const json = await res.json();
        setPageData(Array.isArray(json.data) ? json.data[0] : json);
      } catch (error) {
        console.error("Section fetch error:", error);
      } finally {
        setLoadingSection(false);
      }
    };
    fetchSection();
  }, []);

  // 2. ФУНКЦІЯ ПОШУКУ
  const fetchPosts = useCallback(async ({ search, page }) => {
    setLoadingPosts(true);
    try {
      const limit = 5;
      const query = new URLSearchParams({
        type: 'PROJECTS',
        limit: limit.toString(),
        page: page.toString(),
        search: search || ''
      });

      const res = await fetch(`/admin/api/admin/content?${query}`);
      const json = await res.json();

      const formatted = (json.data || []).map(item => ({
        id: item.id,
        title: item.titleUk,
        titleEn: item.titleEn,
        text: item.textUk,
        textEn: item.textEn,
        images: item.photoGallery || [],
        date: new Date(item.publicationDate || item.createdAt).toLocaleDateString('uk-UA')
      }));

      setPosts(formatted);
      setTotalPosts(json.meta?.total || 0);
    } catch (error) {
      console.error("Posts fetch error:", error);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  if (loadingSection) return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#0c1865' }} />
      </Box>
  );

  const isEn = locale === 'en';
  const displayTitle = isEn ? (pageData?.titleEn || pageData?.titleUk) : pageData?.titleUk;
  const displayDesc = isEn ? (pageData?.contentEn || pageData?.contentUk) : pageData?.contentUk;
  const heroPhoto = pageData?.imagePhoto;

  return (
      <Box component="main" sx={{ background: '#F8FAFC', minHeight: '100vh', pb: 10 }}>

        {/* HERO БЛОК (Синій фон із заголовком) */}
        <Box sx={{
          background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
          pt: { xs: 12, md: 16 },
          pb: { xs: 16, md: 22 }, // Більший відступ знизу, щоб картка тексту "наїжджала" на фон
          color: '#fff',
          position: 'relative',
          zIndex: 1
        }}>
          <Container maxWidth="lg">
            <Typography variant="h1" sx={{
              fontSize: { xs: 36, md: 56 },
              fontWeight: 900,
              textAlign: 'center',
              textTransform: 'uppercase',
              textShadow: '0 10px 20px rgba(0,0,0,0.2)',
              fontFamily: "'Montserrat Alternates', sans-serif"
            }}>
              {displayTitle || t('pageTitle')}
            </Typography>
          </Container>
        </Box>

        {/* БЛОК З КОНТЕНТОМ ТА ФОТО (Наїжджає на синій фон) */}
        <Container maxWidth="lg" sx={{ mt: { xs: -8, md: -12 }, position: 'relative', zIndex: 2 }}>

          {/* ГОЛОВНЕ ФОТО (Якщо воно є) */}
          {heroPhoto && (
              <Box
                  onClick={() => setIsPhotoExpanded(true)}
                  sx={{
                    width: '100%',
                    height: { xs: 300, md: 500 },
                    position: 'relative',
                    borderRadius: 4,
                    overflow: 'hidden',
                    mb: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    '&:hover img': { transform: 'scale(1.02)' },
                    transition: 'transform 0.3s ease'
                  }}
              >
                <Image src={heroPhoto} fill style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} alt="Main section image" priority />
              </Box>
          )}

          {/* ЖУРНАЛЬНА КАРТКА ДЛЯ ТЕКСТУ */}
          {displayDesc && (
              <Box
                  className="rich-text-content"
                  // Якщо текст з HTML (візуальний редактор) — він відрендериться правильно
                  // Якщо це просто текст з ентерами — він збереже абзаци завдяки whiteSpace
                  dangerouslySetInnerHTML={{ __html: displayDesc }}
                  sx={{
                    bgcolor: '#fff',
                    p: { xs: 3, md: 6 },
                    borderRadius: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    mb: 8,
                    whiteSpace: 'pre-wrap', // Зберігає звичайні абзаци, якщо немає HTML

                    // --- ГЛОБАЛЬНІ СТИЛІ ДЛЯ ТЕКСТУ ВСЕРЕДИНІ ---
                    '& h1, & h2, & h3, & h4': {
                      color: '#0c1865',
                      fontWeight: 800,
                      mt: 4,
                      mb: 2,
                      fontFamily: "'Montserrat Alternates', sans-serif"
                    },
                    '& h2': { fontSize: { xs: 24, md: 32 } },
                    '& h3': { fontSize: { xs: 20, md: 26 }, color: '#182BA1' },
                    '& p': {
                      fontSize: { xs: 16, md: 18 },
                      lineHeight: 1.8,
                      color: '#334155',
                      mb: 3,
                      textAlign: 'justify'
                    },
                    '& ul, & ol': {
                      pl: 4,
                      mb: 3,
                      fontSize: { xs: 16, md: 18 },
                      color: '#334155',
                      lineHeight: 1.8
                    },
                    '& li': { mb: 1 },
                    '& img': {
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: 3,
                      my: 4,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    },
                    '& a': {
                      color: '#182BA1',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' }
                    }
                  }}
              />
          )}
        </Container>

        {/* СПИСОК ПРОЕКТІВ (UnifiedNewsLayout) */}
        <Box sx={{ position: 'relative', zIndex: 5, mt: 4 }}>
          <UnifiedNewsLayout
              translationKey="projects"
              data={posts}
              totalCount={totalPosts}
              isLoading={loadingPosts}
              onParamsChange={fetchPosts}
              heroOff={true}
          />
        </Box>

        {/* МОДАЛЬНЕ ВІКНО ДЛЯ ЗБІЛЬШЕННЯ ГОЛОВНОГО ФОТО */}
        {isPhotoExpanded && heroPhoto && (
            <Box onClick={() => setIsPhotoExpanded(false)} sx={{
              position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.9)',
              zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2
            }}>
              <IconButton onClick={() => setIsPhotoExpanded(false)} sx={{ position: 'absolute', top: 20, right: 20, color: '#fff' }}>
                <CloseIcon fontSize="large" />
              </IconButton>
              <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'relative', width: '90%', maxWidth: 1200, height: '85vh' }}>
                <Image src={heroPhoto} alt="Expanded" fill style={{ objectFit: 'contain' }} />
              </Box>
            </Box>
        )}
      </Box>
  );
}
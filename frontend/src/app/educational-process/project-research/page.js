'use client';
import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Container, CircularProgress, IconButton, Button, Grid } from '@mui/material';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard.jsx";
import UnifiedNewsLayout from "@/components/shared/UnifiedNewsLayout"; // Використовуємо його як основу

export default function ProjectResearchPage() {
  const { t, locale } = useTranslation('projects');
  const [loadingSection, setLoadingSection] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);

  const [gallery, setGallery] = useState({ open: false, images: [], index: 0 });
  const [expandedItem, setExpandedItem] = useState(null);

  // 1. Завантаження статичної секції (виконується один раз)
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

  // 2. ФУНКЦІЯ ПОШУКУ (Серверна логіка)
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

  // Логіка галереї
  const handleImageClick = (images, index) => {
    if (!images || images.length === 0) return;
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

  if (loadingSection) return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#0c1865' }} />
      </Box>
  );

  const isEn = locale === 'en';
  const displayTitle = isEn ? (pageData?.titleEn || pageData?.titleUk) : pageData?.titleUk;
  const displayDesc = isEn ? (pageData?.contentEn || pageData?.contentUk) : pageData?.contentUk;
  const heroParagraphs = displayDesc?.split(/\n\n+/).filter(p => p.trim()) || [];
  const heroPhotos = pageData?.imagePhoto ? [pageData.imagePhoto] : [];

  return (
      <Box component="main" sx={{ background: '#F8FAFC', minHeight: '100vh' }}>

        {/* HERO SECTION (Static Content) */}
        <Box sx={{
          background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
          pt: { xs: 8, md: 10 },
          pb: { xs: 12, md: 24 },
          color: '#fff',
          clipPath: { md: 'ellipse(140% 100% at 50% 0%)', xs: 'none' },
          position: 'relative',
          zIndex: 1
        }}>
          <Container maxWidth="lg">
            <Typography variant="h1" sx={{
              fontSize: { xs: 32, md: 52 },
              fontWeight: 900,
              mb: 6,
              textAlign: 'center',
              textTransform: 'uppercase'
            }}>
              {displayTitle || t('pageTitle')}
            </Typography>

            <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
              {heroParagraphs.map((paragraph, idx) => {
                const photo = heroPhotos[idx];
                return (
                    <Grid container spacing={photo ? 6 : 0} key={idx} direction={idx % 2 === 0 ? 'row' : 'row-reverse'} alignItems="center" sx={{ mb: 6 }}>
                      {photo && (
                          <Grid item xs={12} md={5}>
                            <Box
                                onClick={() => handleImageClick(heroPhotos, idx)}
                                sx={{
                                  position: 'relative', height: { xs: 250, md: 350 }, borderRadius: 6,
                                  overflow: 'hidden', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                  '&:hover img': { transform: 'scale(1.05)' }, transition: '0.4s'
                                }}
                            >
                              <Image src={photo} fill style={{ objectFit: 'cover' }} alt="Research" />
                            </Box>
                          </Grid>
                      )}
                      <Grid item xs={12} md={photo ? 7 : 12}>
                        <Typography sx={{ fontSize: { xs: 16, md: 19 }, lineHeight: 1.8, opacity: 0.95, whiteSpace: 'pre-line' }}>
                          {paragraph}
                        </Typography>
                      </Grid>
                    </Grid>
                );
              })}
            </Box>
          </Container>
        </Box>

        {/* SEARCHABLE CONTENT SECTION */}
        <Box sx={{ mt: { md: -10, xs: 2 }, position: 'relative', zIndex: 5, pb: 10 }}>
          <UnifiedNewsLayout
              translationKey="projects"
              data={posts}
              totalCount={totalPosts}
              isLoading={loadingPosts}
              onParamsChange={fetchPosts}
              // Ми вимикаємо Hero в UnifiedNewsLayout, якщо він там є, або просто використовуємо його як обгортку для списку
          />
        </Box>

        {/* MODAL GALLERY */}
        {gallery.open && (
            <Box onClick={closeGallery} sx={{
              position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.95)',
              zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2
            }}>
              <IconButton onClick={closeGallery} sx={{ position: 'absolute', top: 20, right: 20, color: '#fff' }}>
                <CloseIcon fontSize="large" />
              </IconButton>
              <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'relative', width: '90%', maxWidth: 1100, height: '80vh' }}>
                <Image src={gallery.images[gallery.index]} alt="Gallery" fill style={{ objectFit: 'contain' }} />
                {gallery.images.length > 1 && (
                    <>
                      <Button onClick={() => navigateImage(-1)} sx={{ position: 'absolute', left: { xs: 0, md: -70 }, color: '#fff', fontSize: 40, height: '100%' }}>❮</Button>
                      <Button onClick={() => navigateImage(1)} sx={{ position: 'absolute', right: { xs: 0, md: -70 }, color: '#fff', fontSize: 40, height: '100%' }}>❯</Button>
                    </>
                )}
              </Box>
            </Box>
        )}
      </Box>
  );
}
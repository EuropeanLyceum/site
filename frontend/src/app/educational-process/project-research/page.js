'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, Container, CircularProgress, IconButton, Button, alpha, Grid } from '@mui/material';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard.jsx";

export default function ProjectResearchPage() {
  const { t, locale } = useTranslation('projects');
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);
  const [posts, setPosts] = useState([]);

  // --- Логіка Галереї ---
  const [gallery, setGallery] = useState({ open: false, images: [], index: 0 });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Отримуємо дані секції (текст про метод проектів) та самі проекти
        const [sectionRes, contentRes] = await Promise.all([
          fetch(`/admin/api/admin/pageSection?type=PROJECT_RESEARCH`),
          fetch(`/admin/api/admin/content?type=PROJECTS`)
        ]);
        const sectionJson = await sectionRes.json();
        const contentJson = await contentRes.json();

        setPageData(Array.isArray(sectionJson.data) ? sectionJson.data[0] : sectionJson);

        // Форматуємо пости для UndefinedNewsCard
        const formattedPosts = (contentJson.data || []).map(item => ({
          id: item.id,
          title: item.titleUk,
          titleEn: item.titleEn,
          text: item.textUk,
          textEn: item.textEn,
          images: item.photoGallery || [],
          date: new Date(item.publicationDate || item.createdAt).toLocaleDateString('uk-UA')
        }));
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [expandedItem, setExpandedItem] = useState(null);
  const handleReadMore = (id) => setExpandedItem(expandedItem === id ? null : id);

  if (loading) return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#0c1865' }} />
      </Box>
  );

  const isEn = locale === 'en';
  const displayTitle = isEn ? (pageData?.titleEn || pageData?.titleUk) : pageData?.titleUk;
  const displayDesc = isEn ? (pageData?.contentEn || pageData?.contentUk) : pageData?.contentUk;

  // Параграфи для шахового порядку в Hero
  const heroParagraphs = displayDesc?.split(/\n\n+/).filter(p => p.trim()) || [];
  const heroPhotos = pageData?.imagePhoto ? [pageData.imagePhoto] : [];

  return (
      <Box component="main" sx={{ background: '#F8FAFC', minHeight: '100vh', pb: 10 }}>

        {/* HERO SECTION */}
        <Box sx={{
          background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
          pt: { xs: 10, md: 12 },
          pb: { xs: 15, md: 28 },
          color: '#fff',
          clipPath: { md: 'ellipse(140% 100% at 50% 0%)', xs: 'none' },
          position: 'relative',
          zIndex: 1
        }}>
          <Container maxWidth="lg">
            <Typography variant="h1" sx={{
              fontSize: { xs: 32, md: 56 },
              fontWeight: 900,
              fontFamily: "'Montserrat Alternates', sans-serif",
              mb: 8,
              textAlign: 'center',
              textTransform: 'uppercase'
            }}>
              {displayTitle || t('pageTitle')}
            </Typography>

            <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
              {heroParagraphs.length > 0 ? (
                  heroParagraphs.map((paragraph, idx) => {
                    const photo = heroPhotos[idx];
                    const direction = idx % 2 === 0 ? 'row' : 'row-reverse';

                    return (
                        <Grid container spacing={photo ? 6 : 0} key={idx} direction={direction} alignItems="center" sx={{ mb: 6 }}>
                          {photo && (
                              <Grid item xs={12} md={5}>
                                <Box
                                    onClick={() => handleImageClick(heroPhotos, idx)}
                                    sx={{
                                      position: 'relative',
                                      height: { xs: 250, md: 350 },
                                      borderRadius: 6,
                                      overflow: 'hidden',
                                      cursor: 'pointer',
                                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                      '&:hover img': { transform: 'scale(1.05)' },
                                      transition: '0.4s'
                                    }}
                                >
                                  <Image src={photo} fill style={{ objectFit: 'cover' }} alt="Research" />
                                </Box>
                              </Grid>
                          )}
                          <Grid item xs={12} md={photo ? 7 : 12}>
                            <Typography sx={{
                              fontSize: { xs: 16, md: 19 },
                              lineHeight: 1.8,
                              opacity: 0.95,
                              whiteSpace: 'pre-line',
                              textAlign: photo ? 'left' : 'center'
                            }}>
                              {paragraph}
                            </Typography>
                          </Grid>
                        </Grid>
                    );
                  })
              ) : (
                  // Fallback якщо в БД пусто — виводимо текст з перекладів
                  <Typography sx={{ textAlign: 'center', fontSize: 20, opacity: 0.8 }}>
                    {t("projectResearchIntro")}
                  </Typography>
              )}
            </Box>
          </Container>
        </Box>

        {/* CONTENT POSTS SECTION */}
        <Container maxWidth="lg" sx={{ mt: { md: -12, xs: 4 }, position: 'relative', zIndex: 5 }}>
          <Grid container spacing={4}>
            {posts.map((post) => (
                <Grid item xs={12} key={post.id}>
                  <UndefinedNewsCard
                      item={post}
                      locale={locale}
                      t={t}
                      isExpanded={expandedItem === post.id}
                      onReadMore={handleReadMore}
                      onImageClick={handleImageClick}
                  />
                </Grid>
            ))}
          </Grid>
        </Container>

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
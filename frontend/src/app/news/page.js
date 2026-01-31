'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Box, Typography, Button, Grid } from '@mui/material';
import { useTranslation } from '@/contexts/TranslationProvider';
import { apiUrl, assetUrl } from '@/utils/api';

export default function NewsPage() {
  const { t, locale } = useTranslation('news');
  const [expandedNews, setExpandedNews] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Failed to load news');

      const data = await response.json();
      const mappedNews = data.map((item) => ({
        id: item.id,
        title: item.heading || item.title || 'Без заголовка',
        titleEn: item.headingEn || '',
        text: item.description || item.text || 'Опис відсутній',
        textEn: item.descriptionEn || '',
        images: item.photoUrls || [],
        imagePosition: item.imagePosition || 'center',
      }));

      setNews(mappedNews);
    } catch (err) {
      console.error(err);
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const getLocalizedContent = (item) =>
      locale === 'en'
          ? { title: item.titleEn || item.title, text: item.textEn || item.text }
          : { title: item.title, text: item.text };

  const handleReadMore = (id) => {
    setExpandedNews(expandedNews === id ? null : id);
  };

  const handleImageClick = (images, index) => {
    setCurrentImage(images[index]);
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const handleGalleryClose = () => {
    setGalleryOpen(false);
    setCurrentImage(null);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    const currentNews = news.find((item) => item.images.includes(currentImage));
    if (!currentNews) return;
    const idx = currentNews.images.indexOf(currentImage);
    const prevIdx = (idx - 1 + currentNews.images.length) % currentNews.images.length;
    setCurrentImage(currentNews.images[prevIdx]);
    setCurrentImageIndex(prevIdx);
  };

  const handleNextImage = () => {
    const currentNews = news.find((item) => item.images.includes(currentImage));
    if (!currentNews) return;
    const idx = currentNews.images.indexOf(currentImage);
    const nextIdx = (idx + 1) % currentNews.images.length;
    setCurrentImage(currentNews.images[nextIdx]);
    setCurrentImageIndex(nextIdx);
  };

  const getObjectPosition = (pos) => {
    switch (pos) {
      case 'top':
        return 'center top';
      case 'bottom':
        return 'center bottom';
      case 'center':
      default:
        return 'center center';
    }
  };

  return (
      <Box sx={{ position: 'relative', minHeight: '100vh', fontFamily: "'Montserrat Alternates', sans-serif" }}>
        {/* Background */}
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Box sx={{ height: '100%', background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)' }} />
        </Box>

        <Box component="main" sx={{ position: 'relative', zIndex: 2, maxWidth: 1344, mx: 'auto', mt: '60px', px: { xs: 2, sm: 4 }, py: 5 }}>
          <Typography variant="h2" sx={{ fontSize: { xs: 24, sm: 28, md: 48 }, color: '#182BA1', textAlign: 'center', fontWeight: 700, mb: 5 }}>
            {t('newsStream')}
          </Typography>

          {isLoading ? (
              <Box sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: 18, color: '#182BA1' }}>{t('loadingNews')}</Typography>
              </Box>
          ) : news.length === 0 ? (
              <Box sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: 18, color: '#4B555C' }}>{t('noNewsFound')}</Typography>
              </Box>
          ) : (
              <Grid container spacing={4} flexDirection="column">
                {news.map((item, idx) => {
                  const localized = getLocalizedContent(item);
                  const isExpanded = expandedNews === item.id;
                  return (
                      <Grid
                          key={item.id}
                          item
                          sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            background: idx % 2 === 0
                                ? 'linear-gradient(to right, rgba(12,24,101,0.85), rgba(56,75,194,0.85))'
                                : 'linear-gradient(to right, rgba(204,139,106,0.9), rgba(255,109,33,1))',
                            borderRadius: 1,
                            overflow: 'hidden',
                            minHeight: 240,
                          }}
                      >
                        {/* Content */}
                        <Box
                            sx={{
                              width: { xs: '100%', md: '65%' },
                              p: { xs: 3, md: '32px 32px 32px 47px' },
                              boxSizing: 'border-box',
                              zIndex: 2,
                            }}
                        >
                          <Typography
                              variant="h3"
                              sx={{
                                fontSize: { xs: 16, sm: 18, md: 24 },
                                color: '#fff',
                                fontWeight: 600,
                                mb: 1.5,
                                position: 'relative',
                                '::before': {
                                  content: "''",
                                  position: 'absolute',
                                  left: { xs: 0, md: -2 },
                                  top: 0,
                                  width: 1,
                                  height: { xs: 0, md: 176 },
                                  backgroundColor: '#fff',
                                },
                              }}
                          >
                            {localized.title}
                          </Typography>

                          <Typography
                              sx={{
                                fontSize: { xs: 13, sm: 14, md: 16 },
                                lineHeight: 1.5,
                                color: '#fff',
                                mb: 1.5,
                                display: '-webkit-box',
                                overflow: 'hidden',
                                WebkitLineClamp: isExpanded ? 'unset' : 3,
                                WebkitBoxOrient: 'vertical',
                                whiteSpace: 'pre-wrap',
                              }}
                          >
                            {localized.text}
                          </Typography>

                          <Button
                              onClick={() => handleReadMore(item.id)}
                              sx={{
                                mt: 1,
                                width: { xs: 200, md: 231 },
                                height: { xs: 28, md: 33 },
                                fontSize: { xs: 12, md: 14 },
                                color: 'black',
                                backgroundColor: 'rgba(225,229,235,0.62)',
                                '&:hover': { backgroundColor: 'rgba(225,229,235,0.8)' },
                                position: 'relative',
                                textTransform: 'none',
                                fontFamily: "'Montserrat Alternates', sans-serif",
                                '&::after': {
                                  content: `"${isExpanded ? '↑' : '→'}"`,
                                  position: 'absolute',
                                  right: 10,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                },
                              }}
                          >
                            {isExpanded ? t('collapse') : t('readMore')}
                          </Button>
                        </Box>

                        {/* Image */}
                        {item.images.length > 0 && (
                            <Box
                                sx={{
                                  width: { xs: '100%', md: '35%' },
                                  height: { xs: 200, md: '100%' },
                                  position: 'relative',
                                  cursor: 'pointer',
                                  '&:hover img': { transform: 'scale(1.05)' },
                                }}
                                onClick={() => handleImageClick(item.images, 0)}
                            >
                              <Image
                                  src={item.images[0]}
                                  alt="News image"
                                  fill
                                  style={{
                                    objectFit: 'cover',
                                    objectPosition: getObjectPosition(item.imagePosition),
                                    transition: 'transform 0.3s',
                                  }}
                              />
                              <Box
                                  sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                    '&:hover': { opacity: 1 },
                                  }}
                              >
                                <Typography
                                    sx={{
                                      color: '#fff',
                                      px: 2,
                                      py: 1,
                                      border: '2px solid #fff',
                                      borderRadius: 1,
                                    }}
                                >
                                  {t('viewMore')}
                                </Typography>
                              </Box>
                            </Box>
                        )}
                      </Grid>
                  );
                })}
              </Grid>
          )}
        </Box>

        {/* Gallery Modal */}
        {galleryOpen && (
            <Box
                sx={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 9999,
                }}
            >
              <Box sx={{ position: 'relative', maxWidth: '90%', maxHeight: '90vh' }}>
                <Image src={currentImage} alt="Gallery" width={1200} height={800} style={{ objectFit: 'contain' }} />
                <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      px: 2,
                    }}
                >
                  <Button onClick={handlePrevImage} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '50%', p: 2 }}>
                    ❮
                  </Button>
                  <Button onClick={handleNextImage} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '50%', p: 2 }}>
                    ❯
                  </Button>
                </Box>
                <Button
                    onClick={handleGalleryClose}
                    sx={{ position: 'absolute', top: 20, right: 20, color: '#fff', fontSize: 30 }}
                >
                  ×
                </Button>
                <Typography sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', color: '#fff' }}>
                  {currentImageIndex + 1} / {news.find((item) => item.images.includes(currentImage))?.images.length}
                </Typography>
              </Box>
            </Box>
        )}
      </Box>
  );
}

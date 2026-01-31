'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Box, Typography, Button, IconButton, Grid, CircularProgress } from '@mui/material';
import { useTranslation } from '@/contexts/TranslationProvider';
import NewsCard from "@/app/news/components/NewsCard.jsx";

export default function NewsPage() {
  const { t, locale } = useTranslation('news');
  const [expandedNews, setExpandedNews] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const mappedNews = newsData.map(item => ({ ...item }));
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

  const handleReadMore = (id) => {
    setExpandedNews(expandedNews === id ? null : id);
  };

  const handleImageClick = (images, index) => {
    setCurrentImage(images[index]);
    setCurrentImageIndex(index);
    setGalleryOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleGalleryClose = () => {
    setGalleryOpen(false);
    setCurrentImage(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'unset';
  };

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    const currentNews = news.find((item) => item.images.includes(currentImage));
    if (!currentNews) return;
    const idx = currentNews.images.indexOf(currentImage);
    const prevIdx = (idx - 1 + currentNews.images.length) % currentNews.images.length;
    setCurrentImage(currentNews.images[prevIdx]);
    setCurrentImageIndex(prevIdx);
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    const currentNews = news.find((item) => item.images.includes(currentImage));
    if (!currentNews) return;
    const idx = currentNews.images.indexOf(currentImage);
    const nextIdx = (idx + 1) % currentNews.images.length;
    setCurrentImage(currentNews.images[nextIdx]);
    setCurrentImageIndex(nextIdx);
  };

  return (
      <Box sx={{ position: 'relative', minHeight: '100vh', fontFamily: "'Montserrat Alternates', sans-serif" }}>
        {/* Background */}
        <Box sx={{ position: 'fixed', inset: 0, zIndex: -1 }}>
          <Box sx={{ height: '100%', background: 'linear-gradient(180deg, #F5F7FA 0%, #E8ECF2 100%)' }} />
        </Box>

        <Box component="main" sx={{ position: 'relative', zIndex: 1, maxWidth: 1200, mx: 'auto', mt: '60px', px: { xs: 2, md: 4 }, py: 5 }}>
          <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 28, sm: 36, md: 48 },
                color: '#182BA1',
                textAlign: 'center',
                fontWeight: 800,
                mb: { xs: 4, md: 6 },
                textTransform: 'uppercase',
                letterSpacing: 1
              }}
          >
            {t('newsStream')}
          </Typography>

          {isLoading ? (
              <Box sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress sx={{ color: '#182BA1' }} />
              </Box>
          ) : news.length === 0 ? (
              <Box sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: 18, color: '#4B555C' }}>{t('noNewsFound')}</Typography>
              </Box>
          ) : (
              <Grid container spacing={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {news.map(item => (
                    <Grid item key={item.id} xs={12}>
                      <NewsCard
                          item={item}
                          locale={locale}
                          t={t}
                          isExpanded={expandedNews === item.id}
                          onReadMore={handleReadMore}
                          onImageClick={handleImageClick}
                      />
                    </Grid>
                ))}
              </Grid>
          )}
        </Box>

        {/* Gallery Modal */}
        {galleryOpen && (
            <Box
                onClick={handleGalleryClose}
                sx={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.95)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 9999,
                  p: 2
                }}
            >
              <Box
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 1200,
                    height: '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
              >
                <IconButton
                    onClick={handleGalleryClose}
                    sx={{
                      position: 'absolute',
                      top: -40,
                      right: { xs: 0, md: -40 },
                      color: '#fff',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                    }}
                >
                  <span style={{ fontSize: 24, lineHeight: 1 }}>×</span>
                </IconButton>

                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                      src={currentImage}
                      alt="Gallery"
                      fill
                      sizes="100vw"
                      style={{ objectFit: 'contain' }}
                      priority
                  />
                </Box>

                <Button
                    onClick={handlePrevImage}
                    sx={{
                      position: 'absolute',
                      left: { xs: -10, md: -20 },
                      color: '#fff',
                      fontSize: 30,
                      minWidth: 50,
                      height: '100%',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                    }}
                >
                  ❮
                </Button>
                <Button
                    onClick={handleNextImage}
                    sx={{
                      position: 'absolute',
                      right: { xs: -10, md: -20 },
                      color: '#fff',
                      fontSize: 30,
                      minWidth: 50,
                      height: '100%',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                    }}
                >
                  ❯
                </Button>

                <Typography sx={{ position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                  {currentImageIndex + 1} / {news.find((item) => item.images.includes(currentImage))?.images.length}
                </Typography>
              </Box>
            </Box>
        )}
      </Box>
  );
}
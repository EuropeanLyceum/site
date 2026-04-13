'use client';
import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Container, CircularProgress, IconButton, Divider } from '@mui/material';
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

  const [isPhotoExpanded, setIsPhotoExpanded] = useState(false);

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

  const fetchPosts = useCallback(async ({ search, page }) => {
    setLoadingPosts(true);
    try {
      const limit = 5;
      const query = new URLSearchParams({
        type: 'RESEARCH_PROJECT',
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

        {/* HERO БЛОК */}
        <Box sx={{
          background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
          pt: { xs: 8, md: 12 },
          pb: { xs: 12, md: 16 },
          color: '#fff',
          position: 'relative',
          zIndex: 1
        }}>
          <Container maxWidth="lg">
            <Typography variant="h1" sx={{
              fontSize: { xs: 32, md: 52 },
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

        {/* СТАТИЧНИЙ КОНТЕНТ */}
        <Container maxWidth="lg" sx={{ mt: { xs: -8, md: -12 }, position: 'relative', zIndex: 2 }}>
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
                <Image src={heroPhoto} fill style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} alt="Main section" priority />
              </Box>
          )}

          {displayDesc && (
              <Box
                  className="rich-text-content"
                  dangerouslySetInnerHTML={{ __html: displayDesc }}
                  sx={{
                    bgcolor: '#fff',
                    p: { xs: 3, md: 6 },
                    borderRadius: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    mb: 4,
                    whiteSpace: 'pre-wrap',
                    '& h1, & h2, & h3, & h4': { color: '#0c1865', fontWeight: 800, mt: 4, mb: 2 },
                    '& p': { fontSize: { xs: 16, md: 18 }, lineHeight: 1.8, color: '#334155', mb: 3 },
                    '& img': { maxWidth: '100%', borderRadius: 3, my: 4 }
                  }}
              />
          )}
        </Container>

        {/* РОЗДІЛЮВАЧ МІЖ ТЕКСТОМ ТА СПИСКОМ */}
        <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ height: '3px', bgcolor: '#E2E8F0', width: '100%', borderRadius: 1 }} />
          </Box>
        </Container>

        {/* СПИСОК ПРОЕКТІВ */}
        <Box sx={{ position: 'relative', zIndex: 5 }}>
          <UnifiedNewsLayout
              translationKey="projects"
              data={posts}
              totalCount={totalPosts}
              isLoading={loadingPosts}
              onParamsChange={fetchPosts}
              heroOff={true}
          />
        </Box>

        {/* МОДАЛКА ФОТО */}
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
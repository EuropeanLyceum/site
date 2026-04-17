'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Box, Typography, Container, CircularProgress, Grid, Paper, Stack,
  TextField, InputAdornment, Pagination, alpha
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LaunchIcon from '@mui/icons-material/Launch';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

import firebird from '@/assets/photos/firebird/firebird2.png';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import RichText from "@/components/shared/RichText";

export default function TeacherHelpPage() {
  const { t, locale } = useTranslation("teacherHelp");

  const [staticData, setStaticData] = useState({ section: null, externalLinks: [] });
  const [isLoadingStatic, setIsLoadingStatic] = useState(true);

  const [articles, setArticles] = useState([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const isEn = locale === 'en';
  const l = (uk, en) => (isEn ? en || uk : uk);

  useEffect(() => {
    const loadStatic = async () => {
      try {
        const [secRes, linkRes] = await Promise.all([
          fetch('/admin/api/admin/pageSection?type=TEACHERS_INFO'),
          fetch('/admin/api/admin/externalLink?pageKey=TEACHER')
        ]);
        const sJson = await secRes.json();
        const lJson = await linkRes.json();

        setStaticData({
          section: sJson.data?.[0] || null,
          externalLinks: lJson.data || []
        });
      } catch (err) {
        console.error("Static fetch error:", err);
      } finally {
        setIsLoadingStatic(false);
      }
    };
    loadStatic();
  }, []);

  const fetchArticles = useCallback(async (search, currentPage) => {
    setIsLoadingArticles(true);
    try {
      const params = new URLSearchParams({
        type: 'FOR_TEACHERS',
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

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchArticles(searchQuery, page);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, page, fetchArticles]);

  if (isLoadingStatic) return (
      <Box sx={{ py: 20, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#0c1865' }} />
      </Box>
  );

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 10 }}>

        {/* 1. HERO SECTION */}
        <Box sx={heroSx}>
          <Container maxWidth="lg">
            <Typography variant="h1" sx={heroTitleSx}>
              TEACHER <span style={{ color: '#f97316' }}>SUPPORT</span>
            </Typography>
            <RichText
                html={l(staticData.section?.contentUk, staticData.section?.contentEn)}
                sx={{
                  maxWidth: '750px',
                  color: alpha('#fff', 0.9),
                  '& p': { fontSize: '1.25rem', lineHeight: 1.6, fontWeight: 500 }
                }}
            />
          </Container>

          <Box sx={heroDecorationSx}>
            <Image src={firebird} alt="" priority style={{ width: '100%', height: 'auto' }} />
          </Box>
        </Box>

        <Container maxWidth="lg" sx={{ mt: { xs: -4, md: -8 }, position: 'relative', zIndex: 10 }}>

          {/* 2. EXTERNAL LINKS */}
          <Box sx={{ mb: 10 }}>
            <Typography variant="h5" sx={resourcesTitleSx}>
              {t("usefulResourcesTitle") || "Корисні ресурси"}
            </Typography>
            <Grid container spacing={2}>
              {staticData.externalLinks.map((link) => (
                  <Grid key={link.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Paper component="a" href={link.url} target="_blank" sx={resourceCardSx}>
                      <LaunchIcon className="icon" sx={{ color: '#f97316', fontSize: 20 }} />
                      <Typography className="txt" sx={{ fontWeight: 700, color: '#0c1865' }}>
                        {l(link.titleUk, link.titleEn)}
                      </Typography>
                    </Paper>
                  </Grid>
              ))}
            </Grid>
          </Box>

          {/* 3. SEARCH & DYNAMIC ARTICLES */}
          <Box sx={{ mb: 4 }}>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
                spacing={3}
                sx={{ mb: 5 }}
            >
              <Typography variant="h4" sx={sectionTitleSx}>
                {t("methodologicalRecommendations") || "Методичні поради"}
              </Typography>

              <TextField
                  placeholder={t("searchPlaceholder") || "Пошук порад..."}
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  sx={searchSx}
                  InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#182BA1' }} />
                        </InputAdornment>
                    ),
                  }}
              />
            </Stack>

            {isLoadingArticles ? (
                <Box sx={{ py: 10, textAlign: 'center' }}><CircularProgress /></Box>
            ) : (
                <>
                  <Grid container spacing={4}>
                    {articles.map((item) => (
                        <Grid key={item.id} size={{ xs: 12, md: 6 }}>
                          <Paper sx={articleCardSx}>
                            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
                              <Box sx={lightbulbWrapperSx}>
                                <LightbulbIcon sx={{ color: '#182BA1' }} />
                              </Box>
                              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0c1865', lineHeight: 1.2 }}>
                                {l(item.titleUk, item.titleEn)}
                              </Typography>
                            </Box>

                            <RichText
                                html={l(item.textUk, item.textEn)}
                                sx={{ color: '#475569', mb: 3 }}
                            />

                            {item.photoGallery?.length > 0 && (
                                <Box sx={{ mt: 'auto', pt: 2 }}>
                                  <Grid container spacing={1.5}>
                                    {item.photoGallery.slice(0, 3).map((img, i) => (
                                        <Grid key={i} size={4}>
                                          <Box sx={articleImageSx}>
                                            <Image src={img} alt="" fill style={{ objectFit: 'cover' }} />
                                          </Box>
                                        </Grid>
                                    ))}
                                  </Grid>
                                </Box>
                            )}
                          </Paper>
                        </Grid>
                    ))}
                  </Grid>

                  {articles.length === 0 && (
                      <Typography sx={noResultsSx}>
                        {t("noResults") || "Нічого не знайдено"}
                      </Typography>
                  )}

                  {totalArticles > itemsPerPage && (
                      <Stack alignItems="center" sx={{ mt: 8 }}>
                        <Pagination
                            count={Math.ceil(totalArticles / itemsPerPage)}
                            page={page}
                            onChange={(_, v) => {
                              setPage(v);
                              window.scrollTo({ top: 500, behavior: 'smooth' });
                            }}
                            color="primary"
                            size="large"
                        />
                      </Stack>
                  )}
                </>
            )}
          </Box>
        </Container>
      </Box>
  );
}

// --- Styles ---

const heroSx = {
  position: 'relative',
  pt: { xs: 10, md: 15 },
  pb: { xs: 15, md: 22 },
  background: 'linear-gradient(135deg, #0c1865 0%, #182BA1 100%)',
  color: '#fff',
  overflow: 'hidden',
  clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0% 100%)'
};

const heroTitleSx = {
  fontSize: { xs: 40, md: 64 },
  fontWeight: 900,
  fontFamily: "'Montserrat Alternates', sans-serif",
  mb: 3,
  textTransform: 'uppercase',
  lineHeight: 1
};

const heroDecorationSx = {
  position: 'absolute',
  right: { xs: '-10%', md: '-5%' },
  bottom: '5%',
  width: { xs: '300px', md: '450px' },
  opacity: 0.15,
  pointerEvents: 'none',
  filter: 'grayscale(1) brightness(2)'
};

const resourcesTitleSx = {
  fontWeight: 800,
  mb: 4,
  color: { xs: '#0c1865', md: '#fff' }, // На мобілках фон світліший, тому колір темний
  textAlign: { xs: 'center', md: 'left' },
  textShadow: { md: '0 2px 10px rgba(0,0,0,0.3)' }
};

const resourceCardSx = {
  p: 3, borderRadius: 5, display: 'flex', alignItems: 'center', gap: 2,
  textDecoration: 'none', border: '1px solid #e2e8f0', transition: '0.4s',
  bgcolor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  '&:hover': {
    bgcolor: '#0c1865',
    '& .icon, & .txt': { color: '#fff' },
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(12, 24, 101, 0.2)'
  }
};

const sectionTitleSx = {
  fontWeight: 900,
  fontFamily: 'Montserrat Alternates',
  color: '#0c1865'
};

const searchSx = {
  width: { xs: '100%', md: '350px' },
  bgcolor: '#fff',
  borderRadius: 3,
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  '& .MuiOutlinedInput-root': { borderRadius: 3 }
};

const articleCardSx = {
  p: { xs: 3, md: 5 },
  height: '100%',
  borderRadius: 8,
  display: 'flex',
  flexDirection: 'column',
  transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid #e2e8f0',
  boxShadow: '0 15px 40px rgba(0,0,0,0.02)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 25px 50px rgba(0,0,0,0.08)',
    borderColor: '#182BA1'
  }
};

const lightbulbWrapperSx = {
  p: 1.5,
  bgcolor: alpha('#182BA1', 0.1),
  borderRadius: 3,
  display: 'flex',
  flexShrink: 0
};

const articleImageSx = {
  position: 'relative',
  height: 90,
  borderRadius: 3,
  overflow: 'hidden',
  boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
};

const noResultsSx = {
  textAlign: 'center',
  py: 10,
  color: '#94a3b8',
  fontSize: '1.2rem',
  fontStyle: 'italic'
};
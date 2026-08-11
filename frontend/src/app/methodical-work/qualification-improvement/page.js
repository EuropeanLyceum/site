'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Box, Typography, Container, CircularProgress, Grid, Paper, Stack,
  TextField, InputAdornment, Pagination, alpha, Link as MuiLink
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LaunchIcon from '@mui/icons-material/Launch';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import RichText from "@/components/shared/RichText";

export default function QualificationImprovementPage() {
  const { locale, t } = useTranslation("qualification");

  const [staticData, setStaticData] = useState({ section: null, externalLinks: [] });
  const [isLoadingStatic, setIsLoadingStatic] = useState(true);

  const [articles, setArticles] = useState([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const isEn = locale === 'en';
  const l = (uk, en) => (isEn ? en || uk : uk);

  useEffect(() => {
    const loadStatic = async () => {
      try {
        const [secRes, linkRes] = await Promise.all([
          fetch('/admin/api/admin/pageSection?type=QUALIFICATION'),
          fetch('/admin/api/admin/externalLink?pageKey=QUALIFICATION')
        ]);
        const sJson = await secRes.json();
        const lJson = await linkRes.json();

        setStaticData({
          section: sJson.data?.[0] || null,
          externalLinks: lJson.data || []
        });
      } catch (err) {
        console.error("Static data fetch error:", err);
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
        type: 'QUALIFICATION',
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
        {/* HERO SECTION */}
        <Box sx={heroSx}>
          <Container maxWidth="lg">
            <Typography variant="h1" sx={heroTitleSx}>
              {l(staticData.section?.titleUk, staticData.section?.titleEn) || "Qualification Improvement"}
            </Typography>
            <RichText
                html={l(staticData.section?.contentUk, staticData.section?.contentEn)}
                sx={{
                  maxWidth: '850px',
                  color: alpha('#fff', 0.9),
                  '& p': { fontSize: '1.2rem', lineHeight: 1.7 }
                }}
            />
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: { xs: -4, md: -6 }, position: 'relative', zIndex: 2 }}>
          {/* SEARCH & TITLE */}
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3} sx={{ mb: 6 }}>
            <Typography variant="h4" sx={sectionTitleSx}>
              {l(staticData.section?.subTitleUk, staticData.section?.subTitleEn) || "Materials & Reports"}
            </Typography>
            <TextField
                size="small"
                placeholder={isEn ? "Search materials..." : "Пошук матеріалів..."}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#182BA1' }} /></InputAdornment> }}
                sx={searchSx}
            />
          </Stack>

          {/* CONTENT LIST */}
          {isLoadingArticles ? (
              <Box sx={{ py: 10, textAlign: 'center' }}><CircularProgress /></Box>
          ) : (
              <>
                <Grid container spacing={4}>
                  {articles.map((item) => (
                      <Grid size={12} key={item.id}>
                        <Paper sx={articleCardSx}>
                          <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: '#0c1865', lineHeight: 1.2 }}>
                            {l(item.titleUk, item.titleEn)}
                          </Typography>

                          <RichText
                              html={l(item.textUk, item.textEn)}
                              sx={{ color: '#475569', mb: 4 }}
                          />

                          {item.photoGallery?.length > 0 && (
                              <Grid container spacing={2}>
                                {item.photoGallery.map((img, i) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                                      <Box sx={galleryImageSx}>
                                        <Image src={img} alt="" fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 33vw" />
                                      </Box>
                                    </Grid>
                                ))}
                              </Grid>
                          )}

                          {item.videoUrl && (
                              <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={videoIconSx}><LaunchIcon sx={{ fontSize: 18 }} /></Box>
                                <MuiLink href={item.videoUrl} target="_blank" sx={videoLinkSx}>
                                  {isEn ? "Watch Video Materials" : "Переглянути відеоматеріали"}
                                </MuiLink>
                              </Box>
                          )}
                        </Paper>
                      </Grid>
                  ))}
                </Grid>

                {articles.length === 0 && (
                    <Typography sx={noResultsSx}>
                      {isEn ? "No results found" : "Нічого не знайдено"}
                    </Typography>
                )}

                {totalArticles > itemsPerPage && (
                    <Stack alignItems="center" sx={{ mt: 8 }}>
                      <Pagination
                          count={Math.ceil(totalArticles / itemsPerPage)}
                          page={page}
                          onChange={(_, v) => {
                            setPage(v);
                            window.scrollTo({ top: 400, behavior: 'smooth' });
                          }}
                          color="primary"
                          size="large"
                      />
                    </Stack>
                )}
              </>
          )}

          {/* DOCUMENTATION SECTION */}
          <Box sx={docSectionSx}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
              <Box sx={docHeaderIconSx}><AssignmentIcon sx={{ fontSize: 30 }} /></Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#0c1865', fontFamily: "'Montserrat Alternates', sans-serif" }}>
                {isEn ? "Documentation" : "Документація"}
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              {staticData.externalLinks.map((link) => (
                  <Grid size={{ xs: 12, md: 6 }} key={link.id}>
                    <Paper component="a" href={link.url} target="_blank" sx={docLinkCardSx}>
                      <Typography sx={{ fontWeight: 700, color: '#334155' }}>
                        {l(link.titleUk, link.titleEn)}
                      </Typography>
                      <LaunchIcon className="doc-icon" sx={{ color: '#cbd5e1', fontSize: 20, transition: '0.3s' }} />
                    </Paper>
                  </Grid>
              ))}
            </Grid>
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
  clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0% 100%)'
};

const heroTitleSx = {
  fontSize: { xs: 34, md: 56 },
  fontWeight: 900,
  fontFamily: "'Montserrat Alternates', sans-serif",
  mb: 3,
  textTransform: 'uppercase',
  lineHeight: 1.1
};

const sectionTitleSx = {
  fontWeight: 900,
  color: '#fff',
  fontFamily: "'Montserrat Alternates', sans-serif",
  textAlign: { xs: 'center', md: 'left' }
};

const searchSx = {
  width: { xs: '100%', md: 350 },
  bgcolor: '#fff',
  borderRadius: 4,
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  '& .MuiOutlinedInput-root': { borderRadius: 4 }
};

const articleCardSx = {
  p: { xs: 3, md: 6 },
  borderRadius: 8,
  borderLeft: '8px solid #f97316',
  boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
  transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': { transform: 'translateX(12px)', boxShadow: '0 30px 60px rgba(0,0,0,0.08)' }
};

const galleryImageSx = {
  position: 'relative',
  height: 250,
  borderRadius: 4,
  overflow: 'hidden',
  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
};

const videoIconSx = {
  width: 36, height: 36, borderRadius: '50%',
  bgcolor: alpha('#182BA1', 0.1), color: '#182BA1',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const videoLinkSx = {
  fontWeight: 800,
  color: '#182BA1',
  textDecoration: 'none',
  fontSize: '1.05rem',
  '&:hover': { textDecoration: 'underline' }
};

const docSectionSx = {
  mt: 12, p: { xs: 4, md: 8 }, borderRadius: 10,
  bgcolor: '#fff', border: '1px solid #e2e8f0',
  boxShadow: '0 30px 60px rgba(0,0,0,0.03)'
};

const docHeaderIconSx = {
  width: 60, height: 60, borderRadius: 3,
  bgcolor: alpha('#f97316', 0.1), color: '#f97316',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const docLinkCardSx = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  p: 3, borderRadius: 4, textDecoration: 'none',
  border: '1px solid #f1f5f9', transition: '0.3s',
  '&:hover': {
    bgcolor: alpha('#182BA1', 0.05),
    borderColor: '#182BA1',
    transform: 'translateY(-3px)',
    '& .doc-icon': { color: '#182BA1' }
  }
};

const noResultsSx = {
  textAlign: 'center', py: 10, color: '#94a3b8',
  fontStyle: 'italic', fontSize: '1.2rem'
};
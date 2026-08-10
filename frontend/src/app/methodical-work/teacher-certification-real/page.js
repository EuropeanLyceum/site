'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Container, Accordion, AccordionSummary,
  AccordionDetails, Link as MuiLink, CircularProgress, alpha, Grid, Paper, Stack,
  TextField, InputAdornment, Pagination
} from '@mui/material';
import Image from 'next/image';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard";
import RichText from "@/components/shared/RichText";

export default function TeacherCertificationPage() {
  const { locale, t } = useTranslation("teacherCertification");

  const [staticData, setStaticData] = useState({
    section: null,
    externalLinks: [],
    commission: []
  });
  const [isLoadingStatic, setIsLoadingStatic] = useState(true);

  const [articles, setArticles] = useState([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const [expandedId, setExpandedId] = useState(null);

  const isEn = locale === 'en';
  const l = (uk, en) => (isEn ? en || uk : uk);

  useEffect(() => {
    const loadStatic = async () => {
      try {
        const [secRes, linkRes, commRes] = await Promise.all([
          fetch('/admin/api/admin/pageSection?type=CERTIFICATION_REAL'),
          fetch('/admin/api/admin/externalLink?pageKey=CERTIFICATION_REAL'),
          fetch('/admin/api/admin/person?type=CERTIFIED_TEACHER')
        ]);

        const [sJson, lJson, cJson] = await Promise.all([
          secRes.json(), linkRes.json(), commRes.json()
        ]);

        setStaticData({
          section: sJson.data?.[0] || null,
          externalLinks: lJson.data || [],
          commission: cJson.data || []
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
        type: 'CERTIFICATION_REAL',
        limit: itemsPerPage.toString(),
        page: currentPage.toString(),
        search: search || ''
      });

      const res = await fetch(`/admin/api/admin/content?${params}`);
      const json = await res.json();

      const formatted = (json.data || []).map(item => ({
        id: item.id,
        title: l(item.titleUk, item.titleEn),
        text: l(item.textUk, item.textEn),
        images: item.photoGallery || [],
        date: new Date(item.publicationDate || item.createdAt).toLocaleDateString(isEn ? 'en-GB' : 'uk-UA')
      }));

      setArticles(formatted);
      setTotalArticles(json.meta?.total || 0);
    } catch (err) {
      console.error("Articles fetch error:", err);
    } finally {
      setIsLoadingArticles(false);
    }
  }, [isEn]);

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
          <Container maxWidth="md">
            <Typography variant="h1" sx={heroTitleSx}>
              {l(staticData.section?.titleUk, staticData.section?.titleEn) || "Certification_REAL"}
            </Typography>
            <RichText
                html={l(staticData.section?.contentUk, staticData.section?.contentEn)}
                sx={{
                  '& p': { fontSize: '1.2rem', opacity: 0.9, color: '#fff', textAlign: 'center' }
                }}
            />
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
          {/* ІНФОРМАЦІЙНИЙ БЛОК */}
          <Grid container spacing={4} sx={{ mb: 10 }}>
            {/* Комісія */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <GroupsIcon sx={{ color: '#182BA1' }} />
                <Typography variant="h5" sx={sectionTitleSx}>
                  {isEn ? "Certified teachers" : "Сертифіковані вчителі"}
                </Typography>
              </Stack>
              <Accordion sx={accordionSx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>{isEn ? "View List" : "Переглянути"}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {staticData.commission.map((person) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={person.id}>
                          <Paper sx={personCardSx}>
                            <Box sx={personPhotoWrapperSx}>
                              {person.photo ? (
                                  <Image
                                      src={person.photo}
                                      alt={l(person.fullNameUk, person.fullNameEn)}
                                      fill
                                      style={{ objectFit: 'cover' }}
                                  />
                              ) : (
                                  <Box sx={personPhotoPlaceholderSx}>
                                    <Typography sx={{ fontWeight: 900, color: '#64748b' }}>
                                      {l(person.fullNameUk, person.fullNameEn)
                                          ?.split(' ')
                                          .map((n) => n[0])
                                          .slice(0, 2)
                                          .join('')}
                                    </Typography>
                                  </Box>
                              )}
                            </Box>

                            <Stack spacing={1} alignItems="center">
                              <Typography sx={personNameSx}>
                                {l(person.fullNameUk, person.fullNameEn)}
                              </Typography>

                              <Typography variant="body2" sx={personPositionSx}>
                                {l(person.positionUk, person.positionEn)}
                              </Typography>
                            </Stack>
                          </Paper>
                        </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>

            {/* Документи */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <AssignmentIcon sx={{ color: '#182BA1' }} />
                <Typography variant="h5" sx={sectionTitleSx}>
                  {isEn ? "Documents" : "Документація"}
                </Typography>
              </Stack>
              <Stack spacing={2}>
                {staticData.externalLinks.map((doc) => (
                    <Paper key={doc.id} component="a" href={doc.url} target="_blank" sx={docLinkSx}>
                      <Typography sx={{ fontWeight: 700 }}>{l(doc.titleUk, doc.titleEn)}</Typography>
                      <Typography variant="h6" sx={{ ml: 1 }}>→</Typography>
                    </Paper>
                ))}
              </Stack>
            </Grid>
          </Grid>

          {/* ПОШУК ТА ХІД АТЕСТАЦІЇ */}
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 6 }} spacing={2}>
            <Typography variant="h4" sx={feedTitleSx}>
              {isEn ? "Certification Events" : "Хід атестації"}
            </Typography>
            <TextField
                size="small"
                placeholder={isEn ? "Search updates..." : "Пошук новин..."}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#182BA1' }} /></InputAdornment> }}
                sx={searchSx}
            />
          </Stack>

          {isLoadingArticles ? (
              <Box sx={{ py: 10, textAlign: 'center' }}><CircularProgress /></Box>
          ) : (
              <>
                <Stack spacing={4}>
                  {articles.map((event) => (
                      <UndefinedNewsCard
                          key={event.id}
                          item={event}
                          locale={locale}
                          isExpanded={expandedId === event.id}
                          onReadMore={(id) => setExpandedId(expandedId === id ? null : id)}
                      />
                  ))}
                  {articles.length === 0 && (
                      <Typography sx={noResultsSx}>
                        {isEn ? "No updates found" : "Інформацію не знайдено"}
                      </Typography>
                  )}
                </Stack>

                {totalArticles > itemsPerPage && (
                    <Stack alignItems="center" sx={{ mt: 8 }}>
                      <Pagination
                          count={Math.ceil(totalArticles / itemsPerPage)}
                          page={page}
                          onChange={(_, v) => {
                            setPage(v);
                            window.scrollTo({ top: 450, behavior: 'smooth' });
                          }}
                          color="primary"
                          size="large"
                      />
                    </Stack>
                )}
              </>
          )}
        </Container>
      </Box>
  );
}

// --- Styles ---

const heroSx = {
  py: { xs: 10, md: 15 },
  background: 'linear-gradient(135deg, #0c1865 0%, #1e293b 100%)',
  color: '#fff',
  textAlign: 'center',
  clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0% 100%)',
  mb: 2
};

const heroTitleSx = {
  fontWeight: 900,
  fontFamily: "'Montserrat Alternates', sans-serif",
  fontSize: { xs: 34, md: 54 },
  mb: 3,
  textTransform: 'uppercase',
  lineHeight: 1.1
};

const emailCardSx = {
  p: { xs: 3, md: 5 },
  bgcolor: '#fff',
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  border: '1px solid #e2e8f0',
  boxShadow: '0 20px 50px rgba(0,0,0,0.04)'
};

const iconWrapperSx = (color) => ({
  bgcolor: alpha(color, 0.1),
  p: 2.5,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const labelSx = {
  color: '#64748b',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  mb: 0.5
};

const emailLinkSx = {
  color: '#0c1865',
  fontWeight: 900,
  fontSize: { xs: '1.1rem', md: '1.6rem' },
  textDecoration: 'none',
  '&:hover': { color: '#f97316' }
};

const sectionTitleSx = {
  fontWeight: 800,
  color: '#0c1865',
  fontFamily: "'Montserrat Alternates', sans-serif"
};

const accordionSx = {
  borderRadius: '20px !important',
  border: '1px solid #e2e8f0',
  boxShadow: 'none',
  '&:before': { display: 'none' }
};

const personRowSx = {
  px: 3, py: 2,
  borderBottom: '1px solid #f1f5f9',
  '&:last-child': { borderBottom: 'none' }
};

const docLinkSx = {
  p: 3, borderRadius: 4, textDecoration: 'none',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  border: '1px solid #e2e8f0',
  transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  color: '#0c1865',
  '&:hover': {
    bgcolor: '#0c1865',
    color: '#fff',
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 20px rgba(12, 24, 101, 0.2)'
  }
};

const feedTitleSx = {
  fontWeight: 900,
  color: '#0c1865',
  fontFamily: "'Montserrat Alternates', sans-serif"
};

const searchSx = {
  width: { xs: '100%', md: 350 },
  bgcolor: '#fff',
  borderRadius: 4,
  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  '& .MuiOutlinedInput-root': { borderRadius: 4 }
};

const noResultsSx = {
  color: '#94a3b8',
  fontStyle: 'italic',
  textAlign: 'center',
  py: 10,
  fontSize: '1.1rem'
};

const personCardSx = {
  p: 3,
  height: '100%',
  borderRadius: 5,
  border: '1px solid #e2e8f0',
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
    borderColor: '#c7d2fe',
  },
};

const personPhotoWrapperSx = {
  position: 'relative',
  width: 112,
  height: 112,
  borderRadius: '50%',
  overflow: 'hidden',
  mb: 2,
  border: '4px solid #fff',
  boxShadow: '0 8px 20px rgba(12, 24, 101, 0.15)',
  bgcolor: '#e2e8f0',
};

const personPhotoPlaceholderSx = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bgcolor: '#e2e8f0',
  fontSize: '1.1rem',
};

const personNameSx = {
  fontWeight: 800,
  color: '#0c1865',
  lineHeight: 1.3,
};

const personPositionSx = {
  color: '#64748b',
  lineHeight: 1.5,
};
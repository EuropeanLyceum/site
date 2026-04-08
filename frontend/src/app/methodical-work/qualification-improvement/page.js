'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Box, Typography, Container, CircularProgress, Grid, Paper, Stack,
  TextField, InputAdornment, Pagination, Divider, Link as MuiLink
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LaunchIcon from '@mui/icons-material/Launch';
import firebird from '@/assets/photos/firebird/firebird2.png';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';

const ITEMS_PER_PAGE = 5;

export default function QualificationImprovementPage() {
  const { locale } = useTranslation("qualification");
  const [data, setData] = useState({ section: null, articles: [], externalLinks: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const isEn = locale === 'en';
  const l = (uk, en) => (isEn ? en || uk : uk);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Ми тягнемо контент типу QUALIFICATION та посилання METHODOLOGICAL (або інший ключ з вашого Enum)
        const [secRes, artRes, linkRes] = await Promise.all([
          fetch('/admin/api/admin/pageSection?type=QUALIFICATION'), // Можна адаптувати під ваші потреби
          fetch('/admin/api/admin/content?type=QUALIFICATION'),
          fetch('/admin/api/admin/externalLink?pageKey=QUALIFICATION')
        ]);

        const [sJson, aJson, lJson] = await Promise.all([secRes.json(), artRes.json(), linkRes.json()]);

        setData({
          section: sJson.data?.[0] || null,
          articles: aJson.data || [],
          externalLinks: lJson.data || []
        });
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [locale]);

  const filteredArticles = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return data.articles.filter(item =>
        l(item.titleUk, item.titleEn)?.toLowerCase().includes(query) ||
        l(item.textUk, item.textEn)?.toLowerCase().includes(query)
    );
  }, [data.articles, searchQuery, locale]);

  const count = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (isLoading) return <Box sx={{ py: 20, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 10 }}>
        {/* HERO SECTION - Динамічно з PageSection */}
        <Box sx={{
          position: 'relative', py: { xs: 10, md: 15 },
          background: 'linear-gradient(135deg, #0c1865 0%, #182BA1 100%)',
          color: '#fff', overflow: 'hidden', clipPath: 'polygon(0 0, 100% 0, 100% 95%, 0% 100%)'
        }}>
          <Container maxWidth="lg">
            <Typography variant="h1" sx={{
              fontSize: { xs: 32, md: 56 },
              fontWeight: 900,
              fontFamily: "'Montserrat Alternates', sans-serif",
              mb: 2,
              textTransform: 'uppercase'
            }}>
              {l(data.section?.titleUk, data.section?.titleEn) || "Qualification Improvement"}
            </Typography>
            <Typography sx={{ maxWidth: '800px', fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6 }}>
              {l(data.section?.contentUk, data.section?.contentEn)}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 5 }}>
          {/* SEARCH & TITLE */}
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0c1865', fontFamily: "'Montserrat Alternates', sans-serif" }}>
              {l(data.section?.subTitleUk, data.section?.subTitleEn) || "Materials & Reports"}
            </Typography>
            <TextField
                size="small"
                placeholder="..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#182BA1' }} /></InputAdornment> }}
                sx={{ width: { xs: '100%', md: 350 }, bgcolor: '#fff', borderRadius: 2 }}
            />
          </Stack>

          {/* CONTENT BLOCKS (замість статики НУШ та іншого) */}
          <Grid container spacing={4}>
            {paginatedArticles.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <Paper sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 8,
                    borderLeft: '8px solid #f97316',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                    transition: '0.3s',
                    '&:hover': { transform: 'translateX(10px)' }
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: '#0c1865' }}>
                      {l(item.titleUk, item.titleEn)}
                    </Typography>

                    <Typography sx={{ whiteSpace: 'pre-wrap', color: '#475569', lineHeight: 1.8, fontSize: '1.1rem', mb: 4 }}>
                      {l(item.textUk, item.textEn)}
                    </Typography>

                    {item.photoGallery?.length > 0 && (
                        <Grid container spacing={2}>
                          {item.photoGallery.map((img, i) => (
                              <Grid item xs={12} sm={6} md={4} key={i}>
                                <Box sx={{ position: 'relative', height: 250, borderRadius: 4, overflow: 'hidden' }}>
                                  <Image src={img} alt="" fill style={{ objectFit: 'cover' }} />
                                </Box>
                              </Grid>
                          ))}
                        </Grid>
                    )}

                    {item.videoUrl && (
                        <Box sx={{ mt: 3, color: '#182BA1', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LaunchIcon fontSize="small" />
                          <MuiLink href={item.videoUrl} target="_blank" sx={{ fontWeight: 700 }}>
                            {isEn ? "Watch Video Materials" : "Переглянути відеоматеріали"}
                          </MuiLink>
                        </Box>
                    )}
                  </Paper>
                </Grid>
            ))}
          </Grid>

          {/* PAGINATION */}
          {count > 1 && (
              <Stack alignItems="center" sx={{ mt: 6 }}>
                <Pagination count={count} page={page} onChange={(_, v) => setPage(v)} color="primary" />
              </Stack>
          )}

          {/* DOCUMENTATION SECTION - Динамічно з ExternalLink */}
          <Box sx={{
            mt: 12, p: { xs: 4, md: 8 }, borderRadius: 10,
            bgcolor: '#fff', border: '2px solid #e2e8f0'
          }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 5 }}>
              <AssignmentIcon sx={{ color: '#f97316', fontSize: 40 }} />
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#0c1865' }}>
                {isEn ? "Documentation" : "Документація"}
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              {data.externalLinks.map((link) => (
                  <Grid item xs={12} md={6} key={link.id}>
                    <Paper
                        component="a"
                        href={link.url}
                        target="_blank"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 3,
                          borderRadius: 4,
                          textDecoration: 'none',
                          border: '1px solid #f1f5f9',
                          transition: '0.3s',
                          '&:hover': {
                            bgcolor: alpha('#182BA1', 0.05),
                            borderColor: '#182BA1',
                            '& .doc-icon': { color: '#182BA1' }
                          }
                        }}
                    >
                      <Typography sx={{ fontWeight: 700, color: '#334155' }}>
                        {l(link.titleUk, link.titleEn)}
                      </Typography>
                      <LaunchIcon className="doc-icon" sx={{ color: '#cbd5e1', fontSize: 20 }} />
                    </Paper>
                  </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
  );
}
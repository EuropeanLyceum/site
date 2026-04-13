'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Container, Accordion, AccordionSummary,
  AccordionDetails, Link as MuiLink, CircularProgress, alpha, Grid, Paper, Stack,
  TextField, InputAdornment, Pagination
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard";

export default function TeacherCertificationPage() {
  const { locale } = useTranslation("teacherCertification");

  // Статичні дані (Hero, Комісія, Посилання)
  const [staticData, setStaticData] = useState({
    section: null,
    externalLinks: [],
    commission: []
  });
  const [isLoadingStatic, setIsLoadingStatic] = useState(true);

  // Динамічні заходи з пошуком та пагінацією
  const [articles, setArticles] = useState([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const [expandedId, setExpandedId] = useState(null);

  const isEn = locale === 'en';
  const l = (uk, en) => (isEn ? en || uk : uk);

  // 1. Завантаження статичного контенту (1 раз)
  useEffect(() => {
    const loadStatic = async () => {
      try {
        const [secRes, linkRes, commRes] = await Promise.all([
          fetch('/admin/api/admin/pageSection?type=CERTIFICATION'),
          fetch('/admin/api/admin/externalLink?pageKey=CERTIFICATION'),
          fetch('/admin/api/admin/person?type=COMMISSION_MEMBER')
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

  // 2. Функція серверного завантаження статей
  const fetchArticles = useCallback(async (search, currentPage) => {
    setIsLoadingArticles(true);
    try {
      const params = new URLSearchParams({
        type: 'CERTIFICATION',
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
        date: new Date(item.publicationDate || item.createdAt).toLocaleDateString(isEn ? 'en-US' : 'uk-UA')
      }));

      setArticles(formatted);
      setTotalArticles(json.meta?.total || 0);
    } catch (err) {
      console.error("Articles fetch error:", err);
    } finally {
      setIsLoadingArticles(false);
    }
  }, [isEn]);

  // 3. Дебаунс для пошуку (400мс)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchArticles(searchQuery, page);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, page, fetchArticles]);

  if (isLoadingStatic) return <Box sx={{ py: 20, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 10 }}>
        {/* HERO SECTION */}
        <Box sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #0c1865 0%, #1e293b 100%)',
          color: '#fff', textAlign: 'center',
          clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0% 100%)',
          mb: 6
        }}>
          <Container maxWidth="md">
            <Typography variant="h1" sx={{
              fontWeight: 900,
              fontFamily: "'Montserrat Alternates', sans-serif",
              fontSize: { xs: 32, md: 54 },
              mb: 2, textTransform: 'uppercase'
            }}>
              {l(staticData.section?.titleUk, staticData.section?.titleEn) || "Certification"}
            </Typography>
            <Typography sx={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '700px', mx: 'auto' }}>
              {l(staticData.section?.contentUk, staticData.section?.contentEn)}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg">
          {/* ІНФОРМАЦІЙНИЙ БЛОК */}
          <Grid container spacing={4} sx={{ mb: 10 }}>
            {/* Email */}
            <Grid item xs={12}>
              <Paper sx={{
                p: 4, bgcolor: '#fff', borderRadius: 6,
                display: 'flex', alignItems: 'center', gap: 3,
                border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,0,0,0.03)'
              }}>
                <Box sx={{ bgcolor: alpha('#f97316', 0.1), p: 2, borderRadius: 4 }}>
                  <EmailIcon sx={{ fontSize: 40, color: '#f97316' }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    {isEn ? "Email for documents" : "Електронна пошта для документів"}
                  </Typography>
                  <MuiLink href="mailto:atestacia24licey@gmail.com" sx={{ color: '#0c1865', fontWeight: 900, fontSize: { xs: 18, md: 24 }, textDecoration: 'none' }}>
                    atestacia24licey@gmail.com
                  </MuiLink>
                </Box>
              </Paper>
            </Grid>

            {/* Комісія */}
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <GroupsIcon sx={{ color: '#182BA1' }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0c1865' }}>
                  {isEn ? "Commission" : "Комісія"}
                </Typography>
              </Stack>
              <Accordion sx={{ borderRadius: '20px !important', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: 700 }}>{isEn ? "View List" : "Переглянути склад"}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  {staticData.commission.map((person) => (
                      <Box key={person.id} sx={{ px: 3, py: 2, borderBottom: '1px solid #f1f5f9' }}>
                        <Typography sx={{ fontWeight: 800 }}>{l(person.fullNameUk, person.fullNameEn)}</Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>{l(person.positionUk, person.positionEn)}</Typography>
                      </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Grid>

            {/* Документи */}
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <AssignmentIcon sx={{ color: '#182BA1' }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0c1865' }}>
                  {isEn ? "Documents" : "Документація"}
                </Typography>
              </Stack>
              <Stack spacing={2}>
                {staticData.externalLinks.map((doc) => (
                    <Paper key={doc.id} component="a" href={doc.url} target="_blank"
                           sx={{
                             p: 2.5, borderRadius: 4, textDecoration: 'none',
                             display: 'flex', justifyContent: 'space-between', border: '1px solid #e2e8f0',
                             transition: '0.3s', '&:hover': { bgcolor: '#0c1865', '& *': { color: '#fff' } }
                           }}>
                      <Typography sx={{ fontWeight: 700, color: '#0c1865' }}>{l(doc.titleUk, doc.titleEn)}</Typography>
                      <span>→</span>
                    </Paper>
                ))}
              </Stack>
            </Grid>
          </Grid>

          {/* ПОШУК ТА ХІД АТЕСТАЦІЇ */}
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0c1865', fontFamily: "'Montserrat Alternates', sans-serif" }}>
              {isEn ? "Certification Events" : "Хід атестації"}
            </Typography>
            <TextField
                size="small"
                placeholder={isEn ? "Search updates..." : "Пошук новин..."}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#182BA1' }} /></InputAdornment> }}
                sx={{ width: { xs: '100%', md: 350 }, bgcolor: '#fff', borderRadius: 2 }}
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
                      <Typography sx={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', py: 5 }}>
                        {isEn ? "No updates found" : "Інформацію не знайдено"}
                      </Typography>
                  )}
                </Stack>

                {totalArticles > itemsPerPage && (
                    <Stack alignItems="center" sx={{ mt: 6 }}>
                      <Pagination
                          count={Math.ceil(totalArticles / itemsPerPage)}
                          page={page}
                          onChange={(_, v) => {
                            setPage(v);
                            window.scrollTo({ top: 500, behavior: 'smooth' });
                          }}
                          color="primary"
                      />
                    </Stack>
                )}
              </>
          )}
        </Container>
      </Box>
  );
}
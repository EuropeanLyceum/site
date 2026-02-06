'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Container, Accordion, AccordionSummary,
  AccordionDetails, Link as MuiLink, CircularProgress, alpha, Grid, Paper, Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard";

export default function TeacherCertificationPage() {
  const { locale } = useTranslation("teacherCertification");
  const [data, setData] = useState({
    section: null,
    articles: [],
    externalLinks: [],
    commission: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const isEn = locale === 'en';
  const l = (uk, en) => (isEn ? en || uk : uk);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [secRes, artRes, linkRes, commRes] = await Promise.all([
          fetch('/admin/api/admin/pageSection?type=CERTIFICATION'),
          fetch('/admin/api/admin/content?type=CERTIFICATION'),
          fetch('/admin/api/admin/externalLink?pageKey=CERTIFICATION'),
          fetch('/admin/api/admin/person?type=COMMISSION_MEMBER')
        ]);

        const [sJson, aJson, lJson, cJson] = await Promise.all([
          secRes.json(), artRes.json(), linkRes.json(), commRes.json()
        ]);

        setData({
          section: sJson.data?.[0] || null,
          articles: aJson.data || [],
          externalLinks: lJson.data || [],
          commission: cJson.data || []
        });
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [locale]);

  const mappedEvents = useMemo(() => {
    // Реверс, щоб останні додані новини були першими в списку
    return [...data.articles].reverse().map(item => ({
      id: item.id,
      title: l(item.titleUk, item.titleEn),
      text: l(item.textUk, item.textEn),
      images: item.photoGallery || [],
      date: new Date(item.publicationDate || item.createdAt).toLocaleDateString(isEn ? 'en-US' : 'uk-UA')
    }));
  }, [data.articles, locale]);

  if (isLoading) return <Box sx={{ py: 20, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 10 }}>
        {/* 1. HERO SECTION */}
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
              {l(data.section?.titleUk, data.section?.titleEn) || "Certification"}
            </Typography>
            <Typography sx={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '700px', mx: 'auto' }}>
              {l(data.section?.contentUk, data.section?.contentEn)}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg">
          {/* 2. ІНФОРМАЦІЙНИЙ БЛОК (Email, Комісія, Документи) */}
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
                  {data.commission.map((person) => (
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
                {data.externalLinks.map((doc) => (
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

          {/* 3. ARTICLES / EVENTS (ТЕПЕР ОСТАННІ) */}
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0c1865', mb: 4, fontFamily: "'Montserrat Alternates', sans-serif" }}>
            {isEn ? "Certification Events" : "Хід атестації"}
          </Typography>
          <Stack spacing={4}>
            {mappedEvents.length > 0 ? (
                mappedEvents.map((event) => (
                    <UndefinedNewsCard
                        key={event.id}
                        item={event}
                        locale={locale}
                        isExpanded={expandedId === event.id}
                        onReadMore={(id) => setExpandedId(expandedId === id ? null : id)}
                    />
                ))
            ) : (
                <Typography sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                  {isEn ? "No updates yet" : "Інформація оновлюється..."}
                </Typography>
            )}
          </Stack>
        </Container>
      </Box>
  );
}
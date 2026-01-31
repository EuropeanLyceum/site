'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Accordion, AccordionSummary,
  AccordionDetails, Link as MuiLink, CircularProgress, alpha, Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';

import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard";

// ВИНЕСЕНА СТАТИКА
const CERTIFICATION_STATIC = {
  email: "atestacia24licey@gmail.com",

  commission: [
    "derkachLA", "sokolovskaOP", "korshakTV", "ovdienkoOM",
    "nikulYV", "mokrenkoEM", "simonkinaGP", "holovkoSB", "kogutKS"
  ],

  documents: [
    { key: "attestationResults2025", url: "https://docs.google.com/file/d/16pC6gZmJoge33TLgruXy-2mUAH3JjH2d/edit" },
    { key: "extraordinaryAttestationList2025", url: "https://docs.google.com/document/d/1eTJ1ba7kYMbTFR3ejLbg6JWHNcmtTVf3/edit" },
    { key: "attestationList2024_2025", url: "https://docs.google.com/document/d/1aimztLwaSXP7raZ4xIHQlIVxVXJsSMkL/edit" },
    { key: "attestationSchedule", url: "https://docs.google.com/document/d/1pkadNTCdi6zgbcd_AzyC94nenbUxp6fJ/edit" }
  ],

  baseEvents: [
    { id: 'st-1', titleKey: "finalPedagogicalCouncilTitle", textKey: "finalPedagogicalCouncilText", images: [] },
    { id: 'st-2', titleKey: "secondPedagogicalCouncilTitle", textKey: "secondPedagogicalCouncilText", images: [] },
    { id: 'st-3', titleKey: "firstPedagogicalCouncilTitle", textKey: "firstPedagogicalCouncilText", images: [] }
  ]
};

export default function TeacherCertificationPage() {
  const { t, locale } = useTranslation("teacherCertification");
  const [dynamicItems, setDynamicItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/teacher-certification');
        if (response.ok) {
          const data = await response.json();
          setDynamicItems(data);
        }
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  // Підготовка даних для UndefinedNewsCard
  const mappedEvents = [
    ...dynamicItems.filter(item => item.heading || item.headingEn).map(item => ({
      id: item.id,
      title: item.heading,
      titleEn: item.headingEn,
      text: item.description,
      textEn: item.descriptionEn,
      images: Array.isArray(item.photoUrls) ? item.photoUrls : [],
      date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "31.01.2026"
    })),
    ...CERTIFICATION_STATIC.baseEvents.map(e => ({
      id: e.id,
      title: t(e.titleKey),
      text: t(e.textKey),
      images: e.images,
      date: "01.09.2025"
    }))
  ];

  const pinkItems = dynamicItems.filter(item => !item.heading && (item.text || item.url));

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fff', pb: 10 }}>
        {/* Hero Header */}
        <Box sx={{py: 5, bgcolor: alpha('#0c1865', 0.02), textAlign: 'center', borderBottom: '1px solid #eee' }}>
          <Container maxWidth="md">
            <Typography variant="h2" sx={{
              fontWeight: 900, color: '#0c1865',
              fontFamily: "'Montserrat Alternates', sans-serif",
              fontSize: { xs: 32, md: 54 }
            }}>
              {t("pageTitle")}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {isLoading ? (
              <Box sx={{ textAlign: 'center', py: 10 }}><CircularProgress /></Box>
          ) : (
              <Box>
                {mappedEvents.map((event) => (
                    <UndefinedNewsCard
                        key={event.id}
                        item={event}
                        locale={locale}
                        t={t}
                        isExpanded={expandedId === event.id}
                        onReadMore={(id) => setExpandedId(expandedId === id ? null : id)}
                        onImageClick={(images, idx) => console.log("Open gallery", images, idx)}
                    />
                ))}
              </Box>
          )}

          {/* НИЖНЯ СЕКЦІЯ: ДОКУМЕНТИ ТА КОМІСІЯ */}
          <Box sx={{
            mt: 12, p: { xs: 4, md: 8 }, borderRadius: 10,
            background: 'linear-gradient(135deg, #fff 0%, #fff7ed 100%)',
            border: '1px solid #fed7aa',
            boxShadow: '0 30px 60px rgba(249, 115, 22, 0.05)'
          }}>

            <Grid container spacing={6}>
              {/* Email блок */}
              <Grid item size={{xs: 12}}>
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 3, p: 3,
                  bgcolor: '#0c1865', borderRadius: 5, color: '#fff'
                }}>
                  <EmailIcon sx={{ fontSize: 40, color: '#f97316' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>{t("emailForDocuments")}</Typography>
                    <MuiLink href={`mailto:${CERTIFICATION_STATIC.email}`} sx={{ color: '#fff', fontWeight: 800, fontSize: 20, textDecoration: 'none' }}>
                      {CERTIFICATION_STATIC.email}
                    </MuiLink>
                  </Box>
                </Box>
              </Grid>

              {/* Комісія */}
              <Grid item size={{xs: 12, md: 6}}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <GroupsIcon sx={{ color: '#0c1865' }} />
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#0c1865' }}>{t("attestationCommission")}</Typography>
                </Box>
                <Accordion sx={{ borderRadius: '20px !important', border: '1px solid #fed7aa', boxShadow: 'none' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 700 }}>{t("viewCommissionList") || "Переглянути склад"}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {CERTIFICATION_STATIC.commission.map((key) => (
                        <Typography key={key} sx={{ py: 1.5, borderBottom: '1px solid #eee', fontSize: 15 }}>
                          • <strong>{t(key)}</strong>
                        </Typography>
                    ))}
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Документи */}
              <Grid item ize={{xs: 12, md: 6}}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <AssignmentIcon sx={{ color: '#0c1865' }} />
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#0c1865' }}>{t("importantDocuments") || "Документація"}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {CERTIFICATION_STATIC.documents.map((doc) => (
                      <MuiLink
                          key={doc.key} href={doc.url} target="_blank"
                          sx={{
                            p: 2.5, bgcolor: '#fff', borderRadius: 4, textDecoration: 'none',
                            color: '#0c1865', fontWeight: 700, border: '1px solid #fed7aa',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            transition: '0.3s', '&:hover': { transform: 'translateX(10px)', bgcolor: '#0c1865', color: '#fff' }
                          }}
                      >
                        {t(doc.key)} <span>→</span>
                      </MuiLink>
                  ))}
                </Box>
              </Grid>
            </Grid>

            {/* Динамічний "рожевий" футер */}
            {pinkItems.map((item, idx) => {
              const isEn = locale === 'en';
              return (
                  <Box key={item.id} sx={{ mt: 4, p: 3, bgcolor: alpha('#f97316', 0.1), borderRadius: 4 }}>
                    <Typography sx={{ mb: 2, fontWeight: 500 }}>{isEn ? item.textEn : item.text}</Typography>
                    {item.url && (
                        <MuiLink href={item.url} target="_blank" sx={{ color: '#f97316', fontWeight: 800 }}>
                          {isEn ? (item.linkTextEn || item.url) : (item.linkText || item.url)}
                        </MuiLink>
                    )}
                  </Box>
              );
            })}
          </Box>
        </Container>
      </Box>
  );
}
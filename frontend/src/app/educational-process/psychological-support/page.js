'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Paper, Avatar,
  Button, Accordion, AccordionSummary, AccordionDetails,
  Divider, alpha, CircularProgress, Link as MuiLink
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import LaunchIcon from '@mui/icons-material/Launch';
import Image from 'next/image';

import kogutPhoto from '@/assets/photos/kogut.jpg';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';

// СТАТИЧНІ ДАНІ (Те що раніше було в розмітці)
const PSYCHOLOGIST_DATA = {
  photo: kogutPhoto,
  principles: [
    "principleConfidentiality",
    "principleNonJudgmental",
    "principleCompetence"
  ],
  directions: [
    "directionLearning",
    "directionEmotional",
    "directionInterpersonal",
    "directionSelfDiscovery"
  ],
  staticResources: [
    { key: "pedagogicalPractice", url: "https://docs.google.com/document/d/12j01IFFezy-2L8ApwAOyFbDsqN8VMCOy/edit#bookmark=id.mxi12wl6tkex" },
    { key: "adaptationAdvice56", url: "https://docs.google.com/document/d/1xFEVzA5ECo0_C6NCLXrXeX24mTEr_FqZ/edit" },
    { key: "adaptationRecommendations10", url: "https://docs.google.com/document/d/1wWtFj2L1Rp2QfXMaw0FwB6ELzt6vpsZy/edit?usp=drivesdk" },
    { key: "childrenInShelter", url: "https://docs.google.com/document/d/1FU4BnN4c00ZJ2eKHV7COM_ToBzLKDHJ0/edit" },
    { key: "mentalHealthProgram", url: "https://howareu.com/" }
  ]
};

export default function PsychologicalSupport() {
  const { t, locale } = useTranslation("psychological");
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getLocalized = (item) => ({
    title: locale === 'en' ? (item.titleEn || item.title) : item.title,
    content: locale === 'en' ? (item.contentEn || item.content) : item.content,
    text: locale === 'en' ? (item.textEn || item.text) : item.text,
    linkText: locale === 'en' ? (item.linkTextEn || item.linkText) : item.linkText
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/psychological-support");
        if (response.ok) {
          const data = await response.json();
          setArticles(data.sort((a, b) => b.id - a.id));
        }
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    loadData();
  }, []);

  const accordionItems = articles.filter(item => item.content && !item.text);
  const blueBackgroundItems = articles.filter(item => item.text || item.link);

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fff', pb: 10 }}>
        {/* Background Gradient */}
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 600,
          background: 'linear-gradient(180deg, rgba(24, 43, 161, 0.05) 0%, rgba(255,255,255,0) 100%)',
          zIndex: 0
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: 8 }}>
          <Typography variant="h1" sx={{
            fontSize: { xs: 34, md: 54 },
            color: '#182BA1',
            fontWeight: 900,
            textAlign: 'center',
            mb: 6,
            fontFamily: "'Montserrat Alternates', sans-serif"
          }}>
            {t("psychologicalSupport")}
          </Typography>

          {/* Секція Психолога */}
          <Paper elevation={0} sx={{
            borderRadius: 8, overflow: 'hidden', bgcolor: '#fff',
            border: '1px solid', borderColor: alpha('#182BA1', 0.1),
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)', mb: 8
          }}>
            <Grid container>
              <Grid item size={{xs: 12, md: 4}}>
                <Box sx={{ position: 'relative', height: { xs: 400, md: '100%' }, minHeight: 400 }}>
                  <Image
                      src={PSYCHOLOGIST_DATA.photo}
                      alt="Psychologist"
                      fill
                      style={{ objectFit: 'cover' }}
                  />
                </Box>
              </Grid>
              <Grid item size={{xs: 12, md: 8}} sx={{ p: { xs: 3, md: 6 } }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#182BA1', mb: 1 }}>
                  {t("psychologistName")}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#f97316', fontWeight: 600, mb: 3, fontStyle: 'italic' }}>
                  {t("psychologistTitle")}
                </Typography>
                <Typography sx={{ mb: 3, lineHeight: 1.7, color: '#444' }}>
                  {t("psychologistDescription")}
                </Typography>

                <Grid container spacing={4}>
                  <Grid item size={{xs: 12, sm: 6}}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <SchoolIcon sx={{ color: '#f97316' }} />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{t("workDirections")}</Typography>
                    </Box>
                    {PSYCHOLOGIST_DATA.directions.map(key => (
                        <Typography key={key} sx={{ display: 'flex', gap: 1, mb: 1, fontSize: 14 }}>
                          <Box component="span" sx={{ color: '#f97316' }}>•</Box> {t(key)}
                        </Typography>
                    ))}
                  </Grid>
                  <Grid item size={{xs: 12, sm: 6}}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <ContactSupportIcon sx={{ color: '#f97316' }} />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{t("howToContact")}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 14, mb: 1 }}>{t("contactDescription")}</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#182BA1' }}>{t("personalConsultation")}</Typography>
                    <Typography sx={{ fontSize: 14 }}>{t("workSchedule")}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* Секція Ресурсів (Синій фон) */}
          <Box sx={{
            bgcolor: alpha('#182BA1', 0.05),
            borderRadius: 8, p: { xs: 4, md: 6 }, mb: 8,
            border: '1px dashed', borderColor: alpha('#182BA1', 0.2)
          }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, color: '#182BA1' }}>
              📚 {t("usefulResources")}
            </Typography>

            <Grid container spacing={2}>
              {/* Статичні посилання */}
              {PSYCHOLOGIST_DATA.staticResources.map((res, idx) => (
                  <Grid item size={{xs: 12, sm: 6}} key={idx}>
                    <MuiLink href={res.url} target="_blank" sx={{
                      display: 'flex', alignItems: 'center', gap: 1,
                      color: '#182BA1', textDecoration: 'none', fontWeight: 600,
                      '&:hover': { color: '#f97316' }
                    }}>
                      <LaunchIcon sx={{ fontSize: 16 }} /> {t(res.key)}
                    </MuiLink>
                  </Grid>
              ))}

              {/* Динамічні посилання з бази */}
              {blueBackgroundItems.map((item) => {
                const loc = getLocalized(item);
                return (
                    <Grid item size={{xs: 12}} key={item.id}>
                      {loc.text && <Typography sx={{ mt: 2, mb: 1, fontWeight: 500 }}>{loc.text}</Typography>}
                      {item.link && (
                          <MuiLink href={item.link} target="_blank" sx={{ color: '#f97316', fontWeight: 700 }}>
                            {loc.linkText || item.link}
                          </MuiLink>
                      )}
                    </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* Секція Статей (Акордеони) */}
          <Typography variant="h4" sx={{
            textAlign: 'center', fontWeight: 900, mb: 4,
            color: '#182BA1', fontFamily: "'Montserrat Alternates', sans-serif"
          }}>
            {t("usefulArticles")}
          </Typography>

          {isLoading ? <Box sx={{ textAlign: 'center' }}><CircularProgress /></Box> : (
              <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                {accordionItems.map((item) => {
                  const loc = getLocalized(item);
                  return (
                      <Accordion key={item.id} sx={{
                        mb: 2, borderRadius: '16px !important', boxShadow: 'none',
                        border: '1px solid #eee', '&::before': { display: 'none' }
                      }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#f97316' }} />}>
                          <Typography sx={{ fontWeight: 700, color: '#1e2b8d' }}>{loc.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#555' }}>
                            {loc.content}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                  );
                })}
              </Box>
          )}
        </Container>
      </Box>
  );
}
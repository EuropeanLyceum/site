'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Accordion, AccordionSummary,
  AccordionDetails, Grid, Paper, Link as MuiLink,
  CircularProgress, alpha
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';

// ВИНЕСЕНА ІНФОРМАЦІЯ (Конструктор контенту)
const STATIC_METHODICAL_DATA = {
  // Список ігор (ID відповідають ключам у перекладах game{N}Name/Description)
  games: [1, 2],

  // Критерії ефективності уроку
  effectivenessPoints: [1, 2],

  // Правила дисципліни
  disciplineRules: [1, 2],

  // Ресурси цифрової грамотності
  digitalLinks: [
    { key: "cyberHygiene", url: "https://osvita.diia.gov.ua/courses/cyber-hygiene" },
    { key: "cybernanny", url: "https://osvita.diia.gov.ua/courses/cybernanny" },
    { key: "digitalCommunities", url: "https://osvita.diia.gov.ua/courses/digital-communities" },
    { key: "digitalSignature", url: "https://osvita.diia.gov.ua/courses/digital-signature" }
  ],

  // Посилання на академічну доброчесність
  integrityLinks: [
    { key: "academicIntegrityEducation", url: "https://docs.google.com/document/d/15j7N4paWcXiuUZbIzFW9z7Lna6OYW_nD/edit" },
    { key: "academicIntegrityComplete", url: "https://docs.google.com/document/d/1OqnzljmdKG2-TejHKAoy_89NLU8_xp2P/edit" },
    { key: "academicIntegritySchool", url: "https://docs.google.com/document/d/1-ofGwJUyxhkO45aGJmvl6ElM_pf_7Jpu/edit" }
  ]
};

export default function TeacherHelpPage() {
  const { t, locale } = useTranslation("teacherHelp");
  const [dynamicItems, setDynamicItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Логіка локалізації для динамічних даних з БД
  const getLocalized = (item) => ({
    title: locale === 'en' ? (item.titleEn || item.title) : item.title,
    content: locale === 'en' ? (item.contentEn || item.content) : item.content,
    text: locale === 'en' ? (item.textEn || item.text) : item.text,
    linkText: locale === 'en' ? (item.linkTextEn || item.linkText) : item.linkText
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/help-teacher');
        if (response.ok) {
          const data = await response.json();
          setDynamicItems(data);
        }
      } catch (err) { console.error("Fetch error:", err); }
      finally { setIsLoading(false); }
    };
    loadData();
  }, []);

  const accordionItems = dynamicItems.filter(item => item.title && item.content);
  const footerItems = dynamicItems.filter(item => !item.title && (item.text || item.link));

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fff', pb: 10 }}>
        {/* Header */}
        <Box sx={{
          py: 5, bgcolor: alpha('#182BA1', 0.03),
          borderBottom: '1px solid', borderColor: alpha('#182BA1', 0.1)
        }}>
          <Container maxWidth="md">
            <Typography variant="h1" sx={{
              fontSize: { xs: 32, md: 48 }, color: '#182BA1',
              fontWeight: 900, textAlign: 'center',
              fontFamily: "'Montserrat Alternates', sans-serif"
            }}>
              {t("teacherHelp")}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 6 }}>
          {/* Секція динамічних акордеонів (Верхня частина) */}
          <Box sx={{ mb: 6 }}>
            {isLoading ? (
                <Box sx={{ textAlign: 'center', py: 5 }}><CircularProgress /></Box>
            ) : (
                accordionItems.map((item) => {
                  const loc = getLocalized(item);
                  return (
                      <Accordion key={item.id} sx={{ mb: 2, borderRadius: '12px !important', boxShadow: 'none', border: '1px solid #eee' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#182BA1' }} />}>
                          <Typography sx={{ fontWeight: 700, color: '#182BA1' }}>{loc.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ bgcolor: alpha('#182BA1', 0.01) }}>
                          <Typography sx={{ whiteSpace: 'pre-wrap', color: '#444', lineHeight: 1.7 }}>
                            {loc.content}
                          </Typography>
                          {item.link && (
                              <MuiLink href={item.link} target="_blank" sx={{ display: 'block', mt: 2, color: '#f97316', fontWeight: 600 }}>
                                {loc.linkText || item.link}
                              </MuiLink>
                          )}
                        </AccordionDetails>
                      </Accordion>
                  );
                })
            )}
          </Box>

          <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, color: '#182BA1', textAlign: 'center' }}>
            {t("methodologicalRecommendations")}
          </Typography>

          <Grid container spacing={3}>
            {/* Картка рухливих ігор */}
            <Grid item size={{xs: 12, md: 6}}>
              <Paper elevation={0} sx={{
                p: 4, height: '100%', borderRadius: 6,
                bgcolor: alpha('#f97316', 0.05), border: '1px solid', borderColor: alpha('#f97316', 0.1)
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <EmojiEventsIcon sx={{ color: '#f97316', fontSize: 32 }} />
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{t("activeGamesTitle")}</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>{t("activeGamesIntro")}</Typography>

                {STATIC_METHODICAL_DATA.games.map(num => (
                    <Box key={num} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f97316' }}>
                        {t(`game${num}Name`)}
                      </Typography>
                      <Typography variant="body2">{t(`game${num}Description`)}</Typography>
                    </Box>
                ))}
              </Paper>
            </Grid>

            {/* Правила та Дисципліна */}
            <Grid item size={{xs: 12, md: 6}}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Акордеон Ефективності */}
                <Accordion sx={{ borderRadius: '16px !important', border: '1px solid #eee' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 700 }}>{t("lessonEffectivenessTitle")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box component="ol" sx={{ pl: 2 }}>
                      {STATIC_METHODICAL_DATA.effectivenessPoints.map(num => (
                          <li key={num} style={{ marginBottom: '10px' }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{t(`lessonEffectivenessPoint${num}`)}</Typography>
                            <Typography variant="caption" display="block">{t(`lessonEffectivenessText${num}`)}</Typography>
                          </li>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>

                {/* Акордеон Дисципліни */}
                <Accordion sx={{ borderRadius: '16px !important', border: '1px solid #eee' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 700 }}>{t("classDisciplineTitle")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" sx={{ mb: 2 }}>{t("classDisciplineText1")}</Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      {STATIC_METHODICAL_DATA.disciplineRules.map(num => (
                          <li key={num}><Typography variant="body2">{t(`classDisciplineRule${num}`)}</Typography></li>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Grid>
          </Grid>

          {/* Секція ресурсів (Цифрова освіта та Доброчесність) */}
          <Box sx={{
            mt: 8, p: { xs: 4, md: 6 }, borderRadius: 8,
            bgcolor: alpha('#182BA1', 0.04), border: '1px dashed', borderColor: alpha('#182BA1', 0.3)
          }}>
            <Grid container spacing={6}>
              <Grid item size={{xs: 12, md: 6}}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <LaptopMacIcon sx={{ color: '#182BA1' }} />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{t("digitalLiteracyText")}</Typography>
                </Box>
                {STATIC_METHODICAL_DATA.digitalLinks.map((link) => (
                    <MuiLink key={link.key} href={link.url} target="_blank"
                             sx={{ color: '#182BA1', fontWeight: 600, display: 'block', mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      • {t(link.key)}
                    </MuiLink>
                ))}
              </Grid>

              <Grid item size={{xs: 12, md: 6}}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <SchoolIcon sx={{ color: '#182BA1' }} />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{t("academicIntegrity")}</Typography>
                </Box>
                {STATIC_METHODICAL_DATA.integrityLinks.map((link) => (
                    <MuiLink key={link.key} href={link.url} target="_blank"
                             sx={{ color: '#182BA1', fontWeight: 600, display: 'block', mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      • {t(link.key)}
                    </MuiLink>
                ))}
              </Grid>
            </Grid>


            {footerItems.map((item) => {
              const loc = getLocalized(item);
              return (
                  <Box key={item.id} sx={{ mt: 4, pt: 4, borderTop: '1px solid', borderColor: alpha('#000', 0.1) }}>
                    {loc.text && <Typography sx={{ mb: 2, fontWeight: 500, color: '#334155' }}>{loc.text}</Typography>}
                    {item.link && (
                        <MuiLink href={item.link} target="_blank"
                                 sx={{ bgcolor: '#f97316', color: '#fff', px: 2, py: 1, borderRadius: 2, display: 'inline-block', textDecoration: 'none', fontWeight: 700, '&:hover': { bgcolor: '#ea580c' } }}>
                          {loc.linkText || item.link}
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
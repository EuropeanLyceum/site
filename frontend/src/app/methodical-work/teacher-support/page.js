'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Accordion, AccordionSummary,
  AccordionDetails, Link as MuiLink, CircularProgress, alpha, Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';

const STATIC_SECTIONS = [
  {
    id: 'active-games',
    titleKey: "activeGamesTitle",
    type: 'list_with_description', // Ігри: заголовок + опис
    introKey: "activeGamesIntro",
    items: [1, 2], // game1Name, game1Description...
    itemPrefix: 'game'
  },
  {
    id: 'effectiveness',
    titleKey: "lessonEffectivenessTitle",
    type: 'numbered_list', // Ефективність: Пункт + підтекст
    items: [1, 2], // lessonEffectivenessPoint1, lessonEffectivenessText1...
    itemPrefix: 'lessonEffectiveness'
  },
  {
    id: 'discipline',
    titleKey: "classDisciplineTitle",
    type: 'bullet_list', // Дисципліна: Текст + список правил
    introKey: "classDisciplineText1",
    items: [1, 2], // classDisciplineRule1...
    itemPrefix: 'classDisciplineRule'
  }
];

const EXTERNAL_RESOURCES = {
  digital: [
    { key: "cyberHygiene", url: "https://osvita.diia.gov.ua/courses/cyber-hygiene" },
    { key: "cybernanny", url: "https://osvita.diia.gov.ua/courses/cybernanny" },
    { key: "digitalCommunities", url: "https://osvita.diia.gov.ua/courses/digital-communities" },
    { key: "digitalSignature", url: "https://osvita.diia.gov.ua/courses/digital-signature" }
  ],
  integrity: [
    { key: "academicIntegrityEducation", url: "https://docs.google.com/document/d/15j7N4paWcXiuUZbIzFW9z7Lna6OYW_nD/edit" },
    { key: "academicIntegrityComplete", url: "https://docs.google.com/document/d/1OqnzljmdKG2-TejHKAoy_89NLU8_xp2P/edit" },
    { key: "academicIntegritySchool", url: "https://docs.google.com/document/d/1-ofGwJUyxhkO45aGJmvl6ElM_pf_7Jpu/edit" }
  ]
};

export default function TeacherHelpPage() {
  const { t, locale } = useTranslation("teacherHelp");
  const [dynamicItems, setDynamicItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/help-teacher');
        if (response.ok) {
          const data = await response.json();
          setDynamicItems(data);
        }
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    loadData();
  }, []);

  const getLocalized = (item) => ({
    title: locale === 'en' ? (item.titleEn || item.title) : item.title,
    content: locale === 'en' ? (item.contentEn || item.content) : item.content,
    text: locale === 'en' ? (item.textEn || item.text) : item.text,
    linkText: locale === 'en' ? (item.linkTextEn || item.linkText) : item.linkText
  });

  const accordionItemsFromDb = dynamicItems.filter(item => item.title && item.content);
  const footerItemsFromDb = dynamicItems.filter(item => !item.title && (item.text || item.link));

  // Рендерер для статичного контенту всередині акордеонів
  const renderStaticContent = (section) => {
    switch (section.type) {
      case 'list_with_description':
        return (
            <Box>
              <Typography sx={{ mb: 2, fontWeight: 500 }}>{t(section.introKey)}</Typography>
              {section.items.map(num => (
                  <Box key={num} sx={{ mb: 2 }}>
                    <Typography sx={{ fontWeight: 700, color: '#f97316' }}>{t(`${section.itemPrefix}${num}Name`)}</Typography>
                    <Typography variant="body2">{t(`${section.itemPrefix}${num}Description`)}</Typography>
                  </Box>
              ))}
            </Box>
        );
      case 'numbered_list':
        return (
            <Box component="ol" sx={{ pl: 2 }}>
              {section.items.map(num => (
                  <li key={num} style={{ marginBottom: '12px' }}>
                    <Typography sx={{ fontWeight: 700 }}>{t(`${section.itemPrefix}Point${num}`)}</Typography>
                    <Typography variant="body2" sx={{ color: '#555' }}>{t(`${section.itemPrefix}Text${num}`)}</Typography>
                  </li>
              ))}
            </Box>
        );
      case 'bullet_list':
        return (
            <Box>
              <Typography sx={{ mb: 2 }}>{t(section.introKey)}</Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {section.items.map(num => (
                    <li key={num} style={{ marginBottom: '6px' }}>
                      <Typography variant="body2">{t(`${section.itemPrefix}${num}`)}</Typography>
                    </li>
                ))}
              </Box>
            </Box>
        );
      default: return null;
    }
  };

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fff', pb: 10 }}>
        {/* Hero Header */}
        <Box sx={{ py: 6, bgcolor: alpha('#182BA1', 0.03), borderBottom: '1px solid', borderColor: alpha('#182BA1', 0.1) }}>
          <Container maxWidth="md">
            <Typography variant="h1" sx={{ fontSize: { xs: 32, md: 48 }, color: '#182BA1', fontWeight: 900, textAlign: 'center', fontFamily: "'Montserrat Alternates', sans-serif" }}>
              {t("teacherHelp")}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ mt: 6 }}>
          {/* 1. ГРУПА АКОРДЕОНІВ: ДИНАМІЧНІ (З БАЗИ) */}
          {isLoading ? (
              <Box sx={{ textAlign: 'center', py: 5 }}><CircularProgress /></Box>
          ) : (
              accordionItemsFromDb.map((item) => {
                const loc = getLocalized(item);
                return (
                    <Accordion key={item.id} sx={{ mb: 2, borderRadius: '12px !important', boxShadow: 'none', border: '1px solid #eee' }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#182BA1' }} />}>
                        <Typography sx={{ fontWeight: 700, color: '#182BA1' }}>{loc.title}</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ bgcolor: alpha('#182BA1', 0.01) }}>
                        <Typography sx={{ whiteSpace: 'pre-wrap', color: '#444', lineHeight: 1.7 }}>{loc.content}</Typography>
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

          {/* 2. ГРУПА АКОРДЕОНІВ: СТАТИЧНІ (ПОРАДИ, ІГРИ ТОЩО) */}
          <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: 800, color: '#182BA1', textAlign: 'center' }}>
            {t("methodologicalRecommendations")}
          </Typography>

          {STATIC_SECTIONS.map((section) => (
              <Accordion key={section.id} sx={{ mb: 2, borderRadius: '12px !important', boxShadow: 'none', border: '1px solid #eee' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#182BA1' }} />}>
                  <Typography sx={{ fontWeight: 700, color: '#182BA1' }}>{t(section.titleKey)}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: alpha('#182BA1', 0.01) }}>
                  {renderStaticContent(section)}
                </AccordionDetails>
              </Accordion>
          ))}

          {/* 3. ФУТЕР-РЕСУРСИ (БЕЗ АКОРДЕОНІВ, БО ЦЕ ПОСИЛАННЯ) */}
          <Box sx={{ mt: 8, p: 4, borderRadius: 6, bgcolor: alpha('#182BA1', 0.04), border: '1px dashed', borderColor: alpha('#182BA1', 0.3) }}>
            <Grid container spacing={4}>
              <Grid item size={{xs: 12, md: 6}}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#182BA1' }}>{t("digitalLiteracyText")}</Typography>
                {EXTERNAL_RESOURCES.digital.map(link => (
                    <MuiLink key={link.key} href={link.url} target="_blank" sx={{ display: 'block', mb: 1, color: '#182BA1', textDecoration: 'none', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}>
                      • {t(link.key)}
                    </MuiLink>
                ))}
              </Grid>
              <Grid item size={{xs: 12, md: 6}}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#182BA1' }}>{t("academicIntegrity")}</Typography>
                {EXTERNAL_RESOURCES.integrity.map(link => (
                    <MuiLink key={link.key} href={link.url} target="_blank" sx={{ display: 'block', mb: 1, color: '#182BA1', textDecoration: 'none', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}>
                      • {t(link.key)}
                    </MuiLink>
                ))}
              </Grid>
            </Grid>

            {/* Динамічний футер з БД */}
            {footerItemsFromDb.map((item) => {
              const loc = getLocalized(item);
              return (
                  <Box key={item.id} sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: alpha('#000', 0.1) }}>
                    {loc.text && <Typography sx={{ mb: 2 }}>{loc.text}</Typography>}
                    {item.link && (
                        <MuiLink href={item.link} target="_blank" sx={{ bgcolor: '#f97316', color: '#fff', px: 2, py: 1, borderRadius: 2, display: 'inline-block', textDecoration: 'none', fontWeight: 700 }}>
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
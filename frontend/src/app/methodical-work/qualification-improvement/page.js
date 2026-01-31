'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Card, CardMedia,
  CardContent, Link as MuiLink, Divider, CircularProgress, alpha
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';

// ВИНЕСЕНА СТАТИКА (Тут усе, що було жорстко прописано в коді)
const QUALIFICATION_STATIC = {
  // Список документів (нижня секція)
  documents: [
    { key: "qualificationQuestions", url: "https://docs.google.com/document/d/14ZDrZjieY5aDyLI1VQA-bfNv1H4cjDQY/edit" },
    { key: "psychologicalServiceRecommendations", url: "https://drive.google.com/file/d/1V5axKQHpPS0zjSpKjqBZ3zMKqTINgqVX/view" },
    { key: "qualificationResults2024", url: "https://drive.google.com/drive/folders/1JUczDaFO0BFD2rjLtunOUKNSGCF1W9ON" },
    { key: "qualificationProspects2025", url: "https://docs.google.com/document/d/16BFVfn5vPe_XNP76txtudrR-dFwwehIc/edit" }
  ],

  nushTraining: {
    titleKey: "trainingTitle",
    paragraphs: ["trainingText1", "trainingText2", "trainingText3"],
    linkKey: "viewTrainingMaterials",
    url: "https://padlet.com/lubnynush6/l48ff0euvhlk0yk6",
    accentColor: '#8b5cf6'
  }
};

export default function QualificationImprovementPage() {
  const { t, locale } = useTranslation("qualification");
  const [dynamicItems, setDynamicItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/qualification-improvement');
        if (response.ok) {
          const data = await response.json();
          setDynamicItems(data);
        }
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const getLocalized = (item) => ({
    title: locale === 'en' ? (item.titleEn || item.title) : item.title,
    content: locale === 'en' ? (item.contentEn || item.content) : item.content,
    text: locale === 'en' ? (item.textEn || item.text) : item.text,
    linkText: locale === 'en' ? (item.linkTextEn || item.linkText) : item.linkText
  });

  // Фільтрація за вашою логікою
  const contentBlocks = dynamicItems.filter(item =>
      (item.title || item.titleEn || item.content || item.contentEn || item.photoUrls?.length > 0)
  );

  const pinkBackgroundItems = dynamicItems.filter(item =>
      (item.text || item.textEn || item.link) && !item.title && !item.content && (!item.photoUrls || item.photoUrls.length === 0)
  );

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fff', pb: 10 }}>
        {/* Hero Header */}
        <Box sx={{ py: 4, bgcolor: alpha('#182BA1', 0.03), textAlign: 'center' }}>
          <Container maxWidth="md">
            <Typography variant="h2" sx={{
              fontWeight: 900, color: '#182BA1',
              fontFamily: "'Montserrat Alternates', sans-serif",
              fontSize: { xs: 32, md: 48 }
            }}>
              {t("qualificationImprovement")}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 3 }}>
          {isLoading ? (
              <Box sx={{ textAlign: 'center', py: 10 }}><CircularProgress /></Box>
          ) : (
              <Grid container spacing={6}>
                {/* 1. Динамічні блоки (Новини/Звіти про кваліфікацію) */}
                {contentBlocks.reverse().map((item, idx) => {
                  const loc = getLocalized(item);
                  return (
                      <Grid item size={{xs: 12}} key={item.id}>
                        <Box sx={{
                          p: { xs: 3, md: 6 }, borderRadius: 8,
                          borderLeft: '6px solid', borderColor: '#182BA1',
                          bgcolor: alpha('#182BA1', 0.01),
                          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                        }}>
                          {loc.title && (
                              <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: '#1e293b' }}>
                                {loc.title}
                              </Typography>
                          )}
                          {loc.content && (
                              <Typography sx={{ whiteSpace: 'pre-wrap', color: '#475569', lineHeight: 1.8, fontSize: 17, mb: 4 }}>
                                {loc.content}
                              </Typography>
                          )}

                          {/* Фотогалерея блоку */}
                          <Grid container spacing={2}>
                            {item.photoUrls?.map((url, pIdx) => (
                                <Grid item size={{xs: 12, sm: 6, md: 4}} key={pIdx}>
                                  <CardMedia
                                      component="img"
                                      image={url}
                                      sx={{ borderRadius: 4, height: 250, objectFit: 'cover', transition: '0.3s', '&:hover': { transform: 'scale(1.02)' } }}
                                  />
                                </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </Grid>
                  );
                })}

                {/* 2. Статичний блок НУШ */}
                <Grid item size={{xs: 12}}>
                  <Box sx={{
                    p: { xs: 3, md: 6 }, borderRadius: 8,
                    bgcolor: alpha(QUALIFICATION_STATIC.nushTraining.accentColor, 0.05),
                    border: '1px solid', borderColor: alpha(QUALIFICATION_STATIC.nushTraining.accentColor, 0.2)
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#6b21a8', mb: 3 }}>
                      {t(QUALIFICATION_STATIC.nushTraining.titleKey)}
                    </Typography>
                    {QUALIFICATION_STATIC.nushTraining.paragraphs.map((pKey, i) => (
                        <Typography key={i} sx={{ mb: 2, color: '#475569' }}>{t(pKey)}</Typography>
                    ))}
                    <MuiLink
                        href={QUALIFICATION_STATIC.nushTraining.url} target="_blank"
                        sx={{
                          display: 'inline-flex', alignItems: 'center', gap: 1, mt: 2,
                          fontWeight: 700, color: '#8b5cf6', textDecoration: 'none',
                          borderBottom: '2px solid'
                        }}
                    >
                      {t(QUALIFICATION_STATIC.nushTraining.linkKey)} <OpenInNewIcon fontSize="small" />
                    </MuiLink>
                  </Box>
                </Grid>
              </Grid>
          )}

          {/* 3. Футер з документами (Помаранчева зона) */}
          <Box sx={{
            mt: 10, p: { xs: 4, md: 8 }, borderRadius: 10,
            bgcolor: alpha('#f97316', 0.05), border: '2px dashed', borderColor: alpha('#f97316', 0.2)
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <AssignmentIcon sx={{ color: '#f97316', fontSize: 32 }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#c2410c' }}>
                {t("documentsTitle") || "Документація"}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Статичні документи */}
              {QUALIFICATION_STATIC.documents.map((doc, i) => (
                  <Grid item xs={12} md={6} key={i}>
                    <MuiLink
                        href={doc.url} target="_blank"
                        sx={{
                          display: 'block', p: 2, borderRadius: 3, bgcolor: '#fff',
                          color: '#182BA1', fontWeight: 600, textDecoration: 'none',
                          transition: '0.2s', border: '1px solid #eee',
                          '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderColor: '#f97316' }
                        }}
                    >
                      • {t(doc.key)}
                    </MuiLink>
                  </Grid>
              ))}

              {/* Динамічні дод. посилання з API */}
              {pinkBackgroundItems.map((item) => {
                const loc = getLocalized(item);
                return (
                    <Grid item xs={12} key={item.id}>
                      <Divider sx={{ my: 2 }} />
                      {loc.text && <Typography sx={{ mb: 2, fontWeight: 500 }}>{loc.text}</Typography>}
                      {item.link && (
                          <MuiLink
                              href={item.link} target="_blank"
                              sx={{ color: '#f97316', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}
                          >
                            {loc.linkText || item.link} <OpenInNewIcon fontSize="inherit" />
                          </MuiLink>
                      )}
                    </Grid>
                );
              })}
            </Grid>
          </Box>
        </Container>
      </Box>
  );
}
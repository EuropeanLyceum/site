'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Paper,
  Button, Divider, alpha, CircularProgress,
  Link as MuiLink, Card, CardContent
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DescriptionIcon from '@mui/icons-material/Description';
import GppGoodIcon from '@mui/icons-material/GppGood';
import LaunchIcon from '@mui/icons-material/Launch';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';

// СТАТИЧНІ ДАНІ СТОРІНКИ
const ANTI_BULLYING_RESOURCES = {
  chatbot: {
    link: "http://t.me/ProBullyingBot",
    handle: "@ProBullyingBot"
  },
  documents: [
    { key: "bullyingReport", url: "https://drive.google.com/file/d/1NOzfllJcpHzTK7ShfKGAyHDCFjnITMSn/view" },
    { key: "bullyingProcedure", url: "https://drive.google.com/file/d/1_uBWZ8P_eVkUIqA6LfHnBgVbOobdBvaN/view" },
    { key: "cyberbullyingProtection", url: "https://drive.google.com/file/d/1LQqIU9E79Mun7tM0m3Py3YgbJfXTs9ld/view" },
    { key: "cyberbullyingGuide", url: "https://docs.google.com/document/d/1LDIjtAUm1wouy6X-76ho1SG6EYemMbf2/edit" }
  ]
};

export default function Antibullying() {
  const { t, locale } = useTranslation("anti");
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getLocalized = (item) => ({
    title: locale === 'en' ? (item.titleEn || item.title) : item.title,
    content: locale === 'en' ? (item.contentEn || item.content) : item.content,
    linkText: locale === 'en' ? (item.linkTextEn || item.linkText) : item.linkText
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/anti-bullying");
        if (response.ok) {
          const data = await response.json();
          setArticles(data.sort((a, b) => b.id - a.id));
        }
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    loadData();
  }, []);

  const blockItems = articles.filter(item => item.title && item.content);
  const dynamicDocuments = articles.filter(item => item.link && !item.content);

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 10 }}>
        {/* Header Секція */}
        <Box sx={{
          pt: { xs: 6 }, pb: 6, textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(24, 43, 161, 0.08) 0%, transparent 100%)'
        }}>
          <Container maxWidth="md">
            <Typography variant="h1" sx={{
              fontSize: { xs: 32, md: 52 },
              color: '#182BA1',
              fontWeight: 900,
              fontFamily: "'Montserrat Alternates', sans-serif",
              mb: 2
            }}>
              {t("antiBullying")}
            </Typography>
            <Box sx={{ width: 80, height: 4, bgcolor: '#f97316', mx: 'auto', borderRadius: 2 }} />
          </Container>
        </Box>

        <Container maxWidth="lg">
          {/* Чат-бот блок (Акцентний) */}
          <Paper elevation={0} sx={{
            p: { xs: 3, md: 5 }, borderRadius: 6,
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            color: '#fff', mb: 6, position: 'relative', overflow: 'hidden'
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                <SmartToyIcon sx={{ fontSize: 40 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "'Montserrat Alternates', sans-serif" }}>
                  {t("schoolChatbot")}
                </Typography>
              </Box>
              <Typography sx={{ textAlign: 'center', fontSize: '1.1rem', mb: 3, opacity: 0.9 }}>
                {t("chatbotDescription")}
              </Typography>
              <Box sx={{ textAlign: 'center' }}>
                <Button
                    variant="contained"
                    href={ANTI_BULLYING_RESOURCES.chatbot.link}
                    target="_blank"
                    sx={{
                      bgcolor: '#fff', color: '#ea580c', fontWeight: 700, px: 4, py: 1.5,
                      borderRadius: 10, '&:hover': { bgcolor: alpha('#fff', 0.9) }
                    }}
                >
                  {ANTI_BULLYING_RESOURCES.chatbot.handle}
                </Button>
              </Box>
            </Box>
            {/* Декоративний елемент */}
            <SmartToyIcon sx={{
              position: 'absolute', right: -20, bottom: -20,
              fontSize: 150, opacity: 0.1, transform: 'rotate(-15deg)'
            }} />
          </Paper>

          <Grid container spacing={4}>
            {/* Секція документів (Зліва/Зверху) */}
            <Grid item size={{xs: 12, md: 4}}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#182BA1', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <DescriptionIcon /> {t("usefulDocuments")}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[...ANTI_BULLYING_RESOURCES.documents, ...dynamicDocuments].map((doc, idx) => (
                    <Paper
                        key={idx}
                        component="a"
                        href={doc.url || doc.link}
                        target="_blank"
                        sx={{
                          p: 2, borderRadius: 3, textDecoration: 'none',
                          display: 'flex', alignItems: 'center', gap: 2,
                          border: '1px solid #e2e8f0', transition: '0.3s',
                          '&:hover': { bgcolor: '#fff', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', borderColor: '#182BA1' }
                        }}
                    >
                      <Box sx={{ bgcolor: alpha('#182BA1', 0.1), p: 1, borderRadius: 2 }}>
                        <LaunchIcon sx={{ fontSize: 18, color: '#182BA1' }} />
                      </Box>
                      <Typography sx={{ color: '#334155', fontWeight: 600, fontSize: 14 }}>
                        {doc.key ? t(doc.key) : (getLocalized(doc).linkText || doc.link)}
                      </Typography>
                    </Paper>
                ))}
              </Box>
            </Grid>

            {/* Секція контенту (Справа/Знизу) */}
            <Grid item size={{xs: 12, md: 8}}>
              {isLoading ? (
                  <Box sx={{ textAlign: 'center', py: 5 }}><CircularProgress /></Box>
              ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {blockItems.map((article) => {
                      const loc = getLocalized(article);
                      return (
                          <Card key={article.id} sx={{
                            borderRadius: 5, boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                            border: '1px solid #e2e8f0'
                          }}>
                            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                              <Typography variant="h5" sx={{
                                fontWeight: 800, color: '#182BA1', mb: 3,
                                borderLeft: '4px solid #f97316', pl: 2
                              }}>
                                {loc.title}
                              </Typography>

                              <Box sx={{ color: '#475569', lineHeight: 1.8 }}>
                                {loc.content.split('\n').map((para, i) => {
                                  const text = para.trim();
                                  if (!text) return null;

                                  // Рендеринг булетів
                                  if (text.startsWith('•')) {
                                    return (
                                        <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1, pl: 1 }}>
                                          <Box sx={{ color: '#f97316', fontWeight: 900 }}>▸</Box>
                                          <Typography variant="body2">{text.substring(1).trim()}</Typography>
                                        </Box>
                                    );
                                  }

                                  // Рендеринг Важливих боксів (наприклад, визначення)
                                  if (text.startsWith('Булінг') || text.startsWith('Цькування')) {
                                    return (
                                        <Box key={i} sx={{
                                          bgcolor: alpha('#f97316', 0.05), p: 3, borderRadius: 3,
                                          border: '1px solid', borderColor: alpha('#f97316', 0.2), my: 2,
                                          display: 'flex', gap: 2
                                        }}>
                                          <InfoIcon sx={{ color: '#f97316' }} />
                                          <Typography variant="body2" sx={{ fontStyle: 'italic', fontWeight: 500 }}>{text}</Typography>
                                        </Box>
                                    );
                                  }

                                  return <Typography key={i} variant="body1" sx={{ mb: 2 }}>{text}</Typography>;
                                })}
                              </Box>

                              {/* Галерея зображень */}
                              {article.photoUrls && (
                                  <Grid container spacing={2} sx={{ mt: 3 }}>
                                    {article.photoUrls.split(',').map((url, imgIdx) => (
                                        <Grid item size={{xs: 12, sm: 6}} key={imgIdx}>
                                          <Box
                                              component="img"
                                              src={url.trim()}
                                              sx={{
                                                width: '100%', height: 220, objectFit: 'cover',
                                                borderRadius: 4, transition: '0.3s',
                                                '&:hover': { transform: 'scale(1.02)' }
                                              }}
                                          />
                                        </Grid>
                                    ))}
                                  </Grid>
                              )}
                            </CardContent>
                          </Card>
                      );
                    })}
                  </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
  );
}
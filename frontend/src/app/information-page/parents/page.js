'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Box, Typography, Container, Accordion, AccordionSummary,
    AccordionDetails, Link as MuiLink, CircularProgress, alpha, Grid, Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';

export default function ParentsPage() {
    const { t, locale } = useTranslation("parents");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/for-parents').then(res => res.json()).then(d => {
            setData(d);
            setIsLoading(false);
        });
    }, [locale]);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 10 }}>
            {/* HERO */}
            <Box sx={{
                py: { xs: 8, md: 10 },
                background: 'linear-gradient(135deg, #182BA1 0%, #0c1865 100%)',
                color: '#fff', textAlign: 'center',
                clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)', mb: 6
            }}>
                <Container maxWidth="md">
                    <FamilyRestroomIcon sx={{ fontSize: 60, mb: 2, opacity: 0.8 }} />
                    <Typography variant="h1" sx={{ fontSize: { xs: 32, md: 54 }, fontWeight: 900, fontFamily: "'Montserrat Alternates', sans-serif" }}>
                        {t("parentsTitle") || "Батькам"}
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="md">
                {isLoading ? <CircularProgress sx={{ display: 'block', mx: 'auto' }} /> : (
                    <Box>
                        {data.map((item) => {
                            const heading = locale === 'en' ? (item.headingEn || item.heading) : item.heading;
                            const content = locale === 'en' ? (item.contentEn || item.content) : item.content;

                            return (
                                <Paper key={item.id} sx={{ mb: 4, borderRadius: 6, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                                    <Box sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <InfoIcon sx={{ color: '#f97316' }} />
                                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0c1865' }}>
                                                {heading || t("info")}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-line', color: '#334155', lineHeight: 1.8, mb: 3 }}>
                                            {content}
                                        </Typography>

                                        {/* Файли та посилання */}
                                        {item.url && (
                                            <MuiLink href={item.url} target="_blank" sx={{ display: 'inline-block', p: 1.5, px: 3, bgcolor: alpha('#f97316', 0.1), color: '#f97316', borderRadius: 2, fontWeight: 700, textDecoration: 'none' }}>
                                                {t("openResource") || "Перейти до матеріалів"} →
                                            </MuiLink>
                                        )}

                                        {/* Галерея зображень */}
                                        {item.photoUrls?.length > 0 && (
                                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                                {item.photoUrls.map((url, idx) => (
                                                    <Grid item xs={12} sm={item.photoUrls.length > 1 ? 6 : 12} key={idx}>
                                                        <Box sx={{ borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                                                            <Image src={url} alt="parent-info" width={800} height={500} layout="responsive" objectFit="cover" />
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        )}
                                    </Box>
                                </Paper>
                            );
                        })}
                    </Box>
                )}
            </Container>
        </Box>
    );
}
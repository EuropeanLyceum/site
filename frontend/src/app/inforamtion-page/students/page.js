'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Box, Typography, Container, Accordion, AccordionSummary,
    AccordionDetails, Link as MuiLink, CircularProgress, alpha, Grid, Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import firebird from '@/assets/photos/firebird/firebird2.png';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';

export default function StudentsPage() {
    const { t, locale } = useTranslation("students");
    const [dynamicItems, setDynamicItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/for-students')
            .then(res => res.json())
            .then(data => {
                setDynamicItems(data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [locale]);

    const getLocalized = (item) => ({
        heading: locale === 'en' ? (item.headingEn || item.heading) : item.heading,
        content: locale === 'en' ? (item.contentEn || item.content) : item.content,
    });

    const QUICK_TIPS = [
        { id: 'selfControl', title: t('howToControlYourself'), icon: <SelfImprovementIcon fontSize="large" />, color: '#182BA1', keys: ['selfControlRule1', 'selfControlRule2'] },
        { id: 'exam', title: t('howToPrepareForExam'), icon: <RocketLaunchIcon fontSize="large" />, color: '#f97316', keys: ['examPreparationText1', 'examPreparationText2'] },
        { id: 'health', title: t('sevenHealthyLifeRules'), icon: <LightbulbIcon fontSize="large" />, color: '#10b981', keys: ['healthyRulesText1'] }
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 10 }}>
            {/* HERO SECTION */}
            <Box sx={{
                position: 'relative', py: { xs: 10, md: 15 },
                background: 'linear-gradient(135deg, #0c1865 0%, #182BA1 100%)',
                color: '#fff', overflow: 'hidden',
                clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0% 100%)'
            }}>
                <Container maxWidth="lg">
                    <Typography variant="h1" sx={{ fontSize: { xs: 40, md: 72 }, fontWeight: 900, fontFamily: "'Montserrat Alternates', sans-serif", mb: 2 }}>
                        STUDENT <span style={{ color: '#f97316' }}>SUCCESS</span>
                    </Typography>
                    </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -8 }}>
                <Grid container spacing={3}>
                    {isLoading ? <CircularProgress sx={{ mx: 'auto', mt: 5 }} /> : dynamicItems.map((item) => {
                        const loc = getLocalized(item);
                        return (
                            <Grid item xs={12} md={6} key={item.id}>
                                <Paper sx={{ p: 4, height: '100%', borderRadius: 6, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                                        <MenuBookIcon sx={{ color: '#182BA1' }} />
                                        <Typography variant="h5" sx={{ fontWeight: 800 }}>{loc.heading}</Typography>
                                    </Box>
                                    <Typography sx={{ whiteSpace: 'pre-wrap', color: '#475569', mb: 3 }}>{loc.content}</Typography>

                                    {/* Медіа та Файли */}
                                    <Box sx={{ mt: 'auto' }}>
                                        {item.url && (
                                            <MuiLink href={item.url} target="_blank" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#f97316', fontWeight: 700, mb: 2 }}>
                                                <AttachFileIcon fontSize="small" /> {t("openResource") || "Відкрити матеріал"}
                                            </MuiLink>
                                        )}
                                        {item.photoUrls?.map((url, i) => (
                                            <Box key={i} sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', mt: 1 }}>
                                                <Image src={url} alt="info" width={600} height={350} layout="responsive" objectFit="cover" />
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* STATIC TIPS */}
                <Box sx={{ mt: 10 }}>
                    {QUICK_TIPS.map((group) => (
                        <Accordion key={group.id} sx={{ mb: 2, borderRadius: '20px !important', bgcolor: alpha(group.color, 0.03), boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {group.icon}
                                    <Typography sx={{ fontWeight: 800 }}>{group.title}</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    {group.keys.map((key, i) => (
                                        <Grid item xs={12} md={4} key={i}>
                                            <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 3, border: '1px solid #f1f5f9' }}>
                                                <Typography sx={{ color: group.color, fontWeight: 900 }}>0{i + 1}</Typography>
                                                <Typography variant="body2">{t(key)}</Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
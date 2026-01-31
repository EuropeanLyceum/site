'use client';
import {useState, useEffect} from 'react';
import {Box, Typography, Grid} from '@mui/material';
import Image from 'next/image';
import DynamicPost from './components/DynamicPost';
import {useTranslation} from '@/contexts/TranslationProvider.jsx';
import newProjectImg from '@/assets/photos/new_project.jpg';
import healthCircleImg from '@/assets/photos/health_circle.jpg';
import healthProjectImg from '@/assets/photos/health_prjct.jpg';
import {apiUrl, assetUrl} from '@/utils/api.js';

export default function InnovativePage() {
    const {t, locale} = useTranslation('innovative');
    const [dynamicData, setDynamicData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const colorSchemes = [
        {background: '#f8f9ff', accent: '#3b82f6', text: '#1e40af'},
        {background: '#fff7ed', accent: '#f97316', text: '#c2410c'},
        {background: '#faf5ff', accent: '#8b5cf6', text: '#6b21a8'},
        {background: '#f0f9ff', accent: '#0ea5e9', text: '#0369a1'},
        {background: '#fefce8', accent: '#eab308', text: '#a16207'},
        {background: '#fdf4ff', accent: '#c084fc', text: '#9333ea'}
    ];

    const getColorScheme = (index) => colorSchemes[index % colorSchemes.length];

    const formatText = (text) => text; // Тут можна робити розмітку
    const getLocalizedContent = (item) => item; // Тут локалізація, якщо треба

    return (
        <Box component="main" sx={{mt: "30px", width: '100%', minHeight: '100vh', py: {xs: 2, sm: 4}}} lang={locale}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 6,
                    textAlign: 'center',
                    background: 'radial-gradient(circle at center,#182BA1 0%,#8E99DD 83%,#9EA8E5 100%)'
                }}
            >
                <Typography variant="h3" sx={{color: '#fff', fontWeight: 700, mb: 4}}>
                    {t('innovativeMainTitle')}
                </Typography>
                <Box sx={{
                    maxWidth: "1338px",
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "40px",
                    mx: 3,
                    py: 2,
                }}>
                    <Grid container spacing={4} justifyContent="center" alignItems="center">
                        <Grid item size={{xs: 12, sm: 4}} className={"ImageContainerProfile"}>
                            <Image
                                className={"ImageProfile"}
                                src={newProjectImg}
                                alt={t('innovativeImageAlt')}
                                fill/>
                        </Grid>
                        <Grid item size={{xs: 12, sm: 6}}>
                            <Typography sx={{fontSize: {xs: 16, sm: 20, md: 24}, color: '#fff', lineHeight: 1.5}}>
                                {t('innovativeDescription')}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}

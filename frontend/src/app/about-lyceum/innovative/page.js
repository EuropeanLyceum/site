'use client';
import { Box, Typography, Grid, alpha, Container } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import newProjectImg from '@/assets/photos/new_project.jpg';
import DynamicPost from './components/DynamicPost';

const mockPosts = [
    {
        id: 1,
        title: "SMART-освіта: Інтеграція AI",
        titleEn: "SMART Education: AI Integration",
        content: "Ми впроваджуємо новітні алгоритми штучного інтелекту для персоналізації навчання кожного учня. Це дозволяє виявляти таланти на ранніх етапах.",
        contentEn: "We are implementing state-of-the-art AI algorithms to personalize each student's learning experience.",
        url: "https://example.com/ai-edu",
        photoUrls: ["https://picsum.photos/800/600", "https://picsum.photos/800/601"]
    },
    {
        id: 2,
        title: "Екологічний Хаб «Green Lyceum»",
        titleEn: "Eco-Hub 'Green Lyceum'",
        content: "Створення автоматизованої системи моніторингу якості повітря та сонячних панелей на даху ліцею як частина STEM-проєкту.",
        contentEn: "Creating an automated air quality monitoring system and solar panels on the lyceum roof.",
        url: "https://example.com/eco",
        photoUrls: ["https://picsum.photos/1200/800"]
    }
];

export default function InnovativePage() {
    const { t, locale } = useTranslation('innovative');

    return (
        <Box component="main" sx={{ background: '#F8FAFC', minHeight: '100vh', pb: 10 }} lang={locale}>
            {/* HERO SECTION */}
            <Box sx={{
                background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
                pt: { xs: 5 },
                pb: { xs: 15, md: 22 },
                color: '#fff',
                clipPath: { md: 'ellipse(140% 100% at 50% 0%)', xs: 'none' },
                position: 'relative',
                zIndex: 1
            }}>
                <Container maxWidth="lg">
                    <Typography variant="h1" sx={{
                        fontSize: { xs: 32, md: 56 },
                        fontWeight: 900,
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        mb: 6,
                        textAlign: 'center'
                    }}>
                        {t('innovativeMainTitle')}
                    </Typography>

                    <Box sx={{
                        background: alpha('#fff', 0.1),
                        backdropFilter: 'blur(15px)',
                        borderRadius: 8,
                        p: { xs: 3, md: 5 },
                        border: `1px solid ${alpha('#fff', 0.2)}`,
                        maxWidth: 1000,
                        mx: 'auto'
                    }}>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item size={{xs: 12, md: 5}}>
                                {/* КОНТЕЙНЕР ДЛЯ ФОТО */}
                                <Box sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: { xs: 250, md: 320 },
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    display: 'block' // Важливо для Next Image
                                }}>
                                    <Image
                                        src={newProjectImg}
                                        alt="Innovation"
                                        fill
                                        priority
                                        sizes="(max-width: 900px) 100vw, 400px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item size={{xs: 12, md: 7}}>
                                <Typography sx={{
                                    fontSize: { xs: 16, md: 20 },
                                    lineHeight: 1.6,
                                    color: alpha('#fff', 0.9),
                                    textAlign: 'left'
                                }}>
                                    {t('innovativeDescription')}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>

            {/* POSTS SECTION */}
            <Container maxWidth="md" sx={{ mt: -8, position: 'relative', zIndex: 5 }}>
                {mockPosts.map((post, index) => (
                    <DynamicPost key={post.id} item={post} index={index} locale={locale} t={t} />
                ))}
            </Container>
        </Box>
    );
}
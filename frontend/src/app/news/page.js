'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import {Box, Typography, Button, IconButton, Grid, CircularProgress, alpha} from '@mui/material';
import {useTranslation} from '@/contexts/TranslationProvider';
import NewsCard from "@/app/news/components/NewsCard.jsx";
import CloseIcon from '@mui/icons-material/Close';

const newsData = [
    {
        id: 1,
        title: "Відкриття нового інноваційного хабу",
        titleEn: "Opening of the New Innovation Hub",
        text: "Сьогодні відбулося офіційне відкриття нашого технологічного простору. Хаб обладнаний сучасними робочими станціями, зонами для відпочинку та лекторієм. Ми віримо, що це стане місцем народження нових ідей та масштабних проектів для наших студентів та викладачів.",
        textEn: "Today marks the official opening of our technological space. The hub is equipped with modern workstations, lounge areas, and a lecture hall.",
        images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200",
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200",
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200"
        ],
        imagePosition: "center"
    },
    {
        id: 2,
        title: "Перемога наших студентів на міжнародному хакатоні",
        titleEn: "Students Win International Hackathon",
        text: "Команда нашого закладу виборола перше місце серед 50 команд з усього світу. Їхній проект з автоматизації енергозбереження вразив журі своєю простотою та ефективністю. Пишаємося нашими талантами та бажаємо нових звершень!",
        textEn: "Our team took first place among 50 teams from all over the world with their energy-saving automation project.",
        images: [
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200"
        ],
        imagePosition: "top"
    },
    {
        id: 3,
        title: "Оновлення освітніх програм: Курс на Digital",
        titleEn: "Educational Program Updates: Focus on Digital",
        text: "Ми раді повідомити про впровадження нових дисциплін: Artificial Intelligence, Blockchain та Advanced Cybersecurity. Програми розроблені спільно з лідерами ІТ-ринку, щоб забезпечити нашим випускникам найкращі кар'єрні можливості. Реєстрація на курси вже відкрита.",
        textEn: "We are excited to announce new disciplines: AI, Blockchain, and Advanced Cybersecurity.",
        images: [
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200"
        ],
        imagePosition: "center"
    }
];

export default function NewsPage() {
    const {t, locale} = useTranslation('news');
    const [expandedNews, setExpandedNews] = useState(null);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadNews = async () => {
        setIsLoading(true);
        try {
            const mappedNews = newsData.map(item => ({...item}));
            setNews(mappedNews);
        } catch (err) {
            console.error(err);
            setNews([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadNews();
    }, []);

    const handleReadMore = (id) => {
        setExpandedNews(expandedNews === id ? null : id);
    };

    const handleImageClick = (images, index) => {
        setCurrentImage(images[index]);
        setCurrentImageIndex(index);
        setGalleryOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const handleGalleryClose = () => {
        setGalleryOpen(false);
        setCurrentImage(null);
        setCurrentImageIndex(0);
        document.body.style.overflow = 'unset';
    };

    const handlePrevImage = (e) => {
        e?.stopPropagation();
        const currentNews = news.find((item) => item.images.includes(currentImage));
        if (!currentNews) return;
        const idx = currentNews.images.indexOf(currentImage);
        const prevIdx = (idx - 1 + currentNews.images.length) % currentNews.images.length;
        setCurrentImage(currentNews.images[prevIdx]);
        setCurrentImageIndex(prevIdx);
    };

    const handleNextImage = (e) => {
        e?.stopPropagation();
        const currentNews = news.find((item) => item.images.includes(currentImage));
        if (!currentNews) return;
        const idx = currentNews.images.indexOf(currentImage);
        const nextIdx = (idx + 1) % currentNews.images.length;
        setCurrentImage(currentNews.images[nextIdx]);
        setCurrentImageIndex(nextIdx);
    };

    return (
        <Box sx={{p: 2, position: 'relative', minHeight: '100vh', fontFamily: "'Montserrat Alternates', sans-serif"}}>
            {/* Background */}
            <Box sx={{position: 'fixed', inset: 0, zIndex: -1}}>
                <Box sx={{height: '100%', background: 'linear-gradient(180deg, #F5F7FA 0%, #E8ECF2 100%)'}}/>
            </Box>

            <Box sx={{mb: {xs: 3}, position: 'relative', textAlign: 'center', mt: 2}}>
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: {xs: 34, md: 64},
                        color: '#182BA1',
                        fontWeight: 900,
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        position: 'relative',
                        zIndex: 2,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                    }}
                >
                    {t('newsStream')}
                </Typography>
            </Box>

            {isLoading ? (
                <Box sx={{minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <CircularProgress sx={{color: '#182BA1'}}/>
                </Box>
            ) : news.length === 0 ? (
                <Box sx={{minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography sx={{fontSize: 18, color: '#4B555C'}}>{t('noNewsFound')}</Typography>
                </Box>
            ) : (
                <Grid container spacing={4} sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    {news.map(item => (
                        <Grid item key={item.id} size={{xs: 12}}>
                            <NewsCard
                                item={item}
                                locale={locale}
                                t={t}
                                isExpanded={expandedNews === item.id}
                                onReadMore={handleReadMore}
                                onImageClick={handleImageClick}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Gallery Modal */}
            {galleryOpen && (
                <Box
                    onClick={handleGalleryClose}
                    sx={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.95)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                        p: 2
                    }}
                >
                    <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: 1200,
                            height: '80vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <IconButton
                            onClick={handleGalleryClose}
                            sx={{
                                position: 'absolute',
                                top: 20,
                                right: 20,
                                color: '#fff',
                                zIndex: 10,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {bgcolor: 'rgba(255,255,255,0.3)'}
                            }}
                        >
                            <CloseIcon/>
                        </IconButton>

                        <Box sx={{position: 'relative', width: '100%', height: '100%'}}>
                            <Image
                                src={currentImage}
                                alt="Gallery"
                                fill
                                sizes="100vw"
                                style={{objectFit: 'contain'}}
                                priority
                            />
                        </Box>

                        <Button
                            onClick={handlePrevImage}
                            sx={{
                                position: 'absolute',
                                left: {xs: -10, md: -20},
                                color: '#fff',
                                fontSize: 30,
                                minWidth: 50,
                                height: '100%',
                                '&:hover': {bgcolor: 'rgba(255,255,255,0.05)'}
                            }}
                        >
                            ❮
                        </Button>
                        <Button
                            onClick={handleNextImage}
                            sx={{
                                position: 'absolute',
                                right: {xs: -10, md: -20},
                                color: '#fff',
                                fontSize: 30,
                                minWidth: 50,
                                height: '100%',
                                '&:hover': {bgcolor: 'rgba(255,255,255,0.05)'}
                            }}
                        >
                            ❯
                        </Button>

                        <Typography sx={{
                            position: 'absolute',
                            bottom: -30,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: 14
                        }}>
                            {currentImageIndex + 1} / {news.find((item) => item.images.includes(currentImage))?.images.length}
                        </Typography>
                    </Box>
                </Box>
            )
            }
        </Box>
    )
        ;
}
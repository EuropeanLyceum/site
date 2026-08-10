'use client';

import {useState, useEffect, useCallback} from 'react';
import Image from 'next/image';
import {
    Box, Typography, Container, Grid, Paper,
    Button, CircularProgress, Stack, TextField, InputAdornment, IconButton, Pagination
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DescriptionIcon from '@mui/icons-material/Description';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import firebird3 from '@/assets/photos/firebird/firebird3.png';
import {useTranslation} from '@/contexts/TranslationProvider.jsx';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard.jsx";

export default function Antibullying() {
    const {t, locale} = useTranslation("anti");

    // Статичні дані (Hero та посилання)
    const [staticData, setStaticData] = useState({section: null, externalLinks: []});
    // Динамічні дані (Статті з пошуком)
    const [articles, setArticles] = useState([]);
    const [totalArticles, setTotalArticles] = useState(0);

    const [isLoadingStatic, setIsLoadingStatic] = useState(true);
    const [isLoadingArticles, setIsLoadingArticles] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [expandedItem, setExpandedItem] = useState(null);
    const [gallery, setGallery] = useState({open: false, images: [], index: 0});

    const isEn = locale === 'en';
    const l = (uk, en) => (isEn ? en || uk : uk);

    // 1. Завантаження статики (Hero та Документи) - 1 раз
    useEffect(() => {
        const loadStatic = async () => {
            try {
                const [secRes, linkRes] = await Promise.all([
                    fetch('/admin/api/admin/pageSection?type=ANTI_BULLYING'),
                    fetch('/admin/api/admin/externalLink?pageKey=BULLYING')
                ]);
                const sectionJson = await secRes.json();
                const linksJson = await linkRes.json();
                setStaticData({
                    section: sectionJson.data?.[0] || null,
                    externalLinks: linksJson.data || []
                });
            } finally {
                setIsLoadingStatic(false);
            }
        };
        loadStatic();
    }, []);

    // 2. СЕРВЕРНИЙ ПОШУК ТА ПАГІНАЦІЯ (onParamsChange logic)
    const fetchArticles = useCallback(async (search, currentPage) => {
        setIsLoadingArticles(true);
        try {
            const limit = 5;
            const params = new URLSearchParams({
                type: 'ANTI_BULLYING',
                limit: limit.toString(),
                page: currentPage.toString(),
                search: search || ''
            });

            const res = await fetch(`/admin/api/admin/content?${params}`);
            const json = await res.json();

            const formatted = (json.data || []).map(item => ({
                ...item,
                title: item.titleUk,
                titleEn: item.titleEn,
                text: item.textUk,
                textEn: item.textEn,
                images: item.photoGallery || [],
                date: item.publicationDate ? new Date(item.publicationDate).toLocaleDateString(isEn ? 'en-GB' : 'uk-UA') : ''
            }));

            setArticles(formatted);
            setTotalArticles(json.meta?.total || 0);
        } catch (err) {
            console.error("Articles fetch error:", err);
        } finally {
            setIsLoadingArticles(false);
        }
    }, [isEn]);

    // Дебаунс для пошуку
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchArticles(searchQuery, page);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery, page, fetchArticles]);

    const handleImageClick = (images, index) => {
        setGallery({open: true, images, index});
        document.body.style.overflow = 'hidden';
    };

    const closeGallery = () => {
        setGallery({open: false, images: [], index: 0});
        document.body.style.overflow = 'unset';
    };

    if (isLoadingStatic) return <Box sx={{py: 20, textAlign: 'center'}}><CircularProgress/></Box>;

    return (
        <Box sx={{minHeight: '100vh', bgcolor: '#F5F7FA', pb: 10}}>

            {/* 1. HERO SECTION */}
            <Box sx={{
                position: 'relative', mb: 6, p: {xs: 4, md: 10}, overflow: 'hidden',
                background: 'linear-gradient(180deg, rgba(24, 43, 161, 0.08) 0%, rgba(245,247,250,0) 100%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
            }}>
                <Typography variant="h1" sx={{
                    fontFamily: 'Montserrat Alternates, sans-serif', fontWeight: 900,
                    fontSize: {xs: '32px', md: '52px'}, color: '#182BA1', zIndex: 2, mb: 2
                }}>
                    {l(staticData.section?.titleUk, staticData.section?.titleEn) || t("antiBullying")}
                </Typography>
                <Box sx={{width: 80, height: 4, bgcolor: '#f97316', mb: 3, borderRadius: 2, zIndex: 2}}/>
                <Typography sx={{maxWidth: '800px', color: '#475569', zIndex: 2, fontSize: '1.1rem', lineHeight: 1.8}}>
                    {l(staticData.section?.contentUk, staticData.section?.contentEn)}
                </Typography>
                <Box sx={{
                    position: 'absolute',
                    top: '10%',
                    right: '-5%',
                    width: {xs: '200px', md: '350px'},
                    opacity: 0.1,
                    zIndex: 1
                }}>
                    <Image src={firebird3} alt="" priority style={{width: '100%', height: 'auto'}}/>
                </Box>
            </Box>

            <Container maxWidth="lg" sx={{position: 'relative', zIndex: 2}}>

                {/* 2. CHATBOT CARD */}
                <Paper
                    elevation={0}
                    sx={{
                        p: {xs: 4, md: 6},
                        borderRadius: 8,
                        mb: 10,
                        color: '#fff',
                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        position: 'relative',
                        overflow: 'hidden',
                        textAlign: 'center',
                        boxShadow: '0 20px 40px rgba(234, 88, 12, 0.2)',
                    }}
                >
                    <Stack
                        spacing={3}
                        alignItems="center"
                        justifyContent="center"
                        sx={{position: 'relative', zIndex: 2}}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: {xs: 'column', sm: 'row'},
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2,
                            }}
                        >
                            <SmartToyIcon sx={{fontSize: 50}}/>

                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 900,
                                    fontFamily: 'Montserrat Alternates',
                                    textAlign: 'center',
                                    fontSize: {xs: '1.8rem', md: '2.5rem'},
                                }}
                            >
                                {t('schoolChatbot')}
                            </Typography>
                        </Box>

                        <Typography
                            variant="h6"
                            sx={{
                                opacity: 0.95,
                                fontWeight: 500,
                                maxWidth: 700,
                                textAlign: 'center',
                                mx: 'auto',
                                lineHeight: 1.7,
                            }}
                        >
                            {t('chatbotDescription')}
                        </Typography>

                        <Button
                            variant="contained"
                            href="https://t.me/ProBullyingBot"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                bgcolor: '#fff',
                                color: '#ea580c',
                                fontWeight: 900,
                                px: 6,
                                py: 2,
                                borderRadius: 10,
                                textTransform: 'none',
                                fontSize: '1rem',
                                '&:hover': {
                                    bgcolor: '#f8fafc',
                                },
                            }}
                        >
                            @ProBullyingBot
                        </Button>
                    </Stack>
                </Paper>

                <Grid container spacing={6}>
                    {/* 3. EXTERNAL LINKS */}
                    <Grid item size={{xs: 12, md: 4}}>
                        <Box sx={{position: 'sticky', top: 100}}>
                            <Typography variant="h4" sx={{
                                fontWeight: 900,
                                color: '#0c1865',
                                mb: 4,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <DescriptionIcon sx={{color: '#f97316'}}/> {t("usefulDocuments")}
                            </Typography>
                            <Stack spacing={2}>
                                {staticData.externalLinks.map((link) => (
                                    <Paper key={link.id} component="a" href={link.url} target="_blank"
                                           sx={{
                                               p: 3,
                                               borderRadius: 4,
                                               textDecoration: 'none',
                                               display: 'flex',
                                               alignItems: 'center',
                                               gap: 2,
                                               border: '1px solid #e2e8f0',
                                               transition: '0.3s',
                                               '&:hover': {transform: 'translateX(8px)', borderColor: '#182BA1'}
                                           }}>
                                        <LaunchIcon sx={{color: '#182BA1', fontSize: 20}}/>
                                        <Typography sx={{
                                            color: '#334155',
                                            fontWeight: 700
                                        }}>{l(link.titleUk, link.titleEn)}</Typography>
                                    </Paper>
                                ))}
                            </Stack>
                        </Box>
                    </Grid>

                    {/* 4. DYNAMIC ARTICLES */}
                    <Grid item size={{xs: 12, md: 8}}>
                        <Box id="articles-section">
                            <TextField
                                fullWidth placeholder={t('searchPlaceholder') || "Пошук статтей..."}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setPage(1);
                                }}
                                sx={{mb: 4, bgcolor: '#fff', borderRadius: 4}}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SearchIcon
                                        color="primary"/></InputAdornment>
                                }}
                            />

                            {isLoadingArticles ? (
                                <Box sx={{py: 10, textAlign: 'center'}}><CircularProgress/></Box>
                            ) : (
                                <Stack spacing={4}>
                                    {articles.map(article => (
                                        <UndefinedNewsCard
                                            key={article.id}
                                            item={article}
                                            locale={locale}
                                            t={t}
                                            isExpanded={expandedItem === article.id}
                                            onReadMore={(id) => setExpandedItem(expandedItem === id ? null : id)}
                                            onImageClick={handleImageClick}
                                        />
                                    ))}
                                    {articles.length === 0 &&
                                        <Typography sx={{textAlign: 'center', py: 5}}>Нічого не знайдено</Typography>}
                                </Stack>
                            )}

                            {totalArticles > 5 && (
                                <Box sx={{mt: 8, display: 'flex', justifyContent: 'center'}}>
                                    <Pagination
                                        count={Math.ceil(totalArticles / 5)}
                                        page={page}
                                        onChange={(e, v) => {
                                            setPage(v);
                                            window.scrollTo({top: 400, behavior: 'smooth'});
                                        }}
                                        color="primary"
                                    />
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* 5. GALLERY MODAL */}
            {gallery.open && (
                <Box onClick={closeGallery} sx={{
                    position: 'fixed',
                    inset: 0,
                    bgcolor: 'rgba(0,0,0,0.92)',
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <IconButton onClick={closeGallery}
                                sx={{position: 'absolute', top: 20, right: 20, color: '#fff'}}><CloseIcon
                        fontSize="large"/></IconButton>
                    <Box onClick={(e) => e.stopPropagation()} sx={{position: 'relative', width: '90%', height: '80vh'}}>
                        <Image src={gallery.images[gallery.index]} alt="Gallery" fill style={{objectFit: 'contain'}}/>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
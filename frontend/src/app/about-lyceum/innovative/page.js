'use client';
import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Container, CircularProgress, IconButton, Button, alpha, Grid, TextField, InputAdornment, Pagination } from '@mui/material';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import InnovativePost from './components/InnovativePost';

export default function InnovativePage() {
    const { t, locale } = useTranslation('innovative');

    // Стани для даних
    const [loadingSection, setLoadingSection] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [pageData, setPageData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);

    // Стани для фільтрів
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const [gallery, setGallery] = useState({ open: false, images: [], index: 0 });

    // 1. Завантаження статичної Hero-секції (1 раз)
    useEffect(() => {
        const fetchSection = async () => {
            try {
                const res = await fetch(`/admin/api/admin/pageSection?type=INNOVATIVE`);
                const json = await res.json();
                setPageData(Array.isArray(json.data) ? json.data[0] : json);
            } catch (error) {
                console.error("Section fetch error:", error);
            } finally {
                setLoadingSection(false);
            }
        };
        fetchSection();
    }, []);

    // 2. СЕРВЕРНИЙ ПОШУК (fetchPosts)
    const fetchPosts = useCallback(async (search, currentPage) => {
        setLoadingPosts(true);
        try {
            const query = new URLSearchParams({
                type: 'INNOVATION',
                limit: itemsPerPage.toString(),
                page: currentPage.toString(),
                search: search || ''
            });

            const res = await fetch(`/admin/api/admin/content?${query}`);
            const json = await res.json();

            setPosts(json.data || []);
            setTotalPosts(json.meta?.total || 0);
        } catch (error) {
            console.error("Posts fetch error:", error);
        } finally {
            setLoadingPosts(false);
        }
    }, []);

    // Дебаунс для пошуку
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchPosts(searchQuery, page);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery, page, fetchPosts]);

    // Логіка галереї
    const handleImageClick = (images, index) => {
        if (!images || images.length === 0) return;
        setGallery({ open: true, images, index });
        document.body.style.overflow = 'hidden';
    };

    const closeGallery = () => {
        setGallery({ open: false, images: [], index: 0 });
        document.body.style.overflow = 'unset';
    };

    const navigateImage = (direction) => {
        const newIndex = (gallery.index + direction + gallery.images.length) % gallery.images.length;
        setGallery(prev => ({ ...prev, index: newIndex }));
    };

    if (loadingSection) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <CircularProgress sx={{ color: '#0c1865' }} />
        </Box>
    );

    const isEn = locale === 'en';
    const displayTitle = isEn ? (pageData?.titleEn || pageData?.titleUk) : pageData?.titleUk;
    const displayDesc = isEn ? (pageData?.contentEn || pageData?.contentUk) : pageData?.contentUk;
    const heroParagraphs = displayDesc?.split(/\n\n+/).filter(p => p.trim()) || [];
    const heroPhotos = pageData?.imagePhoto ? [pageData.imagePhoto] : [];

    return (
        <Box component="main" sx={{ background: '#F8FAFC', minHeight: '100vh', pb: 10 }}>

            {/* HERO SECTION */}
            <Box sx={{
                background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
                pt: 8,
                pb: { xs: 15, md: 28 },
                color: '#fff',
                clipPath: { md: 'ellipse(140% 100% at 50% 0%)', xs: 'none' },
                position: 'relative',
                zIndex: 1
            }}>
                <Container maxWidth="lg">
                    <Typography variant="h1" sx={{
                        fontSize: { xs: 32, md: 56 }, fontWeight: 900, mb: 8, textAlign: 'center'
                    }}>
                        {displayTitle}
                    </Typography>

                    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
                        {heroParagraphs.map((paragraph, idx) => {
                            const photo = heroPhotos[idx];
                            return (
                                <Grid container spacing={photo ? 6 : 0} key={idx} direction={idx % 2 === 0 ? 'row' : 'row-reverse'} alignItems="center" sx={{ mb: 4 }}>
                                    {photo && (
                                        <Grid item xs={12} md={5}>
                                            <Box
                                                onClick={() => handleImageClick(heroPhotos, idx)}
                                                sx={{
                                                    position: 'relative', height: { xs: 250, md: 350 }, borderRadius: 6,
                                                    overflow: 'hidden', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                                    '&:hover img': { transform: 'scale(1.05)' }, transition: '0.4s'
                                                }}
                                            >
                                                <Image src={photo} fill style={{ objectFit: 'cover' }} alt="Hero" />
                                            </Box>
                                        </Grid>
                                    )}
                                    <Grid item xs={12} md={photo ? 7 : 12}>
                                        <Typography sx={{ fontSize: { xs: 16, md: 20 }, lineHeight: 1.8, opacity: 0.9, whiteSpace: 'pre-line', textAlign: photo ? 'left' : 'center' }}>
                                            {paragraph}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            );
                        })}
                    </Box>
                </Container>
            </Box>

            {/* POSTS SECTION WITH SEARCH */}
            <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 5 }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                    <TextField
                        fullWidth
                        placeholder={t('searchPlaceholder') || "Пошук інновацій..."}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                        sx={{
                            maxWidth: 600, bgcolor: '#fff', borderRadius: 4,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            '& .MuiOutlinedInput-root': { borderRadius: 4 }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#182BA1' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {loadingPosts ? (
                    <Box sx={{ py: 10, textAlign: 'center' }}>
                        <CircularProgress sx={{ color: '#182BA1' }} />
                    </Box>
                ) : (
                    <>
                        {posts.map((post, index) => (
                            <InnovativePost
                                key={post.id}
                                item={post}
                                index={index}
                                locale={locale}
                                t={t}
                                onImageClick={handleImageClick}
                            />
                        ))}

                        {posts.length === 0 && (
                            <Typography sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
                                Нічого не знайдено за вашим запитом
                            </Typography>
                        )}

                        {totalPosts > itemsPerPage && (
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                <Pagination
                                    count={Math.ceil(totalPosts / itemsPerPage)}
                                    page={page}
                                    onChange={(e, v) => setPage(v)}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </>
                )}
            </Container>

            {/* MODAL GALLERY */}
            {gallery.open && (
                <Box onClick={closeGallery} sx={{
                    position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.95)',
                    zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2
                }}>
                    <IconButton onClick={closeGallery} sx={{ position: 'absolute', top: 20, right: 20, color: '#fff' }}>
                        <CloseIcon fontSize="large" />
                    </IconButton>
                    <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'relative', width: '90%', maxWidth: 1100, height: '80vh' }}>
                        <Image src={gallery.images[gallery.index]} alt="Full view" fill style={{ objectFit: 'contain' }} />
                        {gallery.images.length > 1 && (
                            <>
                                <Button onClick={() => navigateImage(-1)} sx={{ position: 'absolute', left: { xs: 0, md: -70 }, color: '#fff', fontSize: 40, height: '100%' }}>❮</Button>
                                <Button onClick={() => navigateImage(1)} sx={{ position: 'absolute', right: { xs: 0, md: -70 }, color: '#fff', fontSize: 40, height: '100%' }}>❯</Button>
                            </>
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
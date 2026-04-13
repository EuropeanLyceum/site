'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Container, CircularProgress, IconButton, Grid, TextField, InputAdornment, Pagination
} from '@mui/material';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard";

export default function MethodicalEventsPage() {
    const { locale } = useTranslation('meth');

    // Статичні дані сторінки (Hero)
    const [pageData, setPageData] = useState(null);
    const [isLoadingStatic, setIsLoadingStatic] = useState(true);

    // Динамічні заходи з пошуком
    const [events, setEvents] = useState([]);
    const [totalEvents, setTotalEvents] = useState(0);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);

    const [expandedId, setExpandedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [gallery, setGallery] = useState({ open: false, images: [], index: 0 });

    const isEn = locale === 'en';
    const l = (uk, en) => (isEn ? en || uk : uk);

    // 1. Завантаження статичного Hero-секції (1 раз)
    useEffect(() => {
        const loadStatic = async () => {
            try {
                const res = await fetch('/admin/api/admin/pageSection?type=METHODOLOGICAL');
                const json = await res.json();
                setPageData(json.data?.[0] || null);
            } catch (err) {
                console.error("Static fetch error:", err);
            } finally {
                setIsLoadingStatic(false);
            }
        };
        loadStatic();
    }, []);

    // 2. Функція серверного завантаження заходів
    const fetchEvents = useCallback(async (search, page) => {
        setIsLoadingEvents(true);
        try {
            const params = new URLSearchParams({
                type: 'METHODOLOGICAL',
                limit: itemsPerPage.toString(),
                page: page.toString(),
                search: search || ''
            });

            const res = await fetch(`/admin/api/admin/content?${params}`);
            const json = await res.json();

            const formatted = (json.data || []).map(item => ({
                id: item.id,
                title: l(item.titleUk, item.titleEn),
                text: l(item.textUk, item.textEn),
                images: item.photoGallery?.length > 0 ? item.photoGallery : (item.imagePhoto ? [item.imagePhoto] : []),
                date: new Date(item.publicationDate || item.createdAt).toLocaleDateString(isEn ? 'en-US' : 'uk-UA')
            }));

            setEvents(formatted);
            setTotalEvents(json.meta?.total || 0);
        } catch (err) {
            console.error("Events fetch error:", err);
        } finally {
            setIsLoadingEvents(false);
        }
    }, [isEn]);

    // 3. Дебаунс для пошуку
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchEvents(searchQuery, currentPage);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery, currentPage, fetchEvents]);

    const handleImageClick = (images, index) => {
        if (!images || images.length === 0) return;
        setGallery({ open: true, images, index: index >= images.length ? 0 : index });
        document.body.style.overflow = 'hidden';
    };

    const closeGallery = () => {
        setGallery({ open: false, images: [], index: 0 });
        document.body.style.overflow = 'unset';
    };

    const navigateImage = (e, direction) => {
        e.stopPropagation();
        setGallery(prev => ({
            ...prev,
            index: (prev.index + direction + prev.images.length) % prev.images.length
        }));
    };

    if (isLoadingStatic) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
            <CircularProgress sx={{ color: '#0c1865' }} />
        </Box>
    );

    const displayTitle = l(pageData?.titleUk, pageData?.titleEn);
    const displayDesc = l(pageData?.contentUk, pageData?.contentEn);
    const heroParagraphs = displayDesc?.split(/\n\n+/).filter(p => p.trim()) || [];
    const heroPhotos = pageData?.imagePhoto ? [pageData.imagePhoto] : [];

    return (
        <Box component="main" sx={{ background: '#F8FAFC', minHeight: '100vh', pb: 10 }}>

            {/* HERO SECTION */}
            <Box sx={{
                background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
                pt: 8, pb: { xs: 12, md: 20 }, color: '#fff',
                clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0% 100%)',
                position: 'relative', zIndex: 1, mb: 6
            }}>
                <Container maxWidth="lg">
                    <Typography variant="h1" sx={{
                        fontSize: { xs: 32, md: 54 }, fontWeight: 900, textAlign: 'center',
                        fontFamily: "'Montserrat Alternates', sans-serif", textTransform: 'uppercase', mb: 6
                    }}>
                        {displayTitle || (isEn ? "Methodical Events" : "Методичні заходи")}
                    </Typography>

                    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
                        {heroParagraphs.map((paragraph, idx) => {
                            const photo = heroPhotos[idx];
                            return (
                                <Grid container spacing={photo ? 6 : 0} key={idx} direction={idx % 2 === 0 ? 'row' : 'row-reverse'} alignItems="center" sx={{ mb: 4 }}>
                                    {photo && (
                                        <Grid item xs={12} md={5}>
                                            <Box onClick={() => handleImageClick([photo], 0)} sx={{
                                                position: 'relative', height: { xs: 250, md: 350 },
                                                borderRadius: 6, overflow: 'hidden', cursor: 'pointer',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.3)', transition: '0.4s',
                                                '&:hover img': { transform: 'scale(1.05)' }
                                            }}>
                                                <Image src={photo} fill style={{ objectFit: 'cover' }} alt="Hero" />
                                            </Box>
                                        </Grid>
                                    )}
                                    <Grid item xs={12} md={photo ? 7 : 12}>
                                        <Typography sx={{ fontSize: { xs: 16, md: 19 }, lineHeight: 1.8, opacity: 0.85, whiteSpace: 'pre-line', textAlign: photo ? 'left' : 'center' }}>
                                            {paragraph}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            );
                        })}
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* SEARCH BAR */}
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
                    <TextField
                        fullWidth placeholder={isEn ? "Search events..." : "Пошук заходів..."}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        sx={{ maxWidth: 600, bgcolor: '#fff', borderRadius: 4, '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#0c1865' }} /></InputAdornment> }}
                    />
                </Box>

                {/* EVENTS LIST */}
                {isLoadingEvents ? (
                    <Box sx={{ py: 10, textAlign: 'center' }}><CircularProgress /></Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {events.map((event) => (
                            <UndefinedNewsCard
                                key={event.id}
                                item={event}
                                locale={locale}
                                isExpanded={expandedId === event.id}
                                onReadMore={(id) => setExpandedId(expandedId === id ? null : id)}
                                onImageClick={handleImageClick}
                            />
                        ))}
                        {events.length === 0 && (
                            <Typography sx={{ textAlign: 'center', color: '#94a3b8', py: 10, fontStyle: 'italic' }}>
                                {isEn ? "No events found" : "Нічого не знайдено"}
                            </Typography>
                        )}
                    </Box>
                )}

                {totalEvents > itemsPerPage && (
                    <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            count={Math.ceil(totalEvents / itemsPerPage)}
                            page={currentPage}
                            onChange={(e, v) => { setCurrentPage(v); window.scrollTo({ top: 600, behavior: 'smooth' }); }}
                            color="primary" size="large"
                        />
                    </Box>
                )}
            </Container>

            {/* MODAL GALLERY - без змін логіки */}
            {gallery.open && (
                <Box onClick={closeGallery} sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                    <IconButton onClick={closeGallery} sx={{ position: 'absolute', top: 20, right: 20, color: '#fff' }}><CloseIcon fontSize="large" /></IconButton>
                    <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'relative', width: '100%', maxWidth: '1000px', height: '80vh' }}>
                        <Image src={gallery.images[gallery.index]} alt="Full view" fill priority style={{ objectFit: 'contain' }} />
                        {gallery.images.length > 1 && (
                            <>
                                <IconButton onClick={(e) => navigateImage(e, -1)} sx={{ position: 'absolute', left: { xs: 0, md: -80 }, top: '50%', color: '#fff' }}>
                                    <Typography variant="h3">❮</Typography>
                                </IconButton>
                                <IconButton onClick={(e) => navigateImage(e, 1)} sx={{ position: 'absolute', right: { xs: 0, md: -80 }, top: '50%', color: '#fff' }}>
                                    <Typography variant="h3">❯</Typography>
                                </IconButton>
                            </>
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
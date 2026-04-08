'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Container, CircularProgress, IconButton, Button, alpha, Grid, TextField, InputAdornment, Pagination
} from '@mui/material';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard";

export default function MethodicalEventsPage() {
    const { locale } = useTranslation('meth');
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState(null);
    const [events, setEvents] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    // Пошук та Пагінація
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [gallery, setGallery] = useState({ open: false, images: [], index: 0 });

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sectionRes, contentRes] = await Promise.all([
                    fetch('/admin/api/admin/pageSection?type=METHODOLOGICAL'),
                    fetch('/admin/api/admin/content?type=METHODOLOGICAL')
                ]);
                const sectionJson = await sectionRes.json();
                const contentJson = await contentRes.json();

                setPageData(sectionJson.data?.[0] || null);
                setEvents((contentJson.data || []).reverse());
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Фільтрація та Мапінг даних
    const filteredEvents = useMemo(() => {
        return events
            .map(item => ({
                id: item.id,
                title: locale === 'en' ? (item.titleEn || item.titleUk) : item.titleUk,
                text: locale === 'en' ? (item.textEn || item.textUk) : item.textUk,
                images: item.photoGallery || (item.imagePhoto ? [item.imagePhoto] : []),
                date: new Date(item.publicationDate || item.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'uk-UA')
            }))
            .filter(event =>
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.text.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [events, searchQuery, locale]);

    // Розрахунок пагінації
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) return (
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

            {/* HERO SECTION З РИЗКОЮ НАВСКОСИ */}
            <Box sx={{
                background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
                pt: 8,
                pb: { xs: 12, md: 20 },
                color: '#fff',
                // Риска навскоси (як у прикладі з атестацією)
                clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0% 100%)',
                position: 'relative',
                zIndex: 1,
                mb: 6
            }}>
                <Container maxWidth="lg">
                    <Typography variant="h1" sx={{
                        fontSize: { xs: 32, md: 54 },
                        fontWeight: 900,
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        mb: 6,
                        textAlign: 'center',
                        textTransform: 'uppercase'
                    }}>
                        {displayTitle || (isEn ? "Methodical Events" : "Методичні заходи")}
                    </Typography>

                    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
                        {heroParagraphs.map((paragraph, idx) => {
                            const photo = heroPhotos[idx];
                            const direction = idx % 2 === 0 ? 'row' : 'row-reverse';

                            return (
                                <Grid container spacing={photo ? 6 : 0} key={idx} direction={direction} alignItems="center" sx={{ mb: 4 }}>
                                    {photo && (
                                        <Grid item xs={12} md={5}>
                                            <Box
                                                onClick={() => handleImageClick(heroPhotos, idx)}
                                                sx={{
                                                    position: 'relative',
                                                    height: { xs: 250, md: 350 },
                                                    borderRadius: 6,
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                                    '&:hover img': { transform: 'scale(1.05)' },
                                                    transition: '0.4s'
                                                }}
                                            >
                                                <Image src={photo} fill style={{ objectFit: 'cover' }} alt="Hero" />
                                            </Box>
                                        </Grid>
                                    )}
                                    <Grid item xs={12} md={photo ? 7 : 12}>
                                        <Typography sx={{
                                            fontSize: { xs: 16, md: 19 },
                                            lineHeight: 1.8,
                                            opacity: 0.85,
                                            whiteSpace: 'pre-line',
                                            textAlign: photo ? 'left' : 'center'
                                        }}>
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
                {/* ПОШУК */}
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
                    <TextField
                        fullWidth
                        maxWidth="md"
                        variant="outlined"
                        placeholder={isEn ? "Search events..." : "Пошук заходів..."}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        sx={{
                            maxWidth: 600,
                            bgcolor: '#fff',
                            borderRadius: 4,
                            '& .MuiOutlinedInput-root': { borderRadius: 4 }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#0c1865' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* СПИСОК ЗАХОДІВ */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {paginatedEvents.length > 0 ? (
                        paginatedEvents.map((event) => (
                            <UndefinedNewsCard
                                key={event.id}
                                item={event}
                                locale={locale}
                                isExpanded={expandedId === event.id}
                                onReadMore={(id) => setExpandedId(expandedId === id ? null : id)}
                                onImageClick={(imgs, idx) => handleImageClick(imgs, idx)}
                            />
                        ))
                    ) : (
                        <Typography sx={{ textAlign: 'center', color: '#94a3b8', py: 10, fontStyle: 'italic' }}>
                            {isEn ? "No events found matching your search" : "За вказаним запитом нічого не знайдено"}
                        </Typography>
                    )}
                </Box>

                {/* ПАГІНАЦІЯ */}
                {totalPages > 1 && (
                    <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={(e, v) => { setCurrentPage(v); window.scrollTo({ top: 600, behavior: 'smooth' }); }}
                            color="primary"
                            size="large"
                        />
                    </Box>
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
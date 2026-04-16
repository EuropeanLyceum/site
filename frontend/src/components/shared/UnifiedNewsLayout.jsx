'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress, Container, TextField, InputAdornment, Pagination, Stack, IconButton } from '@mui/material'; // Added IconButton
import CloseIcon from '@mui/icons-material/Close'; // Ensure this is imported
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image'; // Ensure this is imported for the modal
import { useTranslation } from '@/contexts/TranslationProvider';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard.jsx";

export default function UnifiedNewsLayout({
                                              translationKey,
                                              data = [],
                                              isLoading = false,
                                              totalCount = 0,
                                              onParamsChange,
                                              heroOff = false,
                                          }) {
    const { t, locale } = useTranslation(translationKey);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [expandedItem, setExpandedItem] = useState(null);

    // --- NEW: Gallery State ---
    const [galleryState, setGalleryState] = useState({
        isOpen: false,
        photos: [],
        currentIndex: 0
    });

    const itemsPerPage = 5;

    // Скрол вгору при зміні сторінки
    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            onParamsChange({ search: searchQuery, page: page });
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery, page, onParamsChange]);

    const count = Math.ceil(totalCount / itemsPerPage);

    // --- NEW: Gallery Handlers ---
    const handleOpenGallery = (photos, index) => {
        setGalleryState({
            isOpen: true,
            photos: photos,
            currentIndex: index
        });
    };

    const handleCloseGallery = () => {
        setGalleryState({ ...galleryState, isOpen: false });
    };


    return (
        <Box sx={{ minHeight: '100vh', pb: 10, bgcolor: '#F8FAFC' }}>
            {!heroOff && (
                <Box sx={{ mb: { xs: 4, md: 6 }, pt: { xs: 6, md: 8 }, textAlign: 'center' }}>
                    <Typography variant="h1" sx={{
                        fontSize: { xs: 32, md: 58 },
                        color: '#182BA1',
                        fontWeight: 900,
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        textTransform: 'uppercase',
                        px: 2
                    }}>
                        {t('pageTitle')}
                    </Typography>
                    <Box sx={{ width: 80, height: 5, bgcolor: '#f97316', mx: 'auto', mt: 2, borderRadius: 2 }} />
                </Box>
            )}

            <Container maxWidth="lg">
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
                    <TextField
                        fullWidth
                        placeholder={t('searchPlaceholder') || "Пошук..."}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#182BA1' }} /></InputAdornment>,
                        }}
                        sx={{
                            maxWidth: 600,
                            bgcolor: '#fff',
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            '& .MuiOutlinedInput-root': { borderRadius: 3 }
                        }}
                    />
                </Box>

                {isLoading ? (
                    <Box sx={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress size={60} thickness={4} sx={{ color: '#182BA1' }} />
                    </Box>
                ) : (
                    <>
                        <Stack spacing={4}>
                            {data.map(item => (
                                <UndefinedNewsCard
                                    key={item.id}
                                    item={item}
                                    locale={locale}
                                    isExpanded={expandedItem === item.id}
                                    onReadMore={(id) => setExpandedItem(expandedItem === id ? null : id)}
                                    onImageClick={handleOpenGallery} // Pass the handler here!
                                />
                            ))}
                        </Stack>

                        {data.length === 0 && !isLoading && (
                            <Typography sx={{ textAlign: 'center', py: 10, color: 'text.secondary', fontStyle: 'italic' }}>
                                {locale === 'en' ? "No news found" : "Новин не знайдено"}
                            </Typography>
                        )}

                        {count > 1 && (
                            <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                                <Pagination
                                    count={count}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                    sx={{ '& .MuiPaginationItem-root': { fontWeight: 700 } }}
                                />
                            </Box>
                        )}
                    </>
                )}
            </Container>

            {/* --- NEW: Simple Modal for the Gallery --- */}
            {galleryState.isOpen && galleryState.photos.length > 0 && (
                <Box onClick={handleCloseGallery} sx={{
                    position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.9)',
                    zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2
                }}>
                    <IconButton onClick={handleCloseGallery} sx={{ position: 'absolute', top: 20, right: 20, color: '#fff' }}>
                        <CloseIcon fontSize="large" />
                    </IconButton>
                    <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'relative', width: '90%', maxWidth: 1200, height: '85vh' }}>
                        {/* Currently just shows the clicked image. You can add prev/next buttons here if needed */}
                        <Image src={galleryState.photos[galleryState.currentIndex]} alt="Expanded" fill style={{ objectFit: 'contain' }} />
                    </Box>
                </Box>
            )}

        </Box>
    );
}
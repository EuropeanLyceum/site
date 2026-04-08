'use client';
import { useState, useMemo } from 'react';
import { Box, Typography, Grid, CircularProgress, Container, IconButton, Button, TextField, InputAdornment, Pagination, alpha } from '@mui/material';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from '@/contexts/TranslationProvider';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard.jsx";

export default function UnifiedNewsLayout({ translationKey, data = [], isLoading = false, children }) {
    const { t, locale } = useTranslation(translationKey);
    const [expandedItem, setExpandedItem] = useState(null);
    const [gallery, setGallery] = useState({ open: false, images: [], index: 0 });
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const handleReadMore = (id) => setExpandedItem(expandedItem === id ? null : id);

    const handleImageClick = (images, index) => {
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

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const searchLower = searchQuery.toLowerCase();
            return (
                item.title?.toLowerCase().includes(searchLower) ||
                item.titleEn?.toLowerCase().includes(searchLower) ||
                item.text?.toLowerCase().includes(searchLower) ||
                item.textEn?.toLowerCase().includes(searchLower)
            );
        });
    }, [data, searchQuery]);

    const count = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Box sx={{ minHeight: '100vh', position: 'relative', pb: 10 }}>
            <Box sx={{ position: 'fixed', inset: 0, zIndex: -1, background: 'linear-gradient(180deg, #F5F7FA 0%, #E8ECF2 100%)' }} />

            <Box sx={{ mb: 4, pt: { xs: 4, md: 6 }, textAlign: 'center' }}>
                <Typography variant="h1" sx={{ fontSize: { xs: 32, md: 52 }, color: '#182BA1', fontWeight: 900, fontFamily: "'Montserrat Alternates', sans-serif" }}>
                    {t('pageTitle')}
                </Typography>
                <Box sx={{ width: 80, height: 4, bgcolor: '#f97316', mx: 'auto', mt: 2, borderRadius: 2 }} />
            </Box>

            <Container maxWidth="lg">
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
                    <TextField
                        fullWidth
                        placeholder={t('searchPlaceholder') || "Пошук..."}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                        sx={{
                            maxWidth: 600, bgcolor: '#fff', borderRadius: 4,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 4,
                                '& fieldset': { borderColor: alpha('#182BA1', 0.1) },
                                '&.Mui-focused fieldset': { borderColor: '#182BA1' }
                            }
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

                {isLoading ? (
                    <Box sx={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress sx={{ color: '#182BA1' }} />
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={2}>
                            {paginatedData.map(item => (
                                <Grid item size={{xs: 12}} key={item.id}>
                                    <UndefinedNewsCard item={item} locale={locale} t={t} isExpanded={expandedItem === item.id} onReadMore={handleReadMore} onImageClick={handleImageClick} />
                                </Grid>
                            ))}
                        </Grid>
                        {count > 1 && (
                            <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                                <Pagination count={count} page={page} onChange={(e, v) => { setPage(v); window.scrollTo({ top: 0, behavior: 'smooth' }); }} color="primary" size="large" />
                            </Box>
                        )}
                    </>
                )}
            </Container>

            {gallery.open && (
                <Box onClick={closeGallery} sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                    <IconButton onClick={closeGallery} sx={{ position: 'absolute', top: 20, right: 20, color: '#fff' }}><CloseIcon fontSize="large" /></IconButton>
                    <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'relative', width: '100%', maxWidth: 1200, height: '80vh' }}>
                        <Image src={gallery.images[gallery.index]} alt="Gallery" fill style={{ objectFit: 'contain' }} priority />
                        {gallery.images.length > 1 && (
                            <>
                                <Button onClick={() => navigateImage(-1)} sx={{ position: 'absolute', left: { xs: 0, md: -60 }, color: '#fff', fontSize: 40, height: '100%' }}>❮</Button>
                                <Button onClick={() => navigateImage(1)} sx={{ position: 'absolute', right: { xs: 0, md: -60 }, color: '#fff', fontSize: 40, height: '100%' }}>❯</Button>
                            </>
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
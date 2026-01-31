'use client';
import { useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Container, IconButton, Button } from '@mui/material'; // Додав Container сюди
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from '@/contexts/TranslationProvider';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard.jsx";

export default function UnifiedNewsLayout({
                                              translationKey,
                                              data = [],
                                              isLoading = false,
                                              children
                                          }) {
    const { t, locale } = useTranslation(translationKey);
    const [expandedItem, setExpandedItem] = useState(null);
    const [gallery, setGallery] = useState({ open: false, images: [], index: 0 });

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

    return (
        <Box sx={{ minHeight: '100vh', position: 'relative', pb: 10 }}>
            {/* Background */}
            <Box sx={{ position: 'fixed', inset: 0, zIndex: -1, background: 'linear-gradient(180deg, #F5F7FA 0%, #E8ECF2 100%)' }} />

            {/* Header */}
            <Box sx={{ mb: { xs: 4, md: 8 }, pt: { xs: 4, md: 6 }, textAlign: 'center' }}>
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
                <Box sx={{ width: 60, height: 4, bgcolor: '#f97316', mx: 'auto', mt: 2 }} />
            </Box>

            {isLoading ? (
                <Box sx={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress sx={{ color: '#182BA1' }} />
                </Box>
            ) : (
                <Container maxWidth="lg">
                    {children && (
                        <Box sx={{ mb: 6 }}>
                            {children}
                        </Box>
                    )}

                    <Grid container spacing={2}>
                        {data.map(item => (
                            <Grid item size={{xs: 12}} key={item.id}>
                                <UndefinedNewsCard
                                    item={item}
                                    locale={locale}
                                    t={t}
                                    isExpanded={expandedItem === item.id}
                                    onReadMore={handleReadMore}
                                    onImageClick={handleImageClick}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            )}

            {/* Gallery Modal */}
            {gallery.open && (
                <Box onClick={closeGallery} sx={{
                    position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.95)',
                    zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2
                }}>
                    <IconButton onClick={closeGallery} sx={{
                        position: 'absolute', top: 20, right: 20, color: '#fff',
                        bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                    }}>
                        <CloseIcon fontSize="large" />
                    </IconButton>

                    <Box onClick={(e) => e.stopPropagation()} sx={{ position: 'relative', width: '100%', maxWidth: 1200, height: '80vh' }}>
                        <Image
                            src={gallery.images[gallery.index]}
                            alt="Gallery"
                            fill
                            style={{ objectFit: 'contain' }}
                            priority
                        />

                        {gallery.images.length > 1 && (
                            <>
                                <Button onClick={() => navigateImage(-1)} sx={{ position: 'absolute', left: { xs: 0, md: -60 }, color: '#fff', fontSize: 40, height: '100%' }}>❮</Button>
                                <Button onClick={() => navigateImage(1)} sx={{ position: 'absolute', right: { xs: 0, md: -60 }, color: '#fff', fontSize: 40, height: '100%' }}>❯</Button>
                            </>
                        )}

                        <Typography sx={{ position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)', color: '#fff', opacity: 0.7 }}>
                            {gallery.index + 1} / {gallery.images.length}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
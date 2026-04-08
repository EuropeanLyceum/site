'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, IconButton, Button } from '@mui/material';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from '@/contexts/TranslationProvider';

// Import the ONE generic component
import UniversalHistorySection from './components/UniversalHistorySection';
import Principals from './components/Principals';
import Teachers from './components/Teachers';

export default function HistoryPage() {
    const { t, locale } = useTranslation('history');
    const [loading, setLoading] = useState(true);

    // --- Gallery State ---
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
    // ---------------------

    const [data, setData] = useState({
        founders: [],
        building: [],
        development: [],
        principals: [],
        teachers: []
    });

    useEffect(() => {
        async function loadHistoryData() {
            try {
                const [foundersRes, buildingRes, devRes, principalsRes, teachersRes] = await Promise.all([
                    fetch('/admin/api/admin/content?type=FOUNDERS'),
                    fetch('/admin/api/admin/content?type=BUILDING'),
                    fetch('/admin/api/admin/content?type=HISTORY'),
                    fetch('/admin/api/admin/person?type=PRINCIPALS'),
                    fetch('/admin/api/admin/person?type=FAMOUS_PERSON')
                ]);

                const [founders, building, dev, principals, teachers] = await Promise.all([
                    foundersRes.json(), buildingRes.json(), devRes.json(), principalsRes.json(), teachersRes.json()
                ]);

                setData({
                    // Ensure founders is an array for the universal component
                    founders: founders.data ? [founders.data[0]] : [],
                    building: building.data || [],
                    development: dev.data || [],
                    principals: principals.data || [],
                    teachers: teachers.data || []
                });
            } catch (error) {
                console.error("Failed to fetch history data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadHistoryData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress sx={{ color: '#182BA1' }} />
            </Box>
        );
    }

    return (
        <Box lang={locale} sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #F5F7FA 0%, #E8ECF2 100%)', pb: 10 }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, pt: 5, position: 'relative', zIndex: 2 }}>

                {/* Page Header */}
                <Box sx={{ mb: 5, textAlign: 'center' }}>
                    <Typography variant="h1" sx={{
                        fontSize: { xs: 34, md: 64 },
                        color: '#182BA1',
                        fontWeight: 900,
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                    }}>
                        {t('historyTitle')}
                    </Typography>
                    <Box sx={{ width: 80, height: 6, bgcolor: '#f97316', mx: 'auto', mt: 2, borderRadius: 3 }} />
                </Box>

                {/* --- 1. Founders Section --- */}
                {/* Variant: 'founders' (Gradient Style 1) */}
                <UniversalHistorySection
                    variant="founders"
                    mainTitle={t("foundersTitle")}
                    dataItems={data.founders}
                    locale={locale}
                    t={t}
                    onImageClick={handleImageClick}
                />

                {/* --- 2. Building Section --- */}
                {/* Variant: 'building' (Solid Blue) */}
                <UniversalHistorySection
                    variant="building"
                    mainTitle={t("schoolBuildingTitle")}
                    dataItems={data.building}
                    locale={locale}
                    t={t}
                    onImageClick={handleImageClick}
                />

                {/* --- 3. Development Section --- */}
                {/* Variant: 'development' (Gradient Style 2) */}
                <UniversalHistorySection
                    variant="development"
                    mainTitle={t("developmentStagesTitle")}
                    dataItems={data.development}
                    locale={locale}
                    t={t}
                    onImageClick={handleImageClick}
                />

                {/* Specific Components for People (Principals/Teachers usually have Grid Cards, not long text) */}
                <Principals items={data.principals} locale={locale} t={t} />
                <Teachers items={data.teachers} locale={locale} t={t} />
            </Box>

            {/* --- Gallery Modal --- */}
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
                                <Button onClick={() => navigateImage(-1)} sx={{ position: 'absolute', left: { xs: 0, md: -60 }, color: '#fff', fontSize: 40, height: '100%', minWidth: 50 }}>❮</Button>
                                <Button onClick={() => navigateImage(1)} sx={{ position: 'absolute', right: { xs: 0, md: -60 }, color: '#fff', fontSize: 40, height: '100%', minWidth: 50 }}>❯</Button>
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
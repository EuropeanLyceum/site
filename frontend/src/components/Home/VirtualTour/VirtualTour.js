'use client';

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import {
    Box, Typography, Container, IconButton, Paper,
    Stack, Card, CardActionArea, CircularProgress, Grid
} from "@mui/material";

// Іконки
import {
    ChevronLeft, ChevronRight, LocationOn,
    CenterFocusWeak, MeetingRoom, Layers,
    Class, Science, Biotech, Computer,
    LaptopMac, LibraryBooks, MenuBook, SportsBasketball,
    Pool, Restaurant, LocalCafe, Wc, LocalHospital,
    TheaterComedy, School, BusinessCenter, SupervisorAccount,
    Park, Apartment, Stairs, Elevator, InfoOutlined, Map,
    ImageNotSupported
} from "@mui/icons-material";

import { useTranslation } from "@/contexts/TranslationProvider.jsx";
import RichText from "@/components/shared/RichText"; // Імпортуємо ваш компонент

const IconMap = {
    MeetingRoom, Class, Science, Biotech, Computer,
    LaptopMac, LibraryBooks, MenuBook, SportsBasketball,
    Pool, Restaurant, LocalCafe, Wc, LocalHospital,
    TheaterComedy, School, BusinessCenter, SupervisorAccount,
    Park, Apartment, Stairs, Elevator, InfoOutlined, Map,
    ImageNotSupported
};

// --- 1. Helper Components ---
const RenderIcon = ({ iconName, color }) => {
    const Icon = IconMap[iconName] || MeetingRoom;
    return <Icon sx={{ fontSize: '1.6rem', color: color }} />;
};

const MapButton = React.memo(({ id, onClick, name, iconName, isCurrent }) => (
    <Card
        elevation={0}
        sx={{
            height: '100%',
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            bgcolor: isCurrent ? '#f97316' : '#fff',
            border: '1px solid',
            borderColor: isCurrent ? '#f97316' : '#e2e8f0',
            borderRadius: 3,
            boxShadow: isCurrent
                ? '0 8px 20px -4px rgba(249, 115, 22, 0.4)'
                : '0 2px 4px rgba(0,0,0,0.02)',
            transform: isCurrent ? 'translateY(-2px)' : 'none',
            '&:hover': {
                borderColor: '#182BA1',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 15px -3px rgba(24, 43, 161, 0.15)',
            }
        }}
    >
        <CardActionArea
            onClick={() => onClick(id)}
            sx={{
                p: 2, height: '100%', display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center'
            }}
        >
            <Box sx={{
                mb: 1.5, display: 'flex', justifyContent: 'center', p: 1,
                borderRadius: '50%', bgcolor: isCurrent ? 'rgba(255,255,255,0.2)' : '#f1f5f9'
            }}>
                <RenderIcon iconName={iconName} color={isCurrent ? '#fff' : '#182BA1'} />
            </Box>
            <Typography variant="caption" sx={{
                fontWeight: 700, color: isCurrent ? '#fff' : '#334155',
                display: 'block', fontSize: '0.75rem', lineHeight: 1.3, textAlign: 'center'
            }}>
                {name}
            </Typography>
        </CardActionArea>
    </Card>
));
MapButton.displayName = "MapButton";

// --- 2. Main Component ---
export default function VirtualTour() {
    const { t, locale } = useTranslation("virtual");
    const isEn = locale === 'en';

    const [locations, setLocations] = useState([]);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await fetch('/admin/api/admin/location');
                const json = await res.json();
                const data = json.data || json;

                if (Array.isArray(data) && data.length > 0) {
                    const sorted = data.sort((a, b) => (a.floor || "").localeCompare(b.floor || ""));
                    setLocations(sorted);
                    setCurrentId(sorted[0].id);
                }
            } catch (err) {
                console.error("Tour loading error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLocations();
    }, []);

    const currentRoom = useMemo(() =>
            locations.find(l => l.id === currentId),
        [locations, currentId]);

    const groupedLocations = useMemo(() => {
        const groups = {};
        locations.forEach(loc => {
            const floorKey = loc.floor ? loc.floor : "Other";
            if (!groups[floorKey]) groups[floorKey] = [];
            groups[floorKey].push(loc);
        });
        return groups;
    }, [locations]);

    const navigateTo = useCallback((id) => {
        if (id === currentId) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentId(id);
            setCurrentImageIndex(0);
            setIsTransitioning(false);
            const viewer = document.getElementById('tour-viewer');
            if (viewer && window.innerWidth < 900) {
                viewer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 300);
    }, [currentId]);

    // Обробка Highlights: розбиваємо по новим рядкам ТІЛЬКИ якщо це не HTML
    const highlights = useMemo(() => {
        const rawText = isEn ? currentRoom?.highlightsTextEn : currentRoom?.highlightsTextUk;
        if (!rawText) return [];
        // Якщо текст містить HTML теги, повертаємо як один елемент масиву для RichText
        if (/<[a-z][\s\S]*>/i.test(rawText)) return [rawText];
        return rawText.split('\n').filter(line => line.trim() !== '');
    }, [currentRoom, isEn]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress size={60} sx={{ color: '#0c1865' }} />
        </Box>
    );

    const images = currentRoom?.imagePhotos || [];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 12 }}>
            <Box sx={{
                background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
                pt: { xs: 8, md: 12 }, pb: { xs: 15 },
                color: '#fff', position: 'relative', zIndex: 1, mb: 3
            }}>
                <Container maxWidth="lg">
                    <Typography variant="h1" sx={{
                        fontSize: { xs: 32, md: 56 }, fontWeight: 900,
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        mb: 2, textAlign: 'center'
                    }}>
                        VIRTUAL <span style={{ color: '#f97316' }}>TOUR</span>
                    </Typography>
                    <Typography sx={{ fontSize: { xs: 16, md: 20 }, textAlign: 'center', maxWidth: 700, mx: 'auto', opacity: 0.9 }}>
                        {t('virtualTourSubtitle')}
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, lg: 8 }} id="tour-viewer">
                        <Paper elevation={0} sx={{
                            position: 'relative', borderRadius: 6, overflow: 'hidden',
                            aspectRatio: '16/9', bgcolor: '#000', mb: 4,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }}>
                            <Box sx={{ width: '100%', height: '100%', transition: 'opacity 0.4s', opacity: isTransitioning ? 0.3 : 1 }}>
                                {images.length > 0 ? (
                                    <Image
                                        src={images[currentImageIndex]}
                                        alt={isEn ? currentRoom?.nameEn : currentRoom?.nameUk}
                                        fill style={{ objectFit: 'cover' }} priority
                                    />
                                ) : (
                                    <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexDirection: 'column', gap: 2 }}>
                                        <ImageNotSupported sx={{ fontSize: '3rem' }} />
                                        <Typography>No Image</Typography>
                                    </Box>
                                )}
                            </Box>

                            {/* Controls & Overlays omitted for brevity, same as original */}
                        </Paper>

                        <Box sx={{ px: { md: 2 } }}>
                            {/* ОПИС ЛОКАЦІЇ ЧЕРЕЗ RICHTEXT */}
                            <RichText
                                html={isEn ? currentRoom?.descriptionEn : currentRoom?.descriptionUk}
                                sx={{
                                    fontSize: { xs: 16, md: 18 },
                                    color: '#334155',
                                    mb: 5,
                                    '& p': { lineHeight: 1.8 }
                                }}
                            />

                            {highlights.length > 0 && (
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CenterFocusWeak sx={{ color: '#f97316' }} />
                                        {isEn ? "Key Highlights" : "Ключові особливості"}
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {highlights.map((htmlContent, i) => (
                                            <Grid size={{ xs: 12, sm: 6 }} key={i}>
                                                <Paper elevation={0} sx={{
                                                    p: 2, borderRadius: 3, bgcolor: '#fff',
                                                    border: '1px solid #e2e8f0', display: 'flex',
                                                    alignItems: 'flex-start', gap: 2,
                                                }}>
                                                    <Box sx={{ mt: 1, width: 6, height: 6, borderRadius: '50%', bgcolor: '#f97316', flexShrink: 0 }} />

                                                    {/* HIGHLIGHTS ЧЕРЕЗ RICHTEXT */}
                                                    <RichText
                                                        html={htmlContent}
                                                        sx={{
                                                            '& p': {
                                                                fontWeight: 600,
                                                                color: '#475569',
                                                                fontSize: '0.95rem',
                                                                mb: 0
                                                            }
                                                        }}
                                                    />
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Paper elevation={0} sx={{
                            borderRadius: 6,
                            border: '1px solid #e2e8f0',
                            bgcolor: '#fff',
                            overflow: 'hidden',
                            position: { lg: 'sticky' },
                            top: 24
                        }}>
                            <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <LocationOn sx={{ color: '#f97316' }} />
                                    {isEn ? "CAMPUS MAP" : "КАРТА ЛОКАЦІЙ"}
                                </Typography>
                            </Box>

                            <Box sx={{ p: 3, maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
                                {Object.keys(groupedLocations).sort().map((floor) => (
                                    <Box key={floor} sx={{ mb: 4, '&:last-child': { mb: 0 } }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, ml: 1 }}>
                                            <Layers sx={{ fontSize: 18, color: '#94a3b8' }} />
                                            <Typography variant="subtitle2" sx={{
                                                fontWeight: 700,
                                                color: '#64748b',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                {floor} {isEn ? "FLOOR" : "ПОВЕРХ"}
                                            </Typography>
                                            <Box sx={{ flexGrow: 1, height: '1px', bgcolor: '#e2e8f0' }} />
                                        </Box>

                                        <Grid container spacing={1.5}>
                                            {groupedLocations[floor].map((loc) => (
                                                <Grid size={6} key={loc.id}>
                                                    <MapButton
                                                        id={loc.id}
                                                        isCurrent={loc.id === currentId}
                                                        onClick={navigateTo}
                                                        name={isEn ? loc.nameEn : loc.nameUk}
                                                        iconName={loc.iconName}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
'use client';

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import {
    Box, Typography, Container, IconButton, Paper,
    Stack, Card, CardActionArea, CircularProgress, Grid
} from "@mui/material";

// Об'єднаний список іконок (тільки ті, що ви вказали)
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

// Повний словник іконок з вашого списку
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
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Box sx={{
                mb: 1.5,
                display: 'flex',
                justifyContent: 'center',
                p: 1,
                borderRadius: '50%',
                bgcolor: isCurrent ? 'rgba(255,255,255,0.2)' : '#f1f5f9'
            }}>
                <RenderIcon iconName={iconName} color={isCurrent ? '#fff' : '#182BA1'} />
            </Box>
            <Typography variant="caption" sx={{
                fontWeight: 700,
                color: isCurrent ? '#fff' : '#334155',
                display: 'block',
                fontSize: '0.75rem',
                lineHeight: 1.3,
                textAlign: 'center'
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

    const highlights = useMemo(() => {
        const rawText = isEn ? currentRoom?.highlightsTextEn : currentRoom?.highlightsTextUk;
        if (!rawText) return [];
        return rawText.split('\n').filter(line => line.trim() !== '');
    }, [currentRoom, isEn]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress size={60} sx={{ color: '#0c1865' }} />
        </Box>
    );

    if (locations.length === 0) return (
        <Container sx={{ py: 10, textAlign: 'center' }}>
            <Typography variant="h5" color="text.secondary">
                {t("noLocations")}
            </Typography>
        </Container>
    );

    const images = currentRoom?.imagePhotos || [];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 12 }}>
            {/* HERO SECTION - Пряма лінія */}
            <Box sx={{
                background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
                pt: { xs: 8, md: 12 },
                pb: { xs: 15 }, // Трохи зменшили відступ для прямої лінії
                color: '#fff',
                position: 'relative',
                zIndex: 1,
                mb: 3
            }}>
                <Container maxWidth="lg">
                    <Typography variant="h1" sx={{
                        fontSize: { xs: 32, md: 56 },
                        fontWeight: 900,
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        mb: 2,
                        textAlign: 'center',
                        textShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        VIRTUAL <span style={{ color: '#f97316' }}>TOUR</span>
                    </Typography>
                    <Typography sx={{
                        fontSize: { xs: 16, md: 20 },
                        textAlign: 'center',
                        maxWidth: 700,
                        mx: 'auto',
                        opacity: 0.9,
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        {t('virtualTourSubtitle')}
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, lg: 8 }} id="tour-viewer">
                        <Paper elevation={0} sx={{
                            position: 'relative',
                            borderRadius: 6,
                            overflow: 'hidden',
                            aspectRatio: '16/9',
                            bgcolor: '#000',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            mb: 4
                        }}>
                            <Box sx={{
                                width: '100%', height: '100%', transition: 'opacity 0.4s ease',
                                opacity: isTransitioning ? 0.3 : 1
                            }}>
                                {images.length > 0 ? (
                                    <Image
                                        src={images[currentImageIndex]}
                                        alt={isEn ? currentRoom?.nameEn : currentRoom?.nameUk}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        priority
                                    />
                                ) : (
                                    <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexDirection: 'column', gap: 2 }}>
                                        <ImageNotSupported sx={{ fontSize: '3rem' }} />
                                        <Typography>No Image</Typography>
                                    </Box>
                                )}
                            </Box>

                            {images.length > 1 && (
                                <>
                                    <IconButton
                                        onClick={() => setCurrentImageIndex(prev => prev - 1)}
                                        disabled={currentImageIndex === 0}
                                        sx={{
                                            position: 'absolute', top: '50%', left: 20, transform: 'translateY(-50%)',
                                            bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', color: 'white',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                                            '&.Mui-disabled': { opacity: 0 }
                                        }}
                                    >
                                        <ChevronLeft fontSize="large" />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => setCurrentImageIndex(prev => prev + 1)}
                                        disabled={currentImageIndex === images.length - 1}
                                        sx={{
                                            position: 'absolute', top: '50%', right: 20, transform: 'translateY(-50%)',
                                            bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', color: 'white',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                                            '&.Mui-disabled': { opacity: 0 }
                                        }}
                                    >
                                        <ChevronRight fontSize="large" />
                                    </IconButton>
                                </>
                            )}

                            <Box sx={{
                                position: 'absolute', bottom: 24, left: 24, right: 24,
                                display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'
                            }}>
                                <Box sx={{
                                    p: 2.5, borderRadius: 4,
                                    bgcolor: 'rgba(15, 23, 42, 0.8)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    maxWidth: '80%'
                                }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box sx={{
                                            p: 1.2,
                                            bgcolor: '#f97316',
                                            borderRadius: 2,
                                            display: 'flex',
                                            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)'
                                        }}>
                                            <RenderIcon iconName={currentRoom?.iconName} color="#fff" />
                                        </Box>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 800, fontSize: {xs: '1.1rem', md: '1.4rem'} }}>
                                                {isEn ? currentRoom?.nameEn : currentRoom?.nameUk}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {t("Floor")} {currentRoom?.floor} • {images.length > 0 ? `${currentImageIndex + 1} / ${images.length}` : ''}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                        </Paper>

                        <Box sx={{ px: { md: 2 } }}>
                            <Typography sx={{
                                fontSize: '1.15rem',
                                color: '#334155',
                                lineHeight: 1.8,
                                mb: 5,
                                whiteSpace: 'pre-line'
                            }}>
                                {isEn ? currentRoom?.descriptionEn : currentRoom?.descriptionUk}
                            </Typography>

                            {highlights.length > 0 && (
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CenterFocusWeak sx={{ color: '#f97316' }} />
                                        {isEn ? "Key Highlights" : "Ключові особливості"}
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {highlights.map((text, i) => (
                                            <Grid size={{ xs: 12, sm: 6 }} key={i}>
                                                <Paper elevation={0} sx={{
                                                    p: 2,
                                                    borderRadius: 3,
                                                    bgcolor: '#fff',
                                                    border: '1px solid #e2e8f0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    transition: 'transform 0.2s',
                                                    '&:hover': { transform: 'translateY(-2px)', borderColor: '#cbd5e1' }
                                                }}>
                                                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#f97316', flexShrink: 0 }} />
                                                    <Typography sx={{ fontWeight: 600, color: '#475569' }}>{text}</Typography>
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
'use client';

import {useState, useEffect} from 'react';
import {
    Box, Typography, Container, CircularProgress, IconButton, Grid,
    TextField, InputAdornment, Pagination, alpha
} from '@mui/material';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {useTranslation} from '@/contexts/TranslationProvider.jsx';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard";
import RichText from "@/components/shared/RichText";

export default function MethodicalEventsPage() {

    const {locale} = useTranslation('meth');

    const [pageData, setPageData] = useState(null);
    const [isLoadingStatic, setIsLoadingStatic] = useState(true);
    const [events, setEvents] = useState([]);
    const [totalEvents, setTotalEvents] = useState(0);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);

    const [expandedId, setExpandedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 6;

    const [gallery, setGallery] = useState({
        open: false,
        images: [],
        index: 0
    });

    const isEn = locale === 'en';

    const l = (uk, en) => (isEn ? en || uk : uk);

// -----------------------------
// Завантаження статичної секції
// -----------------------------
    useEffect(() => {
        const controller = new AbortController();

        const loadStatic = async () => {
            try {
                setIsLoadingStatic(true);

                const res = await fetch(
                    '/admin/api/admin/pageSection?type=METHODOLOGICAL',
                    {signal: controller.signal}
                );

                if (!res.ok) {
                    throw new Error('Failed to load static section');
                }

                const json = await res.json();

                setPageData(json.data?.[0] || null);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Static fetch error:', err);
                }
            } finally {
                setIsLoadingStatic(false);
            }
        };

        loadStatic();

        return () => controller.abort();
    }, []);

// -----------------------------
// Завантаження подій
// -----------------------------
    useEffect(() => {
        const controller = new AbortController();

        const handler = setTimeout(async () => {
            try {
                setIsLoadingEvents(true);

                const params = new URLSearchParams({
                    type: 'METHODOLOGICAL',
                    limit: itemsPerPage.toString(),
                    page: currentPage.toString(),
                    search: searchQuery.trim()
                });

                const res = await fetch(
                    `/admin/api/admin/content?${params}`,
                    {signal: controller.signal}
                );

                if (!res.ok) {
                    throw new Error('Failed to load events');
                }

                const json = await res.json();

                const formatted = (json.data || []).map(item => ({
                    id: item.id,
                    title: isEn
                        ? item.titleEn || item.titleUk
                        : item.titleUk,

                    text: isEn
                        ? item.textEn || item.textUk
                        : item.textUk,

                    images:
                        item.photoGallery?.length > 0
                            ? item.photoGallery
                            : item.imagePhoto
                                ? [item.imagePhoto]
                                : [],

                    date: new Date(
                        item.publicationDate || item.createdAt
                    ).toLocaleDateString(
                        isEn ? 'en-GB' : 'uk-UA'
                    )
                }));

                setEvents(formatted);
                setTotalEvents(json.meta?.total || 0);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Events fetch error:', err);
                }
            } finally {
                setIsLoadingEvents(false);
            }
        }, 400);

        return () => {
            clearTimeout(handler);
            controller.abort();
        };
    }, [searchQuery, currentPage, locale, isEn]);


    const handleImageClick = (images, index) => {
        if (!images || images.length === 0) return;
        setGallery({open: true, images, index: index >= images.length ? 0 : index});
        document.body.style.overflow = 'hidden';
    };

    const closeGallery = () => {
        setGallery({open: false, images: [], index: 0});
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
        <Box sx={{display: 'flex', justifyContent: 'center', py: 20}}>
            <CircularProgress sx={{color: '#0c1865'}}/>
        </Box>
    );

    const displayTitle = l(pageData?.titleUk, pageData?.titleEn);
    const displayHtml = l(pageData?.contentUk, pageData?.contentEn);
    const heroPhoto = pageData?.imagePhoto;

    return (
        <Box component="main" sx={{background: '#F8FAFC', minHeight: '100vh', pb: 10}}>

            {/* HERO SECTION */}
            <Box sx={heroContainerSx}>
                <Container maxWidth="lg">
                    <Typography variant="h1" sx={heroTitleSx}>
                        {displayTitle || (isEn ? "Methodical Events" : "Методичні заходи")}
                    </Typography>

                    <Grid container spacing={{xs: 4, md: 8}} alignItems="center">
                        {heroPhoto && (
                            <Grid size={{xs: 12, md: 5}}>
                                <Box onClick={() => handleImageClick([heroPhoto], 0)} sx={heroImageWrapperSx}>
                                    <Image src={heroPhoto} fill style={{objectFit: 'cover'}} alt="Hero" priority/>
                                </Box>
                            </Grid>
                        )}
                        <Grid size={{xs: 12, md: heroPhoto ? 7 : 12}}>
                            <RichText
                                html={displayHtml}
                                sx={{
                                    color: alpha('#fff', 0.9),
                                    fontSize: {xs: 16, md: 19},
                                    '& p': {lineHeight: 1.8, textAlign: 'left'}
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{mt: -6, position: 'relative', zIndex: 2}}>
                {/* SEARCH BAR */}
                <Box sx={{mb: 6, display: 'flex', justifyContent: 'center'}}>
                    <TextField
                        fullWidth
                        placeholder={isEn ? "Search events..." : "Пошук заходів..."}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        sx={searchFieldSx}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{color: '#0c1865'}}/>
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>

                {/* EVENTS LIST */}
                {isLoadingEvents ? (
                    <Box sx={{py: 10, textAlign: 'center'}}><CircularProgress/></Box>
                ) : (
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
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
                            <Typography sx={noResultsSx}>
                                {isEn ? "No events found" : "Нічого не знайдено"}
                            </Typography>
                        )}
                    </Box>
                )}

                {totalEvents > itemsPerPage && (
                    <Box sx={{mt: 8, display: 'flex', justifyContent: 'center'}}>
                        <Pagination
                            count={Math.ceil(totalEvents / itemsPerPage)}
                            page={currentPage}
                            onChange={(e, v) => {
                                setCurrentPage(v);
                                window.scrollTo({top: 400, behavior: 'smooth'});
                            }}
                            color="primary"
                            size="large"
                            sx={{'& .MuiPaginationItem-root': {fontWeight: 700}}}
                        />
                    </Box>
                )}
            </Container>

            {/* MODAL GALLERY */}
            {gallery.open && (
                <Box onClick={closeGallery} sx={galleryOverlaySx}>
                    <IconButton onClick={closeGallery} sx={{position: 'absolute', top: 20, right: 20, color: '#fff'}}>
                        <CloseIcon fontSize="large"/>
                    </IconButton>
                    <Box onClick={(e) => e.stopPropagation()}
                         sx={{position: 'relative', width: '90%', maxWidth: '1200px', height: '80vh'}}>
                        <Image src={gallery.images[gallery.index]} alt="Full view" fill priority
                               style={{objectFit: 'contain'}}/>
                        {gallery.images.length > 1 && (
                            <>
                                <IconButton onClick={(e) => navigateImage(e, -1)} sx={{
                                    position: 'absolute',
                                    left: {xs: 0, md: -60},
                                    top: '50%',
                                    color: '#fff'
                                }}>
                                    <Typography variant="h3">❮</Typography>
                                </IconButton>
                                <IconButton onClick={(e) => navigateImage(e, 1)} sx={{
                                    position: 'absolute',
                                    right: {xs: 0, md: -60},
                                    top: '50%',
                                    color: '#fff'
                                }}>
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

// --- Стилі ---

const heroContainerSx = {
    background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
    pt: {xs: 10, md: 12},
    pb: {xs: 15, md: 22},
    color: '#fff',
    clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0% 100%)',
    position: 'relative',
    zIndex: 1
};

const heroTitleSx = {
    fontSize: {xs: 32, md: 54},
    fontWeight: 900,
    textAlign: 'center',
    fontFamily: "'Montserrat Alternates', sans-serif",
    textTransform: 'uppercase',
    mb: 8,
    lineHeight: 1.1
};

const heroImageWrapperSx = {
    position: 'relative',
    height: {xs: 280, md: 400},
    borderRadius: 6,
    overflow: 'hidden',
    cursor: 'pointer',
    boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
    transition: '0.4s',
    '&:hover img': {transform: 'scale(1.05)'}
};

const searchFieldSx = {
    maxWidth: 600,
    bgcolor: '#fff',
    borderRadius: 4,
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    '& .MuiOutlinedInput-root': {
        borderRadius: 4,
        '& fieldset': {borderColor: 'transparent'},
        '&:hover fieldset': {borderColor: alpha('#0c1865', 0.2)},
    }
};

const noResultsSx = {
    textAlign: 'center',
    color: '#94a3b8',
    py: 10,
    fontStyle: 'italic',
    fontSize: '1.2rem'
};

const galleryOverlaySx = {
    position: 'fixed',
    inset: 0,
    bgcolor: 'rgba(0,0,0,0.95)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 2
};
'use client';
import { Box, Typography, Grid, Button, alpha, Chip } from '@mui/material';
import Image from 'next/image';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import RichText from "../../../../components/shared/RichText";

export default function InnovativePost({ item, index, locale, t, onImageClick }) {
    const isEn = locale === 'en';

    const title = isEn ? (item.titleEn || item.titleUk) : item.titleUk;
    const rawHtml = isEn ? (item.textEn || item.textUk) : item.textUk;
    const photos = item.photoGallery || [];
    const hasPhotos = photos.length > 0;

    const pubDate = item.publicationDate ? new Date(item.publicationDate).toLocaleDateString(isEn ? 'en-GB' : 'uk-UA', {
        day: 'numeric', month: 'long', year: 'numeric'
    }) : null;

    return (
        <Box sx={postCardSx}>
            {/* 1. Header: Номер, Дата та Заголовок */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 2, md: 3 }, mb: 5 }}>
                <Box sx={indexBadgeSx}>
                    {String(index + 1).padStart(2, '0')}
                </Box>
                <Box>
                    {pubDate && (
                        <Typography sx={dateSx}>
                            <CalendarMonthIcon sx={{ fontSize: 18 }} /> {pubDate}
                        </Typography>
                    )}
                    <Typography variant="h4" sx={titleSx}>
                        {title}
                    </Typography>
                </Box>
            </Box>

            {/* 2. Content: Фото зліва, Текст справа (Без шахматки) */}
            <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mb: 5 }}>
                {hasPhotos && (
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box onClick={() => onImageClick(photos, 0)} sx={mainImageSx}>
                            <Image
                                src={photos[0]}
                                fill
                                style={{ objectFit: 'cover', transition: '0.6s' }}
                                alt={title}
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                            <Box className="overlay" sx={imageOverlaySx}>
                                <PhotoLibraryIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography sx={{ fontWeight: 700 }}>{t("viewMore")}</Typography>
                            </Box>
                        </Box>

                        {photos.length > 1 && (
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<PhotoLibraryIcon />}
                                onClick={() => onImageClick(photos, 0)}
                                sx={galleryBtnSx}
                            >
                                {t("viewAllPhotos")} ({photos.length})
                            </Button>
                        )}
                    </Grid>
                )}

                <Grid size={{ xs: 12, md: hasPhotos ? 7 : 12 }}>
                    <RichText
                        html={rawHtml}
                        sx={{
                            color: '#475569',
                            fontSize: { xs: 16, md: 18 },
                            lineHeight: 1.9,
                        }}
                    />
                </Grid>
            </Grid>

            {/* 3. Footer: Теги та Відео */}
            <Box sx={footerSx}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {item.attributes && typeof item.attributes === 'object' &&
                        Object.entries(item.attributes).map(([key, value]) => (
                            <Chip
                                key={key}
                                label={`${key}: ${value}`}
                                sx={chipSx}
                            />
                        ))
                    }
                </Box>

                {item.videoUrl && (
                    <Button
                        href={item.videoUrl}
                        target="_blank"
                        variant="contained"
                        startIcon={<OpenInNewIcon />}
                        sx={videoBtnSx}
                    >
                        {t('viewVideo')}
                    </Button>
                )}
            </Box>
        </Box>
    );
}

// --- СТИЛІ ---

const postCardSx = {
    mb: 8, bgcolor: '#fff', borderRadius: 8, p: { xs: 3, md: 6 },
    boxShadow: '0 25px 60px rgba(0,0,0,0.06)',
    border: '1px solid #E2E8F0',
    position: 'relative'
};

const indexBadgeSx = {
    width: { xs: 50, md: 60 }, height: { xs: 50, md: 60 }, borderRadius: 4,
    bgcolor: '#f97316', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 900, fontSize: { xs: 20, md: 24 }, flexShrink: 0,
    boxShadow: '0 10px 20px rgba(249, 115, 22, 0.2)'
};

const titleSx = {
    fontWeight: 800, color: '#0c1865',
    fontSize: { xs: 24, md: 34 },
    fontFamily: "'Montserrat Alternates', sans-serif",
    lineHeight: 1.2
};

const dateSx = {
    fontSize: 13, fontWeight: 700, color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: 1, mb: 1,
    display: 'flex', alignItems: 'center', gap: 1
};

const mainImageSx = {
    position: 'relative', height: { xs: 250, md: 380 }, borderRadius: 5,
    overflow: 'hidden', cursor: 'pointer',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
    '&:hover .overlay': { opacity: 1 },
    '&:hover img': { transform: 'scale(1.05)' },
    transition: '0.4s'
};

const imageOverlaySx = {
    position: 'absolute', inset: 0, bgcolor: alpha('#0c1865', 0.7),
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    opacity: 0, transition: '0.3s ease', backdropFilter: 'blur(4px)', color: '#fff'
};

const galleryBtnSx = {
    mt: 2, color: '#0c1865', borderColor: alpha('#0c1865', 0.2),
    borderRadius: 3, fontWeight: 700, textTransform: 'none',
    '&:hover': { borderColor: '#0c1865', bgcolor: alpha('#0c1865', 0.05) }
};

const footerSx = {
    display: 'flex', flexWrap: 'wrap', alignItems: 'center',
    justifyContent: 'space-between', pt: 4, borderTop: '2px solid #f8fafc', gap: 3
};

const chipSx = {
    bgcolor: alpha('#0c1865', 0.05),
    color: '#0c1865',
    fontWeight: 700,
    borderRadius: 2,
    fontSize: 13
};

const videoBtnSx = {
    bgcolor: '#0c1865', borderRadius: 3, px: 4, py: 1.5,
    fontWeight: 800, textTransform: 'none',
    '&:hover': { bgcolor: '#f97316' },
    transition: '0.3s'
};
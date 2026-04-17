'use client';

import { Box, Typography, Grid, alpha, Button } from "@mui/material";
import Image from "next/image";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import RichText from "@/components/shared/RichText";

export default function Building({ items, locale, t, onImageClick }) {
    if (!items?.length) return null;

    return (
        <Box component="section" sx={{ mb: 10 }}>
            <Box sx={{
                background: 'linear-gradient(135deg, #0c1865 0%, #162483 100%)',
                borderRadius: { xs: 6, md: 8 },
                p: { xs: 3, sm: 4, md: 8 },
                color: '#fff',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
            }}>
                <Typography variant="h2" sx={titleSx}>
                    {t("schoolBuildingTitle")}
                </Typography>

                {items.map((item, idx) => {
                    const title = locale === 'en' ? (item.titleEn || item.titleUk) : item.titleUk;
                    const rawText = locale === 'en' ? (item.textEn || item.textUk) : item.textUk;
                    const photos = item.photoGallery || [];
                    const hasPhotos = photos.length > 0;

                    return (
                        <Box key={item.id} sx={{ mb: idx !== items.length - 1 ? { xs: 8, md: 12 } : 0 }}>
                            <Typography variant="h4" sx={subtitleSx}>
                                {title}
                            </Typography>

                            <Grid container spacing={{ xs: 4, md: 8 }} alignItems="flex-start">
                                {/* Фото секція */}
                                {hasPhotos && (
                                    <Grid size={{ xs: 12, md: 5 }}>
                                        <Box
                                            onClick={() => onImageClick(photos, 0)}
                                            sx={imageContainerSx}
                                        >
                                            <Image
                                                src={photos[0]}
                                                fill
                                                style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                                alt={title}
                                                sizes="(max-width: 768px) 100vw, 40vw"
                                            />
                                            <Box className="overlay" sx={imageOverlaySx}>
                                                <PhotoLibraryIcon sx={{ fontSize: 40, mb: 1 }} />
                                                <Typography sx={{ fontWeight: 700 }}>{t("viewAllPhotos")}</Typography>
                                            </Box>
                                        </Box>

                                        {photos.length > 1 && (
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<PhotoLibraryIcon />}
                                                onClick={() => onImageClick(photos, 0)}
                                                sx={allPhotosBtnSx}
                                            >
                                                {t("viewAllPhotos")} ({photos.length})
                                            </Button>
                                        )}
                                    </Grid>
                                )}

                                {/* Текстова секція */}
                                <Grid size={{ xs: 12, md: hasPhotos ? 7 : 12 }}>
                                    <RichText
                                        html={rawText}
                                        sx={paragraphSx}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

// --- СТИЛІ ---

const titleSx = {
    fontFamily: "'Montserrat Alternates', sans-serif",
    fontSize: { xs: 28, md: 42 },
    fontWeight: 900,
    color: '#fff',
    textAlign: 'center',
    mb: { xs: 6, md: 10 }
};

const subtitleSx = {
    color: '#f97316',
    fontWeight: 800,
    mb: 4,
    textAlign: { xs: 'center', md: 'left' },
    fontSize: { xs: 20, md: 28 },
    fontFamily: "'Montserrat Alternates', sans-serif"
};

const paragraphSx = {
    fontSize: { xs: 15, md: 17 },
    lineHeight: 1.8,
    color: alpha('#fff', 0.85),
    textAlign: 'left', // ГАРАНТІЯ того, що слова не будуть розриватися заради ширини
};

const imageContainerSx = {
    position: 'relative',
    height: { xs: 250, md: 400 },
    borderRadius: 5,
    overflow: 'hidden',
    cursor: 'pointer',
    boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
    '&:hover .overlay': { opacity: 1 },
    '&:hover img': { transform: 'scale(1.08)' },
    transition: 'all 0.3s ease'
};

const imageOverlaySx = {
    position: 'absolute',
    inset: 0,
    bgcolor: alpha('#0c1865', 0.6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: '0.3s ease',
    backdropFilter: 'blur(4px)',
    color: '#fff'
};

const allPhotosBtnSx = {
    mt: 2,
    color: '#f97316',
    borderColor: alpha('#f97316', 0.5),
    borderRadius: 3,
    px: 4, py: 1.5,
    fontWeight: 700,
    textTransform: 'none',
    borderWidth: '2px',
    '&:hover': {
        borderColor: '#f97316',
        bgcolor: alpha('#f97316', 0.1)
    }
};
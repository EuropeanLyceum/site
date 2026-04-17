'use client';
import { Box, Typography, Grid2 as Grid, alpha, Button } from "@mui/material";
import Image from "next/image";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import RichText from "@/components/shared/RichText"; // Переконайся, що шлях правильний

// --- Helper for Styles ---
const styles = {
    variants: {
        founders: {
            background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
        },
        building: {
            background: 'linear-gradient(135deg, #0c1865 0%, #162483 100%)',
            boxShadow: 'none',
        },
        development: {
            background: 'linear-gradient(165deg, #0c1865 0%, #1a2a8a 100%)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
        }
    },
    mainTitle: {
        fontFamily: "'Montserrat Alternates', sans-serif",
        fontSize: { xs: 28, md: 46 },
        fontWeight: 900,
        color: '#fff',
        textAlign: 'center',
        mb: { xs: 6, md: 10 },
        lineHeight: 1.1
    },
    subTitle: {
        color: '#f97316',
        fontWeight: 800,
        fontFamily: "'Montserrat Alternates', sans-serif",
        fontSize: { xs: 22, md: 30 },
        mb: 4,
        textAlign: { xs: 'center', md: 'left' }
    },
    richTextOverride: {
        fontSize: { xs: 15, md: 17 },
        lineHeight: 1.8,
        color: alpha('#fff', 0.85),
        // textAlign: 'left' вже вшитий у RichText, що вирішує проблему з розривом слів
    }
};

const getLocContent = (item, field, locale) => {
    if (!item) return '';
    const valEn = item[`${field}En`];
    const valUk = item[`${field}Uk`];
    return locale === 'en' ? (valEn || valUk) : valUk;
};

export default function UniversalHistorySection({
                                                    variant = 'building',
                                                    mainTitle,
                                                    dataItems,
                                                    locale,
                                                    t,
                                                    onImageClick
                                                }) {
    if (!dataItems || dataItems.length === 0) return null;

    const currentVariantStyle = styles.variants[variant] || styles.variants.building;

    return (
        <Box component="section" sx={{ mb: 10 }}>
            <Box sx={{
                ...currentVariantStyle,
                borderRadius: { xs: 6, md: 8 },
                p: { xs: 3, sm: 5, md: 8 },
                color: '#fff'
            }}>

                {mainTitle && (
                    <Typography variant="h2" sx={styles.mainTitle}>
                        {mainTitle}
                    </Typography>
                )}

                {dataItems.map((item, itemIndex) => {
                    const itemTitle = getLocContent(item, 'title', locale);
                    const rawHtml = getLocContent(item, 'text', locale);
                    const photos = item.photoGallery || [];
                    const hasPhotos = photos.length > 0;
                    const isLastItem = itemIndex === dataItems.length - 1;

                    return (
                        <Box key={item.id || itemIndex} sx={{
                            mb: isLastItem ? 0 : { xs: 8, md: 12 },
                            pb: isLastItem ? 0 : { xs: 4, md: 6 },
                            borderBottom: isLastItem ? 'none' : '1px solid rgba(255,255,255,0.1)'
                        }}>

                            {itemTitle && (
                                <Typography variant="h4" sx={styles.subTitle}>
                                    {itemTitle}
                                </Typography>
                            )}

                            <Grid container spacing={{ xs: 4, md: 8 }} alignItems="flex-start">

                                {/* Фото зліва */}
                                {hasPhotos && (
                                    <Grid size={{ xs: 12, md: 5 }}>
                                        <Box
                                            onClick={() => onImageClick(photos, 0)}
                                            sx={imageContainerSx}
                                        >
                                            <Image
                                                src={photos[0]}
                                                fill
                                                style={{ objectFit: 'cover', transition: '0.6s ease' }}
                                                alt={itemTitle || "History"}
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
                                                sx={allPhotosBtnSx}
                                            >
                                                {t("viewAllPhotos")} ({photos.length})
                                            </Button>
                                        )}
                                    </Grid>
                                )}

                                {/* Текст справа (RichText) */}
                                <Grid size={{ xs: 12, md: hasPhotos ? 7 : 12 }}>
                                    <RichText
                                        html={rawHtml}
                                        sx={styles.richTextOverride}
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

// --- Локальні стилі для фото та кнопок ---

const imageContainerSx = {
    position: 'relative',
    height: { xs: 250, md: 400 },
    borderRadius: 5,
    overflow: 'hidden',
    cursor: 'pointer',
    boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
    '&:hover .overlay': { opacity: 1 },
    '&:hover img': { transform: 'scale(1.08)' },
    transition: 'all 0.4s ease'
};

const imageOverlaySx = {
    position: 'absolute',
    inset: 0,
    bgcolor: alpha('#0c1865', 0.7),
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
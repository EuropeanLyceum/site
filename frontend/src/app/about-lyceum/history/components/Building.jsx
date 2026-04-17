'use client';
import { Box, Typography, Grid, alpha, Button } from "@mui/material";
import Image from "next/image";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import RichText from "@/components/shared/RichText";

export default function Building({ items, locale, t, onImageClick }) {
    if (!items?.length) return null;

    return (
        <Box component="section" sx={{ mb: 10 }}>
            <Box sx={{ background: '#0c1865', borderRadius: 8, p: { xs: 4, md: 8 }, color: '#fff' }}>
                <Typography variant="h2" sx={{ ...titleSx, textAlign: 'center', mb: 8 }}>
                    {t("schoolBuildingTitle")}
                </Typography>

                {items.map((item, idx) => {
                    const title = locale === 'en' ? (item.titleEn || item.titleUk) : item.titleUk;
                    const rawText = locale === 'en' ? (item.textEn || item.textUk) : item.textUk;
                    const photos = item.photoGallery || [];

                    return (
                        <Box key={item.id} sx={{ mb: idx !== items.length - 1 ? 10 : 0 }}>
                            <Typography variant="h4" sx={{ color: '#f97316', fontWeight: 800, mb: 4, textAlign: 'center' }}>
                                {title}
                            </Typography>

                            <Grid container spacing={6} alignItems="flex-start">
                                {/* Основне фото (якщо є) */}
                                {photos.length > 0 && (
                                    <Grid size={{xs: 12, md: 5}}>
                                        <Box
                                            onClick={() => onImageClick(photos, 0)}
                                            sx={imageContainerSx}
                                        >
                                            <Image
                                                src={photos[0]}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                alt={title}
                                            />
                                        </Box>

                                        {/* Кнопка "Всі фото", якщо їх більше одного */}
                                        {photos.length > 1 && (
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<PhotoLibraryIcon />}
                                                onClick={() => onImageClick(photos, 0)}
                                                sx={{ ...allPhotosBtnSx, mt: 2 }}
                                            >
                                                {t("viewAllPhotos")} ({photos.length})
                                            </Button>
                                        )}
                                    </Grid>
                                )}

                                {/* Текст одним блоком */}
                                <Grid size={{xs: 12, md: photos.length > 0 ? 7 : 12}}>
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

const titleSx = { fontFamily: "'Montserrat Alternates', sans-serif", fontSize: { xs: 28, md: 42 }, fontWeight: 800, color: '#fff' };
const paragraphSx = { fontSize: { xs: 15, md: 17 }, lineHeight: 1.8, color: alpha('#fff', 0.8), textAlign: 'justify' };
const imageContainerSx = {
    position: 'relative', height: { xs: 250, md: 400 }, borderRadius: 4, overflow: 'hidden', cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)', '&:hover img': { transform: 'scale(1.05)' }, transition: 'all 0.3s ease'
};
const allPhotosBtnSx = {
    color: '#f97316', borderColor: '#f97316', borderRadius: '12px', px: 4, py: 1, fontWeight: 700,
    textTransform: 'none', '&:hover': { borderColor: '#fff', color: '#fff', bgcolor: alpha('#fff', 0.1) }
};
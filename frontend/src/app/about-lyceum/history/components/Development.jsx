'use client';
import { Box, Typography, Grid, alpha, Button } from "@mui/material";
import Image from "next/image";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import RichText from "@/components/shared/RichText";

export default function Development({ items, locale, t, onImageClick }) {
    if (!items?.length) return null;

    return (
        <Box component="section" sx={{ mb: 10 }}>
            <Box sx={{ background: 'linear-gradient(165deg, #0c1865 0%, #1a2a8a 100%)', borderRadius: 8, p: { xs: 4, md: 8 }, color: '#fff' }}>
                <Typography variant="h2" sx={{ ...titleSx, textAlign: 'center', mb: 8 }}>
                    {t("developmentStagesTitle")}
                </Typography>

                {items.map((item, idx) => {
                    const photos = item.photoGallery || [];
                    const title = locale === 'en' ? (item.titleEn || item.titleUk) : item.titleUk;
                    const rawText = locale === 'en' ? (item.textEn || item.textUk) : item.textUk;
                    const paragraphs = rawText ? rawText.replace(/(<\/p>)\s*(<p[^>]*>)/gi, '$1\n\n$2').split(/\n\n+/).filter(p => p.trim()) : [];

                    return (
                        <Box key={item.id} sx={{ mb: 6, pb: 6, borderBottom: idx !== items.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                            <Typography variant="h5" sx={{ color: '#f97316', fontWeight: 800, mb: 4 }}>
                                {title}
                            </Typography>

                            {paragraphs.map((p, pIdx) => {
                                const photo = photos[pIdx];
                                const direction = pIdx % 2 === 0 ? 'row-reverse' : 'row';

                                return (
                                    <Grid container spacing={4} key={pIdx} direction={direction} alignItems="center" sx={{ mb: 4 }}>
                                        {photo && (
                                            <Grid item xs={12} md={5}>
                                                <Box onClick={() => onImageClick(photos, pIdx)} sx={imageContainerSx}>
                                                    <Image src={photo} fill style={{ objectFit: 'cover' }} alt="Stage" />
                                                </Box>
                                            </Grid>
                                        )}
                                        <Grid item xs={12} md={photo ? 7 : 12}>
                                            <RichText html={p} sx={paragraphSx} />
                                        </Grid>
                                    </Grid>
                                );
                            })}

                            {photos.length > paragraphs.length && (
                                <Button
                                    onClick={() => onImageClick(photos, 0)}
                                    startIcon={<PhotoLibraryIcon />}
                                    sx={{ mt: 2, color: alpha('#fff', 0.7), fontWeight: 600, textTransform: 'none', '&:hover': { color: '#fff' }}}
                                >
                                    {t("viewGallery")} ({photos.length})
                                </Button>
                            )}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

const titleSx = { fontFamily: "'Montserrat Alternates', sans-serif", fontSize: { xs: 28, md: 42 }, fontWeight: 800, color: '#fff' };
const paragraphSx = { fontSize: { xs: 15, md: 17 }, lineHeight: 1.8, color: alpha('#fff', 0.8), textAlign: 'justify' };

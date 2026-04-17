'use client';
import { Box, Typography, Grid, alpha, Button } from "@mui/material";
import Image from "next/image";
import PhotoLibraryIcon from '@mui/icons-material/'
    import RichText from "../../../../components/RichText";
    
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
                    
                    // SMART SPLIT: Safely separates contiguous <p> tags with double newlines
                    // so the layout doesn't break if the CMS switches from plain text to rich HTML.
                    const formattedText = rawText ? rawText.replace(/(<\/p>)\s*(<p[^>]*>)/gi, '$1\n\n$2') : '';
                    const paragraphs = formattedText.split(/\n\n+/).filter(p => p.trim()) || [];

                    return (
                        <Box key={item.id} sx={{ mb: 6, pb: 6, borderBottom: idx !== items.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                            <Typography variant="h5" sx={{ color: '#f97316', fontWeight: 800, mb: 4 }}>
                                {title}
                            </Typography>

                            {paragraphs.map((p, pIdx) => {
                                const photo = photos[pIdx];
                                // Шаховий порядок:
                                // 0: Текст зліва (row-reverse)
                                // 1: Фото зліва (row)
                                const direction = pIdx % 2 === 0 ? 'row-reverse' : 'row';

                                return (
                                    <Grid
                                        container
                                        spacing={4}
                                        key={pIdx}
                                        direction={direction}
                                        alignItems="center"
                                        sx={{ mb: 4 }}
                                    >
                                        {photo && (
                                            <Grid item size={{ xs: 12, md: 5 }}>
                                                <Box
                                                    onClick={() => onImageClick(photos, pIdx)}
                                                    sx={{
                                                        position: 'relative', height: 350, borderRadius: 4,
                                                        overflow: 'hidden', cursor: 'pointer',
                                                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                                        '&:hover img': { transform: 'scale(1.05)' }
                                                    }}
                                                >
                                                    <Image src={photo} fill style={{ objectFit: 'cover', transition: '0.5s' }} alt="Development stage" />
                                                </Box>
                                            </Grid>
                                        )}

                                        <Grid item size={{ xs: 12, md: photo ? 7 : 12 }}>
                                            {/* RICH TEXT IMPLEMENTATION */}
                                            <RichText 
                                                html={p} 
                                                sx={{ 
                                                    ...paragraphSx, 
                                                    // Switches to normal whitespace if actual HTML tags are detected
                                                    whiteSpace: p.includes('<p>') ? 'normal' : 'pre-line' 
                                                }} 
                                            />
                                        </Grid>
                                    </Grid>
                                );
                            })}

                            {photos.length > paragraphs.length && (
                                <Button
                                    onClick={() => onImageClick(photos, 0)}
                                    startIcon={<PhotoLibraryIcon />}
                                    sx={{
                                        mt: 2,
                                        color: alpha('#fff', 0.7),
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        '&:hover': { color: '#fff', bgcolor: alpha('#fff', 0.1) }
                                    }}
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

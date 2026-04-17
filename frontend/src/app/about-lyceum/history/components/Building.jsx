'use client';
import { Box, Typography, Grid, alpha, Button } from "@mui/material";
import Image from "next/image";
import PhotoLibraryIcon from '@mui/icons-material/'
import RichText from "../../../../components/shared/RichText";

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
                    
                    // SMART SPLIT: 
                    // Adds a double newline between </p> and <p> just in case your 
                    // CMS sends continuous HTML blocks, then safely splits them into an array.
                    const formattedText = rawText ? rawText.replace(/(<\/p>)\s*(<p[^>]*>)/gi, '$1\n\n$2') : '';
                    const paragraphs = formattedText.split(/\n\n+/).filter(p => p.trim()) || [];
                    
                    const photos = item.photoGallery || [];

                    return (
                        <Box key={item.id} sx={{ mb: idx !== items.length - 1 ? 10 : 0 }}>
                            <Typography variant="h4" sx={{ color: '#f97316', fontWeight: 800, mb: 4, textAlign: 'center' }}>
                                {title}
                            </Typography>

                            {paragraphs.map((p, pIdx) => {
                                const photo = photos[pIdx];

                                // 0 (парний) -> Текст зліва (row-reverse)
                                // 1 (непарний) -> Фото зліва (row)
                                const direction = pIdx % 2 === 0 ? 'row-reverse' : 'row';

                                return (
                                    <Grid
                                        container
                                        spacing={6}
                                        key={pIdx}
                                        direction={direction}
                                        alignItems="center"
                                        sx={{ mb: 6 }}
                                    >
                                        {photo && (
                                            <Grid item xs={12} md={5}>
                                                <Box
                                                    onClick={() => onImageClick(photos, pIdx)}
                                                    sx={{
                                                        position: 'relative', height: 350, borderRadius: 4,
                                                        overflow: 'hidden', cursor: 'pointer',
                                                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                                        '&:hover img': { transform: 'scale(1.05)' },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    <Image src={photo} fill style={{ objectFit: 'cover', transition: '0.5s' }} alt="Building history" />
                                                </Box>
                                            </Grid>
                                        )}
                                        <Grid item xs={12} md={photo ? 7 : 12}>
                                            {/* RICH TEXT IMPLEMENTATION */}
                                            <RichText 
                                                html={p} 
                                                sx={{ 
                                                    ...paragraphSx, 
                                                    // Only keep pre-line if it's plain text. If it contains real HTML
                                                    // like <p> or <br>, the browser will handle line breaks naturally.
                                                    whiteSpace: p.includes('<p>') ? 'normal' : 'pre-line' 
                                                }} 
                                            />
                                        </Grid>
                                    </Grid>
                                );
                            })}

                            {photos.length > paragraphs.length && (
                                <Box sx={{ textAlign: 'center', mt: 4 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<PhotoLibraryIcon />}
                                        onClick={() => onImageClick(photos, 0)}
                                        sx={{
                                            color: '#f97316', borderColor: '#f97316', borderRadius: '12px',
                                            px: 4, py: 1, fontWeight: 700, textTransform: 'none',
                                            '&:hover': { borderColor: '#fff', color: '#fff', bgcolor: alpha('#fff', 0.1) }
                                        }}
                                    >
                                        {t("viewAllPhotos")} ({photos.length})
                                    </Button>
                                </Box>
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

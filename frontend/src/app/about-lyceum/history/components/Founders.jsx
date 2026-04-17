'use client';
import { Box, Typography, Grid, alpha, Button } from "@mui/material";
import Image from "next/image";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import RichText from "./RichText"; // Path to your RichText component

export default function Founders({ data, locale, t, onImageClick }) {
    if (!data) return null;

    // Локалізація
    const title = locale === 'en' ? (data.titleEn || data.titleUk) : data.titleUk;
    const rawText = locale === 'en' ? (data.textEn || data.textUk) : data.textUk;

    // SMART SPLIT: Handles both plain text and HTML blocks
    const formattedText = rawText ? rawText.replace(/(<\/p>)\s*(<p[^>]*>)/gi, '$1\n\n$2') : '';
    const paragraphs = formattedText.split(/\n\n+/).filter(p => p.trim()) || [];
    const photos = data.photoGallery || [];

    return (
        <Box component="section" sx={{ mb: 10 }}>
            <Box sx={containerSx}>
                <Typography variant="h2" sx={titleSx}>
                    {title || t("foundersTitle")}
                </Typography>

                {paragraphs.map((p, index) => {
                    const photo = photos[index];
                    // Логіка шахів: парні (0, 2) -> Текст зліва (row-reverse), непарні (1, 3) -> Фото зліва (row)
                    const direction = index % 2 === 0 ? 'row-reverse' : 'row';

                    return (
                        <Grid
                            container
                            spacing={6}
                            key={index}
                            direction={direction}
                            alignItems="center"
                            sx={{ mb: 4 }}
                        >
                            {/* Блок ФОТО */}
                            {photo && (
                                <Grid item size={{ xs: 12, md: 5 }}>
                                    <Box
                                        onClick={() => onImageClick(photos, index)}
                                        sx={{
                                            position: 'relative', height: 400, borderRadius: 6,
                                            overflow: 'hidden', cursor: 'pointer',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                            transition: '0.3s',
                                            '&:hover': { transform: 'scale(1.02)' }
                                        }}
                                    >
                                        <Image src={photo} alt="Founders" fill style={{ objectFit: 'cover' }} />
                                    </Box>
                                </Grid>
                            )}

                            {/* Блок ТЕКСТ */}
                            <Grid item size={{ xs: 12, md: photo ? 7 : 12 }}>
                                <RichText 
                                    html={p}
                                    sx={{ 
                                        ...paragraphSx, 
                                        // Use normal white-space if HTML tags like <p> are present
                                        whiteSpace: p.includes('<p>') ? 'normal' : 'pre-line' 
                                    }}
                                />
                            </Grid>
                        </Grid>
                    );
                })}

                {/* Якщо фотографій більше, ніж абзаців */}
                {photos.length > paragraphs.length && (
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Button
                            variant="outlined"
                            startIcon={<PhotoLibraryIcon />}
                            onClick={() => onImageClick(photos, 0)}
                            sx={{
                                color: '#fff', borderColor: '#fff', borderRadius: '12px',
                                px: 4, py: 1, fontWeight: 700, textTransform: 'none',
                                '&:hover': { borderColor: '#fff', bgcolor: alpha('#fff', 0.1) }
                            }}
                        >
                            {t("viewMore")} ({photos.length})
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

const containerSx = { background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)', borderRadius: 8, p: { xs: 4, md: 6 }, color: '#fff' };
const titleSx = { fontFamily: "'Montserrat Alternates', sans-serif", fontSize: { xs: 28, md: 42 }, fontWeight: 800, mb: 4 };
const paragraphSx = { fontSize: { xs: 15, md: 17 }, lineHeight: 1.8, color: alpha('#fff', 0.8), textAlign: 'justify' };

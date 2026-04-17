'use client';
import { Box, Typography, Grid, Button, alpha, Chip } from '@mui/material';
import Image from 'next/image';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RichText from "./RichText"; // Adjust path as needed

export default function InnovativePost({ item, index, locale, t, onImageClick }) {
    const isEn = locale === 'en';

    const title = isEn ? (item.titleEn || item.titleUk) : item.titleUk;
    const rawText = isEn ? (item.textEn || item.textUk) : item.textUk;

    // SMART SPLIT: Prepares the text for the chess layout by splitting on double newlines
    const formattedText = rawText ? rawText.replace(/(<\/p>)\s*(<p[^>]*>)/gi, '$1\n\n$2') : '';
    const paragraphs = formattedText.split(/\n\n+/).filter(p => p.trim()) || [];
    const photos = item.photoGallery || [];

    const pubDate = item.publicationDate ? new Date(item.publicationDate).toLocaleDateString(isEn ? 'en-GB' : 'uk-UA', {
        day: 'numeric', month: 'long', year: 'numeric'
    }) : null;

    return (
        <Box sx={{
            mb: 8, bgcolor: '#fff', borderRadius: 8, p: { xs: 3, md: 6 },
            boxShadow: '0 25px 60px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Header Area */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 6 }}>
                <Box sx={{
                    width: 60, height: 60, borderRadius: 4,
                    bgcolor: '#f97316', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 24, flexShrink: 0,
                    boxShadow: '0 10px 20px rgba(249, 115, 22, 0.2)'
                }}>
                    {String(index + 1).padStart(2, '0')}
                </Box>
                <Box>
                    {pubDate && (
                        <Typography sx={{
                            fontSize: 12, fontWeight: 700, color: '#94a3b8',
                            textTransform: 'uppercase', letterSpacing: 1, mb: 1,
                            display: 'flex', alignItems: 'center', gap: 0.5
                        }}>
                            <CalendarMonthIcon sx={{ fontSize: 16 }} /> {pubDate}
                        </Typography>
                    )}
                    <Typography variant="h4" sx={{
                        fontWeight: 800, color: '#0c1865',
                        fontSize: { xs: 24, md: 34 }, fontFamily: "'Montserrat Alternates', sans-serif"
                    }}>
                        {title}
                    </Typography>
                </Box>
            </Box>

            {/* Paragraphs with Chess Photos */}
            <Box sx={{ mb: 4 }}>
                {paragraphs.map((p, pIdx) => {
                    const photo = photos[pIdx];
                    const direction = pIdx % 2 === 0 ? 'row-reverse' : 'row';

                    return (
                        <Grid container spacing={photo ? 6 : 0} key={pIdx} direction={direction} alignItems="center" sx={{ mb: 6 }}>
                            {photo && (
                                <Grid item xs={12} md={5}>
                                    <Box
                                        onClick={() => onImageClick(photos, pIdx)}
                                        sx={{
                                            position: 'relative', height: 350, borderRadius: 5,
                                            overflow: 'hidden', cursor: 'pointer',
                                            boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                                            '&:hover img': { transform: 'scale(1.05)' },
                                            transition: '0.4s'
                                        }}
                                    >
                                        <Image src={photo} fill style={{ objectFit: 'cover', transition: '0.6s' }} alt="Post content" />
                                    </Box>
                                </Grid>
                            )}
                            <Grid item xs={12} md={photo ? 7 : 12}>
                                {/* RICH TEXT IMPLEMENTATION */}
                                <RichText 
                                    html={p}
                                    sx={{
                                        color: '#475569', 
                                        fontSize: { xs: 16, md: 18 },
                                        lineHeight: 1.9, 
                                        textAlign: 'justify',
                                        // Use normal wrap for HTML, pre-line for raw text blocks
                                        whiteSpace: p.includes('<p>') ? 'normal' : 'pre-line'
                                    }}
                                />
                            </Grid>
                        </Grid>
                    );
                })}
            </Box>

            {/* Footer: Tags & Video */}
            <Box sx={{
                display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                justifyContent: 'space-between', pt: 4, borderTop: '2px solid #f8fafc', gap: 3
            }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {item.attributes && typeof item.attributes === 'object' &&
                        Object.entries(item.attributes).map(([key, value]) => (
                            <Chip
                                key={key}
                                label={`${key}: ${value}`}
                                sx={{
                                    bgcolor: alpha('#0c1865', 0.05),
                                    color: '#0c1865',
                                    fontWeight: 700,
                                    borderRadius: 2
                                }}
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
                        sx={{
                            bgcolor: '#0c1865', borderRadius: 3, px: 4, py: 1.5,
                            fontWeight: 800, textTransform: 'none',
                            '&:hover': { bgcolor: '#f97316' },
                            transition: '0.3s'
                        }}
                    >
                        {t('viewVideo')}
                    </Button>
                )}
            </Box>
        </Box>
    );
}

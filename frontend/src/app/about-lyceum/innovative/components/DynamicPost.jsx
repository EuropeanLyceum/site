'use client';
import { Box, Typography, Grid, alpha, Button } from '@mui/material';
import Image from 'next/image';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function DynamicPost({ item, index, locale, t }) {
    const isEn = locale === 'en';
    const title = isEn ? item.titleEn : item.title;
    const content = isEn ? item.contentEn : item.content;

    return (
        <Box
            sx={{
                mb: 6,
                background: '#fff',
                borderRadius: 8,
                p: { xs: 3, md: 6 },
                boxShadow: '0 15px 40px rgba(0,0,0,0.06)',
                border: '1px solid #E2E8F0',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Box sx={{
                    minWidth: 45, height: 45, borderRadius: 3,
                    bgcolor: '#f97316', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, mr: 2, fontSize: 20
                }}>
                    {index + 1}
                </Box>
                <Typography variant="h4" sx={{
                    fontWeight: 800,
                    color: '#0c1865',
                    fontSize: { xs: 22, md: 28 },
                    fontFamily: "'Montserrat Alternates', sans-serif"
                }}>
                    {title}
                </Typography>
            </Box>

            <Typography sx={{
                color: '#475569',
                fontSize: { xs: 15, md: 17 },
                lineHeight: 1.8,
                mb: 4,
                whiteSpace: 'pre-wrap'
            }}>
                {content}
            </Typography>

            {/* СЕКЦІЯ ФОТО */}
            {item.photoUrls && item.photoUrls.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={2}>
                        {item.photoUrls.map((url, idx) => (
                            <Grid item size={{xs: 12}} sm={item.photoUrls.length === 1 ? 12 : 6} key={idx}>
                                <Box sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: { xs: 220, md: 350 }, // Чітка висота
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    bgcolor: '#f1f5f9',
                                    border: '1px solid #E2E8F0'
                                }}>
                                    <Image
                                        src={url}
                                        alt="Project Detail"
                                        fill
                                        unoptimized // Щоб точно вантажило зовнішні посилання
                                        sizes="(max-width: 768px) 100vw, 500px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {item.url && (
                <Button
                    href={item.url}
                    target="_blank"
                    endIcon={<OpenInNewIcon />}
                    variant="contained"
                    sx={{
                        textTransform: 'none',
                        fontWeight: 800,
                        bgcolor: '#0c1865',
                        px: 4, py: 1.5,
                        borderRadius: 3,
                        '&:hover': { bgcolor: '#f97316', transform: 'translateY(-2px)' },
                        transition: 'all 0.2s'
                    }}
                >
                    {t('learnMore') || 'Докладніше'}
                </Button>
            )}
        </Box>
    );
}
'use client';

import { Box, Typography, Button, alpha, Chip } from "@mui/material";
import Image from "next/image";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RichText from "@/components/shared/RichText";

export default function UndefinedNewsCard({ item, locale, t, isExpanded, onReadMore, onImageClick }) {
    if (!item) return null;

    const localized = {
        title: locale === "en" ? (item.titleEn || item.title || "No title") : (item.title || "Без заголовка"),
        text: locale === "en" ? (item.textEn || item.text || "") : (item.text || "")
    };

    const photos = Array.isArray(item.images) ? item.images : [];
    const hasPhotos = photos.length > 0;
    const displayImages = isExpanded ? photos.slice(0, 3) : photos.slice(0, 1);

    return (
        <Box sx={{
            my: 3, mx: "auto",
            display: 'flex',
            flexDirection: { xs: hasPhotos ? 'column-reverse' : 'column', md: 'row' },
            background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
            borderRadius: { xs: 6, md: 8 },
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(12, 24, 101, 0.15)',
            transition: 'all 0.5s ease',
            width: '100%',
            '&:hover': { transform: { md: 'translateY(-4px)' } }
        }}>
            <Box sx={{
                width: { xs: '100%', md: hasPhotos ? '60%' : '100%' },
                p: { xs: 3, sm: 4, md: 6 },
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/* Дата */}
                {item.date && (
                    <Box sx={{ mb: 2 }}>
                        <Chip
                            icon={<CalendarTodayIcon sx={{ fontSize: '14px !important', color: '#f97316 !important' }} />}
                            label={item.date}
                            sx={{
                                bgcolor: alpha('#fff', 0.1),
                                color: '#fff',
                                fontWeight: 600,
                                border: `1px solid ${alpha('#fff', 0.1)}`
                            }}
                        />
                    </Box>
                )}

                {/* Заголовок */}
                <Typography variant="h3" sx={{
                    fontSize: { xs: 22, md: 32 },
                    color: '#fff',
                    fontWeight: 800,
                    mb: 2,
                    lineHeight: 1.2,
                    fontFamily: "'Montserrat Alternates', sans-serif"
                }}>
                    {localized.title}
                </Typography>

                {/* Контент через RichText */}
                <RichText
                    html={localized.text}
                    clamp={isExpanded ? undefined : 3}
                    sx={{
                        fontSize: { xs: 15, md: 17 },
                        color: alpha('#fff', 0.85),
                        mb: 4,
                    }}
                />

                <Box sx={{ mt: 'auto' }}>
                    <Button
                        onClick={() => onReadMore?.(item.id)}
                        variant="contained"
                        sx={{
                            px: 4, py: 1.2,
                            bgcolor: isExpanded ? alpha('#fff', 0.1) : '#f97316',
                            color: '#fff',
                            borderRadius: 3,
                            fontWeight: 700,
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: isExpanded ? '#fff' : '#ea580c',
                                color: isExpanded ? '#0c1865' : '#fff'
                            }
                        }}
                    >
                        {isExpanded ? t?.('collapse') || 'Collapse' : t?.('readMore') || 'Read More'}
                    </Button>
                </Box>
            </Box>

            {/* Фото */}
            {hasPhotos && (
                <Box sx={{
                    width: { xs: '100%', md: '40%' },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    minHeight: { xs: 250, md: isExpanded ? 600 : 450 },
                    bgcolor: '#050a2e'
                }}>
                    {displayImages.map((img, index) => (
                        <Box
                            key={index}
                            onClick={() => onImageClick?.(photos, index)}
                            sx={{
                                position: 'relative',
                                flex: index === 0 ? 2 : 1,
                                cursor: 'pointer',
                                overflow: 'hidden',
                                '&:hover img': { transform: 'scale(1.05)' }
                            }}
                        >
                            <Image
                                src={img}
                                alt="news"
                                fill
                                style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}
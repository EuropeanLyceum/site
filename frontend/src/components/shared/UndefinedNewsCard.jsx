'use client';

import {Box, Typography, Button, alpha, Chip} from "@mui/material";
import Image from "next/image";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function UndefinedNewsCard({item, locale, t, isExpanded, onReadMore, onImageClick}) {
    // 1. Захист від undefined: якщо item не передано, нічого не рендеримо
    if (!item) return null;

    // 2. Мапінг контенту (з дефолтними значеннями)
    const localized = locale === "en"
        ? {
            title: item.titleEn || item.title || "No title",
            text: item.textEn || item.text || ""
        }
        : {
            title: item.title || "Без заголовка",
            text: item.text || ""
        };

    // 3. Безпечна робота з картинками
    const photos = Array.isArray(item.images) ? item.images : [];
    const hasPhotos = photos.length > 0;
    const displayImages = isExpanded ? photos.slice(0, 3) : photos.slice(0, 1);

    return (
        <Box sx={{
            my: 3, mx: "auto",
            display: 'flex',
            // Якщо фото немає, не міняємо порядок на мобілках
            flexDirection: {
                xs: hasPhotos ? 'column-reverse' : 'column',
                md: 'row'
            },
            background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
            borderRadius: {xs: 6, md: 8},
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(12, 24, 101, 0.15)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            width: '100%', // Важливо для стабільності верстки
            '&:hover': {
                transform: {md: 'translateY(-8px) scale(1.01)'},
                boxShadow: '0 30px 60px rgba(12, 24, 101, 0.25)',
            }
        }}>
            {/* Текстова частина */}
            <Box sx={{
                width: {xs: '100%', md: hasPhotos ? '60%' : '100%'},
                p: {xs: 4, md: 6},
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1
            }}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 3}}>
                    <Chip
                        icon={<CalendarTodayIcon sx={{fontSize: '14px !important', color: '#f97316 !important'}}/>}
                        label={item.date || ''}
                        sx={{
                            bgcolor: alpha('#fff', 0.1),
                            color: '#fff',
                            fontWeight: 600,
                            backdropFilter: 'blur(4px)',
                            border: `1px solid ${alpha('#fff', 0.1)}`
                        }}
                    />
                </Box>

                <Typography variant="h3" sx={{
                    fontSize: {xs: 24, md: 34},
                    color: '#fff',
                    fontWeight: 900,
                    mb: 3,
                    fontFamily: "'Montserrat Alternates', sans-serif"
                }}>
                    {localized.title}
                </Typography>

                <Typography
                    component="div"
                    sx={{
                        fontSize: {xs: 15, md: 17},
                        lineHeight: 1.8,
                        color: alpha('#fff', 0.8),
                        mb: 5,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitLineClamp: isExpanded ? 'unset' : 3,
                        WebkitBoxOrient: 'vertical',
                        whiteSpace: 'pre-wrap',
                    }}
                    dangerouslySetInnerHTML={{ __html: localized.text }}
                />

                <Box sx={{mt: 'auto'}}>
                    <Button
                        onClick={() => onReadMore?.(item.id)}
                        variant="contained"
                        sx={{
                            px: 5, py: 1.5,
                            bgcolor: isExpanded ? alpha('#fff', 0.1) : '#f97316',
                            color: '#fff', borderRadius: 4, fontWeight: 800,
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

            {/* Секція Зображень */}
            {hasPhotos && (
                <Box sx={{
                    width: {xs: '100%', md: '40%'},
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    bgcolor: '#0c1865',
                    height: {xs: isExpanded ? '500px' : '300px', md: 'auto'},
                    minHeight: {md: isExpanded ? 600 : 450},
                    position: 'relative'
                }}>
                    {displayImages.map((img, index) => (
                        <Box
                            key={`${item.id}-img-${index}`}
                            onClick={() => onImageClick?.(photos, index)}
                            sx={{
                                position: 'relative',
                                flex: index === 0 ? 2 : 1,
                                width: '100%',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                '&:hover img': {transform: 'scale(1.1)'}
                            }}
                        >
                            {/* Додано unoptimized або priority залежно від потреби */}
                            <Image
                                src={img}
                                alt={localized.title}
                                fill
                                style={{objectFit: 'cover'}}
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                            <Box className="overlay" sx={{
                                position: 'absolute', inset: 0,
                                bgcolor: alpha('#182BA1', 0.6),
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                opacity: 0, transition: '0.4s', '&:hover': {opacity: 1}
                            }}>
                                <Typography sx={{
                                    color: '#fff',
                                    border: '2px solid #fff',
                                    px: 3,
                                    py: 1,
                                    borderRadius: 10,
                                    fontWeight: 900
                                }}>
                                    {t?.('viewMore') || 'View'}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}
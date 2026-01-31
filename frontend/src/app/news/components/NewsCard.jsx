import { Box, Typography, Button, alpha, Chip } from "@mui/material";
import Image from "next/image";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

function NewsCard({ item, locale, t, isExpanded, onReadMore, onImageClick }) {
    const localized = locale === "en"
        ? { title: item.titleEn || item.title, text: item.textEn || item.text }
        : { title: item.title, text: item.text };

    // Визначаємо кількість фото: 1 якщо згорнуто, до 3 якщо розгорнуто
    const displayImages = isExpanded ? item.images.slice(0, 3) : item.images.slice(0, 1);

    return (
        <Box
            sx={{
                my: 3,
                mx: "auto",
                display: 'flex',
                flexDirection: { xs: 'column-reverse', md: 'row' },
                background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
                borderRadius: { xs: 6, md: 8 },
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(12, 24, 101, 0.15)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&:hover': {
                    transform: { md: 'translateY(-8px) scale(1.01)' },
                    boxShadow: '0 30px 60px rgba(12, 24, 101, 0.25)',
                }
            }}
        >
            {/* Текстова частина */}
            <Box
                sx={{
                    width: { xs: '100%', md: '60%' },
                    p: { xs: 4, md: 6 },
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    zIndex: 2
                }}
            >
                {/* Дата публікації (фейкова або з бази) */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Chip
                        icon={<CalendarTodayIcon sx={{ fontSize: '14px !important', color: '#f97316 !important' }} />}
                        label="31 Jan 2026"
                        sx={{
                            bgcolor: alpha('#fff', 0.1),
                            color: '#fff',
                            fontWeight: 600,
                            backdropFilter: 'blur(4px)',
                            border: `1px solid ${alpha('#fff', 0.1)}`
                        }}
                    />
                </Box>

                <Typography
                    variant="h3"
                    sx={{
                        fontSize: { xs: 24, md: 34 },
                        color: '#fff',
                        fontWeight: 900,
                        mb: 3,
                        lineHeight: 1.1,
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        letterSpacing: '-0.03em'
                    }}
                >
                    {localized.title}
                </Typography>

                <Typography
                    sx={{
                        fontSize: { xs: 15, md: 17 },
                        lineHeight: 1.8,
                        color: alpha('#fff', 0.7),
                        mb: 5,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitLineClamp: isExpanded ? 'unset' : 3,
                        WebkitBoxOrient: 'vertical',
                        whiteSpace: 'pre-wrap',
                        transition: 'all 0.5s ease',
                        fontWeight: 400
                    }}
                >
                    {localized.text}
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                    <Button
                        onClick={() => onReadMore(item.id)}
                        variant="contained"
                        sx={{
                            px: 5,
                            py: 1.5,
                            bgcolor: isExpanded ? alpha('#fff', 0.1) : '#f97316',
                            color: '#fff',
                            borderRadius: 4,
                            textTransform: 'none',
                            fontWeight: 800,
                            boxShadow: isExpanded ? 'none' : '0 10px 20px rgba(249, 115, 22, 0.3)',
                            '&:hover': {
                                bgcolor: isExpanded ? '#fff' : '#ea580c',
                                color: isExpanded ? '#0c1865' : '#fff',
                                transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s'
                        }}
                    >
                        {isExpanded ? t('collapse') : t('readMore')}
                    </Button>
                </Box>
            </Box>

            {/* Секція Зображень */}
            <Box
                sx={{
                    width: { xs: '100%', md: '40%' },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    bgcolor: '#000',
                    // ВИПРАВЛЕННЯ: на мобайлі даємо чітку висоту, щоб блок не зникав
                    height: {
                        xs: isExpanded ? '500px' : '300px',
                        md: 'auto'
                    },
                    // Мінімальна висота для md, щоб картка не схлопувалась
                    minHeight: { md: isExpanded ? 600 : 450 },
                    position: 'relative',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    flexShrink: 0,
                    zIndex: 1
                }}
            >
                {displayImages.map((img, index) => (
                    <Box
                        key={index}
                        onClick={() => onImageClick(item.images, index)}
                        sx={{
                            position: 'relative',
                            cursor: 'pointer',
                            // Розподіляємо місце між фото всередині фіксованого контейнера
                            flex: index === 0 ? 2 : 1,
                            width: '100%',
                            overflow: 'hidden',
                            '&:hover img': { transform: 'scale(1.1)' },
                            '&:hover .overlay': { opacity: 1 },
                        }}
                    >
                        <Image
                            src={img}
                            alt="News"
                            fill
                            sizes="(max-width: 900px) 100vw, 40vw"
                            style={{
                                objectFit: 'cover',
                                transition: 'all 0.8s ease'
                            }}
                        />

                        {/* Градієнтна маска */}
                        <Box sx={{
                            position: 'absolute', inset: 0,
                            background: {
                                xs: 'linear-gradient(to top, rgba(12,24,101,0.5), transparent)',
                                md: 'linear-gradient(to right, rgba(12,24,101,0.5), transparent)'
                            },
                            pointerEvents: 'none'
                        }} />

                        <Box className="overlay" sx={{
                            position: 'absolute', inset: 0,
                            bgcolor: alpha('#182BA1', 0.6),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: 0, transition: '0.4s', backdropFilter: 'blur(8px)'
                        }}>
                            <Typography sx={{
                                color: '#fff', border: '2px solid #fff', px: 3, py: 1,
                                borderRadius: 10, fontWeight: 900, fontSize: 12,
                                textTransform: 'uppercase', letterSpacing: 2
                            }}>
                                {t('viewMore')}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default NewsCard;
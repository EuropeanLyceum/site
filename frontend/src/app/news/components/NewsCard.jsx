import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";

function NewsCard({ item, locale, t, isExpanded, onReadMore, onImageClick }) {
    const localized = locale === "en"
        ? { title: item.titleEn || item.title, text: item.textEn || item.text }
        : { title: item.title, text: item.text };

    const getObjectPosition = (pos) => {
        switch (pos) {
            case "top": return "center top";
            case "bottom": return "center bottom";
            case "center":
            default: return "center center";
        }
    };

    // Визначаємо, скільки фото показувати
    // Якщо розгорнуто — до 3-х фото, якщо ні — тільки одне.
    const displayImages = isExpanded ? item.images.slice(0, 3) : item.images.slice(0, 1);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', md: 'row' },
                background: 'linear-gradient(135deg, rgba(12,24,101,0.95), rgba(56,75,194,0.95))',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
            }}
        >
            {/* Content Section */}
            <Box
                sx={{
                    width: { xs: '100%', md: '65%' },
                    p: { xs: 3, md: 4 },
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: { md: 300 }
                }}
            >
                <Typography
                    component="h3"
                    sx={{
                        fontSize: { xs: 18, sm: 20, md: 24 },
                        color: '#fff',
                        fontWeight: 700,
                        mb: 2,
                        lineHeight: 1.3,
                        pl: { md: 2 },
                        borderLeft: { md: '2px solid #fff' },
                    }}
                >
                    {localized.title}
                </Typography>

                <Typography
                    sx={{
                        fontSize: { xs: 14, sm: 15, md: 16 },
                        lineHeight: 1.6,
                        color: 'rgba(255,255,255,0.9)',
                        mb: 3,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitLineClamp: isExpanded ? 'unset' : 3,
                        WebkitBoxOrient: 'vertical',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                    }}
                >
                    {localized.text}
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                    <Button
                        onClick={() => onReadMore(item.id)}
                        sx={{
                            px: 3,
                            py: 1,
                            color: '#0c1865',
                            backgroundColor: '#e1e5eb',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { backgroundColor: '#fff', transform: 'translateX(4px)' },
                            transition: 'all 0.3s'
                        }}
                        endIcon={<span>{isExpanded ? '↑' : '→'}</span>}
                    >
                        {isExpanded ? t('collapse') : t('readMore')}
                    </Button>
                </Box>
            </Box>

            {/* Multi-Image Section */}
            {item.images.length > 0 && (
                <Box
                    sx={{
                        width: { xs: '100%', md: '35%' },
                        display: 'flex',
                        flexDirection: 'column', // Фото йдуть одне під одним на десктопі
                        gap: 0.5, // Невеликий проміжок між фото
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        maxHeight: isExpanded ? { md: 800 } : { md: 450 }, // Збільшуємо ліміт висоти при розгортанні
                        overflow: 'hidden',
                        transition: 'max-height 0.4s ease-in-out'
                    }}
                >
                    {displayImages.map((img, index) => (
                        <Box
                            key={index}
                            onClick={() => onImageClick(item.images, index)}
                            sx={{
                                position: 'relative',
                                cursor: 'pointer',
                                // Якщо фото одне — воно на всю висоту. Якщо декілька — ділять місце порівну.
                                flex: 1,
                                minHeight: { xs: 240, md: isExpanded ? 200 : 300 },
                                overflow: 'hidden',
                                '&:hover img': { transform: 'scale(1.08)' },
                                '&:hover .overlay': { opacity: 1 },
                            }}
                        >
                            <Image
                                src={img}
                                alt={`${localized.title} - ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 35vw"
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: getObjectPosition(item.imagePosition),
                                    transition: 'transform 0.5s ease',
                                }}
                            />

                            {/* Overlay (тільки для першого фото або коли не розгорнуто, щоб не "смітити") */}
                            <Box
                                className="overlay"
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                }}
                            >
                                <Typography sx={{ color: '#fff', border: '1px solid #fff', px: 2, py: 0.5, borderRadius: 4, fontSize: 12 }}>
                                    {t('viewMore')}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default NewsCard;
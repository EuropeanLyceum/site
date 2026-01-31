'use client';
import { Box, Typography, Link, Grid } from '@mui/material';

export default function DynamicPost({ item, index, getColorScheme, getLocalizedContent, formatText }) {
    const colors = getColorScheme(index);
    const localized = getLocalizedContent(item);

    return (
        <Box
            sx={{
                mb: 10,
                p: { xs: 3, sm: 6 },
                position: 'relative',
                background: `linear-gradient(90deg, ${colors.accent}05 0%, transparent 20%, transparent 80%, ${colors.accent}05 100%)`,
                borderLeft: `4px solid ${colors.accent}30`,
                borderRadius: 2,
                pl: { xs: 3, sm: 8 }
            }}
        >
            {/* Заголовок */}
            {localized.title && (
                <Box mb={3}>
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: colors.text, mb: 1 }}
                    >
                        {localized.title}
                    </Typography>
                    <Box sx={{ width: 10, height: 3, background: colors.accent, borderRadius: 1 }} />
                </Box>
            )}

            {/* Контент */}
            {localized.content && (
                <Typography sx={{ color: colors.text, fontSize: { xs: 14, sm: 16 }, lineHeight: 1.6, mb: 3 }}>
                    {formatText(localized.content)}
                </Typography>
            )}

            {/* Посилання */}
            {item.url && (
                <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        display: 'inline-block',
                        color: colors.accent,
                        fontWeight: 600,
                        textDecoration: 'underline',
                        mb: 3,
                        '&:hover': { color: colors.text }
                    }}
                >
                    {localized.linkText || item.url}
                </Link>
            )}

            {/* Фото */}
            {item.photoUrls && item.photoUrls.length > 0 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {item.photoUrls.map((url, idx) => (
                        <Grid item xs={12} sm={6} key={idx}>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: { xs: 150, sm: 280 },
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'scale(1.02)' }
                                }}
                            >
                                <img
                                    src={url}
                                    alt={`Innovative activity photo ${idx + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Розділювальна лінія */}
            <Box sx={{ width: '100%', height: 2, background: colors.accent, mt: 6, opacity: 0.8 }} />
        </Box>
    );
}

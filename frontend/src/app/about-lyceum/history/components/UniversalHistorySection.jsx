'use client';
import { Box, Typography, Grid, alpha, Button } from "@mui/material";
import Image from "next/image";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

// --- Helper for Styles ---
const styles = {
    // Defines the background styles for different section types
    variants: {
        founders: {
            background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
            boxShadow: '0 20px 40px rgba(12, 24, 101, 0.2)',
        },
        building: {
            background: '#0c1865',
            boxShadow: 'none',
        },
        development: {
            background: 'linear-gradient(165deg, #0c1865 0%, #1a2a8a 100%)',
            boxShadow: '0 20px 40px rgba(26, 42, 138, 0.2)',
        }
    },
    title: {
        fontFamily: "'Montserrat Alternates', sans-serif",
        fontSize: { xs: 28, md: 42 },
        fontWeight: 800,
        color: '#fff',
        textAlign: 'center',
        mb: 6
    },
    subTitle: {
        color: '#f97316',
        fontWeight: 800,
        fontSize: { xs: 22, md: 28 },
        mb: 3
    },
    text: {
        fontSize: { xs: 15, md: 17 },
        lineHeight: 1.8,
        color: alpha('#fff', 0.8),
        textAlign: 'justify',
        whiteSpace: 'pre-line'
    }
};

// --- Helper for Localization ---
const getLocContent = (item, field, locale) => {
    if (!item) return '';
    const valEn = item[`${field}En`];
    const valUk = item[`${field}Uk`];
    return locale === 'en' ? (valEn || valUk) : valUk;
};

export default function UniversalHistorySection({
                                                    variant = 'building', // 'founders' | 'building' | 'development'
                                                    mainTitle,
                                                    dataItems, // Always an Array []
                                                    locale,
                                                    t,
                                                    onImageClick
                                                }) {
    if (!dataItems || dataItems.length === 0) return null;

    const currentStyle = styles.variants[variant] || styles.variants.building;

    return (
        <Box component="section" sx={{ mb: 10 }}>
            <Box sx={{ ...currentStyle, borderRadius: 8, p: { xs: 3, md: 8 }, color: '#fff' }}>

                {/* Main Section Title (e.g., "HISTORY OF CONSTRUCTION") */}
                {mainTitle && (
                    <Typography variant="h2" sx={styles.title}>
                        {mainTitle}
                    </Typography>
                )}

                {/* Render Each Sub-Item (e.g., Stage 1, Stage 2, or just the Founder) */}
                {dataItems.map((item, itemIndex) => {
                    const itemTitle = getLocContent(item, 'title', locale);
                    const rawText = getLocContent(item, 'text', locale);

                    // Robust split: handles double newlines, carriage returns, etc.
                    const paragraphs = rawText?.split(/(?:\r\n|\r|\n){2,}/).filter(p => p.trim()) || [];
                    const photos = item.photoGallery || [];

                    const isLastItem = itemIndex === dataItems.length - 1;

                    return (
                        <Box key={item.id || itemIndex} sx={{ mb: isLastItem ? 0 : 8, pb: isLastItem ? 0 : 6, borderBottom: isLastItem ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>

                            {/* Sub-Item Title (e.g., "Stage 1: The Beginning") */}
                            {itemTitle && (
                                <Typography variant="h4" sx={styles.subTitle}>
                                    {itemTitle}
                                </Typography>
                            )}

                            {/* CHESS LOGIC: Loop through paragraphs */}
                            {paragraphs.map((paragraph, pIndex) => {
                                const photo = photos[pIndex]; // Match paragraph index to photo index

                                // Logic: If index is even (0,2,4) -> Text Left / Photo Right
                                // We use 'row' normally, and 'row-reverse' to swap.
                                // row = Photo Left, Text Right (in DOM order Photo is 1st grid item)
                                // Let's standardized:
                                // Grid Item 1: Photo
                                // Grid Item 2: Text
                                // direction='row' -> Photo | Text
                                // direction='row-reverse' -> Text | Photo

                                const direction = pIndex % 2 === 0 ? 'row-reverse' : 'row';

                                return (
                                    <Grid
                                        container
                                        spacing={photo ? 6 : 0}
                                        key={pIndex}
                                        direction={direction}
                                        alignItems="center"
                                        sx={{ mb: 4 }}
                                    >
                                        {/* PHOTO COLUMN (Only renders if photo exists) */}
                                        {photo && (
                                            <Grid item size={{ xs: 12, md: 5 }}>
                                                <Box
                                                    onClick={() => onImageClick(photos, pIndex)}
                                                    sx={{
                                                        position: 'relative',
                                                        height: { xs: 250, md: 350 },
                                                        borderRadius: 4,
                                                        overflow: 'hidden',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                                        '&:hover img': { transform: 'scale(1.05)' },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    <Image
                                                        src={photo}
                                                        fill
                                                        style={{ objectFit: 'cover', transition: '0.5s' }}
                                                        alt="History content"
                                                        sizes="(max-width: 768px) 100vw, 40vw"
                                                    />
                                                </Box>
                                            </Grid>
                                        )}

                                        {/* TEXT COLUMN (Expands to 12 if no photo) */}
                                        <Grid item size={{ xs: 12, md: photo ? 7 : 12 }}>
                                            <Typography sx={styles.text}>
                                                {paragraph}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                );
                            })}

                            {/* REMAINING PHOTOS BUTTON */}
                            {/* If there are more photos than paragraphs, give access to them */}
                            {photos.length > paragraphs.length && (
                                <Box sx={{ mt: 3, textAlign: 'left' }}>
                                    <Button
                                        onClick={() => onImageClick(photos, paragraphs.length)} // Open gallery at the first hidden photo
                                        startIcon={<PhotoLibraryIcon />}
                                        sx={{
                                            color: alpha('#fff', 0.8),
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            '&:hover': { color: '#fff', bgcolor: alpha('#fff', 0.1) }
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
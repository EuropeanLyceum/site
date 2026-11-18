'use client';
import { Box, Grid, Typography, Container, alpha } from "@mui/material";
import Image from "next/image";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RichText from "../../../../components/shared/RichText"; // Adjust path as needed

export default function MaterialBase({ t, stats, locale }) {
    if (!stats) return null;

    const materialBaseDescription = locale === 'en' ? stats.materialBaseDescriptionEn : stats.materialBaseDescriptionUk;

    // We still extract items to keep the 2-column grid layout with checkmarks
    const items = materialBaseDescription
        ? extractListItems(materialBaseDescription)
        : [];

    function extractListItems(input) {
        if (!input) return [];

        // 1. If it's HTML <li> (from Quill/Rich Text)
        const liMatches = [...input.matchAll(/<li[^>]*>(.*?)<\/li>/g)];
        if (liMatches.length > 0) {
            return liMatches
                .map(match => match[1].trim()) // Keep HTML inside the LI for RichText
                .filter(Boolean);
        }

        // 2. Plain text fallback (bullets + numbering)
        return input
            .split('\n')
            .map(line => line.trim())
            .filter(line => /^([-•*]\s+|\d+\.\s+)/.test(line))
            .map(line => line.replace(/^([-•*]\s+|\d+\.\s+)/, '').trim())
            .filter(Boolean);
    }

    return (
        <Container maxWidth="xl" sx={{ mb: 10 }}>
            <Box sx={{ background: '#0c1865', borderRadius: 8, overflow: 'hidden', color: '#fff' }}>
                <Grid container>
                    {/* Image Section */}
                    <Grid size={{ xs: 12, lg: 6 }} sx={{ position: 'relative', minHeight: 400 }}>
                        <Image
                            src={stats.materialBasePhoto}
                            alt="Material Base"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                        <Box sx={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to right, transparent, #0c1865)',
                            display: { xs: 'none', lg: 'block' }
                        }} />
                    </Grid>

                    {/* Text Content Section */}
                    <Grid size={{ xs: 12, lg: 6 }} sx={{ p: { xs: 4, md: 8 } }}>
                        <Typography sx={{
                            fontFamily: 'Montserrat Alternates, sans-serif',
                            fontWeight: 900,
                            fontSize: { xs: 28, md: 42 },
                            mb: 2
                        }}>
                            {t("facilitiesTitle")}
                        </Typography>
                        <Typography sx={{ color: alpha('#fff', 0.7), mb: 5, fontSize: 18 }}>
                            {t("threeFloorBuildingTitle")}
                        </Typography>

                        <Grid container spacing={3}>
                            {items.map((htmlContent, idx) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                        <CheckCircleIcon sx={{ color: '#f97316', mt: 0.3, flexShrink: 0 }} />
                                        
                                        {/* RICH TEXT IMPLEMENTATION */}
                                        <RichText 
                                            html={htmlContent} 
                                            sx={{ 
                                                fontWeight: 500, 
                                                lineHeight: 1.4,
                                                fontSize: 16,
                                                // Ensure internal paragraphs don't add extra margins
                                                '& p': { m: 0 } 
                                            }} 
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

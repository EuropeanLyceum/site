'use client';
import { Box, Typography, Grid, alpha } from '@mui/material';
import Image from 'next/image';

export default function Teachers({ items, locale, t }) {
    if (!items?.length) return null;

    return (
        <Box sx={{ mb: 5 }}>
            <Box sx={{ background: '#0c1865', borderRadius: 8, p: { xs: 4, md: 8 } }}>
                <Typography variant="h2" sx={{ ...titleSx, textAlign: 'center', mb: 8 }}>
                    {t('teachersTitle')}
                </Typography>

                {items.sort((a, b) => a.order - b.order).map((teacher) => {
                    const isEn = locale === 'en';
                    return (
                        <Box key={teacher.id} sx={{
                            mb: 6, p: 4, background: alpha('#fff', 0.03),
                            borderRadius: 6, border: `1px solid ${alpha('#fff', 0.05)}`
                        }}>
                            <Grid container spacing={4} alignItems="center">
                                <Grid item size={{ xs: 12, md: 4 }}>
                                    <Box sx={{ position: 'relative', height: 400, borderRadius: 4, overflow: 'hidden' }}>
                                        <Image src={teacher.photo || ''} fill style={{ objectFit: 'cover' }} alt="Teacher" />
                                    </Box>
                                </Grid>
                                <Grid item size={{ xs: 12, md: 8 }}>
                                    <Typography variant="h4" sx={{ color: '#f97316', fontWeight: 800, mb: 1, fontFamily: "'Montserrat Alternates', sans-serif" }}>
                                        {isEn ? teacher.fullNameEn : teacher.fullNameUk}
                                    </Typography>
                                    <Typography sx={{ color: alpha('#fff', 0.5), fontWeight: 700, mb: 3, textTransform: 'uppercase', fontSize: 14 }}>
                                        {isEn ? teacher.specializationEn : teacher.specializationUk}
                                    </Typography>
                                    <Typography sx={{ ...paragraphSx, whiteSpace: 'pre-line' }}>
                                        {isEn ? teacher.descriptionEn : teacher.descriptionUk}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

const titleSx = { fontFamily: "'Montserrat Alternates', sans-serif", fontSize: { xs: 28, md: 42 }, fontWeight: 800, color: '#fff' };
const paragraphSx = { fontSize: { xs: 15, md: 17 }, lineHeight: 1.7, color: alpha('#fff', 0.8), textAlign: 'justify' };
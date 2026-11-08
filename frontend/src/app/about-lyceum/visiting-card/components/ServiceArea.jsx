'use client';
import { Box, Typography, Grid, Container, alpha } from "@mui/material";

export default function ServiceArea({ t, areas, locale }) {
    if (!areas || areas.length === 0) return null;

    return (
        <Container maxWidth="xl" sx={{ mb: 10 }}>
            <Box sx={{
                background: '#0c1865', borderRadius: 8, p: { xs: 4, md: 6 },
                boxShadow: '0 20px 50px rgba(12, 24, 101, 0.2)'
            }}>
                <Typography variant="h2" sx={{
                    fontFamily: 'Montserrat Alternates', fontWeight: 800,
                    color: '#fff', textAlign: 'center', mb: 5, fontSize: { xs: 28, md: 40 }
                }}>
                    {t('serviceAreaTitle')}
                </Typography>

                <Grid container spacing={2}>
                    {areas.map((area) => (
                        <Grid key={area.id} item size={{xs: 12, sm: 6, lg: 4}}>
                            <Box sx={{
                                background: alpha('#fff', 0.05), border: `1px solid ${alpha('#fff', 0.1)}`,
                                borderRadius: 4, p: 2, display: 'flex', alignItems: 'center', transition: '0.3s',
                                '&:hover': { background: '#f97316', transform: 'scale(1.02)' }
                            }}>
                                <Box sx={{ width: 8, height: 8, bgcolor: '#f97316', borderRadius: '50%', mr: 2, flexShrink: 0 }} />
                                <Typography sx={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>
                                    {locale === 'en' ? (area.nameEn || area.nameUk) : area.nameUk}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}
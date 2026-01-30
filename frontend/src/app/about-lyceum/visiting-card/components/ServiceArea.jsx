'use client';
import { Box, Grid, Typography } from "@mui/material";

export default function ServiceArea({ t }) {
    return (
        <Box
            id="service-area"
            sx={{
                width: '100%',
                position: 'relative',
                mt: '40px',
            }}
        >
            <Typography
                component="h1"
                sx={{
                    fontFamily: '"Montserrat Alternates", sans-serif',
                    fontWeight: 700,
                    fontSize: '40px',
                    lineHeight: '100%',
                    textAlign: 'center',
                    color: '#182BA1',
                    mt: '45px',
                    mb: '30px',
                }}
            >
                {t('serviceAreaTitle')}
            </Typography>

            <Grid
                container
                spacing={3}
                sx={{
                    width: '100%',
                    background: 'rgba(24, 43, 161, 0.6)',
                    padding: '36px 64px',
                }}
            >
                {Array.from({ length: 9 }).map((_, i) => (
                    <Grid
                        key={i}
                        item
                        size={{ xs: 12, md: 6, lg: 4 }}
                        sx={{
                            background: '#F8F8F8',
                            borderRadius: '18px',
                            padding: '12px',
                            minHeight: '50px',
                        }}
                    >
                        <Typography
                            sx={{
                                color: '#000',
                                fontFamily: 'Montserrat, sans-serif',
                                fontSize: '16px',
                                fontWeight: 400,
                            }}
                        >
                            {t(`serviceAreaAddress${i + 1}`)}
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
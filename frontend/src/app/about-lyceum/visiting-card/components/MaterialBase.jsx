'use client';
import { Box, Grid, Typography, Container, alpha } from "@mui/material";
import Image from "next/image";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import materialDefault from "@/assets/photos/building/material_basis.jpg";

export default function MaterialBase({ t, stats, locale }) {
    if (!stats) return null;

    const materialBaseDescription = locale === 'en' ? stats.materialBaseDescriptionEn : stats.materialBaseDescriptionUk;
    // Розбиваємо текст по рядках, щоб створити список пунктів
    const items = materialBaseDescription ? materialBaseDescription.split('\n').filter(i => i.trim() !== "") : [];

    return (
        <Container maxWidth="xl" sx={{ mb: 10 }}>
            <Box sx={{ background: '#0c1865', borderRadius: 8, overflow: 'hidden', color: '#fff' }}>
                <Grid container>
                    <Grid item size={{xs: 12, lg: 6}} sx={{ position: 'relative', minHeight: 400 }}>
                        <Image src={stats.materialBasePhotoUrl || materialDefault} alt="Material Base" fill style={{ objectFit: 'cover' }} />
                        <Box sx={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to right, transparent, #0c1865)',
                            display: { xs: 'none', lg: 'block' }
                        }} />
                    </Grid>

                    <Grid item size={{xs: 12, lg: 6}} sx={{ p: { xs: 4, md: 8 } }}>
                        <Typography sx={{ fontFamily: 'Montserrat Alternates', fontWeight: 900, fontSize: { xs: 28, md: 42 }, mb: 2 }}>
                            {t("facilitiesTitle")}
                        </Typography>
                        <Typography sx={{ color: alpha('#fff', 0.7), mb: 5, fontSize: 18 }}>
                            {t("threeFloorBuildingTitle")}
                        </Typography>

                        <Grid container spacing={3}>
                            {items.map((text, idx) => (
                                <Grid item size={{xs: 12, sm: 6}} key={idx}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <CheckCircleIcon sx={{ color: '#f97316' }} />
                                        <Typography sx={{ fontWeight: 500 }}>{text}</Typography>
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
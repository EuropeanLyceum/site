'use client';

import { Box, Typography, Grid, alpha } from "@mui/material";
import Image from "next/image";
import founders from "@/assets/photos/history/founders.jpg";

export default function Founders({ t }) {
    return (
        <Box component="section" sx={{ mb: 10 }}>
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
                    borderRadius: 8,
                    p: { xs: 4, md: 6 },
                    boxShadow: '0 20px 50px rgba(12, 24, 101, 0.2)',
                    color: '#fff'
                }}
            >
                <Typography variant="h2" sx={titleSx}>{t("foundersTitle")}</Typography>

                <Grid container spacing={6} alignItems="center">
                    <Grid item size={{xs: 12, md: 5}}>
                        <Box sx={{
                            position: 'relative', height: { xs: 300, md: 450 },
                            borderRadius: 6, overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <Image src={founders} alt={t("foundersImageAlt")} fill style={{ objectFit: 'cover' }} />
                        </Box>
                    </Grid>
                    <Grid item size={{xs: 12, md: 7}}>
                        <Typography sx={paragraphSx}>{t("foundersDescription")}</Typography>
                        <Typography sx={paragraphSx}>{t("foundersDescription2")}</Typography>
                        <Typography sx={paragraphSx}>{t("foundersDescription3")}</Typography>
                        <Typography sx={{ ...paragraphSx, mb: 0 }}>{t("foundersDescription4")}</Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

const titleSx = {
    fontFamily: "'Montserrat Alternates', sans-serif",
    fontSize: { xs: 28, md: 42 },
    fontWeight: 800,
    mb: 4,
    color: '#fff'
};

const paragraphSx = {
    fontFamily: "'Montserrat Alternates', sans-serif",
    fontSize: { xs: 15, md: 17 },
    lineHeight: 1.8,
    color: alpha('#fff', 0.8),
    mb: 2,
    textAlign: 'justify'
};
'use client';

import { Box, Typography, Grid, alpha } from "@mui/material";
import Image from "next/image";
import development1 from "@/assets/photos/history/development1.jpg";
import development2 from "@/assets/photos/history/development2.jpg";
import development3 from "@/assets/photos/history/development3.jpg";

export default function Development({ t }) {
    const stages = [
        {
            img: development1,
            alt: "developmentImage1Alt",
            desc: "developmentDescription1",
            reverse: false
        },
        {
            img: development2,
            alt: "developmentImage2Alt",
            desc: "developmentDescription2",
            reverse: true
        },
        {
            img: development3,
            alt: "developmentImage3Alt",
            desc: "developmentDescription3",
            reverse: false,
            caption: "schoolBuildingCaption"
        }
    ];

    return (
        <Box component="section" sx={{ mb: 10 }}>
            <Box
                sx={{
                    background: 'linear-gradient(165deg, #0c1865 0%, #1a2a8a 100%)',
                    borderRadius: 8,
                    p: { xs: 3, md: 8 },
                    boxShadow: '0 20px 50px rgba(12, 24, 101, 0.2)',
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                {/* Декоративний фон */}
                <Box sx={{
                    position: 'absolute', top: 0, right: 0, width: '100%', height: '100%',
                    background: 'radial-gradient(circle at 100% 0%, rgba(249, 115, 22, 0.05) 0%, transparent 40%)',
                    pointerEvents: 'none'
                }} />

                {/* Title */}
                <Typography
                    component="h2"
                    sx={{
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        fontSize: { xs: 28, md: 42 },
                        fontWeight: 800,
                        color: "#fff",
                        textAlign: "center",
                        mb: 8,
                        position: 'relative'
                    }}
                >
                    {t("developmentStagesTitle")}
                </Typography>

                <Grid container spacing={8}>
                    {stages.map((stage, idx) => (
                        <Grid item key={idx} size={{xs: 12}}>
                            <Grid
                                container
                                spacing={{ xs: 4, md: 8 }}
                                alignItems="center"
                                direction={stage.reverse ? { xs: "column", md: "row-reverse" } : "row"}
                            >
                                {/* Фото */}
                                <Grid item size={{xs: 12, md: 5}}>
                                    <Box sx={{ position: 'relative' }}>
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                height: { xs: 250, md: 350 },
                                                borderRadius: 6,
                                                overflow: 'hidden',
                                                boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                                                border: `1px solid ${alpha('#fff', 0.1)}`
                                            }}
                                        >
                                            <Image
                                                fill
                                                src={stage.img}
                                                alt={t(stage.alt)}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </Box>

                                        {stage.caption && (
                                            <Typography
                                                sx={{
                                                    mt: 2,
                                                    fontSize: 13,
                                                    color: alpha("#fff", 0.6),
                                                    textAlign: "center",
                                                    fontStyle: "italic",
                                                    fontFamily: "'Montserrat Alternates', sans-serif",
                                                }}
                                            >
                                                {t(stage.caption)}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>

                                {/* Текст */}
                                <Grid item size={{xs: 12, md: 7}}>
                                    <Box sx={{ position: 'relative' }}>
                                        {/* Номер етапу на фоні */}
                                        <Typography sx={{
                                            position: 'absolute', top: -40,
                                            left: stage.reverse ? 'auto' : -20,
                                            right: stage.reverse ? -20 : 'auto',
                                            fontSize: 100, fontWeight: 900,
                                            color: alpha('#fff', 0.03), zIndex: 0,
                                            userSelect: 'none'
                                        }}>
                                            0{idx + 1}
                                        </Typography>

                                        <Typography sx={paragraphSx}>
                                            {t(stage.desc)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

const paragraphSx = {
    fontFamily: "'Montserrat Alternates', sans-serif",
    fontSize: { xs: 15, md: 17 },
    lineHeight: 1.8,
    color: alpha("#fff", 0.8),
    textAlign: "justify",
    position: 'relative',
    zIndex: 1
};
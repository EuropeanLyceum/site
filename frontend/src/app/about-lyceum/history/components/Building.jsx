'use client';

import { Box, Typography, Grid, alpha } from "@mui/material";
import Image from "next/image";
import schoolPhoto1 from "@/assets/photos/history/school_photo1.jpg";
import schoolPhoto2 from "@/assets/photos/history/school_photo2.jpg";
import schoolPhoto3 from "@/assets/photos/history/school_photo3.jpg";

export default function Building({ t }) {
    const blocks = [
        { img: schoolPhoto1, text: "schoolBuildingDescription1" },
        { img: schoolPhoto2, text: "schoolBuildingDescription2", reverse: true },
        { img: schoolPhoto3, text: "schoolBuildingDescription3" }
    ];

    return (
        <Box component="section" sx={{ mb: 10 }}>
            <Box sx={{ background: '#0c1865', borderRadius: 8, p: { xs: 3, md: 8 }, color: '#fff' }}>
                <Typography variant="h2" sx={{ ...titleSx, textAlign: 'center', mb: 8 }}>
                    {t("schoolBuildingTitle")}
                </Typography>

                {blocks.map((block, idx) => (
                    <Grid container spacing={6} key={idx} direction={block.reverse ? 'row-reverse' : 'row'} alignItems="center" sx={{ mb: idx !== 2 ? 8 : 0 }}>
                        <Grid item size={{xs: 12, md: 5}}>
                            <Box sx={{ position: 'relative', height: 300, borderRadius: 4, overflow: 'hidden' }}>
                                <Image src={block.img} fill style={{ objectFit: 'cover' }} alt="History" />
                            </Box>
                        </Grid>
                        <Grid item size={{xs: 12, md: 7}}>
                            <Typography sx={paragraphSx}>{t(block.text)}</Typography>
                        </Grid>
                    </Grid>
                ))}
            </Box>
        </Box>
    );
}

const titleSx = { fontFamily: "'Montserrat Alternates', sans-serif", fontSize: { xs: 28, md: 42 }, fontWeight: 800, color: '#fff' };
const paragraphSx = { fontSize: { xs: 15, md: 17 }, lineHeight: 1.8, color: alpha('#fff', 0.8), textAlign: 'justify' };
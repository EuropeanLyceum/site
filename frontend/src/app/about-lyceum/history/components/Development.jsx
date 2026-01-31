'use client';

import { Box, Typography, Grid } from "@mui/material";
import Image from "next/image";
import development1 from "@/assets/photos/history/development1.jpg";
import development2 from "@/assets/photos/history/development2.jpg";
import development3 from "@/assets/photos/history/development3.jpg";

export default function Development({ t }) {
    return (
        <Box component="section" sx={{ mb: "80px" }}>
            {/* Title */}
            <Typography
                component="h2"
                sx={{
                    fontFamily: "'Montserrat Alternates', sans-serif",
                    fontSize: { xs: 24, sm: 28, md: 36, lg: 42 },
                    fontWeight: 700,
                    color: "#182BA1",
                    textAlign: "center",
                    mb: { xs: 4, md: 6 },
                }}
            >
                {t("developmentStagesTitle")}
            </Typography>

            {/* Content */}
            <Box sx={{ width: { xs: "100%", md: "95%" }, mx: "auto" }}>
                <Box
                    sx={{
                        backgroundColor: "rgba(24, 43, 161, 0.5)",
                        borderRadius: "20px",
                        p: { xs: 2, sm: 3, md: 5 },
                    }}
                >
                    <Grid container spacing={4}>
                        {/* BLOCK 1 */}
                        <Grid item size={{xs: 12}}>
                            <Grid
                                container
                                spacing={3}
                                alignItems="flex-start"
                                direction={{ xs: "column", md: "row" }}
                            >
                                <Grid item size={{xs: 12, md: 5}}>
                                    <Box className="ImageContainerFull">
                                        <Image
                                            fill
                                            src={development1}
                                            alt={t("developmentImage1Alt")}
                                            className="ImageFull"
                                        />
                                    </Box>
                                </Grid>

                                <Grid item size={{xs: 12, md: 7}}>
                                    <Typography sx={paragraphSx}>
                                        {t("developmentDescription1")}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* BLOCK 2 */}
                        <Grid item size={{xs: 12}}>
                            <Grid
                                container
                                spacing={3}
                                alignItems="flex-start"
                                direction={{ xs: "column", md: "row-reverse" }}
                            >
                                <Grid item size={{xs: 12, md: 5}}>
                                    <Box className="ImageContainerFull">
                                        <Image
                                            fill
                                            src={development2}
                                            alt={t("developmentImage2Alt")}
                                            className="ImageFull"
                                        />
                                    </Box>
                                </Grid>

                                <Grid item size={{xs: 12, md: 7}}>
                                    <Typography sx={paragraphSx}>
                                        {t("developmentDescription2")}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* BLOCK 3 */}
                        <Grid item size={{xs: 12}}>
                            <Grid
                                container
                                spacing={3}
                                alignItems="flex-start"
                                direction={{ xs: "column", md: "row" }}
                            >
                                <Grid item size={{xs: 12, md: 5}}>
                                    <Box>
                                        <Box className="ImageContainerFull">
                                            <Image
                                                fill
                                                src={development3}
                                                alt={t("developmentImage3Alt")}
                                                className="ImageFull"
                                            />
                                        </Box>

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontSize: 14,
                                                color: "#fff",
                                                textAlign: "center",
                                                fontStyle: "italic",
                                            }}
                                        >
                                            {t("schoolBuildingCaption")}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item size={{xs: 12, md: 7}}>
                                    <Typography sx={paragraphSx}>
                                        {t("developmentDescription3")}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
}

const paragraphSx = {
    fontFamily: "'Montserrat Alternates', sans-serif",
    fontSize: { xs: 14, sm: 16, md: 18 },
    lineHeight: { xs: 1.5, md: 1.8 },
    color: "#fff",
    textAlign: "justify",
};

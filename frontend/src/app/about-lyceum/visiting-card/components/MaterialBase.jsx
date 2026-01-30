'use client';

import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";
import galochka from "@/assets/photos/icons/galochka-icon.png";
import materialBasis from "@/assets/photos/building/material_basis.jpg";

export default function MaterialBase({ t }) {
    return (
        <Box sx={{mb: 5}}>
            {/* Title */}
            <Typography
                component="h1"
                sx={{
                    fontFamily: "'Montserrat Alternates', sans-serif",
                    fontSize: { xs: 32, md: 45 },
                    fontWeight: 700,
                    color: "#182BA1",
                    textAlign: "center",
                    mt: "100px",
                    mb: "40px",
                }}
            >
                {t("facilitiesTitle")}
            </Typography>

            {/* Content */}
            <Grid
                container
                spacing={3}
                sx={{
                    width: "100%",
                    mx: "auto",
                    alignItems: "flex-start",
                    px: "10px"
                }}
            >
                {/* Image */}
                <Grid item size={{xs: 12, md: 12, lg: 6}}>
                    <Box className="ImageContainerFull">
                        <Image
                            src={materialBasis}
                            alt={t("facilitiesPhotoAlt")}
                            className="ImageFull"
                            fill
                        />
                    </Box>
                </Grid>

                {/* Info */}
                <Grid item size={{xs: 12, md: 12, lg: 6}}>
                    <Typography
                        component="h2"
                        sx={{
                            fontSize: 20,
                            color: "#000",
                            mb: "36px",
                        }}
                    >
                        {t("threeFloorBuildingTitle")}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        {[
                            "classrooms26Description",
                            "englishCabinets10Description",
                            "modernCabinetsDescription",
                            "resourceCenterDescription",
                            "hallsDescription",
                            "multimediaCenterDescription",
                        ].map((key) => (
                            <Box
                                key={key}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "32px",
                                }}
                            >
                                <Image
                                    src={galochka}
                                    alt={t("checkmarkAlt")}
                                    width={21}
                                    height={21}
                                />
                                <Typography>{t(key)}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
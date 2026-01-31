'use client';

import { Box, Typography } from "@mui/material";
import Image from "next/image";
import founders from "@/assets/photos/history/founders.jpg";

export default function Founders({ t }) {
    return (
        <Box component="section" sx={{ mt: "70px", mb: "80px" }}>
            {/* Title */}
            <Typography
                component="h2"
                sx={{
                    fontFamily: "'Montserrat Alternates', sans-serif",
                    fontSize: { xs: 24, sm: 28, md: 36, lg: 42 },
                    fontWeight: 700,
                    color: "#182BA1",
                    textAlign: "center",
                    mb: { xs: "25px", md: "50px" },
                    mt: "20px",
                }}
            >
                {t("foundersTitle")}
            </Typography>

            {/* Block */}
            <Box
                sx={{
                    width: { xs: "100%", md: "95%" },
                    mx: "auto",
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "rgba(24, 43, 161, 0.5)",
                        borderRadius: "20px",
                        p: { xs: "15px", sm: "20px", md: "40px" },
                    }}
                >
                    {/* First paragraph */}
                    <Typography sx={paragraphSx}>
                        {t("foundersDescription")}
                    </Typography>

                    {/* Image + text */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", lg: "45% 1fr" },
                            gap: { xs: "20px", lg: "30px" },
                            alignItems: "start",
                            mb: "20px",
                        }}
                    >
                        <Box
                            className={"ImageContainerOld"}
                        >
                            <Image
                                src={founders}
                                alt={t("foundersImageAlt")}
                                fill
                                className={"ImageOld"}
                            />
                        </Box>

                        <Box>
                            <Typography sx={paragraphSx}>
                                {t("foundersDescription2")}
                            </Typography>
                            <Typography sx={paragraphSx}>
                                {t("foundersDescription3")}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Last paragraph */}
                    <Typography sx={paragraphSx}>
                        {t("foundersDescription4")}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

const paragraphSx = {
    fontFamily: "'Montserrat Alternates', sans-serif",
    fontSize: { xs: 14, sm: 15, md: 18 },
    lineHeight: { xs: 1.4, md: 1.8 },
    color: "#fff",
    mb: "20px",
    textAlign: "justify",
};

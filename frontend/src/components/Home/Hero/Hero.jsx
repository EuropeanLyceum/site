"use client";

import { Box, Typography } from "@mui/material";
import Image from "next/image";
import logo from "@/assets/photos/icons/logo_without_background.ico.png";
import { useTranslation } from "@/contexts/TranslationProvider";

export default function Hero() {
    const { t } = useTranslation("home");

    return (
        <Box sx={{ position: "relative", overflow: "hidden" }}>
            {/* Background */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                }}
            >
                {/* Gradient */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(180deg, #182ba1 0%, #8e99dd 84%, #9ea8e5 100%)",
                    }}
                />

                {/* Logo background */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: { xs: "-80px", md: "-180px" },
                        width: "100%",
                        height: { xs: "100%", md: "133%" },
                        zIndex: 1,
                        filter: "blur(8px)",
                        opacity: 0.8,
                        display: { xs: "none", sm: "block" },
                    }}
                >
                    <Image
                        src={logo}
                        alt="Background Logo"
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </Box>
            </Box>

            {/* Content */}
            <Box
                sx={{
                    position: "relative",
                    zIndex: 2,
                    maxWidth: 1400,
                    mx: "auto",
                    px: { xs: 2, sm: 4, md: 9 },
                    pt: { xs: 4, md: 8 },
                    pb: { xs: 8, md: 18 },
                    color: "#fff",
                    mt: 8
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        pl: { xs: 0, md: 4 },
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            left: { xs: 0, md: -25 },
                            top: 40,
                            bottom: 40,
                            width: { xs: 2, md: 3 },
                            background: "rgba(255,255,255,0.9)",
                        },
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: 28, sm: 34, md: 42, lg: 80 },
                            fontWeight: 600,
                            mb: { xs: 2, md: 5 },
                            textAlign: { xs: "center", md: "left" },
                            textShadow: "0 2px 4px rgba(0,0,0,0.4)",
                            letterSpacing: "0.5px",
                            ml: 2
                        }}
                    >
                        {t("welcome")}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: { sm: 16, md: 18 },
                            lineHeight: 1.7,
                            fontFamily: "'Montserrat Alternates', sans-serif",
                            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                            whiteSpace: "pre-line",
                            textAlign: "justify",
                            ml: 2
                        }}
                    >
                        {t("welcomeDescription")}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
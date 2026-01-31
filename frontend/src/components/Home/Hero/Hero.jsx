'use client';
import { Box, Typography, Container, alpha } from "@mui/material";
import Image from "next/image";
import logo from "@/assets/photos/icons/logo_without_background.ico.png";

export default function Hero({ t }) {
    return (
        <Box sx={{
            position: "relative",
            minHeight: { xs: "auto", md: "80vh" },
            display: "flex",
            alignItems: "center",
            background: "linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)",
            overflow: "hidden",
            pt: { xs: 8, md: 5 },
            pb: { xs: 8, md: 8 }
        }}>

            <Box sx={{
                position: "absolute",
                top: { xs: "0%", md: "-10%" },
                right: { xs: "-20%", md: "-5%" },
                width: { xs: "80%", md: "50%" },
                height: "120%",
                zIndex: 1,
                opacity: 0.4,
                filter: "blur(8px)",
                userSelect: "none",
                pointerEvents: "none"
            }}>
                <Image
                    src={logo}
                    alt="Background Accent"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                />
            </Box>

            {/* Додаткове тепле світло для балансу */}
            <Box sx={{
                position: "absolute", bottom: "-20%", left: "-10%",
                width: "40%", height: "60%",
                background: "radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)",
                filter: "blur(80px)", zIndex: 1
            }} />

            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
                <Box sx={{
                    maxWidth: 800,
                    borderLeft: "6px solid #f97316",
                    pl: { xs: 3, md: 6 },
                    py: 2,
                    // Додаємо легку тінь тексту, щоб він "відірвався" від фонової букви
                    textShadow: "0 10px 30px rgba(0,0,0,0.5)"
                }}>
                    <Typography variant="h1" sx={{
                        fontSize: { xs: 36, sm: 48, md: 72 },
                        fontWeight: 900,
                        color: "#fff",
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        lineHeight: 1.1,
                        mb: 4,
                        textTransform: "uppercase",
                        letterSpacing: "-0.02em"
                    }}>
                        {t("welcome")}
                    </Typography>

                    <Typography sx={{
                        fontSize: { xs: 16, md: 20 },
                        color: alpha("#fff", 0.9),
                        lineHeight: 1.8,
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        textAlign: "justify",
                        maxWidth: 700
                    }}>
                        {t("welcomeDescription")}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
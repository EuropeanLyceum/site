'use client';
import { Box, Typography, Container, alpha } from "@mui/material";
import Image from "next/image";
import logo from "@/assets/photos/icons/logo_without_background.ico.png";

export default function Hero({ t, locale, data }) {
    const isEn = locale === 'en';

    // Мапінг полів з Prisma моделі PageSection
    const title = isEn ? (data?.titleEn || data?.titleUk) : data?.titleUk;
    const description = isEn ? (data?.contentEn || data?.contentUk) : data?.contentUk;
    const bgImage = data?.imagePhoto || logo;

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
            {/* Фонове лого */}
            <Box sx={{
                position: "absolute",
                top: "-10%", right: "-5%",
                width: { xs: "80%", md: "50%" },
                height: "120%",
                zIndex: 1,
                opacity: 0.15, // Зменшив непрозорість для кращої читабельності
                filter: "blur(5px)",
                userSelect: "none",
                pointerEvents: "none"
            }}>
                <Image
                    src={bgImage}
                    alt="Background Accent"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                />
            </Box>

            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
                <Box sx={{
                    maxWidth: 850,
                    borderLeft: "6px solid #f97316",
                    pl: { xs: 3, md: 6 },
                    py: 2
                }}>
                    <Typography variant="h1" sx={{
                        fontSize: { xs: 34, sm: 48, md: 68 },
                        fontWeight: 900,
                        color: "#fff",
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        lineHeight: 1.1,
                        mb: 3,
                        textTransform: "uppercase"
                    }}>
                        {title || t("heroDefaultTitle")}
                    </Typography>

                    <Typography sx={{
                        fontSize: { xs: 16, md: 19 },
                        color: alpha("#fff", 0.85),
                        lineHeight: 1.7,
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        textAlign: "justify"
                    }}>
                        {description || t("heroDefaultDesc")}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
import { Box, Typography } from "@mui/material";
import FunctionCard from "./FunctionCard";
import virtualImg from "@/assets/photos/home/virtual.jpg";
import testImage from "@/assets/photos/home/test.jpg";
import faqImg from "@/assets/photos/home/FAQ.jpg";
import { useTranslation } from "@/contexts/TranslationProvider";

export default function UsefulFunctions() {
    const { t } = useTranslation("home");

    return (
        <Box
            sx={{
                py: 5,
                maxWidth: 1172,
                mx: "auto",
                px: 2,
            }}
        >
            <Typography
                sx={{
                    fontFamily: "'Montserrat Alternates', sans-serif",
                    fontSize: 34,
                    fontWeight: 700,
                    textAlign: "center",
                    mb: 3,
                }}
            >
                {t("usefulFunctions")}
            </Typography>

            <Typography
                sx={{
                    fontFamily: "'Montserrat Alternates', sans-serif",
                    fontSize: 18,
                    color: "#4B555C",
                    textAlign: "center",
                    mb: 5,
                }}
            >
                {t("recommendTry")}
            </Typography>

            {/* Cards */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                }}
            >
                {/* Wide card */}
                <FunctionCard
                    href="/features/virtual-tour"
                    image={virtualImg}
                    title={t("virtualTour")}
                    wide
                />

                {/* Bottom row */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 5,
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <FunctionCard
                        href="/features/profile-tests"
                        image={testImage}
                        title={t("profileTests")}
                    />

                    <FunctionCard
                        image={faqImg}
                        title={t("faq")}
                        onClick={() => {
                            const el = document.getElementById("faq-section");
                            if (el) {
                                window.scrollTo({
                                    top: el.offsetTop,
                                    behavior: "smooth",
                                });
                            }
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
}
import { Box, Typography } from "@mui/material";
import FunctionCard from "./FunctionCard";
import virtualImg from "@/assets/photos/home/virtual.jpg";
import testImage from "@/assets/photos/home/test.jpg";
import faqImg from "@/assets/photos/home/FAQ.jpg";
import { useTranslation } from "@/contexts/TranslationProvider";

export default function UsefulFunctions() {
    const { t } = useTranslation("home");

    return (
        <Box className="useful-functions">
            <Typography variant="h2" className="section-title">
                {t("usefulFunctions")}
            </Typography>

            <Typography className="section-subtitle" sx={{pb: "15px"}}>
                {t("recommendTry")}
            </Typography>

            <Box className="cards-container">
                <FunctionCard
                    href="/features/virtual-tour"
                    image={virtualImg}
                    title={t("virtualTour")}
                    wide
                />

                <Box className="cards-row">
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
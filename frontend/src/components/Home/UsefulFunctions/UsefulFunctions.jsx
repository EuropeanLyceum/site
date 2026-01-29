import { Box, Typography } from "@mui/material";
import FunctionCard from "./FunctionCard";
import virtualImg from "@/assets/photos/virtual.jpg";
import testImage from "@/assets/photos/test.jpg";
import faqImg from "@/assets/photos/FAQ.jpg";
import { useTranslation } from "@/contexts/TranslationProvider";

export default function UsefulFunctions() {
    const { t } = useTranslation();

    return (
        <Box className="useful-functions">
            <Typography variant="h2" className="section-title">
                {t("usefulFunctions")}
            </Typography>

            <Typography className="section-subtitle" sx={{p: "5px"}}>
                {t("recommendTry")}
            </Typography>

            <Box className="cards-container">
                <FunctionCard
                    href="/virtual-tour"
                    image={virtualImg}
                    title={t("virtualTour")}
                    wide
                />

                <Box className="cards-row">
                    <FunctionCard
                        href="/profile-tests"
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
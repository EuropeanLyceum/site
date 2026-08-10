'use client';
import { Box, Typography, Grid, Container } from "@mui/material";
import FunctionCard from "./FunctionCard";
import virtualImg from "@/assets/photos/home/virtual.jpg";
import testImage from "@/assets/photos/home/test.jpg";
import faqImg from "@/assets/photos/home/FAQ.jpg";
import meredianImg from "@/assets/photos/home/newspaper.png";

export default function UsefulFunctions({ t, linkToNewspaper }) {
    const handleFaqClick = (e) => {
        if (!document.getElementById("faq-section")) return;
        e.preventDefault();
        const el = document.getElementById("faq-section");
        const offset = el.offsetTop - 100;
        window.scrollTo({ top: offset, behavior: "smooth" });
    };

    return (
        <Box component="section" sx={{ width: '100%', py: { xs: 6, md: 10 } }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: 6 }}>
                    <Typography sx={{
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        fontSize: { xs: 28, md: 42 },
                        fontWeight: 900,
                        color: "#0c1865",
                        mb: 2,
                    }}>
                        {t("usefulFunctions")}
                    </Typography>

                    <Typography sx={{
                        fontFamily: "'Montserrat Alternates', sans-serif",
                        fontSize: { xs: 16, md: 19 },
                        color: "#64748B",
                        maxWidth: 600,
                        mx: "auto"
                    }}>
                        {t("recommendTry")}
                    </Typography>
                </Box>

                <Grid container spacing={4} sx={{ width: '100%', m: 0 }}>
                    {/* Wide card */}
                    <Grid item size={{xs: 12}} sx={{ pl: '0 !important', pt: '0 !important' }}>
                        <FunctionCard
                            href="/features/virtual-tour"
                            image={virtualImg}
                            title={t("virtualTour")}
                        />
                    </Grid>

                    {/* Bottom row */}
                    <Grid item size={{xs: 12, md: 6, lg: 4}} sx={{ pl: { xs: '0 !important', md: '0 !important' } }}>
                        <FunctionCard
                            href="/features/profile-tests"
                            image={testImage}
                            title={t("profileTests")}
                        />
                    </Grid>

                    <Grid item size={{xs: 12, md: 6, lg: 4}} sx={{ pl: { xs: '0 !important', md: '0 !important' } }}>
                        <FunctionCard
                            href={linkToNewspaper}
                            image={meredianImg}
                            title={t("newspaper")}
                        />
                    </Grid>

                    <Grid item size={{xs: 12, md: 6, lg: 4}} sx={{ pl: { xs: '0 !important', md: '0 !important' } }}>
                        <FunctionCard
                            image={faqImg}
                            title={t("faq")}
                            onClick={handleFaqClick}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
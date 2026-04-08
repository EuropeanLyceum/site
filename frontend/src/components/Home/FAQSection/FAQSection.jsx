'use client';
import { Box, Grid, Accordion, AccordionSummary, AccordionDetails, Typography, Container, alpha, CircularProgress } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";

const FAQSection = ({ options = [], title, image, imageAlt, t }) => {
    return (
        <Box
            id="faq-section"
            sx={{
                py: { xs: 8, md: 12 },
                background: "#F1F5F9",
                overflow: "hidden", // Щоб крила не створювали горизонтальну прокрутку
                position: "relative"
            }}
        >
            {/* Використовуємо Container тільки для контролю ширини, але Grid всередині зробимо на всю ширину для фото */}
            <Container maxWidth="xl" sx={{ px: { xs: 2, md: 0 } }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item size={{ xs: 0, md: 5 }} sx={{ position: "relative" }}>
                        <Box sx={{
                            position: "relative",
                            height: { xs: 300, md: 600, lg: 750 },
                            width: { xs: "100%", md: "110%" },
                            display: "flex",
                            alignItems: "center"
                        }}>
                            <Image
                                src={image}
                                alt="Firebird"
                                fill
                                style={{
                                    objectFit: "contain",
                                    objectPosition: "left center", // Притискаємо саме зображення всередині до лівого краю
                                }}
                                priority
                            />
                        </Box>
                    </Grid>

                    <Grid item size={{ xs: 12, md: 7 }}>
                        <Typography variant="h2" sx={{
                            fontFamily: "Montserrat Alternates",
                            fontWeight: 900,
                            color: "#0c1865",
                            mb: 4,
                            fontSize: { xs: 30, md: 48 }
                        }}>
                            {title}
                        </Typography>

                        {options.length > 0 ? (
                            options.map((item) => (
                                <Accordion
                                    key={item.id}
                                    sx={{
                                        mb: 2,
                                        borderRadius: "16px !important",
                                        border: "1px solid #E2E8F0",
                                        boxShadow: "none",
                                        "&:hover": { borderColor: "#f97316" }
                                    }}
                                >
                                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#f97316" }} />}>
                                        <Typography sx={{ fontWeight: 700, color: "#0c1865" }}>
                                            {item.label}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography sx={{ color: "#475569", whiteSpace: 'pre-line' }}>
                                            {item.text}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        ) : (
                            <Box textAlign="center" py={4}>
                                <CircularProgress size={24} sx={{ color: "#f97316" }} />
                                <Typography sx={{ mt: 2, color: "#64748B" }}>{t("loading")}</Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default FAQSection;
'use client';
import { Box, Grid, Accordion, AccordionSummary, AccordionDetails, Typography, Container, alpha } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";

const FAQSection = ({ options = [], title, image }) => {
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
                <Grid container spacing={{ xs: 4, md: 0 }} columnSpacing={0} alignItems="center">

                    {/* Image column - Фенікс впритул до лівого краю */}
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

                    {/* FAQ column */}
                    <Grid item size={{ xs: 12, md: 6 }} sx={{ pr: { md: 4, lg: 10 } }}>
                        <Typography variant="h2" sx={{
                            fontFamily: "Montserrat Alternates",
                            fontWeight: 900,
                            color: "#0c1865",
                            mb: 5,
                            fontSize: { xs: 32, md: 42, lg: 54 },
                            textAlign: { xs: "center", md: "left" }
                        }}>
                            {title}
                        </Typography>

                        {options.map((item, index) => (
                            <Accordion key={index} sx={{
                                mb: 2,
                                borderRadius: "20px !important",
                                boxShadow: "0 10px 30px rgba(12, 43, 161, 0.05)",
                                border: "1px solid #E2E8F0",
                                background: "#fff",
                                "&:before": { display: "none" },
                                transition: "0.3s",
                                "&:hover": {
                                    borderColor: alpha("#f97316", 0.3),
                                    transform: "translateX(10px)" // Легкий зсув вправо при наведенні
                                }
                            }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#f97316" }} />}>
                                    <Typography sx={{
                                        fontWeight: 700,
                                        color: "#0c1865",
                                        py: 1,
                                        fontFamily: "Montserrat Alternates",
                                        fontSize: { xs: 15, md: 17 }
                                    }}>
                                        {item.label}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ borderTop: "1px solid #F1F5F9", p: 3 }}>
                                    <Typography sx={{
                                        color: "#64748B",
                                        lineHeight: 1.8,
                                        fontSize: 16
                                    }}>
                                        {item.text}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default FAQSection;
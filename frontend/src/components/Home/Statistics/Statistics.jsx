'use client';
import { Box, Typography, Grid, Container, alpha } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { animateNumber } from "./useAnimatedCounters";
import imagebg from "../../../assets/photos/geometric_ornament.svg";

export default function Statistics({ t, stats }) {
    const [counters, setCounters] = useState([0, 0, 0, 0]);
    const hasAnimated = useRef(false);

    // Мапінг даних з БД до плиток
    // 1. Учні, 2. Вчителі, 3. FLEX, 4. 200-бальники
    const finalValues = stats ? [
        stats.studentsCountReal || 0,
        stats.teachersCount || 0,
        stats.flexParticipantsCount || 0,
        stats.topScorersCount || 0
    ] : [0, 0, 0, 0];

    useEffect(() => {
        if (!stats || hasAnimated.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                finalValues.forEach((value, i) => {
                    animateNumber(0, value, 2000, (curr) => {
                        setCounters(prev => {
                            const n = [...prev];
                            n[i] = curr;
                            return n;
                        });
                    });
                });
                hasAnimated.current = true;
                observer.disconnect();
            }
        }, { threshold: 0.3 });

        const el = document.getElementById("stats");
        if (el) observer.observe(el);

        return () => observer.disconnect();
    }, [stats, finalValues]);

    const labels = [
        t("studentsCount"),
        t("teachersCount"),
        t("flexWinners"),
        t("examResults")
    ];

    return (
        <Box id="stats" sx={{
            position: "relative", py: 12,
            backgroundImage: `url(${imagebg.src})`,
            backgroundSize: "cover", backgroundAttachment: "fixed",
            minHeight: "400px" // Щоб не "стрибало" під час завантаження
        }}>
            <Box sx={{ position: "absolute", inset: 0, bgcolor: alpha("#0c1865", 0.9) }} />

            <Container maxWidth="lg" sx={{ position: "relative" }}>
                <Grid container spacing={3}>
                    {labels.map((label, i) => (
                        <Grid item size={{xs: 12, sm: 6, md: 3}} key={i}>
                            <Box sx={{
                                textAlign: "center", p: 4,
                                background: alpha("#fff", 0.05),
                                borderRadius: 6, border: `1px solid ${alpha("#fff", 0.1)}`,
                                backdropFilter: "blur(10px)",
                                transition: "0.3s",
                                '&:hover': { background: alpha("#fff", 0.1) }
                            }}>
                                <Typography sx={{
                                    fontSize: { xs: 40, md: 54 },
                                    fontWeight: 900,
                                    color: "#f97316",
                                    mb: 1
                                }}>
                                    {counters[i]}+
                                </Typography>
                                <Typography sx={{ color: "#fff", fontWeight: 500, opacity: 0.8, textTransform: 'uppercase', fontSize: 14, letterSpacing: 1 }}>
                                    {label}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

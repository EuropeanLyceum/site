'use client';
import { Box, Typography, Grid, Container, alpha } from "@mui/material";
import { useEffect, useState } from "react";
import { animateNumber } from "./useAnimatedCounters";
import imagebg from "../../../assets/photos/geometric_ornament.svg";

export default function Statistics({ t }) {
    const [counters, setCounters] = useState([0, 0, 0, 0]);
    const finalValues = [780, 60, 46, 6];

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                finalValues.forEach((value, i) => {
                    animateNumber(0, value, 2000, (curr) => {
                        setCounters(prev => {
                            const n = [...prev]; n[i] = curr; return n;
                        });
                    });
                });
                observer.disconnect();
            }
        }, { threshold: 0.3 });
        const el = document.getElementById("stats");
        if (el) observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <Box id="stats" sx={{
            position: "relative", py: 12,
            backgroundImage: `url(${imagebg.src})`,
            backgroundSize: "cover", backgroundAttachment: "fixed"
        }}>
            <Box sx={{ position: "absolute", inset: 0, bgcolor: alpha("#0c1865", 0.9) }} />

            <Container maxWidth="lg" sx={{ position: "relative" }}>
                <Grid container spacing={3}>
                    {[t("studentsCount"), t("teachersCount"), t("flexWinners"), t("examResults")].map((label, i) => (
                        <Grid item size={{xs: 12, sm: 6, md: 3}} key={i}>
                            <Box sx={{
                                textAlign: "center", p: 4,
                                background: alpha("#fff", 0.05),
                                borderRadius: 6, border: `1px solid ${alpha("#fff", 0.1)}`,
                                backdropFilter: "blur(10px)"
                            }}>
                                <Typography sx={{ fontSize: 54, fontWeight: 900, color: "#f97316", mb: 1 }}>
                                    {counters[i]}+
                                </Typography>
                                <Typography sx={{ color: "#fff", fontWeight: 500, opacity: 0.8 }}>
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
"use client";

import { Box, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { animateNumber } from "./useAnimatedCounters";
import { useTranslation } from "@/contexts/TranslationProvider";
import imagebg from "../../../assets/photos/geometric_ornament.svg";

export default function Statistics() {
    const { t } = useTranslation("home");
    const [counters, setCounters] = useState([0, 0, 0, 0]);

    const finalValues = [780, 60, 46, 6];
    const SECTION_ID = "statistics-section";

    useEffect(() => {
        if (!("IntersectionObserver" in window)) return;

        const target = document.getElementById(SECTION_ID);
        if (!target) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;

                finalValues.forEach((value, i) => {
                    animateNumber(0, value, 2000, (current) => {
                        setCounters((prev) => {
                            const next = [...prev];
                            next[i] = current;
                            return next;
                        });
                    });
                });

                observer.disconnect();
            },
            { threshold: 0.3 }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, []);

    return (
        <Box
            id={SECTION_ID}
            component="section"
            sx={{
                position: "relative",
                py: { xs: 8, md: 12 },
                backgroundImage: `url(${imagebg.src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* overlay */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(12, 24, 101, 0.85)",
                    backdropFilter: "blur(7px)",
                }}
            />

            <Grid
                container
                spacing={{ xs: 2, md: 4 }}
                justifyContent="center"
                maxWidth="1200px"
                mx="auto"
                position="relative"
            >
                {[
                    t("studentsCount"),
                    t("teachersCount"),
                    t("flexWinners"),
                    t("examResults"),
                ].map((label, i) => (
                    <Grid item xs={12} md={6} lg={3} key={i}>
                        <Box textAlign="center" sx={{maxWidth: "270px"}}>
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    color: "#fff",
                                    mb: 2,
                                    fontSize: 48,
                                }}
                            >
                                {counters[i].toLocaleString()}
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#D1D5DB",
                                    fontSize: 18 ,
                                    lineHeight: 1.4,
                                }}
                            >
                                {label}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
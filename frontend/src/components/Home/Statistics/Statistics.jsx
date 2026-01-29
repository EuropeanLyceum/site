import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { animateNumber } from "./useAnimatedCounters";
import { useTranslation } from "@/contexts/TranslationProvider";

export default function Statistics() {
    const { t } = useTranslation("home");
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const [counters, setCounters] = useState([0, 0, 0, 0]);

    const finalValues = [780, 60, 46, 6];

    useEffect(() => {
        if (!("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !visible) {
                    setVisible(true);

                    finalValues.forEach((value, i) => {
                        animateNumber(0, value, 2000, (current) => {
                            setCounters((prev) => {
                                const next = [...prev];
                                next[i] = current;
                                return next;
                            });
                        });
                    });
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [visible]);

    return (
        <Box ref={ref} className="statistics-section">
            <Box className="statistics-content">
                {[
                    t("studentsCount"),
                    t("teachersCount"),
                    t("flexWinners"),
                    t("examResults"),
                ].map((label, i) => (
                    <Box key={i} className="stat-item">
                        <Typography variant="h2" className="stat-number">
                            {counters[i].toLocaleString()}
                        </Typography>
                        <Typography className="stat-text">{label}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
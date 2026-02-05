'use client';
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import BusinessCard from "./components/BusinessCard";
import ServiceArea from "./components/ServiceArea";
import Clubs from "./components/Clubs";
import MaterialBase from "./components/MaterialBase";

export default function VisitingCardPage() {
    const { t, locale } = useTranslation("visiting");
    const [stats, setStats] = useState(null);
    const [clubs, setClubs] = useState([]);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        // 1. Загальна статистика
        fetch('/admin/api/admin/lyceumStats/1')
            .then(res => res.json())
            .then(data => { if (!data.error) setStats(data); })
            .catch(console.error);

        // 2. Гуртки (всі)
        fetch('/admin/api/admin/clubs')
            .then(res => res.json())
            .then(res => setClubs(res.data || []))
            .catch(console.error);

        // 3. Територія обслуговування (всі)
        fetch('/admin/api/admin/workingArea')
            .then(res => res.json())
            .then(res => setAreas(res.data || []))
            .catch(console.error);
    }, []);

    return (
        <Box lang={locale} sx={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)', minHeight: '100vh', pb: 10 }}>
            <BusinessCard t={t} stats={stats} locale={locale} />
            <ServiceArea t={t} areas={areas} locale={locale} />
            <Clubs t={t} clubs={clubs} locale={locale} />
            <MaterialBase t={t} stats={stats} locale={locale} />
        </Box>
    );
}
'use client';
import { Box } from "@mui/material";
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import BusinessCard from "./components/BusinessCard";
import ServiceArea from "./components/ServiceArea";
import Clubs from "./components/Clubs";
import MaterialBase from "./components/MaterialBase";

export default function VisitingCardPage() {
    const { t, locale } = useTranslation("visiting");

    return (
        <Box
            lang={locale}
            sx={{
                background: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)',
                minHeight: '100vh',
                pb: 10
            }}
        >
            <BusinessCard t={t}/>
            <ServiceArea t={t}/>
            <Clubs t={t}/>
            <MaterialBase t={t}/>
        </Box>
    );
}
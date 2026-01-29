'use client';
import {Box, } from "@mui/material"
import styles from '@/app/about-lyceum/visiting-card/visiting-card.module.css';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import BusinessCard from "@/app/about-lyceum/visiting-card/components/BusinessCard.jsx";
import ServiceArea from "@/app/about-lyceum/visiting-card/components/ServiceArea.jsx";
import Clubs from "@/app/about-lyceum/visiting-card/components/Clubs.jsx";
import MaterialBase from "@/app/about-lyceum/visiting-card/components/MaterialBase.jsx";

export default function VisitingCardPage() {
  const { t, locale } = useTranslation("visiting");

  return (
    <Box className={styles.visitingCardPage} lang={locale}>
        <BusinessCard t={t}/>
        <ServiceArea t={t}/>
        <Clubs t={t}/>
        <MaterialBase t={t}/>
    </Box>
  );
}
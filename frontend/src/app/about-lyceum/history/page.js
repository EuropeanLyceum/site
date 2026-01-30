'use client';
import styles from "@/app/about-lyceum/history/history.module.css";
import { useTranslation } from "@/contexts/TranslationProvider.jsx";
import {Box} from "@mui/material";
import Founders from "@/app/about-lyceum/history/components/Founders.jsx";
import Building from "@/app/about-lyceum/history/components/Building.jsx";
import Development from "@/app/about-lyceum/history/components/Development.jsx";
import Principals from "@/app/about-lyceum/history/components/Principals.jsx";
import Teachers from "@/app/about-lyceum/history/components/Teachers.jsx";

export default function HistoryPage() {
  const { t, locale } = useTranslation("history");

  return (
    <Box lang={locale} >
      <Box className={styles.historyContent}>
        <Founders t={t}/>
        <Building t={t}/>
        <Development t={t}/>
        <Principals t={t}/>
        <Teachers t={t}/>
      </Box>
    </Box>
  );
}
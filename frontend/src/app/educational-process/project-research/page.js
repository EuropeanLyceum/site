'use client';

import UnifiedNewsLayout from "@/components/shared/UnifiedNewsLayout";
import { Box, Typography } from "@mui/material";
import {useTranslation} from "@/contexts/TranslationProvider.jsx";

export default function ProjectResearchPage() {
  const { t } = useTranslation("projects");

  const events = [
    {
      id: 1,
      date: "22.01.2026",
      title: "День Соборності України: Ланцюг Єдності",
      titleEn: "Unity Day of Ukraine: Chain of Unity",
      text: "У нашому ліцеї пройшла урочиста лінійка та акція 'Коло єднання'. Учні об'єдналися, щоб вкотре нагадати: наша сила в єдності. Також відбувся конкурс патріотичного малюнка, де кожен висловив свою любов до Батьківщини через мистецтво.",
      textEn: "A solemn assembly and the 'Circle of Unity' action were held in our lyceum. Students united to remind everyone that our strength is in unity.",
      images: [
        "https://images.unsplash.com/photo-1566908829550-e6551b00979b?q=80&w=1200",
        "https://plus.unsplash.com/premium_photo-1661919588051-933390069324?q=80&w=1200"
      ]
    }
  ];

  return (
      <UnifiedNewsLayout translationKey="projects" data={events}>
        <Box sx={{
          background: '#fff',
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          fontFamily: "'Montserrat Alternates', sans-serif",
          color: '#1e2b8d'
        }}>
          <Typography sx={{ fontSize: '1.1rem', mb: 3, lineHeight: 1.7 }}>
            {t("projectResearchIntro")}
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {t("projectMethodTitle")}
          </Typography>
          <Typography sx={{ mb: 3 }}>
            {t("projectMethodDefinition")}
          </Typography>

          <Typography sx={{ fontWeight: 700, mb: 2 }}>
            {t("projectMethodAllows")}
          </Typography>

          <Box component="ul" sx={{ pl: 2, '& li': { mb: 1, lineHeight: 1.5 } }}>
            <li>{t("projectMethodBenefit1")}</li>
            <li>{t("projectMethodBenefit2")}</li>
            <li>{t("projectMethodBenefit3")}</li>
            <li>{t("projectMethodBenefit4")}</li>
            <li>{t("projectMethodBenefit5")}</li>
          </Box>
        </Box>
      </UnifiedNewsLayout>
  );
}
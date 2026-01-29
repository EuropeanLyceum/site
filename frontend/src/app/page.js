"use client";

import Hero from "@/components/Home/Hero/Hero";
import UsefulFunctions from "@/components/Home/UsefulFunctions/UsefulFunctions";
import Statistics from "@/components/Home/Statistics/Statistics";
import FAQSection from "@/components/Home/FAQSection/FAQSection";
import firebirdImg from "@/assets/photos/firebird/firebird.png";
import { useTranslation } from "@/contexts/TranslationProvider";

export default function MainPage() {
  const { t } = useTranslation();

  return (
      <>
        <Hero />
        <UsefulFunctions />
        <Statistics />

        <FAQSection
            options={t("faqData")}
            title={t("faqTitle")}
            image={firebirdImg}
            imageAlt="Жар-птиця"
        />
      </>
  );
}
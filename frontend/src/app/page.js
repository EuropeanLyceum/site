'use client';
import { useState, useEffect } from "react";
import Hero from "@/components/Home/Hero/Hero";
import UsefulFunctions from "@/components/Home/UsefulFunctions/UsefulFunctions";
import Statistics from "@/components/Home/Statistics/Statistics";
import FAQSection from "@/components/Home/FAQSection/FAQSection";
import firebirdImg from "@/assets/photos/firebird/firebird.png";
import { useTranslation } from "@/contexts/TranslationProvider";

export default function MainPage() {
    const { t, locale } = useTranslation("home");
    const [faqs, setFaqs] = useState([]);
    const [heroData, setHeroData] = useState(null);
    const [stats, setStats] = useState(null);
    const [link, setLink] = useState(null);

    useEffect(() => {
        const isEn = locale === "en";

        // 1. FAQ (Завантаження списку)
        fetch('/admin/api/admin/faq')
            .then(res => res.json())
            .then(response => {
                const rawItems = response.data || [];
                const formatted = rawItems.map(item => ({
                    label: (isEn && item.questionEn) ? item.questionEn : item.questionUk,
                    text: (isEn && item.answerEn) ? item.answerEn : item.answerUk,
                    id: item.id
                }));
                setFaqs(formatted);
            }).catch(err => console.error("FAQ Error:", err));

        // 2. Hero-контент (Фільтруємо за типом)
        fetch('/admin/api/admin/pageSection?type=HOME_HERO')
            .then(res => res.json())
            .then(response => {
                // Оскільки фільтр повертає масив через findMany
                if (response.data && response.data.length > 0) {
                    setHeroData(response.data[0]);
                }
            }).catch(err => console.error("Hero Error:", err));

        // 3. Статистика (Прямий запит по ID 1)
        fetch('/admin/api/admin/lyceumStats/1')
            .then(res => res.json())
            .then(data => {
                if (!data.error) setStats(data);
            }).catch(err => console.error("Stats Error:", err));

        fetch('/admin/api/admin/externalLink?pageKey=NEWSPAPER')
            .then(res => res.json())
            .then(data => {
                if (!data.error) setLink(data.url);
            }).catch(err => console.error("Link Error:", err));

    }, [locale]);

    return (
        <>
            <Hero t={t} locale={locale} data={heroData} />
            <UsefulFunctions t={t} linkToNewspaper={link}/>
            <Statistics t={t} stats={stats} />
            <FAQSection
                t={t}
                options={faqs}
                title={t("faqTitle")}
                image={firebirdImg}
                imageAlt="Жар-птиця"
            />
        </>
    );
}
'use client';

import UnifiedNewsLayout from "@/components/shared/UnifiedNewsLayout";

const newsData = [
    {
        id: 1,
        title: "Відкриття нового інноваційного хабу",
        titleEn: "Opening of the New Innovation Hub",
        text: "Сьогодні відбулося офіційне відкриття нашого технологічного простору. Хаб обладнаний сучасними робочими станціями, зонами для відпочинку та лекторієм. Ми віримо, що це стане місцем народження нових ідей та масштабних проектів для наших студентів та викладачів.",
        textEn: "Today marks the official opening of our technological space. The hub is equipped with modern workstations, lounge areas, and a lecture hall.",
        images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200",
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200",
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200"
        ],
        imagePosition: "center"
    },
    {
        id: 2,
        title: "Перемога наших студентів на міжнародному хакатоні",
        titleEn: "Students Win International Hackathon",
        text: "Команда нашого закладу виборола перше місце серед 50 команд з усього світу. Їхній проект з автоматизації енергозбереження вразив журі своєю простотою та ефективністю. Пишаємося нашими талантами та бажаємо нових звершень!",
        textEn: "Our team took first place among 50 teams from all over the world with their energy-saving automation project.",
        images: [
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200"
        ],
        imagePosition: "top"
    },
    {
        id: 3,
        title: "Оновлення освітніх програм: Курс на Digital",
        titleEn: "Educational Program Updates: Focus on Digital",
        text: "Ми раді повідомити про впровадження нових дисциплін: Artificial Intelligence, Blockchain та Advanced Cybersecurity. Програми розроблені спільно з лідерами ІТ-ринку, щоб забезпечити нашим випускникам найкращі кар'єрні можливості. Реєстрація на курси вже відкрита.",
        textEn: "We are excited to announce new disciplines: AI, Blockchain, and Advanced Cybersecurity.",
        images: [
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200"
        ],
        imagePosition: "center"
    }
];



export default function SportLifePage() {
    return <UnifiedNewsLayout translationKey="news" data={newsData} />;
}
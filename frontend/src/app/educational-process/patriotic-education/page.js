import UnifiedNewsLayout from "@/components/shared/UnifiedNewsLayout";

const patrioticEducation = [
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

export default function PatrioticEducationPage() {
  return <UnifiedNewsLayout translationKey="patrioticEducation" data={patrioticEducation} />;
}
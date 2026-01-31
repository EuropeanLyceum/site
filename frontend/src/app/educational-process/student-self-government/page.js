import UnifiedNewsLayout from "@/components/shared/UnifiedNewsLayout";

const govData = [
  {
    id: 1,
    date: "25.01.2026",
    title: "Вибори президента ліцею",
    titleEn: "Lyceum President Elections",
    text: "Сьогодні відбулося таємне голосування...",
    textEn: "Secret balloting took place today...",
    images: ["https://images.unsplash.com/photo-1540910419892-f0c73255297e?q=80&w=1200"]
  }
];

export default function StudentGovernmentPage() {
  return <UnifiedNewsLayout translationKey="government" data={govData} />;
}
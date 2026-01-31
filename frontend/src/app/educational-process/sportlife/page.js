import UnifiedNewsLayout from "@/components/shared/UnifiedNewsLayout";

const sportLife = [
  {
    id: 1,
    date: "28.01.2026",
    title: "Турнір з футзалу серед старшокласників",
    titleEn: "Futsal Tournament Among High School Students",
    text: "Спорт — це життя! У запеклій боротьбі команда 10-А класу виборола кубок ліцею. Дякуємо всім учасникам за волю до перемоги та неймовірні емоції на полі. Наступний етап — товариський матч з викладачами.",
    textEn: "In a fierce struggle, the team of the 10-A class won the lyceum cup. Thanks to all participants for the will to win.",
    images: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200",
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200"
    ]
  }
];

export default function SportLifePage() {
  return <UnifiedNewsLayout translationKey="sportLife" data={sportLife} />;
}
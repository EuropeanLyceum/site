import UnifiedNewsLayout from "@/components/shared/UnifiedNewsLayout";

const clubsStudios = [
  {
    id: 1,
    date: "15.02.2026",
    title: "Студія робототехніки: перші кроки в AI",
    titleEn: "Robotics Studio: First Steps into AI",
    text: "Наші ліцеїсти почали опановувати створення автономних дронів. На заняттях ми використовуємо сучасні плати Arduino та датчики руху. Кожен учень має змогу власноруч зібрати свого першого робота та запрограмувати його на виконання базових завдань.",
    textEn: "Our students started mastering the creation of autonomous drones. We use Arduino boards and motion sensors in class.",
    images: [
      "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?q=80&w=1200",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200"
    ]
  },
  {
    id: 2,
    date: "10.02.2026",
    title: "Театральна майстерня: прем'єра сезону",
    titleEn: "Theater Workshop: Season Premiere",
    text: "Відбулася відкрита репетиція вистави за мотивами творів сучасних українських авторів. Юні актори вразили глядачів своєю щирістю та майстерністю перевтілення. Запрошуємо всіх на офіційну прем'єру наступного місяця!",
    textEn: "An open rehearsal of a play based on the works of modern Ukrainian authors took place.",
    images: [
      "https://images.unsplash.com/photo-1503095396549-807a8bc3667c?q=80&w=1200"
    ]
  }
];

export default function ClubsStudiosPage() {
  return <UnifiedNewsLayout translationKey="clubsStudios" data={clubsStudios} />;
}
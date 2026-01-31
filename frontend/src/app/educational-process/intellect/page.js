import UnifiedNewsLayout from "@/components/shared/UnifiedNewsLayout";

const intellect = [
  {
    id: 1,
    date: "05.02.2026",
    title: "Олімпіадний марафон: наші переможці",
    titleEn: "Olympiad Marathon: Our Winners",
    text: "За результатами міського етапу всеукраїнських олімпіад, наші учні вибороли 15 призових місць! Особлива гордість — перші місця з математики та англійської мови. Попереду обласний етап, готуємося до нових висот.",
    textEn: "According to the results of the city stage of the All-Ukrainian Olympiads, our students won 15 prizes!",
    images: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200",
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200"
    ]
  }
];

export default function IntellectPage() {
  return <UnifiedNewsLayout translationKey="intellect" data={intellect} />;
}
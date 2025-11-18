"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();

  const groupedLinks = [
    {
      title: "🏫 Про ліцей",
      links: [
        { href: "/visiting-card", label: "Наша візитка" },
        { href: "/school-history", label: "Історія закладу" },
        { href: "/innovation-activity", label: "Інноваційна діяльність" },
      ],
    },
    {
      title: "📰 Новини",
      links: [
        { href: "/news-management", label: "Управління новинами" },
      ],
    },
    {
      title: "👥 Педагогічний колектив",
      links: [
        { href: "/staff", label: "Вчителі" },
      ],
    },
    {
      title: "🏛️ Прозорість управління",
      links: [
        { href: "/regulatory-documents", label: "Нормативні документи" },
        { href: "/financial-reports", label: "Фінансова звітність" },
        { href: "/public-information", label: "Публічна інформація" },
      ],
    },
    {
      title: "🎓 Освітній процес",
      links: [
        { href: "/intellect-talent", label: "Інтелект та обдарованість" },
        { href: "/student-government", label: "Учнівське самоврядування" },
        { href: "/project-research", label: "Проєктно-дослідницька робота" },
        { href: "/patriotic-education", label: "Національно-патріотичне виховання" },
        { href: "/evaluation-criteria", label: "Критерії оцінювання" },
        { href: "/clubs-studios", label: "Клуби та студії" },
        { href: "/sport-life", label: "СпортLife" },
        { href: "/social-psychological-support", label: "Соціально-психологічна підтримка" },
        { href: "/anti-bullying", label: "Протидія булінгу" },
      ],
    },
    {
      title: "📚 Методична робота",
      links: [
        { href: "/help-teacher", label: "На допомогу вчителю" },
        { href: "/qualification-improvement", label: "Підвищення кваліфікації" },
        { href: "/teacher-certification", label: "Атестація педпрацівників" },
        { href: "/methodological-events", label: "Основні методичні заходи" },
      ],
    },
    {
      title: "ℹ️ Інформаційна сторінка",
      links: [
        { href: "/for-parents", label: "Батькам" },
        { href: "/for-students", label: "Учням" },
      ],
    },
    {
      title: "⚙️ Налаштування",
      links: [
        { href: "/change-password", label: "Зміна даних входу" },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-4 overflow-y-auto max-h-screen fixed left-0 top-0 h-full z-10">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      {groupedLinks.map((group) => (
        <div key={group.title} className="mb-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">{group.title}</h3>
          <ul className="space-y-1">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    "block px-2 py-1 rounded hover:bg-gray-100 text-sm",
                    pathname === link.href && "font-bold text-blue-600 bg-blue-50"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}

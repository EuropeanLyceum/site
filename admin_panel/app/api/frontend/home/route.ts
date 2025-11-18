import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Отримуємо дані для головної сторінки
    const homeData = {
      schoolName: "Ліцей \"Європейський\"",
      description: "Ліцей \"Європейський\" - це сучасний навчальний заклад, який надає якісну освіту та створює умови для розвитку талантів кожного учня. Наші вчителі - це досвідчені педагоги, які допомагають учням досягати успіхів у навчанні та житті.",
      sections: [
        {
          id: "news",
          title: "📰 Новини",
          description: "Останні новини та події нашого ліцею",
          link: "/news",
          color: "blue"
        },
        {
          id: "teachers",
          title: "👨‍🏫 Педагогічний колектив", 
          description: "Знайомство з нашими вчителями та адміністрацією",
          link: "/teachers",
          color: "green"
        },
        {
          id: "about",
          title: "🏫 Про ліцей",
          description: "Інформація про наш навчальний заклад",
          link: "/about",
          color: "purple"
        }
      ],
      adminPanelUrl: "/admin"
    };

    return NextResponse.json(homeData);
  } catch (error) {
    console.error('Помилка отримання даних головної сторінки:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}

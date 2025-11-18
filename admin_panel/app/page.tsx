import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Хедер */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-900">
              Ліцей "Європейський"
            </h1>
            <Link 
              href="/admin"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Адмін панель
            </Link>
          </div>
          <p className="text-xl text-gray-600 mt-2">
            Офіційний сайт
          </p>
        </div>
      </header>

      {/* Основний контент */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Новини */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📰 Новини</h2>
            <p className="text-gray-600 mb-6">
              Останні новини та події нашого ліцею
            </p>
            <Link 
              href="/news"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-block"
            >
              Переглянути новини
            </Link>
          </div>

          {/* Вчителі */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">👨‍🏫 Педагогічний колектив</h2>
            <p className="text-gray-600 mb-6">
              Знайомство з нашими вчителями та адміністрацією
            </p>
            <Link 
              href="/teachers"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition inline-block"
            >
              Переглянути вчителів
            </Link>
          </div>

          {/* Інформація про ліцей */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🏫 Про ліцей</h2>
            <p className="text-gray-600 mb-6">
              Інформація про наш навчальний заклад
            </p>
            <Link 
              href="/about"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition inline-block"
            >
              Дізнатися більше
            </Link>
          </div>

        </div>

        {/* Додаткова інформація */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Про наш ліцей
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed text-center max-w-4xl mx-auto">
            Ліцей "Європейський" - це сучасний навчальний заклад, який надає якісну освіту 
            та створює умови для розвитку талантів кожного учня. Наші вчителі - це 
            досвідчені педагоги, які допомагають учням досягати успіхів у навчанні та житті.
          </p>
        </div>
      </main>

      {/* Футер */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 Ліцей "Європейський". Всі права захищені.</p>
        </div>
      </footer>
    </div>
  );
}

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;
  if (!token) {
    redirect('/login');
  }
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🏠 Адмін Панель</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Ласкаво просимо до панелі адміністратора!
        </h2>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          У цій адмін панелі ви можете редагувати та оновлювати контент різних сторінок сайту ліцею "Європейський". 
          Використовуйте ліве меню для навігації по розділах.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-medium text-gray-800 mb-2">📝 Редагування контенту</h3>
            <p className="text-sm text-gray-600">
              Додавати, редагувати та видаляти тексти, заголовки, описи та іншу інформацію
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium text-gray-800 mb-2">🖼️ Управління фото</h3>
            <p className="text-sm text-gray-600">
              Завантажувати нові зображення, видаляти старі та організовувати галереї
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-medium text-gray-800 mb-2">🔗 Посилання та файли</h3>
            <p className="text-sm text-gray-600">
              Додавати корисні посилання, документи та інші матеріали
            </p>
          </div>
          
          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-medium text-gray-800 mb-2">📊 Структура сайту</h3>
            <p className="text-sm text-gray-600">
              Керувати розділами, категоріями та організацією інформації
            </p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Порада:</strong> Для початку роботи виберіть потрібний розділ у лівому меню. 
            Кожен розділ має свої інструменти для управління контентом.
          </p>
        </div>
      </div>
    </div>
  );
}

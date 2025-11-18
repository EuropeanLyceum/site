'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

type Teacher = {
  id: number;
  fullname: string;
  position: string;
  description: string;
  photoUrl?: string;
  category: string;
};

export default function PublicTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("всі");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch("/api/staff");
        const data = await res.json();
        setTeachers(data);
      } catch (error) {
        console.error("Помилка завантаження вчителів:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const categories = ["всі", "гуманітарні дисципліни", "точні науки", "адміністрація"];
  
  const filteredTeachers = selectedCategory === "всі" 
    ? teachers 
    : teachers.filter(teacher => teacher.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Завантаження...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Хедер */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Педагогічний колектив</h1>
            <Link 
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              На головну
            </Link>
          </div>
        </div>
      </header>

      {/* Основний контент */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Фільтр по категоріях */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Фільтр по категорії:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 bg-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {filteredTeachers.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              Вчителів не знайдено
            </h2>
            <p className="text-gray-500">
              В цій категорії поки немає вчителів.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {teacher.photoUrl && (
                  <img
                    src={teacher.photoUrl}
                    alt={teacher.fullname}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {teacher.fullname}
                  </h2>
                  <p className="text-blue-600 font-medium mb-2">{teacher.position}</p>
                  <p className="text-sm text-gray-500 mb-3">{teacher.category}</p>
                  <p className="text-gray-700 leading-relaxed">
                    {teacher.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}





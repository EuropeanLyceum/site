'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateStaffPage() {
  const [fullname, setFullname] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("гуманітарні дисципліни");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const categories = ["гуманітарні дисципліни", "точні науки", "адміністрація"];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname,
          position,
          description,
          category,
          photoUrl: photoUrl || null,
        }),
      });

      if (response.ok) {
        router.push("/staff");
      } else {
        const data = await response.json();
        setError(data.error || "Помилка при створенні вчителя");
      }
    } catch (error) {
      setError("Помилка мережі");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Додати вчителя</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Прізвище, ім'я та по батькові
          </label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Посада
          </label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Категорія
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Опис вчителя
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Фото вчителя (необов'язково)
          </label>
          <input
            type="file"
            onChange={handleFileSelect}
            accept="image/*"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          
          {/* Прев'ю фото */}
          {photoUrl && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Прев'ю фото:</h3>
              <div className="relative inline-block">
                <img
                  src={photoUrl}
                  alt="Прев'ю фото"
                  className="w-32 h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl("")}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            {isLoading ? "Створення..." : "Додати вчителя"}
          </button>
          
          <button 
            type="button"
            onClick={() => router.push("/staff")}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
          >
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
}












'use client';

import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Викликаємо API для виходу
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      // Перенаправляємо на логін
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Якщо API не працює, просто перенаправляємо
      window.location.href = '/login';
    }
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold">
        Вітаємо, Адміністратор
      </h1>
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Вийти
      </button>
    </header>
  );
}
  

'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function ClearSessionPage() {
  useEffect(() => {
    // Автоматично виходимо з системи при завантаженні сторінки
    signOut({ callbackUrl: '/login' });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Очищення сесії</h2>
        <p className="text-gray-600">Перенаправлення на сторінку входу...</p>
      </div>
    </div>
  );
}

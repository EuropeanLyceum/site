'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LinkItem = {
  id: number;
  title: string;
  url?: string;
  content?: string;
  year?: number;
  subject?: string;
  category: string;
};

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLinks = async () => {
      const res = await fetch('/admin/api/links');
      const data = await res.json();
      setLinks(data);
    };

    fetchLinks();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Посилання</h1>
        <button
          onClick={() => router.push('/links/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Додати посилання
        </button>
      </div>

      {links.length === 0 ? (
        <p>Посилань немає</p>
      ) : (
        <div className="space-y-4">
          {links.map(link => (
            <div key={link.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold">{link.title}</h2>
                <span className="text-sm text-gray-500">{link.category}</span>
              </div>
              {link.year && <p>📅 Рік: {link.year}</p>}
              {link.subject && <p>📘 Предмет: {link.subject}</p>}
              {link.url && (
                <a href={link.url} target="_blank" className="text-blue-600 hover:underline">
                  🔗 Перейти
                </a>
              )}
              {link.content && (
                <div
                    className="mt-2 text-gray-700 [&_img]:mt-2 [&_img]:rounded [&_img]:max-w-full"
                    dangerouslySetInnerHTML={{ __html: link.content }}
                />
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

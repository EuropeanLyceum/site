'use client';
import { useState, useCallback } from "react";
import UnifiedNewsLayout from "@/components/shared/UnifiedNewsLayout";

export default function SportLifePage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Функція для завантаження даних із серверною фільтрацією
  const fetchData = useCallback(async ({ search, page }) => {
    setLoading(true);
    try {
      const limit = 5;
      const query = new URLSearchParams({
        type: 'SPORT_LIFE', // Тип контенту з вашої бази
        limit: limit.toString(),
        page: page.toString(),
        search: search || ''
      });

      const res = await fetch(`/admin/api/admin/content?${query}`);
      const json = await res.json();

      // Мапимо дані під уніфікований формат карток
      const formatted = (json.data || []).map(item => ({
        id: item.id,
        title: item.titleUk,
        titleEn: item.titleEn,
        text: item.textUk,
        textEn: item.textEn,
        images: item.photoGallery || [],
        date: new Date(item.publicationDate || item.createdAt).toLocaleDateString('uk-UA')
      }));

      setData(formatted);
      setTotal(json.meta?.total || 0);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
      <UnifiedNewsLayout
          translationKey="sportLife"
          data={data}
          totalCount={total}
          isLoading={loading}
          onParamsChange={fetchData} // Передаємо функцію для обробки пошуку та сторінок
      />
  );
}
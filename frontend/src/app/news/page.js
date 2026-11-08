'use client';
import { useState, useCallback } from "react";
import UnifiedNewsLayout from "@/components/shared/UnifiedNewsLayout";

export default function DynamicNewsPage() {
    const [news, setNews] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNews = useCallback(async ({ search, page }) => {
        setLoading(true);
        try {
            // Формуємо URL з параметрами для сервера
            const limit = 5;
            const query = new URLSearchParams({
                type: 'NEWS',
                limit: limit.toString(),
                page: page.toString(),
                search: search || ''
            });

            const res = await fetch(`/admin/api/admin/content?${query}`);
            const json = await res.json();

            const formattedData = (json.data || []).map(item => ({
                id: item.id,
                title: item.titleUk,
                titleEn: item.titleEn,
                text: item.textUk,
                textEn: item.textEn,
                images: item.photoGallery || [],
                date: new Date(item.publicationDate || item.createdAt).toLocaleDateString('uk-UA')
            }));

            setNews(formattedData);
            setTotal(json.meta?.total || 0);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <UnifiedNewsLayout
            translationKey="news"
            data={news}
            totalCount={total}
            isLoading={loading}
            onParamsChange={fetchNews} // Передаємо функцію завантаження в лейаут
        />
    );
}
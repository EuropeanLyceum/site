'use client';
import { useState, useEffect } from "react";
import UnifiedNewsLayout from "@/components/shared/UnifiedNewsLayout";

export default function DynamicNewsPage() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/admin/api/admin/content?type=NEWS');
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
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return <UnifiedNewsLayout translationKey="news" data={news} isLoading={loading} />;
}
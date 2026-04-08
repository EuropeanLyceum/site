'use client';
import { useState, useEffect } from "react";
import UnifiedNewsLayout from "@/components/shared/UnifiedNewsLayout";

export default function ClubsStudiosPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/admin/api/admin/content?type=CLUBS_STUDIOS');
        const json = await res.json();
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
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return <UnifiedNewsLayout translationKey="clubsStudios" data={data} isLoading={loading} />;
}
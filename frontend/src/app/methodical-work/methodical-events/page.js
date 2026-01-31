'use client';

import { useState, useEffect } from 'react';
import UnifiedNewsLayout from "@/components/shared/UnifiedNewsLayout";

export default function MethodicalEventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/methodological-events')
        .then(res => res.json())
        .then(data => {
          const formatted = data.map(item => ({
            id: item.id,
            title: item.heading,
            titleEn: item.headingEn,
            text: item.description,
            textEn: item.descriptionEn,
            images: Array.isArray(item.photoUrls) ? item.photoUrls : [],
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "2026"
          }));
          setEvents(formatted);
        })
        .finally(() => setIsLoading(false));
  }, []);

  return (
      <UnifiedNewsLayout
          translationKey="meth"
          data={events}
          isLoading={isLoading}
      />
  );
}
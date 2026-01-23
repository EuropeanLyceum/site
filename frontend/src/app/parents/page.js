'use client';
import { useState, useEffect } from 'react';
import styles from '@/styles/parents.module.css';
import Image from 'next/image';
import { useTranslation } from '@/contexts/TranslationProvider';
import { apiUrl, assetUrl } from '@/utils/api';

export default function ParentsPage() {
    const { t, locale } = useTranslation();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Функція для отримання локалізованого контенту
    const getLocalizedContent = (item) => {
        if (locale === 'en') {
            return {
                heading: item.headingEn || item.heading,
                content: item.contentEn || item.content
            };
        }
        return {
            heading: item.heading,
            content: item.content
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(' Завантаження даних для сторінки "Батькам"...');
                const response = await fetch('/api/for-parents');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                console.log('📊 Отримано даних:', result.length);
                setData(result);
            } catch (error) {
                console.error('❌ Помилка завантаження даних:', error);
                setError('Помилка завантаження даних');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [locale]); // Додаємо locale як залежність


    if (error) {
        return (
            <div className={styles.parentsPage} lang={locale}>
                <div className={styles.intellectContent}>
                    <div className={styles.warningMessage}>
                        <p>{t("errorLoadingParents") || "Помилка завантаження даних"}: {error}</p>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className={styles.parentsPage} lang={locale}>
            <div className={styles.intellectContent}>
                
                {data.map((item, index) => {
                    const localized = getLocalizedContent(item);
                    
                    return (
                        <div key={item.id}>
                            {/* Заголовок та текст в одному контейнері */}
                            {(localized.heading || localized.content) && (
                                <div className={styles.warningMessage}>
                                    {/* Показуємо заголовок тільки якщо він не "Шановні батьки" */}
                                    {localized.heading && localized.heading !== "Шановні батьки" && localized.heading !== "Dear Parents" && (
                                        <h2>{localized.heading}</h2>
                                    )}
                                    {localized.content && (
                                        <p style={{ whiteSpace: 'pre-line' }}>
                                            {localized.content}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Посилання */}
                            {item.url && (
                                <div className={styles.warningMessage}>
                                    <p>
                                        <a 
                                            href={item.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={styles.link}
                                        >
                                            {item.url}
                                        </a>
                                    </p>
                                </div>
                            )}

                            {/* Фотографії */}
                            {Array.isArray(item.photoUrls) && item.photoUrls.length > 0 && (
                                <div>
                                    {item.photoUrls.map((photoUrl, photoIndex) => (
                                        <div key={photoIndex} className={styles.photo}>
                                            <Image 
                                                src={photoUrl.startsWith('http') ? photoUrl : photoUrl}
                                                alt={`фото ${photoIndex + 1} для батьків`}
                                                width={1800}
                                                height={1000}
                                                style={{ width: '100%', height: 'auto' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

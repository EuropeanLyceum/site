'use client';

import Image from "next/image";
import styles from "@/styles/intellect.module.css";
import { useEffect, useState } from "react";
import { useTranslation } from "@/contexts/TranslationProvider";

export default function IntellectPage() {
  const { t, locale } = useTranslation();
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [renderKey, setRenderKey] = useState(0);

  // Діагностика перекладу
  console.log('IntellectTalent - Current locale:', locale);
  console.log('IntellectTalent - Translation test:', t('intellectTalent'));

  // Відстеження змін мови
  useEffect(() => {
    console.log('IntellectTalent - Language changed to:', locale);
    setRenderKey(prev => prev + 1);
  }, [locale]);

  // Функція для отримання локалізованого контенту
  const getLocalizedContent = (item) => {
    if (locale === 'en') {
      return {
        heading: item.headingEn || item.heading, // fallback до української
        description: item.descriptionEn || item.description
      };
    }
    return {
      heading: item.heading,
      description: item.description
    };
  };

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      console.log(" --- start ---");
      
      // Прямий запит до API сервера
      const response = await fetch("http://localhost:3001/api/intellect-talent");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Events loaded:", data);

      // Оновлюємо стан з даними з API
      const mappedEvents = data.map((item) => ({
        id: item.id,
        heading: item.heading,
        description: item.description,
        headingEn: item.headingEn,
        descriptionEn: item.descriptionEn,
        photoUrls: item.photoUrls ? item.photoUrls.map((url) => 
          url.startsWith('http') ? url : `http://localhost:3001${url}`
        ) : [],
        imagePosition: item.imagePosition || 'center'
      }));
      
      setEvents(mappedEvents);
      return data;
    } catch (error) {
      console.error("Error loading events:", error);
      setEvents([]);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleReadMore = (id) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  const handleImageClick = (images, index) => {
    setCurrentImage(images[index]);
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const handleGalleryClose = () => {
    setGalleryOpen(false);
    setCurrentImage(null);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    const currentEvent = events.find((item) => item.photoUrls.includes(currentImage));
    if (currentEvent && currentImage) {
      const currentIndex = currentEvent.photoUrls.indexOf(currentImage);
      const prevIndex =
        (currentIndex - 1 + currentEvent.photoUrls.length) %
        currentEvent.photoUrls.length;
      setCurrentImage(currentEvent.photoUrls[prevIndex]);
      setCurrentImageIndex(prevIndex);
    }
  };

  const handleNextImage = () => {
    const currentEvent = events.find((item) => item.photoUrls.includes(currentImage));
    if (currentEvent && currentImage) {
      const currentIndex = currentEvent.photoUrls.indexOf(currentImage);
      const nextIndex = (currentIndex + 1) % currentEvent.photoUrls.length;
      setCurrentImage(currentEvent.photoUrls[nextIndex]);
      setCurrentImageIndex(nextIndex);
    }
  };

  // Функція для отримання стилю позиціонування фото
  const getImagePositionStyle = (position) => {
    switch (position) {
      case 'top':
        return { objectPosition: 'center top' };
      case 'bottom':
        return { objectPosition: 'center bottom' };
      case 'center':
      default:
        return { objectPosition: 'center center' };
    }
  };

  return (
    <div className={styles.intellectPage} lang={locale} key={`${locale}-${renderKey}`}>
      <div className={styles.intellectContent}>
        <h1 className={styles.intellectTitle}>{t("intellectTalent")}</h1>
        
        {(
          <div className={styles.eventsList}>
            {events.map((item) => {
              const localized = getLocalizedContent(item);
              
              return (
                <div
                  key={item.id}
                  className={`${styles.eventItem} ${expandedEvent === item.id ? styles.expanded : ""}`}
                >
                  <div className={styles.eventContent}>
                    <h3 className={styles.eventTitle}>{localized.heading}</h3>
                    <p
                      className={styles.eventText}
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      {localized.description}
                    </p>
                    <button
                      className={`${styles.readMoreBtn} ${expandedEvent === item.id ? styles.expanded : ""}`}
                      onClick={() => handleReadMore(item.id)}
                    >
                      {expandedEvent === item.id ? t("collapse") : t("readMore")}
                    </button>
                  </div>
                  {item.photoUrls.length > 0 && (
                    <div className={styles.eventImage}>
                      <Image
                        src={item.photoUrls[0]}
                        alt="Event image"
                        width={400}
                        height={300}
                        onClick={() => handleImageClick(item.photoUrls, 0)}
                        style={getImagePositionStyle(item.imagePosition)}
                      />
                      <div 
                        className={styles.eventImageOverlay}
                        onClick={() => handleImageClick(item.photoUrls, 0)}
                      >
                        <span className={styles.viewMoreText}>{t("viewMore")}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Gallery Modal */}
      {galleryOpen && (
        <div className={`${styles.galleryModal} ${galleryOpen ? styles.active : ""}`}>
          <div className={styles.galleryContent}>
            <Image
              src={currentImage}
              alt="Gallery image"
              width={1200}
              height={800}
            />
            <div className={styles.galleryNav}>
              <button className={styles.galleryPrev} onClick={handlePrevImage}>
                ❮
              </button>
              <button className={styles.galleryNext} onClick={handleNextImage}>
                ❯
              </button>
            </div>
            <button className={styles.galleryClose} onClick={handleGalleryClose}>
              ×
            </button>
            <div className={styles.galleryCounter}>
              {currentImageIndex + 1} /{" "}
              {events.find((item) => item.photoUrls.includes(currentImage))?.photoUrls.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
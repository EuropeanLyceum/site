'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/studentselfgovernment.module.css';
import Image from 'next/image';
import { useTranslation } from '@/contexts/TranslationProvider';

export default function StudentGovernmentPage() {
  const { t, locale } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvents, setExpandedEvents] = useState(new Set());
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  // Діагностика перекладу
  console.log('StudentGovernment - Current locale:', locale);
  console.log('StudentGovernment - Translation test:', t('studentGovernment'));

  // Відстеження змін мови
  useEffect(() => {
    console.log('StudentGovernment - Language changed to:', locale);
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

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/student-government');
      
      if (!response.ok) {
        throw new Error('Помилка завантаження даних');
      }
      
      const data = await response.json();
      console.log('Отримані дані:', data);
      
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
    } catch (error) {
      console.error('Помилка завантаження подій:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEventExpansion = (eventId) => {
    const newExpandedEvents = new Set(expandedEvents);
    if (newExpandedEvents.has(eventId)) {
      newExpandedEvents.delete(eventId);
    } else {
      newExpandedEvents.add(eventId);
    }
    setExpandedEvents(newExpandedEvents);
  };

  const handleImageClick = (images, index) => {
    setSelectedImages(images);
    setCurrentImageIndex(index);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
    setSelectedImages([]);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === selectedImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedImages.length - 1 : prev - 1
    );
  };

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
    <>
      <div className={styles.studentGovernmentPage} lang={locale} key={`${locale}-${renderKey}`}>
        <div className={styles.studentGovernmentContent}>
          <h1 className={styles.studentGovernmentTitle}>
            {t("studentGovernment") || "Учнівське самоврядування"}
          </h1>
          
          <div className={styles.eventsList}>
            {events.map((item) => {
              const isExpanded = expandedEvents.has(item.id);
              const localized = getLocalizedContent(item);
              
              return (
                <div 
                  key={item.id} 
                  className={`${styles.eventItem} ${isExpanded ? styles.expanded : ''}`}
                >
                  <div className={styles.eventContent}>
                    <h2 className={styles.eventTitle}>{localized.heading}</h2>
                    <p className={styles.eventText}>{localized.description}</p>
                    
                    <button
                      className={`${styles.readMoreBtn} ${isExpanded ? styles.expanded : ''}`}
                      onClick={() => toggleEventExpansion(item.id)}
                    >
                      {isExpanded ? t("collapse") : t("readMore")}
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
                      
                      {/* Overlay показується завжди, як у "Інтелект та обдарованість" */}
                      <div 
                        className={styles.eventImageOverlay}
                        onClick={() => handleImageClick(item.photoUrls, 0)}
                      >
                        <span className={styles.viewMoreText}>
                          {t("viewMore")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Галерея - рендериться поза основним контейнером, як у "Інтелект та обдарованість" */}
      {showGallery && (
        <div className={`${styles.galleryModal} ${styles.active}`}>
          <div className={styles.galleryContent}>
            <Image
              src={selectedImages[currentImageIndex]}
              alt="Gallery image"
              width={1200}
              height={800}
            />
            <div className={styles.galleryNav}>
              <button className={styles.galleryPrev} onClick={prevImage}>
                ❮
              </button>
              <button className={styles.galleryNext} onClick={nextImage}>
                ❯
              </button>
            </div>
            <button className={styles.galleryClose} onClick={closeGallery}>
              ×
            </button>
            <div className={styles.galleryCounter}>
              {currentImageIndex + 1} / {selectedImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
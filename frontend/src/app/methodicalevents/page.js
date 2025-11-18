'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/methodicalevents.module.css';
import { useTranslation } from '@/contexts/TranslationProvider';

export default function MethodicalEventsPage() {
  const { t, locale } = useTranslation();
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dynamicEvents, setDynamicEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Функція для отримання локалізованого контенту
  const getLocalizedContent = (item) => {
    if (locale === 'en') {
      return {
        heading: item.headingEn || item.heading,
        description: item.descriptionEn || item.description
      };
    }
    return {
      heading: item.heading,
      description: item.description
    };
  };

  // Завантаження динамічних подій з API
  useEffect(() => {
    const fetchDynamicEvents = async () => {
      try {
        console.log('🔄 Завантаження динамічних методичних заходів...');
        const response = await fetch('http://localhost:3001/api/methodological-events');
        if (response.ok) {
          const data = await response.json();
          console.log('📊 Отримано динамічних методичних заходів:', data.length);
          
          // Конвертуємо дані з API в формат, сумісний з нашим компонентом
          const formattedEvents = data.map(item => {
            const localized = getLocalizedContent(item);
            
            return {
              id: `dynamic-${item.id}`,
              title: localized.heading,
              text: localized.description,
              images: item.photoUrls ? item.photoUrls.map(url => 
                url.startsWith('http') ? url : `http://localhost:3001${url}`
              ) : [],
              imagePosition: item.imagePosition || 'center',
              isDynamic: true
            };
          });
          
          setDynamicEvents(formattedEvents);
        } else {
          console.error('❌ Помилка відповіді:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('❌ Помилка завантаження динамічних методичних заходів:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDynamicEvents();
  }, [locale]); // Додаємо locale як залежність

  // Використовуємо тільки динамічні події з адмінки
  const allEvents = dynamicEvents;

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
    const currentEvent = allEvents.find((item) => item.images.includes(currentImage));
    if (currentEvent) {
      const currentIndex = currentEvent.images.indexOf(currentImage);
      const prevIndex =
        (currentIndex - 1 + currentEvent.images.length) %
        currentEvent.images.length;
      setCurrentImage(currentEvent.images[prevIndex]);
      setCurrentImageIndex(prevIndex);
    }
  };

  const handleNextImage = () => {
    const currentEvent = allEvents.find((item) => item.images.includes(currentImage));
    if (currentEvent) {
      const currentIndex = currentEvent.images.indexOf(currentImage);
      const nextIndex = (currentIndex + 1) % currentEvent.images.length;
      setCurrentImage(currentEvent.images[nextIndex]);
      setCurrentImageIndex(nextIndex);
    }
  };

  // Функція для отримання стилю позиціонування зображення - ДОДАНО
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
    <div className={styles.container} lang={locale}>
      <div className={styles.background}>
        <div className={styles.gradientBg}></div>
      </div>

      <main className={styles.eventsMain}>
        <h2 className={styles.eventsStreamTitle}>{t("methodicalEventsTitle")}</h2>


        <div className={styles.eventsList}>
          {allEvents.map((item, index) => (
            <div
              key={item.id}
              className={`${styles.eventItem} ${expandedEvent === item.id ? styles.expanded : ""}`}
            >
              <div className={styles.eventContent}>
                <h3 className={styles.eventItemTitle}>{item.title}</h3>
                <p
                  className={styles.eventItemText}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {item.text}
                </p>
                <button
                  className={`${styles.readMoreBtn} ${expandedEvent === item.id ? styles.expanded : ""}`}
                  onClick={() => handleReadMore(item.id)}
                >
                  {expandedEvent === item.id ? t("collapse") : t("readMore")}
                </button>
              </div>
              {item.images.length > 0 && (
                <div className={styles.eventImage}>
                  <img
                    src={item.images[0]}
                    alt="Event image"
                    width={400}
                    height={300}
                    onClick={() => handleImageClick(item.images, 0)}
                    data-position={item.imagePosition || 'center'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      ...getImagePositionStyle(item.imagePosition) // ДОДАНО стиль позиціонування
                    }}
                  />
                  <a
                    href="#"
                    className={styles.eventImageOverlay}
                    onClick={(e) => {
                      e.preventDefault();
                      handleImageClick(item.images, 0);
                    }}
                  >
                    <span className={styles.viewMoreText}>
                      {t("viewAllPhotos")}
                    </span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Повідомлення якщо немає подій */}
        {!isLoading && allEvents.length === 0 && (
          <div className={styles.placeholderMessage}>
            {t("noMethodicalEvents")}
          </div>
        )}
      </main>

      {/* Gallery Modal */}
      {galleryOpen && (
        <div
          className={`${styles.galleryModal} ${galleryOpen ? styles.active : ""}`}
        >
          <div className={styles.galleryContent}>
            <img
              src={currentImage}
              alt="Gallery image"
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain'
              }}
            />
            <div className={styles.galleryNav}>
              <button className={styles.galleryPrev} onClick={handlePrevImage}>
                ❮
              </button>
              <button className={styles.galleryNext} onClick={handleNextImage}>
                ❯
              </button>
            </div>
            <button
              className={styles.galleryClose}
              onClick={handleGalleryClose}
            >
              ×
            </button>
            <div className={styles.galleryCounter}>
              {currentImageIndex + 1} /{" "}
              {
                allEvents.find((item) => item.images.includes(currentImage))?.images
                  .length
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

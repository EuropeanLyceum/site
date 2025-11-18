'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/clubsstudios.module.css';
import { useTranslation } from '@/contexts/TranslationProvider';

export default function ClubsStudiosPage() {
  const { t, locale } = useTranslation();
  const [expandedClub, setExpandedClub] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [renderKey, setRenderKey] = useState(0);

  // Діагностика перекладу
  console.log('ClubsStudios - Current locale:', locale);
  console.log('ClubsStudios - Translation test:', t('clubsStudios'));

  // Відстеження змін мови
  useEffect(() => {
    console.log('ClubsStudios - Language changed to:', locale);
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

  const loadClubs = async () => {
    try {
      setIsLoading(true);
      console.log(" --- start ---");
      
      // Прямий запит до API сервера
      const response = await fetch("http://localhost:3001/api/clubs-studios");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Clubs loaded:", data);

      // Оновлюємо стан з даними з API
      const mappedClubs = data.map((item) => ({
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
      
      setClubs(mappedClubs);
      return data;
    } catch (error) {
      console.error("Error loading clubs:", error);
      setClubs([]);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const handleReadMore = (id) => {
    setExpandedClub(expandedClub === id ? null : id);
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
    const currentClub = clubs.find((item) => item.photoUrls.includes(currentImage));
    if (currentClub && currentImage) {
      const currentIndex = currentClub.photoUrls.indexOf(currentImage);
      const prevIndex =
        (currentIndex - 1 + currentClub.photoUrls.length) %
        currentClub.photoUrls.length;
      setCurrentImage(currentClub.photoUrls[prevIndex]);
      setCurrentImageIndex(prevIndex);
    }
  };

  const handleNextImage = () => {
    const currentClub = clubs.find((item) => item.photoUrls.includes(currentImage));
    if (currentClub && currentImage) {
      const currentIndex = currentClub.photoUrls.indexOf(currentImage);
      const nextIndex = (currentIndex + 1) % currentClub.photoUrls.length;
      setCurrentImage(currentClub.photoUrls[nextIndex]);
      setCurrentImageIndex(nextIndex);
    }
  };

  return (
    <>
      <div className={styles.clubsStudiosPage} lang={locale} key={`${locale}-${renderKey}`}>
        <div className={styles.content}>
          <h1 className={styles.title}>{t("clubsStudios")}</h1>
          
          {(
            <div className={styles.clubsList}>
              {clubs.map((item) => {
                const localized = getLocalizedContent(item);
                
                return (
                  <div
                    key={item.id}
                    className={`${styles.clubItem} ${expandedClub === item.id ? styles.expanded : ""}`}
                  >
                    <div className={styles.clubContent}>
                      <h3 className={styles.clubTitle}>{localized.heading}</h3>
                      <p
                        className={styles.clubDescription}
                        style={{ whiteSpace: 'pre-line' }}
                      >
                        {localized.description}
                      </p>
                      <button
                        className={`${styles.readMoreBtn} ${expandedClub === item.id ? styles.expanded : ""}`}
                        onClick={() => handleReadMore(item.id)}
                      >
                        {expandedClub === item.id ? t("collapse") : t("readMore")}
                      </button>
                    </div>
                    {item.photoUrls.length > 0 && (
                      <div className={styles.clubImage}>
                        <img
                          src={item.photoUrls[0]}
                          alt="Club image"
                          onClick={() => handleImageClick(item.photoUrls, 0)}
                          data-position={item.imagePosition || 'center'}
                          onLoad={() => console.log(`🖼️ Зображення завантажено для ID ${item.id}, data-position = "${item.imagePosition || 'center'}"`)}
                        />
                        <div 
                          className={styles.clubImageOverlay}
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
      </div>

      {/* Gallery Modal - рендериться поза основним контейнером */}
      {galleryOpen && (
        <div className={`${styles.galleryModal} ${styles.active}`}>
          <div className={styles.galleryContent}>
            <img
              src={currentImage}
              alt="Gallery image"
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
              {clubs.find((item) => item.photoUrls.includes(currentImage))?.photoUrls.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
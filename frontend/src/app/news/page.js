"use client";

import Image from "next/image";
import styles from "@/styles/news.module.css";
import { useEffect, useState } from "react";
import { useTranslation } from "@/contexts/TranslationProvider";

export default function NewsPage() {
  const { t, locale } = useTranslation();
  const [expandedNews, setExpandedNews] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNews = async () => {
    try {
      setIsLoading(true);
      console.log(" --- start ---");
      
      // Прямий запит до API сервера (після налаштування CORS)
      const response = await fetch("http://localhost:3001/api/news");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("News loaded:", data);

      // Оновлюємо стан з даними з API
      const mappedNews = data.map(item => ({
        id: item.id,
        title: item.heading || item.title || 'Без заголовка',
        titleEn: item.headingEn || '',
        text: item.description || item.text || 'Опис відсутній',
        textEn: item.descriptionEn || '',
        images: item.photoUrls ? item.photoUrls.map(url => 
          url.startsWith('http') ? url : `http://localhost:3001${url}`
        ) : [],
        imagePosition: item.imagePosition || 'center' // Додано підтримку imagePosition
      }));
      
      setNews(mappedNews);
      return data;
    } catch (error) {
      console.error("Error loading news:", error);
      // Якщо API не працює, показуємо порожній список
      setNews([]);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Функція для отримання локалізованого контенту
  const getLocalizedContent = (item) => {
    if (locale === 'en') {
      return {
        title: item.titleEn || item.title, // fallback до української
        text: item.textEn || item.text
      };
    }
    return {
      title: item.title,
      text: item.text
    };
  };

  const handleReadMore = (id) => {
    setExpandedNews(expandedNews === id ? null : id);
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
    const currentNews = news.find((item) => item.images.includes(currentImage));
    if (currentNews) {
      const currentIndex = currentNews.images.indexOf(currentImage);
      const prevIndex =
        (currentIndex - 1 + currentNews.images.length) %
        currentNews.images.length;
      setCurrentImage(currentNews.images[prevIndex]);
      setCurrentImageIndex(prevIndex);
    }
  };

  const handleNextImage = () => {
    const currentNews = news.find((item) => item.images.includes(currentImage));
    if (currentNews) {
      const currentIndex = currentNews.images.indexOf(currentImage);
      const nextIndex = (currentIndex + 1) % currentNews.images.length;
      setCurrentImage(currentNews.images[nextIndex]);
      setCurrentImageIndex(nextIndex);
    }
  };

  // Функція для отримання стилю позиціонування зображення
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
      <div className={styles.container}>
        <div className={styles.background}>
          <div className={styles.gradientBg}></div>
        </div>

        <main className={styles.newsMain}>
          <h2 className={styles.newsStreamTitle}>{t("newsStream")}</h2>
          
          {isLoading ? (
            <div className={styles.newsContainer}>
              <div className={styles.loadingMessage}>{t("loadingNews")}</div>
            </div>
          ) : news.length === 0 ? (
            <div className={styles.newsContainer}>
              <div className={styles.noNewsMessage}>{t("noNewsFound")}</div>
            </div>
          ) : (
            <div className={styles.newsList}>
              {news.map((item) => {
                const localized = getLocalizedContent(item);
                
                return (
                  <div
                    key={item.id}
                    className={`${styles.newsItem} ${expandedNews === item.id ? styles.expanded : ""}`}
                  >
                    <div className={styles.newsContent}>
                      <h3 className={styles.newsItemTitle}>{localized.title}</h3>
                      <p
                        className={styles.newsItemText}
                        style={{ whiteSpace: 'pre-line' }}
                      >
                        {localized.text}
                      </p>
                      <button
                        className={`${styles.readMoreBtn} ${expandedNews === item.id ? styles.expanded : ""}`}
                        onClick={() => handleReadMore(item.id)}
                      >
                        {expandedNews === item.id ? t("collapse") : t("readMore")}
                      </button>
                    </div>
                    {item.images.length > 0 && (
                      <div className={styles.newsImage}>
                        <Image
                          src={item.images[0]}
                          alt="News image"
                          width={400}
                          height={300}
                          onClick={() => handleImageClick(item.images, 0)}
                          style={getImagePositionStyle(item.imagePosition)} // Додано стиль позиціонування
                          data-position={item.imagePosition} // Додано data-атрибут для CSS
                        />
                        <a
                          href="#"
                          className={styles.newsImageOverlay}
                          onClick={(e) => {
                            e.preventDefault();
                            handleImageClick(item.images, 0);
                          }}
                        >
                          <span className={styles.viewMoreText}>
                            {t("viewMore")}
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Gallery Modal - рендериться поза основним контейнером */}
      {galleryOpen && (
        <div
          className={`${styles.galleryModal} ${styles.active}`}
        >
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
            <button
              className={styles.galleryClose}
              onClick={handleGalleryClose}
            >
              ×
            </button>
            <div className={styles.galleryCounter}>
              {currentImageIndex + 1} /{" "}
              {
                news.find((item) => item.images.includes(currentImage))?.images
                  .length
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/teachercertification.module.css';
import { useTranslation } from '@/contexts/TranslationProvider';

// Імпортуємо зображення
import attest1 from '@/assets/attest1.jpg';
import attest2 from '@/assets/attest2.jpg';
import attest3 from '@/assets/attest3.jpg';
import attest4 from '@/assets/attest4.jpg';
import attest5 from '@/assets/attest5.jpg';
import attest6 from '@/assets/attest6.jpg';
import attest7 from '@/assets/attest7.jpg';
import attest8 from '@/assets/attest8.jpg';
import attest9 from '@/assets/attest9.jpg';
import attest10 from '@/assets/attest10.jpg';
import attest11 from '@/assets/attest11.jpg';
import attest12 from '@/assets/attest12.jpg';
import attest13 from '@/assets/attest13.jpg';
import attest14 from '@/assets/attest14.jpg';
import attest15 from '@/assets/attest15.jpg';
import attest16 from '@/assets/attest16.jpg';

export default function TeacherCertificationPage() {
  const { t, locale } = useTranslation();
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dynamicItems, setDynamicItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDynamicItems();
  }, []);

  const fetchDynamicItems = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/teacher-certification');
      if (response.ok) {
        const data = await response.json();
        setDynamicItems(data);
      }
    } catch (error) {
      console.error('Error fetching dynamic items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Функція для отримання локалізованого контенту
  const getLocalizedContent = (item) => {
    if (locale === 'en') {
      return {
        heading: item.headingEn || item.heading,
        description: item.descriptionEn || item.description,
        text: item.textEn || item.text,
        linkText: item.linkTextEn || item.linkText
      };
    }
    return {
      heading: item.heading,
      description: item.description,
      text: item.text,
      linkText: item.linkText
    };
  };

  // Статичні блоки (з перекладами)
  const staticEvents = [
    {
      id: 1,
      title: t("finalPedagogicalCouncilTitle"),
      text: t("finalPedagogicalCouncilText"),
      images: [attest12, attest13, attest14, attest15, attest16],
      imagePosition: 'center' // Додаємо поле позиціонування
    },
    {
      id: 2,
      title: t("secondPedagogicalCouncilTitle"),
      text: t("secondPedagogicalCouncilText"),
      images: [attest7, attest8, attest9, attest10, attest11],
      imagePosition: 'center' // Додаємо поле позиціонування
    },
    {
      id: 3,
      title: t("firstPedagogicalCouncilTitle"),
      text: t("firstPedagogicalCouncilText"),
      images: [attest1, attest2, attest3, attest4, attest5, attest6],
      imagePosition: 'center' // Додаємо поле позиціонування
    },
  ];

  // Динамічні блоки (додаються зверху) - як на сторінці новин
  const dynamicEvents = dynamicItems.filter(item => 
    (item.heading || item.headingEn) && (item.description || item.descriptionEn) && item.photoUrls
  ).map(item => {
    const localized = getLocalizedContent(item);
    
    return {
      id: `dynamic-${item.id}`,
      title: localized.heading,
      text: localized.description,
      images: (() => {
        try {
          // Перевіряємо, чи photoUrls є рядком (JSON) або масивом
          if (typeof item.photoUrls === 'string') {
            const parsed = JSON.parse(item.photoUrls);
            return Array.isArray(parsed) ? parsed : [];
          }
          return Array.isArray(item.photoUrls) ? item.photoUrls : [];
        } catch {
          return [];
        }
      })().map(url => 
        url.startsWith('http') ? url : `http://localhost:3001${url}`
      ),
      imagePosition: item.imagePosition || 'center'
    };
  });

  // Об'єднуємо динамічні (зверху) та статичні блоки
  const allEvents = [...dynamicEvents, ...staticEvents];

  // Елементи для рожевого фону (як на сторінці на допомогу вчителю)
  const pinkBackgroundItems = dynamicItems.filter(item => 
    (item.text || item.textEn || item.url) && !item.heading && !item.headingEn && !item.description && !item.descriptionEn
  );

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
      const prevIndex = (currentIndex - 1 + currentEvent.images.length) % currentEvent.images.length;
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

  // Функція для отримання стилю позиціонування зображення (як на сторінці новин)
  const getImagePositionStyle = (position) => {
    switch (position) {
      case 'top':
        return { objectPosition: 'center top' };
      case 'bottom':
        return { objectPosition: 'center bottom' };
      case 'left':
        return { objectPosition: 'left center' };
      case 'right':
        return { objectPosition: 'right center' };
      case 'center':
      default:
        return { objectPosition: 'center center' };
    }
  };

  // Функція для відображення тексту з пропущеними рядками
  const renderTextWithLineBreaks = (text) => {
    if (!text) return null;
    
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => (
      <p key={index}>
        {paragraph.split('\n').map((line, lineIndex) => (
          <span key={lineIndex}>
            {line}
            {lineIndex < paragraph.split('\n').length - 1 && <br />}
          </span>
        ))}
      </p>
    ));
  };

  return (
    <div className={styles.container} lang={locale}>
      <div className={styles.background}>
        <div className={styles.gradientBg}></div>
      </div>

      <main className={styles.eventsMain}>
        <h2 className={styles.eventsStreamTitle}>{t("teacherCertification")}</h2>

        {(
          <div className={styles.eventsList}>
            {allEvents.map((item) => (
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
                {item.images && item.images.length > 0 && (
                  <div className={styles.eventImage}>
                    <Image
                      src={item.images[0]}
                      alt="Event image"
                      width={400}
                      height={300}
                      onClick={() => handleImageClick(item.images, 0)}
                      style={getImagePositionStyle(item.imagePosition)}
                      data-position={item.imagePosition}
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
        )}

        {/* Секція з документами та рожевим фоном */}
        <section className={styles.teacherCertificationDocuments}>
          <div className={styles.documentsContainer}>
            <p className={styles.documentsText}>{t("emailForDocuments")} <a href="mailto:atestacia24licey@gmail.com" className={styles.emailLink}>atestacia24licey@gmail.com</a></p>
            
            <p className={styles.documentsSubtitle}>{t("attestationCommission")}</p>
            <div className={styles.documentsList}>
              <p className={styles.commissionMember}>{t("derkachLA")} – {t("commissionChairman")}</p>
              <p className={styles.commissionMember}>{t("sokolovskaOP")} – {t("commissionSecretary")}</p>
              <p className={styles.commissionMember}>{t("korshakTV")} – {t("commissionMember")}</p>
              <p className={styles.commissionMember}>{t("ovdienkoOM")} – {t("commissionMember")}</p>
              <p className={styles.commissionMember}>{t("nikulYV")} – {t("commissionMember")}</p>
              <p className={styles.commissionMember}>{t("mokrenkoEM")} – {t("commissionMember")}</p>
              <p className={styles.commissionMember}>{t("simonkinaGP")} – {t("commissionMember")}</p>
              <p className={styles.commissionMember}>{t("holovkoSB")} – {t("commissionMember")}</p>
              <p className={styles.commissionMember}>{t("kogutKS")} – {t("commissionMember")}</p>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.documentsList}>
              <a href="https://docs.google.com/file/d/16pC6gZmJoge33TLgruXy-2mUAH3JjH2d/edit?filetype=msword" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t("attestationResults2025")}</a>
              <a href="https://docs.google.com/document/d/1eTJ1ba7kYMbTFR3ejLbg6JWHNcmtTVf3/edit" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t("extraordinaryAttestationList2025")}</a>
              <a href="https://docs.google.com/document/d/1aimztLwaSXP7raZ4xIHQlIVxVXJsSMkL/edit?tab=t.0" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t("attestationList2024_2025")}</a>
              <a href="https://docs.google.com/document/d/1pkadNTCdi6zgbcd_AzyC94nenbUxp6fJ/edit?tab=t.0" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t("attestationSchedule")}</a>
            </div>

            {/* Динамічні елементи для рожевого фону (як на сторінці на допомогу вчителю) */}
            {pinkBackgroundItems.length > 0 && (
              <>
                <div className={styles.divider}></div>
                <div className={styles.documentsBlock}>
                  {pinkBackgroundItems.map((item, index) => {
                    const localized = getLocalizedContent(item);
                    
                    return (
                      <div key={item.id}>
                        {/* Горизонтальна лінія та більший відступ перед текстом, якщо це не перший запис */}
                        {localized.text && index > 0 && (
                          <>
                            <div className={styles.divider}></div>
                            <div style={{ marginTop: '40px' }}></div>
                          </>
                        )}
                        
                        {/* Текст, якщо є */}
                        {localized.text && (
                          <div className={styles.documentsText}>
                            {renderTextWithLineBreaks(localized.text)}
                          </div>
                        )}
                        
                        {/* Посилання, якщо є */}
                        {item.url && (
                          <div className={styles.documentsList}>
                            <a 
                              href={item.url} 
                              className={styles.documentLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              {localized.linkText || item.url}
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Gallery Modal */}
      {galleryOpen && (
        <div className={`${styles.galleryModal} ${styles.active}`}>
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
              {allEvents.find((item) => item.images.includes(currentImage))?.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

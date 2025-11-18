'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/regulatorydocuments.module.css';
import Image from 'next/image';
import firebird3 from '@/assets/firebird3.png';
import { useTranslation } from '@/contexts/TranslationProvider';

export default function RegulatoryDocuments() {
  const { t, locale } = useTranslation();
  const [documentsData, setDocumentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [renderKey, setRenderKey] = useState(0);

  // Діагностика перекладу
  console.log('RegulatoryDocuments - Current locale:', locale);
  console.log('RegulatoryDocuments - Translation test:', t('regulatoryDocumentsTitle'));
  console.log('RegulatoryDocuments - Component rendered at:', new Date().toISOString());

  // Відстеження змін мови
  useEffect(() => {
    console.log('RegulatoryDocuments - Language changed to:', locale);
    setRenderKey(prev => prev + 1);
  }, [locale]);

  // Функція для отримання локалізованого контенту
  const getLocalizedContent = (document) => {
    if (locale === 'en') {
      return {
        title: document.titleEn || document.title, // fallback до української
        content: document.contentEn || document.content,
        linkText: document.linkTextEn || document.linkText // fallback до української
      };
    }
    return {
      title: document.title,
      content: document.content,
      linkText: document.linkText
    };
  };

  // Отримання документів з адмін-панелі
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/regulatory-documents');
        if (response.ok) {
          const data = await response.json();
          // старі зверху, нові знизу
          data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setDocumentsData(data);
        }
      } catch (error) {
        console.error('Error fetching regulatory documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Форматування тексту з переносами рядків
  const formatText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      <div className={styles.pageContainer} key={`${locale}-${renderKey}`}>
        <div className="container" lang={locale}>
          <div className="background">
            <div className="gradientBg"></div>
          </div>
          
          <main className={styles.regulatoryDocumentsMain}>
            <h2 className={styles.regulatoryDocumentsTitle}>
              {t('regulatoryDocumentsTitle')}
              <Image src={firebird3} alt={t('firebirdAlt')} className={styles.firebirdImage} />
            </h2>

            <div className={styles.documentsSections}>
              {/* Корисна інформація */}
              <section className={styles.usefulInfoSection}>
                <h2 className={styles.sectionTitle}>{t('usefulInfoTitle')}</h2>
                <div className={styles.linksContainer}>
                  <a href="https://drive.google.com/file/d/1SwYB8RHXm14vYTbYj83fLa9XbUE_QKQJ/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('statuteLink')}</a>
                  <a href="https://drive.google.com/file/d/1LakFeplNYfPwEFCEmsrK3IocЗxrtDa0I/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('edrExtractLink')}</a>
                  <a href="https://drive.google.com/file/d/1HE2ib8ThVe0zJJ2g8vCrd08Eaqce-fhy/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('derkachAppointmentLink')}</a>
                  <a href="https://drive.google.com/file/d/1OKBBJpasb7KgSwWbxDc4grImgNyxcIXl/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('licenseReissueLink')}</a>
                  <a href="https://drive.google.com/file/d/165qNwaV3sKhmCr3ThX5GVx_81prA-aRU/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('attestationResultsLink')}</a>
                  <a href="https://zakon.rada.gov.ua/laws/show/z0566-11#Text" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('evaluationCriteriaLink1')}</a>
                  <a href="https://ru.osvita.ua/legislation/Ser_osv/2357/" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('evaluationCriteriaLink2')}</a>
                </div>
              </section>

              {/* 2024-2025 */}
              <section className={styles.yearSection}>
                <h2 className={styles.sectionTitle}>{t('academicYear2024Title')}</h2>
                <div className={styles.linksContainer}>
                  <a href="https://docs.google.com/document/d/1yuaR41nDv4SiMAlrx1S9mCuLD53aHwhw/edit" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('educationalProgramLink')}</a>
                </div>
              </section>

              {/* Динамічний контент з адмін-панелі */}
              {!isLoading && documentsData.length > 0 && (
                <section className={styles.dynamicSection}>
                  {documentsData.map((document) => {
                    const localized = getLocalizedContent(document);
                    
                    return (
                      <div 
                        key={document.id} 
                        className={styles.dynamicDocument}
                      >
                        <div className={styles.documentContent}>
                          {/* Заголовок */}
                          {localized.title && (
                            <h3 style={{
                              fontFamily: 'Montserrat Alternates, sans-serif',
                              fontSize: '34px',
                              color: '#000000',
                              marginBottom: '15px'
                            }}>
                              {localized.title}
                            </h3>
                          )}

                          {/* Текст */}
                          {localized.content && (
                            <div
                              style={{
                                color: '#000000',
                                fontSize: '18px',
                                paddingLeft: '20px',
                                marginBottom: '15px',
                                lineHeight: '1.6'
                              }}
                            >
                              {formatText(localized.content)}
                            </div>
                          )}

                          {/* Посилання як текст (linkText) */}
                          {document.url && (
                            <div style={{ position: 'relative', paddingLeft: '20px' }}>
                              <a 
                                href={document.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                  display: 'block',
                                  textDecoration: 'underline',
                                  color: '#182BA1',
                                  transition: 'color 0.3s ease',
                                  fontSize: '18px',
                                  fontFamily: 'Montserrat Alternates, sans-serif',
                                  lineHeight: '1.5',
                                  padding: '8px 0',
                                  width: '100%',
                                  maxWidth: '800px',
                                  whiteSpace: 'normal',
                                  wordWrap: 'break-word',
                                  position: 'relative',
                                  paddingLeft: '20px'
                                }}
                                onMouseEnter={(e) => { e.target.style.color = '#2a41d1'; }}
                                onMouseLeave={(e) => { e.target.style.color = '#182BA1'; }}
                              >
                                {localized.linkText || document.url}
                              </a>
                              <span style={{
                                content: '"•"',
                                position: 'absolute',
                                left: '0',
                                color: '#182BA1',
                                fontSize: '20px',
                                lineHeight: '1',
                                top: '50%',
                                transform: 'translateY(-50%)'
                              }}>
                                •
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Фото справа - три в горизонтальний рядок по ширині */}
                        {document.photoUrls && (() => {
                          try {
                            const photoArray = JSON.parse(document.photoUrls);
                            return Array.isArray(photoArray) && photoArray.length > 0;
                          } catch (e) {
                            return false;
                          }
                        })() && (
                          <div className={styles.documentPhotos}>
                            <div className={styles.photosRow}>
                              {(() => {
                                try {
                                  return JSON.parse(document.photoUrls).map((url, photoIndex) => (
                                    <div key={photoIndex} className={styles.photoItem}>
                                      <img
                                        src={`http://localhost:3001${url}`}
                                        alt={`${t('documentPhotoAlt')} ${photoIndex + 1}`}
                                        onError={(e) => {
                                          console.error('Помилка завантаження зображення:', url);
                                          e.target.style.display = 'none';
                                        }}
                                      />
                                    </div>
                                  ));
                                } catch (e) {
                                  return null;
                                }
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
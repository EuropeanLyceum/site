'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/qualificationimprovement.module.css';
import { useTranslation } from '@/contexts/TranslationProvider';

export default function QualificationImprovementPage() {
  const { t, locale } = useTranslation();
  const [dynamicItems, setDynamicItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDynamicItems();
  }, []);

  const fetchDynamicItems = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/qualification-improvement');
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

  // Функція для форматування тексту з переносами рядків
  const formatText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => (
      <span key={idx}>
        {line}
        {idx < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  // Функція для отримання локалізованого контенту
  const getLocalizedContent = (item) => {
    if (locale === 'en') {
      return {
        title: item.titleEn || item.title,
        content: item.contentEn || item.content,
        text: item.textEn || item.text,
        linkText: item.linkTextEn || item.linkText
      };
    }
    return {
      title: item.title,
      content: item.content,
      text: item.text,
      linkText: item.linkText
    };
  };

  // Мінімалістична кольорова палітра
  const colorSchemes = [
    {
      background: '#fff7ed',
      accent: '#f97316',
      text: '#c2410c',
      border: '#fed7aa'
    },
    {
      background: '#f8f9ff',
      accent: '#3b82f6',
      text: '#1e40af',
      border: '#dbeafe'
    },
    {
      background: '#faf5ff',
      accent: '#8b5cf6',
      text: '#6b21a8',
      border: '#e9d5ff'
    },
    {
      background: '#f0f9ff',
      accent: '#0ea5e9',
      text: '#0369a1',
      border: '#bae6fd'
    },
    {
      background: '#fefce8',
      accent: '#eab308',
      text: '#a16207',
      border: '#fde68a'
    },
    {
      background: '#fdf4ff',
      accent: '#c084fc',
      text: '#9333ea',
      border: '#e9d5ff'
    }
  ];

  // Функція для отримання кольору на основі індексу
  const getColorScheme = (index) => {
    return colorSchemes[index % colorSchemes.length];
  };

  // Фільтруємо елементи для блоків контенту (заголовок + текст + фото)
  const contentBlocks = dynamicItems.filter(item => 
    (item.title || item.titleEn || item.content || item.contentEn || (item.photoUrls && item.photoUrls.length > 0))
  );

  // Фільтруємо елементи для рожевого фону (додатковий текст + посилання)
  const pinkBackgroundItems = dynamicItems.filter(item => 
    (item.text || item.textEn || item.link) && !item.title && !item.titleEn && !item.content && !item.contentEn && (!item.photoUrls || item.photoUrls.length === 0)
  );

  return (
    <div className={styles.qualificationImprovementPage} lang={locale}>
      <main className={styles.qualificationImprovementMain}>
        <div className={styles.titleContainer}>
          <h2 className={styles.qualificationImprovementTitle}>{t("qualificationImprovement")}</h2>
        </div>

        {/* Динамічні блоки контенту - ЗВЕРХУ сторінки */}
        {contentBlocks.length > 0 ? (
          <section className={styles.section}>
            <div className={styles.dynamicSection} style={{ paddingTop: '0px' }}>
              {contentBlocks.slice().reverse().map((item, itemIndex) => {
                const colors = getColorScheme(itemIndex);
                const localized = getLocalizedContent(item);
                
                return (
                  <div key={item.id} style={{
                    marginBottom: '50px',
                    padding: '60px 120px',
                    position: 'relative',
                    background: `linear-gradient(90deg, ${colors.accent}05 0%, transparent 20%, transparent 80%, ${colors.accent}05 100%)`,
                    borderLeft: `4px solid ${colors.accent}30`,
                    paddingLeft: '120px'
                  }}>
                    {/* Заголовок з мінімалістичним підкресленням */}
                    {localized.title && (
                      <div style={{ marginBottom: '30px' }}>
                        <h3 style={{
                          fontFamily: 'Montserrat Alternates, sans-serif',
                          fontSize: '28px',
                          fontWeight: '700',
                          color: colors.text,
                          margin: '0 0 10px 0',
                          position: 'relative'
                        }}>
                          {localized.title}
                        </h3>
                        <div style={{
                          width: '80px',
                          height: '3px',
                          background: colors.accent,
                          borderRadius: '2px'
                        }}></div>
                      </div>
                    )}

                    {/* Текст без рамок */}
                    {localized.content && (
                      <div style={{
                        color: colors.text,
                        fontSize: '16px',
                        lineHeight: '1.5',
                        marginBottom: '30px',
                        width: '100%'
                      }}>
                        {formatText(localized.content)}
                      </div>
                    )}

                    {/* Фото без рамок */}
                    {item.photoUrls && item.photoUrls.length > 0 && (
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '20px',
                        justifyContent: 'center',
                        marginTop: '20px',
                        width: '100%'
                      }}>
                        {item.photoUrls.map((url, index) => (
                          <div key={index} style={{ 
                            flex: '0 0 auto',
                            maxWidth: 'calc(50% - 10px)',
                            minWidth: '300px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            transition: 'transform 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}>
                            <img
                              src={`http://localhost:3001${url}`}
                              alt={`Qualification improvement photo ${index + 1}`}
                              style={{ 
                                width: '100%', 
                                height: '280px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                              onError={(e) => {
                                console.error('Помилка завантаження зображення:', url);
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Мінімалістична розділювальна лінія */}
                    <div style={{
                      width: '100%',
                      height: '2px',
                      background: colors.accent,
                      marginTop: '60px',
                      opacity: '0.8'
                    }}></div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Статичний блок з тренінгом "Нова українська школа" */}
        <section className={styles.section}>
          <div className={styles.dynamicSection} style={{ paddingTop: '0px' }}>
            <div style={{
              marginBottom: '50px',
              padding: '60px 120px',
              position: 'relative',
              background: `linear-gradient(90deg, #8b5cf605 0%, transparent 20%, transparent 80%, #8b5cf605 100%)`,
              borderLeft: `4px solid #8b5cf630`,
              paddingLeft: '120px'
            }}>
              {/* Заголовок */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{
                  fontFamily: 'Montserrat Alternates, sans-serif',
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#6b21a8',
                  margin: '0 0 10px 0',
                  position: 'relative'
                }}>
                  {t("trainingTitle")}
                </h3>
                <div style={{
                  width: '80px',
                  height: '3px',
                  background: '#8b5cf6',
                  borderRadius: '2px'
                }}></div>
              </div>

              {/* Текст */}
              <div style={{
                color: '#6b21a8',
                fontSize: '16px',
                lineHeight: '1.5',
                marginBottom: '30px',
                width: '100%'
              }}>
                <p>{t("trainingText1")}</p>
                <p>{t("trainingText2")}</p>
                <p>{t("trainingText3")}</p>
              </div>

              {/* Посилання */}
              <div style={{ marginBottom: '40px' }}>
                <a
                  href="https://padlet.com/lubnynush6/l48ff0euvhlk0yk6"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    color: '#8b5cf6',
                    fontSize: '18px',
                    fontFamily: 'Montserrat Alternates, sans-serif',
                    fontWeight: '600',
                    textDecoration: 'none',
                    borderBottom: `2px solid #8b5cf6`,
                    paddingBottom: '2px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => { 
                    e.target.style.borderBottomColor = '#6b21a8';
                    e.target.style.color = '#6b21a8';
                  }}
                  onMouseLeave={(e) => { 
                    e.target.style.borderBottomColor = '#8b5cf6';
                    e.target.style.color = '#8b5cf6';
                  }}
                >
                  {t("viewTrainingMaterials")}
                </a>
              </div>

              {/* Мінімалістична розділювальна лінія */}
              <div style={{
                width: '100%',
                height: '2px',
                background: '#8b5cf6',
                marginTop: '60px',
                opacity: '0.8'
              }}></div>
            </div>
          </div>
        </section>
        
        {/* Секція з корисними документами */}
        <section className={styles.qualificationImprovementDocuments}>
          <div className={styles.documentsContainer}>
            <div className={styles.documentsBlock}>
              {/* Статичні документи */}
              <div className={styles.documentsList}>
                <a href="https://docs.google.com/document/d/14ZDrZjieY5aDyLI1VQA-bfNv1H4cjDQY/edit?tab=t.0" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t("qualificationQuestions")}</a>
                <a href="https://drive.google.com/file/d/1AWbv9UfaJ6hK0A_c1HSVDnqj2hLvOmjk/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t("methodologicalRecommendations")}</a>
                <a href="https://drive.google.com/file/d/1V5axKQHpPS0zjSpKjqBZ3zMKqTINgqVX/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t("psychologicalServiceRecommendations")}</a>
                <a href="https://drive.google.com/drive/folders/1JUczDaFO0BFD2rjLtunOUKNSGCF1W9ON" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t("qualificationResults2024")}</a>
                <a href="https://docs.google.com/document/d/16BFVfn5vPe_XNP76txtudrR-dFwwehIc/edit?tab=t.0" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t("qualificationProspects2025")}</a>
              </div>

              {/* Динамічні елементи для рожевого фону */}
              {pinkBackgroundItems.length > 0 && (
                <>
                  <div className={styles.divider}></div>
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
                            {formatText(localized.text)}
                          </div>
                        )}
                        
                        {/* Посилання, якщо є */}
                        {item.link && (
                          <div className={styles.documentsList}>
                            <a 
                              href={item.link} 
                              className={styles.documentLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              {localized.linkText || item.link}
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

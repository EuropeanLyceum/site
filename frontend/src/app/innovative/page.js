'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/innovative.module.css';
import newProjectImg from '@/assets/new_project.jpg';
import healthCircleImg from '@/assets/health_circle.jpg';
import healthProjectImg from '@/assets/health_prjct.jpg';
import { useTranslation } from '@/contexts/TranslationProvider';

const InnovativePage = () => {
  const { t, locale } = useTranslation();
  const [dynamicData, setDynamicData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Завантаження динамічних оновлень з адмінки
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/innovation-activity");
        if (response.ok) {
          const data = await response.json();
          // старі зверху, нові знизу
          data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setDynamicData(data);
        }
      } catch (e) {
        console.error('Error fetching innovative data:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Форматування тексту з переносами рядків
  const formatText = (text) => {
    if (!text) return '';
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
        title: item.titleEn || item.title, // fallback до української
        content: item.contentEn || item.content,
        linkText: item.linkText // linkText залишається без змін
      };
    }
    return {
      title: item.title,
      content: item.content,
      linkText: item.linkText
    };
  };

  // Мінімалістична кольорова палітра
  const colorSchemes = [
    {
      background: '#f8f9ff',
      accent: '#3b82f6',
      text: '#1e40af',
      border: '#dbeafe'
    },
    {
      background: '#fff7ed',
      accent: '#f97316',
      text: '#c2410c',
      border: '#fed7aa'
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

  return (
    <>
      <div className="container" lang={locale}>
        <div className="background">
          <div className="gradientBg"></div>
        </div>
        
        <main className={styles.innovativeMain}>
          {/* Головна секція */}
          <section className={styles.innovationSection}>
            <h2 className={styles.innovationTitle}>{t('innovativeMainTitle')}</h2>
            
            <div className={styles.innovationContent}>
              <div className={styles.innovationImage}>
                <Image 
                  src={newProjectImg}
                  alt={t('innovativeImageAlt')}
                  width={350}
                  height={510}
                  className={styles.innovationImg}
                />
              </div>
              
              <div className={styles.innovationText}>
                {t('innovativeDescription')}
              </div>
            </div>
          </section>

          {/* Секція "Дівчата STEM" */}
          <section className={styles.stemGirlsSection}>
            <div className={styles.stemContainer}>
              <h2 className={styles.stemTitle}>{t('stemTitle')}</h2>
              
              <p className={styles.stemSubtitle}>{t('stemSubtitle')}</p>
              
              <p className={styles.stemText}><span className={styles.stemOrange}><strong>STEM</strong></span> – <span className={styles.stemTerm}>{t('stemAbbreviationText')}</span></p>
              
              <div className={styles.stemAbbreviation}>
                <ul>
                  <li><span className={styles.stemTerm}>Science</span> – {t('stemScience')}</li>
                  <li><span className={styles.stemTerm}>Technology</span> – {t('stemTechnology')}</li>
                  <li><span className={styles.stemTerm}>Engineering</span> – {t('stemEngineering')}</li>
                  <li><span className={styles.stemTerm}>Mathematics</span> – {t('stemMathematics')}</li>
                </ul>
              </div>
              
              <div className={styles.stemDescription}>
                <p><span className={styles.stemTerm}>{t('stemBranchesTitle')}</span> – {t('stemBranchesDescription')}</p>
                
                <p><strong>{t('stemGirlsInitiative')}</strong> – {t('stemInitiativeDescription')}</p>
                
                <p><strong>{t('stemTasksTitle')}</strong> – {t('stemTasksDescription')}</p>
              </div>
            </div>
          </section>

          {/* Секція "Українсько-швейцарський проект" */}
          <section className={styles.healthProjectSection}>
            <div className={styles.healthContainer}>
              <h2 className={styles.healthTitle}>{t('healthProjectTitle')}</h2>
              
              <div className={styles.healthContent}>
                <div className={styles.healthRow}>
                  <div className={styles.healthImageContainer}>
                    <Image 
                      src={healthCircleImg}
                      alt={t('healthCircleAlt')}
                      width={450}
                      height={450}
                      className={styles.healthImage}
                    />
                  </div>
                  
                  <div className={styles.healthTextContainer}>
                    <div className={styles.healthTextBox}>
                      <p>{t('healthProjectDescription1')}</p>
                    </div>
                  </div>
                </div>
                
                <div className={styles.healthRow}>
                  <div className={styles.healthTextContainer}>
                    <div className={styles.healthTextBox}>
                      <p>{t('healthProjectDescription2')}</p>
                    </div>
                  </div>
                  
                  <div className={styles.healthImageContainer}>
                    <Image 
                      src={healthProjectImg}
                      alt={t('healthProjectLogoAlt')}
                      width={700}
                      height={350}
                      className={styles.healthImage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Динамічний контент з адмін-панелі */}
          {isLoading ? (
            <section className={styles.section}>
              <div className={styles.dynamicSection}>
                <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' }}>
                  Завантаження динамічного контенту...
                </div>
              </div>
            </section>
          ) : dynamicData.length > 0 ? (
            <section className={styles.section}>
              <div className={styles.dynamicSection}>
                {dynamicData.map((item, itemIndex) => {
                  const colors = getColorScheme(itemIndex);
                  const localized = getLocalizedContent(item);
                  
                  return (
                    <div key={item.id} style={{
                      marginBottom: '80px',
                      padding: '50px 80px',
                      position: 'relative',
                      background: `linear-gradient(90deg, ${colors.accent}05 0%, transparent 20%, transparent 80%, ${colors.accent}05 100%)`,
                      borderLeft: `4px solid ${colors.accent}30`,
                      paddingLeft: '80px'
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

                      {/* Посилання мінімалістичне */}
                      {item.url && (
                        <div style={{ marginBottom: '40px' }}>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-block',
                              color: colors.accent,
                              fontSize: '18px',
                              fontFamily: 'Montserrat Alternates, sans-serif',
                              fontWeight: '600',
                              textDecoration: 'none',
                              borderBottom: `2px solid ${colors.accent}`,
                              paddingBottom: '2px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => { 
                              e.target.style.borderBottomColor = colors.text;
                              e.target.style.color = colors.text;
                            }}
                            onMouseLeave={(e) => { 
                              e.target.style.borderBottomColor = colors.accent;
                              e.target.style.color = colors.accent;
                            }}
                          >
                            {localized.linkText || item.url}
                          </a>
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
                                alt={`Innovative activity photo ${index + 1}`}
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
          ) : (
            <section className={styles.section}>
              <div className={styles.dynamicSection}>
                <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' }}>
                  Динамічний контент відсутній
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default InnovativePage;
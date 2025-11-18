'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/antibullying.module.css';
import { useTranslation } from '@/contexts/TranslationProvider';

export default function Antibullying() {
  const { t, locale } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [renderKey, setRenderKey] = useState(0);

  // Діагностика перекладу
  console.log('Antibullying - Current locale:', locale);
  console.log('Antibullying - Translation test:', t('antiBullying'));

  // Відстеження змін мови
  useEffect(() => {
    console.log('Antibullying - Language changed to:', locale);
    setRenderKey(prev => prev + 1);
  }, [locale]);

  // Функція для отримання локалізованого контенту
  const getLocalizedContent = (item) => {
    if (locale === 'en') {
      return {
        title: item.titleEn || item.title, // fallback до української
        content: item.contentEn || item.content,
        linkText: item.linkTextEn || item.linkText
      };
    }
    return {
      title: item.title,
      content: item.content,
      linkText: item.linkText
    };
  };

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3001/api/anti-bullying");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Articles loaded:", data);

      // Сортуємо за ID (новіші зверху)
      const sortedArticles = data.sort((a, b) => b.id - a.id);
      setArticles(sortedArticles);
    } catch (error) {
      console.error("Error loading articles:", error);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  // Розділяємо динамічні елементи на блоки та елементи для секції документів
  const blockItems = articles.filter(item => {
    const localized = getLocalizedContent(item);
    return localized.title && localized.content;
  });
  
  // Елементи для відображення в секції "Корисні документи та матеріали"
  const documentItems = articles.filter(item => 
    item.link
  ).sort((a, b) => a.id - b.id); // Сортуємо за ID в прямому порядку (старіші зверху)

  // Функція для відображення тексту з пропущеними рядками
  const renderTextWithLineBreaks = (text) => {
    if (!text) return null;
    
    // Розділяємо текст на абзаци за подвійними пропущеними рядками
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
    <div className={styles.antibullyingPage} lang={locale} key={`${locale}-${renderKey}`}>
      <div className={styles.intellectContent}>
        <h1 className={styles.intellectTitle}>{t("antiBullying")}</h1>
        
        {/* Шкільний чат-бот секція */}
        <div className={styles.chatbotSection}>
          <div className={styles.chatbotContent}>
              <h2 className={styles.chatbotTitle}>
                {t("schoolChatbot")} <span className={styles.hashtag}>{t("chatbotHashtag")}</span>
              </h2>
            <p className={styles.chatbotDescription}>
              {t("chatbotDescription")}
            </p>
            <p className={styles.chatbotInfo}>
              {t("chatbotInfo")}{' '}
              <a 
                href="http://t.me/ProBullyingBot" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.telegramLink}
              >
                http://t.me/ProBullyingBot
              </a>
            </p>
          </div>
        </div>

        {/* Розділювальна лінія */}
        <div className={styles.divider}></div>

        {/* Посилання на документи */}
        <div className={styles.documentsSection}>
           <h3 className={styles.documentsTitle}>{t("usefulDocuments")}</h3>
          <div className={styles.documentsList}>
            <a 
              href="https://drive.google.com/file/d/1NOzfllJcpHzTK7ShfKGAyHDCFjnITMSn/view" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.documentLink}
            >
               {t("bullyingReport")}
             </a>
             
             <a 
               href="https://drive.google.com/file/d/1_uBWZ8P_eVkUIqA6LfHnBgVbOobdBvaN/view" 
               target="_blank" 
               rel="noopener noreferrer"
               className={styles.documentLink}
             >
               {t("bullyingProcedure")}
             </a>
             
             <a 
               href="https://drive.google.com/file/d/1LQqIU9E79Mun7tM0m3Py3YgbJfXTs9ld/view" 
               target="_blank" 
               rel="noopener noreferrer"
               className={styles.documentLink}
             >
               {t("cyberbullyingProtection")}
             </a>
             
             <a 
               href="https://docs.google.com/document/d/1LDIjtAUm1wouy6X-76ho1SG6EYemMbf2/edit" 
               target="_blank" 
               rel="noopener noreferrer"
               className={styles.documentLink}
             >
               {t("cyberbullyingGuide")}
            </a>

            {/* Динамічні елементи для секції документів */}
            {documentItems.map((item, index) => {
              const localized = getLocalizedContent(item);
              
              return (
                <a 
                  key={item.id}
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.documentLink}
                >
                  {localized.linkText || item.link}
                </a>
              );
            })}
          </div>
        </div>

        {/* Динамічні блоки з адмінки */}
        {isLoading ? (
           <div className={styles.loadingMessage}>{t("loadingArticles")}</div>
        ) : blockItems.length === 0 ? null : (
          <div className={styles.verticalContent}>
            {blockItems.map((article, index) => {
              const localized = getLocalizedContent(article);
              
              return (
                <div key={article.id} className={styles.contentCard}>
                  <h3 className={styles.contentTitle}>{localized.title}</h3>
                  <div className={styles.contentText}>
                    {localized.content.split('\n').map((paragraph, pIndex) => {
                      if (paragraph.trim().startsWith('•')) {
                        return (
                          <ul key={pIndex} className={styles.bulletList}>
                            <li>{paragraph.trim().substring(1).trim()}</li>
                          </ul>
                        );
                      } else if (paragraph.trim().startsWith('ПОРЯДОК') || 
                                 paragraph.trim().startsWith('Визначення') ||
                                 paragraph.trim().startsWith('Основні') ||
                                 paragraph.trim().startsWith('Подача')) {
                        return (
                          <h4 key={pIndex} className={styles.sectionTitle}>
                            {paragraph}
                          </h4>
                        );
                      } else if (paragraph.trim().startsWith('Загальні') ||
                                 paragraph.trim().startsWith('Типові') ||
                                 paragraph.trim().startsWith('Подання') ||
                                 paragraph.trim().startsWith('Розгляд') ||
                                 paragraph.trim().startsWith('Відповідальна') ||
                                 paragraph.trim().startsWith('Комісія') ||
                                 paragraph.trim().startsWith('Терміни')) {
                        return (
                          <h5 key={pIndex} className={styles.subsectionTitle}>
                            {paragraph}
                          </h5>
                        );
                      } else if (paragraph.trim().startsWith('Булінг') ||
                                 paragraph.trim().startsWith('Цькування') ||
                                 paragraph.trim().startsWith('Така ж') ||
                                 paragraph.trim().startsWith('За булінг')) {
                        return (
                          <div key={pIndex} className={styles.definitionBox}>
                            <p>{paragraph}</p>
                          </div>
                        );
                      } else if (paragraph.trim().startsWith('Заяви щодо')) {
                        return (
                          <div key={pIndex} className={styles.contactInfo}>
                            <p>{paragraph}</p>
                          </div>
                        );
                      } else if (paragraph.trim()) {
                        return <p key={pIndex}>{paragraph}</p>;
                      }
                      return null;
                    })}
                  </div>
                  {article.photoUrls && (
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '20px',
                      justifyContent: 'center',
                      marginTop: '20px',
                      width: '100%'
                    }}>
                      {article.photoUrls.split(',').filter(url => url.trim()).map((url, photoIndex) => (
                        <div key={photoIndex} style={{ 
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
                            alt={`Фото ${photoIndex + 1}`}
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
                  {article.link && (
                    <div className={styles.articleLink}>
                      <a 
                        href={article.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.documentLink}
                      >
                         {localized.linkText || t("viewDocument")}
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
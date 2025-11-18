'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/psychologicalsupport.module.css';
import Image from 'next/image';
import kogutPhoto from '@/assets/kogut.jpg';
import { useTranslation } from '@/contexts/TranslationProvider';

export default function PsychologicalSupport() {
  const { t, locale } = useTranslation();
  const [openAccordion, setOpenAccordion] = useState(null);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [renderKey, setRenderKey] = useState(0);

  // Діагностика перекладу
  console.log('PsychologicalSupport - Current locale:', locale);
  console.log('PsychologicalSupport - Translation test:', t('psychologicalSupport'));

  // Відстеження змін мови
  useEffect(() => {
    console.log('PsychologicalSupport - Language changed to:', locale);
    setRenderKey(prev => prev + 1);
  }, [locale]);

  // Функція для отримання локалізованого контенту
  const getLocalizedContent = (item) => {
    if (locale === 'en') {
      return {
        title: item.titleEn || item.title, // fallback до української
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

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      console.log(" --- start ---");

      const response = await fetch("http://localhost:3001/api/psychological-support");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Articles loaded:", data);

      // Сортуємо за ID (новіші зверху)
      const sortedArticles = data.sort((a, b) => b.id - a.id);
      setArticles(sortedArticles);
      return data;
    } catch (error) {
      console.error("Error loading articles:", error);
      setArticles([]);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  // Розділяємо динамічні елементи на акордеони та елементи для синього фону
  const accordionItems = articles.filter(item => {
    const localized = getLocalizedContent(item);
    return localized.title && localized.content && !localized.text && !item.link;
  });
  
  // Елементи для відображення на синьому фоні (текст та посилання)
  const blueBackgroundItems = articles.filter(item => {
    const localized = getLocalizedContent(item);
    return localized.text || item.link;
  }).sort((a, b) => a.id - b.id); // Сортуємо за ID в прямому порядку (старіші зверху)

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
    <div className={styles.psychologicalSupportPage} lang={locale} key={`${locale}-${renderKey}`}>
      <div className={styles.intellectContent}>
        <h1 className={styles.intellectTitle}>{t("psychologicalSupport")}</h1>
        
        {/* Психолог секція */}
        <div className={styles.psychologistSection}>
          <div className={styles.psychologistInfo}>
            <Image 
                src={kogutPhoto} 
                alt={t("psychologistName")}
                width={300}
                height={400}
                priority
                className={styles.psychologistImage}
              />
            <div className={styles.psychologistDetails}>
              <h2 className={styles.psychologistName}>{t("psychologistName")}</h2>
              <p className={styles.psychologistTitle}>{t("psychologistTitle")}</p>
              <p className={styles.psychologistDescription}>{t("psychologistDescription")}</p>
              <p className={styles.psychologistGoal}>{t("psychologistGoal")}</p>
              
              <div className={styles.psychologistPrinciples}>
                <h3>{t("psychologistPrinciples")}</h3>
                <ul>
                  <li>{t("principleConfidentiality")}</li>
                  <li>{t("principleNonJudgmental")}</li>
                  <li>{t("principleCompetence")}</li>
                </ul>
              </div>
              
              <div className={styles.workDirections}>
                <h3>{t("workDirections")}</h3>
                <ul>
                  <li>{t("directionLearning")}</li>
                  <li>{t("directionEmotional")}</li>
                  <li>{t("directionInterpersonal")}</li>
                  <li>{t("directionSelfDiscovery")}</li>
                </ul>
              </div>
              
              <div className={styles.contactInfo}>
                <h3>{t("howToContact")}</h3>
                <p>{t("contactDescription")}</p>
                <p><strong>{t("personalConsultation")}</strong></p>
                <p><strong>{t("workSchedule")}</strong></p>
                <p><strong>{t("officeNumber")}</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Фон з посиланнями - тут додаємо динамічні елементи для синього фону */}
        <div className={styles.resourcesSection}>
          <div className={styles.resourcesContainer}>
            <div className={styles.resourcesLinks}>
              <a 
                href="https://docs.google.com/document/d/12j01IFFezy-2L8ApwAOyFbDsqN8VMCOy/edit#bookmark=id.mxi12wl6tkex" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.resourceLink}
              >
                {t("pedagogicalPractice")}
              </a>
              <a 
                href="https://docs.google.com/document/d/1xFEVzA5ECo0_C6NCLXrXeX24mTEr_FqZ/edit" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.resourceLink}
              >
                {t("adaptationAdvice56")}
              </a>
              <a 
                href="https://docs.google.com/document/d/1wWtFj2L1Rp2QfXMaw0FwB6ELzt6vpsZy/edit?usp=drivesdk&ouid=105927083664009103834&rtpof=true&sd=true" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.resourceLink}
              >
                {t("adaptationRecommendations10")}
              </a>
              <a 
                href="https://docs.google.com/document/d/1FU4BnN4c00ZJ2eKHV7COM_ToBzLKDHJ0/edit" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.resourceLink}
              >
                {t("childrenInShelter")}
              </a>
              <a 
                href="https://howareu.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.resourceLink}
              >
                {t("mentalHealthProgram")}
              </a>
            </div>

            {/* Динамічні елементи для синього фону - аналогічно до сторінки "На допомогу вчителю" */}
            {blueBackgroundItems.length > 0 && (
              <>
                <div className={styles.divider}></div>
                <div className={styles.documentsBlock}>
                  {blueBackgroundItems.map((item, index) => {
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
                </div>
              </>
            )}
          </div>
        </div>
        
        <h2 className={styles.articlesTitle}>{t("usefulArticles")}</h2>
        
        {/* Динамічні акордеони додаються зверху */}
        {isLoading ? (
          <div className={styles.accordionContainer}>
            <div className={styles.loadingMessage}>Завантаження додаткових матеріалів...</div>
          </div>
        ) : accordionItems.length > 0 ? (
          accordionItems.map((item, index) => {
            const localized = getLocalizedContent(item);
            
            return (
              <div key={item.id} className={styles.accordionItem}>
                <button
                  className={`${styles.accordionHeader} ${openAccordion === index ? styles.active : ''}`}
                  onClick={() => toggleAccordion(index)}
                >
                  <span className={styles.accordionTitle}>{localized.title}</span>
                  <span className={styles.accordionIcon}>
                    {openAccordion === index ? '−' : '+'}
                  </span>
                </button>
                
                <div className={`${styles.accordionContent} ${openAccordion === index ? styles.open : ''}`}>
                  <div className={styles.accordionText}>
                    {/* Відображаємо тільки основний текст акордеону */}
                    {renderTextWithLineBreaks(localized.content)}
                  </div>
                </div>
              </div>
            );
          })
        ) : null}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import firebird from '@/assets/firebird2.png';
import styles from '@/styles/students.module.css';
import { useTranslation } from '@/contexts/TranslationProvider';

const StudentsPage = () => {
  const { t, locale } = useTranslation();
  const [activeSections, setActiveSections] = useState({});
  const [dynamicItems, setDynamicItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Функція для отримання локалізованого контенту
  const getLocalizedContent = (item) => {
    if (locale === 'en') {
      return {
        heading: item.headingEn || item.heading,
        content: item.contentEn || item.content,
        textOnly: item.textOnlyEn || item.textOnly
      };
    }
    return {
      heading: item.heading,
      content: item.content,
      textOnly: item.textOnly
    };
  };

  useEffect(() => {
    fetchDynamicItems();
  }, [locale]); // Додаємо locale як залежність

  const fetchDynamicItems = async () => {
    try {
      console.log('Завантаження даних для сторінки "Учням"...');
      const response = await fetch('http://localhost:3001/api/for-students');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Отримано даних:', data.length);
        setDynamicItems(data);
      } else {
        console.error('Помилка завантаження:', response.status);
      }
    } catch (error) {
      console.error('Помилка завантаження даних:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (sectionId) => {
    setActiveSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Розділяємо динамічні елементи на різні типи
  const accordionItems = dynamicItems.filter(item => {
    const localized = getLocalizedContent(item);
    // Акордеон показується тільки якщо є заголовок І контент
    return localized.heading && localized.content;
  });
  
  const textOnlyItems = dynamicItems.filter(item => {
    const localized = getLocalizedContent(item);
    // Текст тільки показується якщо є textOnly АЛЕ немає заголовка, контенту, URL та фото
    return localized.textOnly && !localized.heading && !localized.content && !item.url && (!item.photoUrls || item.photoUrls.length === 0);
  });
  
  // Елементи для відображення під акордеонами (посилання та фото)
  const bottomItems = dynamicItems.filter(item => {
    const localized = getLocalizedContent(item);
    
    // Показуємо елемент якщо він має посилання або фото
    const hasUrl = !!item.url;
    const hasPhotos = item.photoUrls && Array.isArray(item.photoUrls) && item.photoUrls.length > 0;
    
    return hasUrl || hasPhotos;
  });

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
    <>
      <div className="container" lang={locale}>
        <div className="background">
          <div className="gradientBg"></div>
        </div>
        
        <main className={styles.studentsMain}>
          {/* Динамічні акордеони додаються зверху */}
          <div className={styles.accordionList}>
            {accordionItems.map((item, index) => {
              const localized = getLocalizedContent(item);
              
              return (
                <section key={item.id} className={styles.studentsSection}>
                  <div 
                    className={`${styles.sectionHeader} ${activeSections[`dynamic-${item.id}`] ? styles.active : ''}`}
                    onClick={() => toggleSection(`dynamic-${item.id}`)}
                  >
                    <h3 className={styles.sectionTitle}>{localized.heading}</h3>
                    <div className={styles.sectionMarker}></div>
                  </div>
                  
                  <div className={`${styles.sectionContent} ${activeSections[`dynamic-${item.id}`] ? styles.active : ''}`}>
                    <div className={styles.detailedDescription}>
                      {renderTextWithLineBreaks(localized.content)}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          {/* Секція про те, як володіти собою */}
          <section className={styles.studentsSection}>
            <div 
              className={`${styles.sectionHeader} ${activeSections.selfControl ? styles.active : ''}`}
              onClick={() => toggleSection('selfControl')}
            >
              <h3 className={styles.sectionTitle}>{t('howToControlYourself')}</h3>
              <div className={styles.sectionMarker}></div>
            </div>
            
            <div className={styles.sectionContent}>
              <div className={styles.detailedDescription}>
                <p>{t('selfControlRule1')}</p>
                <p>{t('selfControlRule2')}</p>
                <p>{t('selfControlRule3')}</p>
                <p>{t('selfControlRule3Note')}</p>
                <p>{t('selfControlRule4')}</p>
                <p>{t('selfControlRule5')}</p>
                <p>{t('selfControlRule6')}</p>
                <p>{t('selfControlRule7')}</p>
                <p>{t('selfControlRule8')}</p>
                <p>{t('toleranceDefinition')}</p>
                <p>{t('aggressionDefinition')}</p>
              </div>
            </div>
          </section>

          {/* Секція про те, як стати сильнішим і красивим */}
          <section className={styles.studentsSection}>
            <div 
              className={`${styles.sectionHeader} ${activeSections.stronger ? styles.active : ''}`}
              onClick={() => toggleSection('stronger')}
            >
              <h3 className={styles.sectionTitle}>{t('becomeStrongerAndBeautiful')}</h3>
              <div className={styles.sectionMarker}></div>
            </div>
            
            <div className={styles.sectionContent}>
              <div className={styles.detailedDescription}>
                <p>{t('strongerBeautifulText1')}</p>
                <p>{t('strongerBeautifulText2')}</p>
                <p>{t('strongerBeautifulText3')}</p>
                <p>{t('strongerBeautifulText4')}</p>
                <p>{t('strongerBeautifulText5')}</p>
                <p>{t('strongerBeautifulText6')}</p>
                <p>{t('strongerBeautifulText7')}</p>
                <p>{t('strongerBeautifulText8')}</p>
                <p>{t('strongerBeautifulText9')}</p>
                <p>{t('strongerBeautifulText10')}</p>
                <p>{t('strongerBeautifulText11')}</p>
              </div>
            </div>
          </section>

          {/* Секція про сніданок */}
          <section className={styles.studentsSection}>
            <div 
              className={`${styles.sectionHeader} ${activeSections.breakfast ? styles.active : ''}`}
              onClick={() => toggleSection('breakfast')}
            >
              <h3 className={styles.sectionTitle}>{t('properBreakfast')}</h3>
              <div className={styles.sectionMarker}></div>
            </div>
            
            <div className={styles.sectionContent}>
              <div className={styles.detailedDescription}>
                <p>{t('breakfastText1')}</p>
                <p>{t('breakfastText2')}</p>
                <p>{t('breakfastText3')}</p>
                <p>{t('breakfastText4')}</p>
                <p>{t('breakfastText5')}</p>
                <p>{t('breakfastText6')}</p>
              </div>
            </div>
          </section>

          {/* Секція з порадами */}
          <section className={styles.studentsSection}>
            <div 
              className={`${styles.sectionHeader} ${activeSections.tips ? styles.active : ''}`}
              onClick={() => toggleSection('tips')}
            >
              <h3 className={styles.sectionTitle}>{t('sevenAdviceForStudents')}</h3>
              <div className={styles.sectionMarker}></div>
            </div>
            
            <div className={styles.sectionContent}>
              <div className={styles.detailedDescription}>
                <p><span className={styles.adviceName}>{t('firstAdvice')}</span></p>
                <p>{t('firstAdviceText1')}</p>
                <p>{t('firstAdviceText2')}</p>
                <p>{t('firstAdviceText3')}</p>

                <p><span className={styles.adviceName}>{t('secondAdvice')}</span></p>
                <p>{t('secondAdviceText1')}</p>
                <p>{t('secondAdviceText2')}</p>
                <p>{t('secondAdviceText3')}</p>
                <p>{t('secondAdviceText4')}</p>

                <p><span className={styles.adviceName}>{t('thirdAdvice')}</span></p>
                <p>{t('thirdAdviceText1')}</p>
                <p>{t('thirdAdviceText2')}</p>

                <p><span className={styles.adviceName}>{t('fourthAdvice')}</span></p>
                <p>{t('fourthAdviceText1')}</p>
                <p>{t('fourthAdviceText2')}</p>
                <p>{t('fourthAdviceText3')}</p>

                <p><span className={styles.adviceName}>{t('fifthAdvice')}</span></p>
                <p>{t('fifthAdviceText1')}</p>
                <p>{t('fifthAdviceText2')}</p>

                <p><span className={styles.adviceName}>{t('sixthAdvice')}</span></p>
                <p>{t('sixthAdviceText1')}</p>
                <p>{t('sixthAdviceText2')}</p>
                <p>{t('sixthAdviceText3')}</p>

                <p><span className={styles.adviceName}>{t('seventhAdvice')}</span></p>
                <p>{t('seventhAdviceText1')}</p>
              </div>
            </div>
          </section>

          {/* Секція з порадами випускникам */}
          <section className={styles.studentsSection}>
            <div 
              className={`${styles.sectionHeader} ${activeSections.graduateTips ? styles.active : ''}`}
              onClick={() => toggleSection('graduateTips')}
            >
              <h3 className={styles.sectionTitle}>{t('adviceForGraduates')}</h3>
              <div className={styles.sectionMarker}></div>
            </div>
            
            <div className={styles.sectionContent}>
              <div className={styles.detailedDescription}>
                <p>{t('graduatesAdviceText1')}</p>
                <p>{t('graduatesAdviceText2')}</p>
                <p>{t('graduatesAdviceText3')}</p>
                <p>{t('graduatesAdviceText4')}</p>
                <p>{t('graduatesAdviceText5')}</p>
                <p>{t('graduatesAdviceText6')}</p>
              </div>
            </div>
          </section>

          {/* Секція про увагу */}
          <section className={styles.studentsSection}>
            <div 
              className={`${styles.sectionHeader} ${activeSections.attention ? styles.active : ''}`}
              onClick={() => toggleSection('attention')}
            >
              <h3 className={styles.sectionTitle}>{t('attentionIsResult')}</h3>
              <div className={styles.sectionMarker}></div>
            </div>
            
            <div className={styles.sectionContent}>
              <div className={styles.detailedDescription}>
                <p>{t('attentionResultText1')}</p>
                <p>{t('attentionResultText2')}</p>
                <p>{t('attentionResultText3')}</p>
                <p>{t('attentionResultText4')}</p>
                <p>{t('attentionResultText5')}</p>
                <p>{t('attentionResultText6')}</p>
                <p>{t('attentionResultText7')}</p>
                <p>{t('attentionResultText8')}</p>
                <p>{t('attentionResultText9')}</p>
                <p>{t('attentionResultText10')}</p>
                <p>{t('attentionResultText11')}</p>
                <p>{t('attentionResultText12')}</p>
                <p>{t('attentionResultText13')}</p>
                <p>{t('attentionResultText14')}</p>
                <p>{t('attentionResultText15')}</p>
                <p>{t('attentionResultText16')}</p>
                <p>{t('attentionResultText17')}</p>
                <p>{t('attentionResultText18')}</p>
                <p>{t('attentionResultText19')}</p>
                <p>{t('attentionResultText20')}</p>
                <p>{t('attentionResultText21')}</p>
                <p>{t('attentionResultText22')}</p>
                <p>{t('attentionResultText23')}</p>
              </div>
            </div>
          </section>

          {/* Секція про те, як не хвилюватися перед контрольною роботою */}
          <section className={styles.studentsSection}>
            <div 
              className={`${styles.sectionHeader} ${activeSections.testAnxiety ? styles.active : ''}`}
              onClick={() => toggleSection('testAnxiety')}
            >
              <h3 className={styles.sectionTitle}>{t('howNotToWorryBeforeTest')}</h3>
              <div className={styles.sectionMarker}></div>
            </div>
            
            <div className={styles.sectionContent}>
              <div className={styles.detailedDescription}>
                <p>{t('noWorryText1')}</p>
                <p>{t('noWorryText2')}</p>
                <p>{t('noWorryText3')}</p>
                <p>{t('noWorryText4')}</p>
                <p>{t('noWorryText5')}</p>
                <p>{t('noWorryText6')}</p>
                <p>{t('noWorryText7')}</p>
                <p>{t('noWorryText8')}</p>
                <p>{t('noWorryText9')}</p>
                <p>{t('noWorryText10')}</p>
                <p>{t('noWorryText11')}</p>
                <p>{t('noWorryText12')}</p>
                <p>{t('noWorryText13')}</p>
                <p>{t('noWorryText14')}</p>
                <p>{t('noWorryText15')}</p>
                <p>{t('noWorryText16')}</p>
                <p>{t('noWorryText17')}</p>
              </div>
            </div>
          </section>

          {/* Секція з рецептами для тестування */}
          <section className={styles.studentsSection}>
            <div 
              className={`${styles.sectionHeader} ${activeSections.testRecipes ? styles.active : ''}`}
              onClick={() => toggleSection('testRecipes')}
            >
              <h3 className={styles.sectionTitle}>{t('universalTestRecipes')}</h3>
              <div className={styles.sectionMarker}></div>
            </div>
            
            <div className={styles.sectionContent}>
              <div className={styles.detailedDescription}>
                <p>{t('universalRecipesText1')}</p>
                <p>{t('universalRecipesText2')}</p>
                <p>{t('universalRecipesText3')}</p>
                <p>{t('universalRecipesText4')}</p>
                <p>{t('universalRecipesText5')}</p>
                <p>{t('universalRecipesText6')}</p>
                <p>{t('universalRecipesText7')}</p>
                <p>{t('universalRecipesText8')}</p>
                <p>{t('universalRecipesText9')}</p>
                <p>{t('universalRecipesText10')}</p>
                <p>{t('universalRecipesText11')}</p>
              </div>
            </div>
          </section>

          {/* Секція з підготовкою до іспиту */}
          <section className={styles.studentsSection}>
            <div 
              className={`${styles.sectionHeader} ${activeSections.examPrep ? styles.active : ''}`}
              onClick={() => toggleSection('examPrep')}
            >
              <h3 className={styles.sectionTitle}>{t('howToPrepareForExam')}</h3>
              <div className={styles.sectionMarker}></div>
            </div>
            
            <div className={styles.sectionContent}>
              <div className={styles.detailedDescription}>
                <p>{t('examPreparationText1')}</p>
                <p>{t('examPreparationText2')}</p>
                <p>{t('examPreparationText3')}</p>
                <p>{t('examPreparationText4')}</p>
                <p>{t('examPreparationText5')}</p>
                <p>{t('examPreparationText6')}</p>
                <p>{t('examPreparationText7')}</p>
                <p>{t('examPreparationText8')}</p>
                <p>{t('examPreparationText9')}</p>
                <p>{t('examPreparationText10')}</p>
                <p>{t('examPreparationText11')}</p>
                <p>{t('examPreparationText12')}</p>
                <p>{t('examPreparationText13')}</p>
                <p>{t('examPreparationText14')}</p>
                <p>{t('examPreparationText15')}</p>
                <p>{t('examPreparationText16')}</p>
              </div>
            </div>
          </section>

          {/* Секція з правилами здорового способу життя */}
          <section className={styles.studentsSection}>
            <div 
              className={`${styles.sectionHeader} ${activeSections.healthyLife ? styles.active : ''}`}
              onClick={() => toggleSection('healthyLife')}
            >
              <h3 className={styles.sectionTitle}>{t('sevenHealthyLifeRules')}</h3>
              <div className={styles.sectionMarker}></div>
            </div>
            
            <div className={styles.sectionContent}>
              <div className={styles.detailedDescription}>
                <p>{t('healthyRulesText1')}</p>
                <p>{t('healthyRulesText2')}</p>
                <p>{t('healthyRulesText3')}</p>
                <p>{t('healthyRulesText4')}</p>
                <p>{t('healthyRulesText5')}</p>
                <p>{t('healthyRulesText6')}</p>
                <p>{t('healthyRulesText7')}</p>
                <p>{t('healthyRulesText8')}</p>
                <p>{t('healthyRulesText9')}</p>
                <p>{t('healthyRulesText10')}</p>
                <p>{t('healthyRulesText11')}</p>
                <p>{t('healthyRulesText12')}</p>
                <p>{t('healthyRulesText13')}</p>
                <p>{t('healthyRulesText14')}</p>
                <p>{t('healthyRulesText15')}</p>
                <p>{t('healthyRulesText16')}</p>
                <p>{t('healthyRulesText17')}</p>
                <p>{t('healthyRulesText18')}</p>
                <p>{t('healthyRulesText19')}</p>
                <p>{t('healthyRulesText20')}</p>
              </div>
            </div>
          </section>

          {/* Секція з вправами для очей */}
          <section className={styles.studentsSection}>
            <div 
              className={`${styles.sectionHeader} ${activeSections.eyeExercises ? styles.active : ''}`}
              onClick={() => toggleSection('eyeExercises')}
            >
              <h3 className={styles.sectionTitle}>{t('eyeExercises')}</h3>
              <div className={styles.sectionMarker}></div>
            </div>
            
            <div className={styles.sectionContent}>
              <div className={styles.detailedDescription}>
                <p>{t('eyeExercisesText1')}</p>
                <p>{t('eyeExercisesText2')}</p>
                <p>{t('eyeExercisesText3')}</p>
                <p>{t('eyeExercisesText4')}</p>
                <p>{t('eyeExercisesText5')}</p>
                <p>{t('eyeExercisesText6')}</p>
                <p>{t('eyeExercisesText7')}</p>
              </div>
            </div>
          </section>

          {/* Секція з вправами для спини */}
          <section className={styles.studentsSection}>
            <div 
              className={`${styles.sectionHeader} ${activeSections.backExercises ? styles.active : ''}`}
              onClick={() => toggleSection('backExercises')}
            >
              <h3 className={styles.sectionTitle}>{t('backExercises')}</h3>
              <div className={styles.sectionMarker}></div>
            </div>
            
            <div className={styles.sectionContent}>
              <div className={styles.detailedDescription}>
                <p>{t('backExercisesText1')}</p>
                <p>{t('backExercisesText2')}</p>
                <p>{t('backExercisesText3')}</p>
                <p>{t('backExercisesText4')}</p>
                <p>{t('backExercisesText5')}</p>
                <p>{t('backExercisesText6')}</p>
                <p>{t('backExercisesText7')}</p>
                <p>{t('backExercisesText8')}</p>
                <p>{t('backExercisesText9')}</p>
                <p>{t('backExercisesText10')}</p>
                <p>{t('backExercisesText11')}</p>
                <p>{t('backExercisesText12')}</p>
              </div>
            </div>
          </section>

          {/* Секція з етикетними нормами */}
          <section className={styles.studentsSection}>
            <div 
              className={`${styles.sectionHeader} ${activeSections.etiquette ? styles.active : ''}`}
              onClick={() => toggleSection('etiquette')}
            >
              <h3 className={styles.sectionTitle}>{t('etiquetteNorms')}</h3>
              <div className={styles.sectionMarker}></div>
            </div>
            
            <div className={styles.sectionContent}>
              <div className={styles.detailedDescription}>
                <p>{t('etiquetteNormsText1')}</p>
                <p>{t('etiquetteNormsText2')}</p>
                <p>{t('etiquetteNormsText3')}</p>
                <p>{t('etiquetteNormsText4')}</p>
                <p>{t('etiquetteNormsText5')}</p>
                <p>{t('etiquetteNormsText6')}</p>
                <p>{t('etiquetteNormsText7')}</p>
                <p>{t('etiquetteNormsText8')}</p>
                <p>{t('etiquetteNormsText9')}</p>
                <p>{t('etiquetteNormsText10')}</p>
                <p>{t('etiquetteNormsText11')}</p>
                <p>{t('etiquetteNormsText12')}</p>
                <p>{t('etiquetteNormsText13')}</p>
                <p>{t('etiquetteNormsText14')}</p>
                <p>{t('etiquetteNormsText15')}</p>
                <p>{t('etiquetteNormsText16')}</p>
                <p><span className={styles.adviceName}>{t('etiquetteNormsText17')}</span></p>
                <p>{t('etiquetteNormsText18')}</p>
                <p>{t('etiquetteNormsText19')}</p>
                <p>{t('etiquetteNormsText20')}</p>
                <p>{t('etiquetteNormsText21')}</p>

                <p><span className={styles.adviceName}>{t('etiquetteNormsText22')}</span></p>
                <p>{t('etiquetteNormsText23')}</p>
                <p>{t('etiquetteNormsText24')}</p>

                <p><span className={styles.adviceName}>{t('etiquetteNormsText25')}</span></p>
                <p>{t('etiquetteNormsText26')}</p>
                <p>{t('etiquetteNormsText27')}</p>
                <p>{t('etiquetteNormsText28')}</p>
                <p>{t('etiquetteNormsText29')}</p>
                <p>{t('etiquetteNormsText30')}</p>
                <p>{t('etiquetteNormsText31')}</p>
              </div>
            </div>
          </section>

          {/* Динамічні текстові блоки (textOnly) - ПІСЛЯ всіх акордеонів */}
          {textOnlyItems.length > 0 && (
            <div className={styles.warningMessage}>
              {textOnlyItems.map((item, index) => {
                const localized = getLocalizedContent(item);
                return (
                  <div key={item.id}>
                    {renderTextWithLineBreaks(localized.textOnly)}
                  </div>
                );
              })}
            </div>
          )}

          {/* Динамічні елементи для відображення під акордеонами */}
          {bottomItems.length > 0 && (
            <div className={styles.warningMessage}>
              {bottomItems.map((item, index) => {
                const localized = getLocalizedContent(item);
                
                return (
                  <div key={item.id}>
                    {/* Заголовок */}
                    {localized.heading && (
                      <h3 style={{
                        fontFamily: 'Montserrat Alternates, sans-serif',
                        fontSize: '24px',
                        color: '#182BA1',
                        marginBottom: '15px',
                        fontWeight: '700'
                      }}>
                        {localized.heading}
                      </h3>
                    )}
                    
                    {/* Текст */}
                    {localized.content && (
                      <div style={{
                        color: '#000000',
                        fontSize: '16px',
                        marginBottom: '15px',
                        lineHeight: '1.6'
                      }}>
                        {renderTextWithLineBreaks(localized.content)}
                      </div>
                    )}
                    
                    {/* Текст тільки */}
                    {localized.textOnly && (
                      <div style={{
                        color: '#000000',
                        fontSize: '16px',
                        marginBottom: '15px',
                        lineHeight: '1.6'
                      }}>
                        {renderTextWithLineBreaks(localized.textOnly)}
                      </div>
                    )}
                    
                    {/* Посилання */}
                    {item.url && (
                      <div className={styles.linkSection} style={{ marginBottom: '15px' }}>
                        <a 
                          href={item.url} 
                          className={styles.documentLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {item.url}
                        </a>
                      </div>
                    )}
                    
                    {/* Фотографії */}
                    {item.photoUrls && Array.isArray(item.photoUrls) && item.photoUrls.length > 0 && (
                      <div className={styles.photo}>
                        {item.photoUrls.map((url, photoIndex) => (
                          <Image 
                            key={photoIndex}
                            src={url.startsWith('http') ? url : `http://localhost:3001${url}`}
                            alt={`Фото для учня ${photoIndex + 1}`}
                            width={1800}
                            height={1000}
                            style={{ width: '100%', height: 'auto' }}
                            priority={photoIndex === 0}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Зображення Firebird */}
          <div className={styles.firebirdContainer}>
            <Image src={firebird} alt="Firebird" className={styles.firebirdImage} />
          </div>
        </main>
      </div>
    </>
  );
};

export default StudentsPage;
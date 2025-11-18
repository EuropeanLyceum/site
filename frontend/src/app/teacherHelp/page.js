'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/teacherhelp.module.css';
import { useTranslation } from '@/contexts/TranslationProvider';

export default function TeacherHelpPage() {
  const { t, locale } = useTranslation();
  const [activeSections, setActiveSections] = useState([]);
  const [dynamicItems, setDynamicItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [renderKey, setRenderKey] = useState(0);

  // Діагностика перекладу
  console.log('TeacherHelp - Current locale:', locale);
  console.log('TeacherHelp - Translation test:', t('teacherHelp'));

  // Відстеження змін мови
  useEffect(() => {
    console.log('TeacherHelp - Language changed to:', locale);
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

  useEffect(() => {
    fetchDynamicItems();
  }, []);

  const fetchDynamicItems = async () => {
    try {
      // Змінюємо URL на порт 3000, де знаходиться API
      const response = await fetch('http://localhost:3001/api/help-teacher');
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

  const toggleSection = (index) => {
    setActiveSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Розділяємо динамічні елементи на акордеони та елементи для рожевого фону
  const accordionItems = dynamicItems.filter(item => {
    const localized = getLocalizedContent(item);
    return localized.title && localized.content;
  });
  
  // Елементи для відображення на рожевому фоні (текст та посилання)
  const pinkBackgroundItems = dynamicItems.filter(item => {
    const localized = getLocalizedContent(item);
    // Текст без заголовка та контенту акордеону (може бути з посиланням або без)
    return (localized.text && !localized.title && !localized.content) ||
           // Посилання без заголовка та контенту акордеону
           (item.link && !localized.title && !localized.content);
  });
  
  // Розділяємо на текст та посилання для рожевого фону
  const textItems = pinkBackgroundItems.filter(item => {
    const localized = getLocalizedContent(item);
    return localized.text && !localized.title && !localized.content;
  });
  const linkItems = pinkBackgroundItems.filter(item => {
    const localized = getLocalizedContent(item);
    return item.link && !localized.title && !localized.content;
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
    <div className={styles.teacherHelpPage} lang={locale} key={`${locale}-${renderKey}`}>
      <main className={styles.teacherHelpMain}>
        <div className={styles.titleContainer}>
          <h2 className={styles.teacherHelpTitle}>{t("teacherHelp")}</h2>
        </div>

        {/* Динамічні акордеони додаються зверху */}
        {accordionItems.map((item, index) => {
            const localized = getLocalizedContent(item);
            
            return (
              <section key={item.id} className={styles.teacherHelpSection}>
                <div 
                  className={`${styles.sectionHeader} ${activeSections.includes(index) ? styles.active : ''}`}
                  onClick={() => toggleSection(index)}
                >
                  <h3 className={styles.sectionTitle}>{localized.title}</h3>
                  <div className={styles.sectionMarker}></div>
                </div>
                
                <div className={`${styles.sectionContent} ${activeSections.includes(index) ? styles.active : ''}`}>
                  <div className={styles.detailedDescription}>
                    {/* Відображаємо текст акордеону з пропущеними рядками */}
                    {renderTextWithLineBreaks(localized.content)}
                    
                    {/* Додатковий текст, якщо є */}
                    {localized.text && (
                      <div className={styles.additionalText}>
                        {renderTextWithLineBreaks(localized.text)}
                      </div>
                    )}
                    
                    {/* Посилання, якщо є (можна комбінувати з текстом) */}
                    {item.link && (
                      <div className={styles.linkSection}>
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
                </div>
              </section>
            );
          })}

        {/* Статичні акордеони */}
        <section className={styles.teacherHelpSection}>
          <div 
            className={`${styles.sectionHeader} ${activeSections.includes(accordionItems.length) ? styles.active : ''}`}
            onClick={() => toggleSection(accordionItems.length)}
          >
            <h3 className={styles.sectionTitle}>{t("activeGamesTitle")}</h3>
            <div className={styles.sectionMarker}></div>
          </div>
          
          <div className={`${styles.sectionContent} ${activeSections.includes(accordionItems.length) ? styles.active : ''}`}>
            <div className={styles.detailedDescription}>
              <p>{t("activeGamesIntro")}</p>
              <p><span className={styles.gameName}>{t("game1Name")}</span> {t("game1Description")}</p>
              <p><span className={styles.gameName}>{t("game2Name")}</span> {t("game2Description")}</p>
              <p><span className={styles.gameName}>{t("game3Name")}</span> {t("game3Description")}</p>
              <p><span className={styles.gameName}>{t("game4Name")}</span> {t("game4Description")}</p>
              <p><span className={styles.gameName}>{t("game5Name")}</span> {t("game5Description")}</p>
              <p>{t("game5Instruction")}</p>
              <p><span className={styles.gameName}>{t("game6Name")}</span> {t("game6Description")}</p>
              <p>{t("game6Instruction")}</p>
              <p><span className={styles.gameName}>{t("game7Name")}</span> {t("game7Description")}</p>
            </div>
          </div>
        </section>
        
        <section className={styles.teacherHelpSection}>
          <div 
            className={`${styles.sectionHeader} ${activeSections.includes(accordionItems.length + 1) ? styles.active : ''}`}
            onClick={() => toggleSection(accordionItems.length + 1)}
          >
            <h3 className={styles.sectionTitle}>{t("methodologicalRecommendations")}</h3>
            <div className={styles.sectionMarker}></div>
          </div>
          
          <div className={`${styles.sectionContent} ${activeSections.includes(accordionItems.length + 1) ? styles.active : ''}`}>
            <div className={styles.detailedDescription}>
              <p>{t("methodologicalRecommendationsText1")}</p>
              <p>{t("methodologicalRecommendationsText2")}</p>
              <p>{t("methodologicalRecommendationsText3")}</p>
            </div>
          </div>
        </section>
        
        <section className={styles.teacherHelpSection}>
          <div 
            className={`${styles.sectionHeader} ${activeSections.includes(accordionItems.length + 2) ? styles.active : ''}`}
            onClick={() => toggleSection(accordionItems.length + 2)}
          >
            <h3 className={styles.sectionTitle}>{t("lessonEffectivenessTitle")}</h3>
            <div className={styles.sectionMarker}></div>
          </div>
          
          <div className={`${styles.sectionContent} ${activeSections.includes(accordionItems.length + 2) ? styles.active : ''}`}>
            <div className={styles.detailedDescription}>
              <ol className={styles.numberedList}>
                <li>
                  <strong>{t("lessonEffectivenessPoint1")}</strong>
                  <p>{t("lessonEffectivenessText1")}</p>
                </li>
                <li>
                  <strong>{t("lessonEffectivenessPoint2")}</strong>
                  <p>{t("lessonEffectivenessText2")}</p>
                </li>
                <li>
                  <strong>{t("lessonEffectivenessPoint3")}</strong>
                  <p>{t("lessonEffectivenessText3")}</p>
                </li>
                <li>
                  <strong>{t("lessonEffectivenessPoint4")}</strong>
                  <p>{t("lessonEffectivenessText4")}</p>
                </li>
                <li>
                  <strong>{t("lessonEffectivenessPoint5")}</strong>
                </li>
                <li>
                  <strong>{t("lessonEffectivenessPoint6")}</strong>
                  <p>{t("lessonEffectivenessText6")}</p>
                </li>
                <li>
                  <strong>{t("lessonEffectivenessPoint7")}</strong>
                  <p>{t("lessonEffectivenessText7")}</p>
                </li>
                <li>
                  <strong>{t("lessonEffectivenessPoint8")}</strong>
                </li>
                <li>
                  <strong>{t("lessonEffectivenessPoint9")}</strong>
                  <p>{t("lessonEffectivenessText9")}</p>
                </li>
                <li>
                  <strong>{t("lessonEffectivenessPoint10")}</strong>
                  <p>{t("lessonEffectivenessText10")}</p>
                </li>
                <li>
                  <strong>{t("lessonEffectivenessPoint11")}</strong>
                </li>
              </ol>
            </div>
          </div>
        </section>
        
        <section className={styles.teacherHelpSection}>
          <div 
            className={`${styles.sectionHeader} ${activeSections.includes(accordionItems.length + 3) ? styles.active : ''}`}
            onClick={() => toggleSection(accordionItems.length + 3)}
          >
            <h3 className={styles.sectionTitle}>{t("classDisciplineTitle")}</h3>
            <div className={styles.sectionMarker}></div>
          </div>
          
          <div className={`${styles.sectionContent} ${activeSections.includes(accordionItems.length + 3) ? styles.active : ''}`}>
            <div className={styles.detailedDescription}>
              <p>{t("classDisciplineText1")}</p>
              <p>{t("classDisciplineText2")}</p>
              <p><strong>{t("classDisciplineRulesTitle")}</strong></p>
              <ul className={styles.bulletList}>
                <li>{t("classDisciplineRule1")}</li>
                <li>{t("classDisciplineRule2")}</li>
                <li>{t("classDisciplineRule3")}</li>
                <li>{t("classDisciplineRule4")}</li>
                <li>{t("classDisciplineRule5")}</li>
                <li>{t("classDisciplineRule6")}</li>
                <li>{t("classDisciplineRule7")}</li>
                <li>{t("classDisciplineRule8")}</li>
                <li>{t("classDisciplineRule9")}</li>
                <li>{t("classDisciplineRule10")}</li>
                <li>{t("classDisciplineRule11")}</li>
                <li>{t("classDisciplineRule12")}</li>
                <li>{t("classDisciplineRule13")}</li>
                <li>{t("classDisciplineRule14")}</li>
              </ul>
            </div>
          </div>
        </section>
        
        <section className={styles.teacherHelpSection}>
          <div 
            className={`${styles.sectionHeader} ${activeSections.includes(accordionItems.length + 4) ? styles.active : ''}`}
            onClick={() => toggleSection(accordionItems.length + 4)}
          >
            <h3 className={styles.sectionTitle}>{t("hyperactiveChildrenTitle")}</h3>
            <div className={styles.sectionMarker}></div>
          </div>
          
          <div className={`${styles.sectionContent} ${activeSections.includes(accordionItems.length + 4) ? styles.active : ''}`}>
            <div className={styles.detailedDescription}>
              <p>{t("hyperactiveChildrenText1")}</p>
              
              <p><strong>{t("hyperactiveChildrenSymptomsTitle")}</strong></p>
              <ul className={styles.bulletList}>
                <li>{t("hyperactiveChildrenSymptom1")}</li>
                <li>{t("hyperactiveChildrenSymptom2")}</li>
                <li>{t("hyperactiveChildrenSymptom3")}</li>
                <li>{t("hyperactiveChildrenSymptom4")}</li>
                <li>{t("hyperactiveChildrenSymptom5")}</li>
                <li>{t("hyperactiveChildrenSymptom6")}</li>
                <li>{t("hyperactiveChildrenSymptom7")}</li>
                <li>{t("hyperactiveChildrenSymptom8")}</li>
                <li>{t("hyperactiveChildrenSymptom9")}</li>
                <li>{t("hyperactiveChildrenSymptom10")}</li>
                <li>{t("hyperactiveChildrenSymptom11")}</li>
                <li>{t("hyperactiveChildrenSymptom12")}</li>
                <li>{t("hyperactiveChildrenSymptom13")}</li>
                <li>{t("hyperactiveChildrenSymptom14")}</li>
              </ul>

              <p><strong>{t("hyperactiveChildrenGroupsTitle")}</strong></p>
              <ul className={styles.bulletList}>
                <li>{t("hyperactiveChildrenGroup1")}</li>
                <li>{t("hyperactiveChildrenGroup2")}</li>
                <li>{t("hyperactiveChildrenGroup3")}</li>
              </ul>

              <p>{t("hyperactiveChildrenText2")}</p>

              <p><strong>{t("hyperactiveChildrenQuestion")}</strong></p>
              <p>{t("hyperactiveChildrenStats")}</p>

              <p><strong>{t("hyperactiveChildrenWhyBoys")}</strong></p>
              <p>{t("hyperactiveChildrenExplanation")}</p>
            </div>
          </div>
        </section>
        
        {/* Секція з корисними документами */}
        <section className={styles.teacherHelpDocuments}>
          <div className={styles.documentsContainer}>
            <div className={styles.documentsBlock}>
              <p className={styles.documentsText}>{t("digitalLiteracyText")}</p>
              <div className={styles.documentsList}>
                <a href="https://osvita.diia.gov.ua/courses/cyber-hygiene" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t("cyberHygiene")}</a>
                <a href="https://osvita.diia.gov.ua/courses/cybernanny" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t("cybernanny")}</a>
                <a href="https://osvita.diia.gov.ua/courses/digital-communities" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t("digitalCommunities")}</a>
                <a href="https://osvita.diia.gov.ua/courses/digital-signature" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t("digitalSignature")}</a>
              </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.documentsBlock}>
              <div className={styles.documentsList}>
                <a href="https://docs.google.com/document/d/15j7N4paWcXiuUZbIzFW9z7Lna6OYW_nD/edit?tab=t.0" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t("academicIntegrityEducation")}</a>
                <a href="https://docs.google.com/document/d/1OqnzljmdKG2-TejHKAoy_89NLU8_xp2P/edit?tab=t.0" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t("academicIntegrityComplete")}</a>
                <a href="https://docs.google.com/document/d/1-ofGwJUyxhkO45aGJmvl6ElM_pf_7Jpu/edit?tab=t.0" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t("academicIntegritySchool")}</a>
              </div>
            </div>

          {/* Динамічні елементи для рожевого фону */}
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
                      {item.link && (
                        <div className={styles.documentsList}>
                          <a 
                            key={item.id}
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
        </section>
      </main>
    </div>
  );
}
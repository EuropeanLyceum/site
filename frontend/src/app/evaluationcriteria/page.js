'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/evaluationcriteria.module.css';
import { useTranslation } from '@/contexts/TranslationProvider';

export default function EvaluationCriteria() {
  const { t, locale } = useTranslation();
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [renderKey, setRenderKey] = useState(0);

  // Діагностика перекладу
  console.log('EvaluationCriteria - Current locale:', locale);
  console.log('EvaluationCriteria - Translation test:', t('evaluationCriteria'));

  // Відстеження змін мови
  useEffect(() => {
    console.log('EvaluationCriteria - Language changed to:', locale);
    setRenderKey(prev => prev + 1);
  }, [locale]);

  // Функція для отримання локалізованого контенту
  const getLocalizedContent = (item) => {
    if (locale === 'en') {
      return {
        name: item.nameEn || item.name // fallback до української
      };
    }
    return {
      name: item.name
    };
  };

  const loadSubjects = async () => {
    try {
      setIsLoading(true);
      console.log(" --- start ---");
      
      // Прямий запит до API сервера
      const response = await fetch("http://localhost:3001/api/evaluation-criteria");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Subjects loaded:", data);

      // Оновлюємо стан з даними з API
      const mappedSubjects = data.map((item) => ({
        id: item.id,
        name: item.name,
        nameEn: item.nameEn,
        color: item.color,
        link: item.url,
        hasSubItems: item.hasSubItems,
        subItems: item.hasSubItems && item.subItems ? item.subItems.map((subItem) => ({
          name: subItem.name,
          link: subItem.link
        })) : []
      }));
      
      setSubjects(mappedSubjects);
      return data;
    } catch (error) {
      console.error("Error loading subjects:", error);
      setSubjects([]);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const toggleSubject = (subjectId) => {
    setExpandedSubject(expandedSubject === subjectId ? null : subjectId);
  };

  return (
    <div className={styles.evaluationCriteriaPage} lang={locale} key={`${locale}-${renderKey}`}>
      <div className={styles.content}>
        <h1 className={styles.title}>{t("evaluationCriteria")}</h1>
        
        {(
          <div className={styles.subjectsGrid}>
            {subjects.map((subject) => {
              const localized = getLocalizedContent(subject);
              
              return (
                <div key={subject.id} className={styles.subjectCard}>
                  {subject.hasSubItems ? (
                    <div className={styles.subjectWithSubItems}>
                      <div 
                        className={styles.subjectHeader}
                        onClick={() => toggleSubject(subject.id)}
                      >
                        <div className={styles.subjectInfo}>
                          <div 
                            className={styles.imageContainer}
                            style={{ backgroundColor: subject.color }}
                          >
                            <span className={styles.subjectIcon}>
                              {localized.name.charAt(0)}
                            </span>
                          </div>
                          <h3 className={styles.subjectName}>{localized.name}</h3>
                        </div>
                        <span className={`${styles.expandIcon} ${expandedSubject === subject.id ? styles.expanded : ''}`}>
                          ▼
                        </span>
                      </div>
                      
                      {expandedSubject === subject.id && (
                        <div className={styles.subItems}>
                          <div className={styles.subItemsGrid}>
                            {subject.subItems.map((item, index) => (
                              <a
                                key={index}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.subItem}
                              >
                                {item.name}
                                <span className={styles.linkIcon}>↗</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={subject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.subjectLink}
                    >
                      <div className={styles.subjectInfo}>
                        <div 
                          className={styles.imageContainer}
                          style={{ backgroundColor: subject.color }}
                        >
                          <span className={styles.subjectIcon}>
                            {localized.name.charAt(0)}
                          </span>
                        </div>
                        <h3 className={styles.subjectName}>{localized.name}</h3>
                      </div>
                      <span className={styles.linkIcon}>↗</span>
                    </a>
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
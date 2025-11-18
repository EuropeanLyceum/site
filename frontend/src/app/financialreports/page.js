'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/financialreports.module.css';
import Image from 'next/image';
import firebird3 from '@/assets/firebird3.png';
import { useTranslation } from '@/contexts/TranslationProvider';

const FinancialReportsPage = () => {
  const { t, locale } = useTranslation();
  const [dynamicData, setDynamicData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [renderKey, setRenderKey] = useState(0);

  // Діагностика перекладу
  console.log('FinancialReports - Current locale:', locale);
  console.log('FinancialReports - Translation test:', t('financialReportsTitle'));

  // Відстеження змін мови
  useEffect(() => {
    console.log('FinancialReports - Language changed to:', locale);
    setRenderKey(prev => prev + 1);
  }, [locale]);

  // Функція для отримання локалізованого контенту
  const getLocalizedContent = (item) => {
    if (locale === 'en') {
      return {
        title: item.titleEn || item.title, // fallback до української
        content: item.contentEn || item.content,
        linkText: item.linkTextEn || item.linkText // fallback до української
      };
    }
    return {
      title: item.title,
      content: item.content,
      linkText: item.linkText
    };
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/financial-reports');
        if (res.ok) {
          const data = await res.json();
          // старі зверху, нові знизу
          data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setDynamicData(data);
        }
      } catch (e) {
        console.error('Error fetching financial reports:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const formatText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, idx) => (
      <span key={idx}>
        {line}
        {idx < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      <div className="container" lang={locale} key={`${locale}-${renderKey}`}>
        <div className="background">
          <div className="gradientBg"></div>
        </div>
        
        <main className={styles.financialReportsMain}>
          <h2 className={styles.financialReportsTitle}>
            {t('financialReportsTitle')}
            <Image src={firebird3} alt={t('firebirdAlt')} className={styles.firebirdImage} />
          </h2>

          <div className={styles.reportsSections}>
            {/* Статична інформація (залишаємо як є) */}
            <section className={styles.usefulInfoSection}>
              <h2 className={styles.sectionTitle}>{t('usefulInfoTitle')}</h2>
              <div className={styles.linksContainer}>
                <a href="https://docs.google.com/document/d/1pzR18-esF1WdWZp4FD_MTR8xS_b-ovC3/edit" className={styles.reportLink} target="_blank" rel="noopener noreferrer">{t('technicalSpecsLink')}</a>
                <a href="https://docs.google.com/document/d/1pdQWlaOvCN-3JU1HkWITRCheY_s8UY6R/edit?tab=t.0" className={styles.reportLink} target="_blank" rel="noopener noreferrer">{t('shelterSpecsLink')}</a>
                <a href="https://docs.google.com/document/d/1lxzcya-9m9Kd3pwprFBIfwvoHMxL2P3j/edit?tab=t.0" className={styles.reportLink} target="_blank" rel="noopener noreferrer">{t('protocolPlan3Link')}</a>
                <a href="https://docs.google.com/document/d/1ACcL1_-Bi18lZhJZoAKvkXKRbJ7OjY-K/edit?tab=t.0" className={styles.reportLink} target="_blank" rel="noopener noreferrer">{t('protocolPlan4Link')}</a>
                <a href="https://docs.google.com/document/d/1AT3uh4BjeqyEkGqThit5u8sQEdEPKKA3/edit?tab=t.0" className={styles.reportLink} target="_blank" rel="noopener noreferrer">{t('technicalTaskLink')}</a>
                <a href="https://drive.google.com/file/d/1u7xDdhrAxIP6w5UbulxHdj_ceAhpGBsY/view" className={styles.reportLink} target="_blank" rel="noopener noreferrer">{t('purchaseReportLink')}</a>
                <p className={styles.reportSubtitle}>{t('constructionObjectSubtitle')}</p>
                <div className={styles.subLinks}>
                  <a href="https://drive.google.com/file/d/1dSuCfMF3tZJiDcb0ZAeUmkjytHZiS0fZ/view" className={styles.reportLink} target="_blank" rel="noopener noreferrer">{t('workPermitLink')}</a>
                  <a href="https://drive.google.com/file/d/1uR8ANtmNdZ9BHjz4wmfu4_RqKIy0hPqC/view" className={styles.reportLink} target="_blank" rel="noopener noreferrer">{t('protocolDecisionLink')}</a>
                  <a href="https://docs.google.com/document/d/1KiUz-8JG5pnQ8dqauBqKA7N-7roTmYDm/edit?tab=t.0" className={styles.reportLink} target="_blank" rel="noopener noreferrer">{t('purchaseSpecsLink')}</a>
                  <a href="https://docs.google.com/document/d/13eY8wZVhn782l7Rk8mxouiKilMwZQ0CT/edit?rtpof=true&sd=true&tab=t.0" className={styles.reportLink} target="_blank" rel="noopener noreferrer">{t('purchaseInfoLink')}</a>
                </div>
              </div>
            </section>

            {/* Динамічний контент з адмін-панелі */}
            {!isLoading && dynamicData.length > 0 && (
              <section className={styles.dynamicSection}>
                {dynamicData.map((item) => {
                  const localized = getLocalizedContent(item);
                  
                  return (
                    <div key={item.id} className={styles.dynamicDocument}>
                      {/* Фото справа (3 в рядок) */}
                      {item.photoUrls && JSON.parse(item.photoUrls).length > 0 && (
                        <div className={styles.documentPhotos}>
                          <div className={styles.photosRow}>
                            {JSON.parse(item.photoUrls).map((url, i) => (
                              <div key={i} className={styles.photoItem}>
                                <img
                                  src={`http://localhost:3001${url}`}
                                  alt={`${t('reportPhotoAlt')} ${i + 1}`}
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Текстова частина */}
                      <div className={styles.documentContent}>
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

                        {item.url && (
                          <div style={{ position: 'relative', paddingLeft: '20px' }}>
                            <a
                              href={item.url}
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
                              {localized.linkText || item.url}
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
                    </div>
                  );
                })}
              </section>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default FinancialReportsPage;
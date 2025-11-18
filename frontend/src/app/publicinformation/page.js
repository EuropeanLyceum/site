'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/publicinformation.module.css';
import Image from 'next/image';
import firebird3 from '@/assets/firebird3.png';
import { useTranslation } from '@/contexts/TranslationProvider';

const PublicInformationPage = () => {
  const { t, locale } = useTranslation();
  const [dynamicData, setDynamicData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [renderKey, setRenderKey] = useState(0);

  // Діагностика перекладу
  console.log('PublicInformation - Current locale:', locale);
  console.log('PublicInformation - Translation test:', t('publicInformationTitle'));

  // Відстеження змін мови
  useEffect(() => {
    console.log('PublicInformation - Language changed to:', locale);
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

  // Завантаження динаміки з адмінки
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/public-information');
        if (res.ok) {
          const data = await res.json();
          // старі зверху, нові знизу
          data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setDynamicData(data);
        }
      } catch (e) {
        console.error('Error fetching public information:', e);
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

  return (
    <>
      <div className="container" lang={locale} key={`${locale}-${renderKey}`}>
        <div className="background">
          <div className="gradientBg"></div>
        </div>
        
        <main className={styles.publicInformationMain}>
          <h2 className={styles.publicInformationTitle}>
            {t('publicInformationTitle')}
            <Image src={firebird3} alt={t('firebirdAlt')} className={styles.firebirdImage} />
          </h2>

          <div className={styles.documentsSections}>
            {/* Статичні блоки — залишаємо без змін */}
            <section className={styles.usefulInfoSection}>
              <h2 className={styles.sectionTitle}>{t('usefulInfoTitle')}</h2>
              <div className={styles.linksContainer}>
                <a href="https://drive.google.com/drive/folders/136MrtcYadLvro0n-ujkywmg749gRB4x8" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('qrCodesLink')}</a>
                <a href="https://docs.google.com/document/d/1sKl1Pm6AU_IAd_CvGAOJG95COGHmCcdJ/edit" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('accessibilityInfoLink')}</a>
                <a href="https://drive.google.com/file/d/1xJ6yMNoyMF80lsDBepv2-dUVZ-NCVIQM/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('textbookSelectionLink')}</a>
                <a href="https://drive.google.com/file/d/1gdRcCOrGQMzhycIi7uaE2н5Xf0ngA8P6/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('textbookResultsLink')}</a>
                
                <p className={styles.documentSubtitle}>{t('textbookProvisionSubtitle')}</p>
                <div className={styles.gridLinks}>
                  <a href="https://drive.google.com/file/d/11gWSVCCxRkmupybt_UbCStEb-OjkXkYg/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('grade2Link')}</a>
                  <a href="https://drive.google.com/file/d/19cYI1Wy5Xkk5wBJ1kXb_nB6-hRX1RSUH/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('grade3Link')}</a>
                  <a href="https://drive.google.com/file/d/1DOTZim103F08XYqJMHAP6q68wkg0fv2S/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('grade4Link')}</a>
                  <a href="https://drive.google.com/file/d/1mUhKPAQji_XUHUk12Fbu11bFBGpqnRen/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('grade5Link')}</a>
                  <a href="https://drive.google.com/file/d/1PvnCy67jGvl1v60jwLyDFqfaOILFjDN4/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('grade6Link')}</a>
                  <a href="https://drive.google.com/file/d/1mRL_0Q67cl_JRHNhPJ-yDCmGpMub0Akg/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('grade7Link')}</a>
                  <a href="https://drive.google.com/file/d/188ixYvOzWdw4o3SZ4уZmIvAUP2dcKUi8/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('grade8Link')}</a>
                  <a href="https://drive.google.com/file/d/1Vux6wrRM9qfCYRzcbBTJcRL1tIIzxeid/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('grade9Link')}</a>
                  <a href="https://drive.google.com/file/d/1V5uIcjO_kX66s37_QZuykEkZCqleOYWl/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('grade10Link')}</a>
                  <a href="https://drive.google.com/file/d/17CLgClf0u_TmfHchC1Vwhb6vLPHOI8gg/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('grade11Link')}</a>
                </div>
                
                <p className={styles.documentSubtitle}>{t('evaluationSystemSubtitle')}</p>
                <div className={styles.nestedLinks}>
                  <a href="https://drive.google.com/file/d/1H6DbuJstja2ekGCOkOG99DA5O5Kw7pQI/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('formativeEvaluationLink')}</a>
                  <a href="https://drive.google.com/file/d/1ifW9SkZL5L9O46n5TBQqEJRHPKDQW7-I/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('grade2EvaluationLink')}</a>
                  <a href="https://drive.google.com/file/d/1ZXD9hhOALtNQB5H2STWBEgK2zaFQBKSa/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('grade34EvaluationLink')}</a>
                  <a href="https://drive.google.com/file/d/1JKEejTh9gL4co5cLwDvQuXQMI4n-oIqY/view" className={styles.documentLink} target="_blank" rel="noopener noreferrer">{t('achievementCertificateLink')}</a>
                </div>
              </div>
            </section>

            {/* Динамічний контент з адмінки */}
            {!isLoading && dynamicData.length > 0 && (
              <section className={styles.dynamicSection}>
                {dynamicData.map((item) => {
                  const localized = getLocalizedContent(item);
                  
                  return (
                    <div key={item.id} className={styles.dynamicDocument}>
                      {/* Фото справа, 3 у ряд */}
                      {item.photoUrls && JSON.parse(item.photoUrls).length > 0 && (
                        <div className={styles.documentPhotos}>
                          <div className={styles.photosRow}>
                            {JSON.parse(item.photoUrls).map((url, i) => (
                              <div key={i} className={styles.photoItem}>
                                <img
                                  src={`http://localhost:3001${url}`}
                                  alt={`${t('publicInfoPhotoAlt')} ${i + 1}`}
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

export default PublicInformationPage;
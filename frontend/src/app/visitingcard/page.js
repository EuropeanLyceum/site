'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import teachers from '@/assets/teachers.jpg';
import logoPictureVisitCard from '@/assets/logo_picture_visit_card.jpg';
import materialBasis from '@/assets/material_basis.jpg';
import galochka from '@/assets/galochka.png';
import styles from '@/styles/visitingcard.module.css';
import { useTranslation } from '@/contexts/TranslationProvider';

export default function VisitingCardPage() {
  const { t, locale } = useTranslation();
  const [dynamicData, setDynamicData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Завантаження динамічних оновлень з адмінки
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/visiting-card');
        if (res.ok) {
          const data = await res.json();
          // старі зверху, нові знизу
          data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setDynamicData(data);
        }
      } catch (e) {
        console.error('Error fetching visiting card data:', e);
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

  return (
    <div className={styles.visitingCardPage} lang={locale}>
      <main>
        {/* Секція: Наша візитка */}
        <section className={`${styles.section} ${styles.ourCard} ${styles.active}`}>
          <h1 className={styles.ourCardTitle}>{t('ourCardTitle')}</h1>
          
          <div className={styles.ourCardContent}>
            <div className={styles.ourCardImageContainer}>
              <Image 
                src={teachers} 
                alt={t('teachersTeamAlt')} 
                className={styles.ourCardImage} 
                width={710} 
                height={400}
                priority
              />
            </div>
            <div className={styles.ourCardInfo}>
              <div className={styles.mainInfoRow}>
                <div className={`${styles.infoBlock} ${styles.mainInfo}`}>
                  <div className={styles.infoContent}>
                    <h2><span>{t('academicLyceumEuropean')}</span><span>"{t('europeanLyceum')}"</span></h2>
                    <p className={styles.location}>{t('locationLubnyPoltava')}</p>
                    <p className={styles.motto}>"{t('ourKnowledgeMotto')}"</p>
                  </div>
                  <Image 
                    src={logoPictureVisitCard} 
                    alt={t('logoAlt')} 
                    className={styles.infoLogo} 
                    width={105} 
                    height={105}
                  />
                </div>
                <div className={`${styles.infoBlock} ${styles.specialization}`}>
                  <h3>{t('specializationTitle')}</h3>
                  <p>{t('inDepthEnglishStudy')}</p>
                </div>
              </div>
              <div className={styles.staffInfoRow}>
                <div className={styles.staffInfoColumn}>
                  <div className={styles.infoRow}>
                    <div className={`${styles.infoBlock} ${styles.teachers}`}>
                      <h3>{t('teachersCount')}</h3>
                      <p>{t('teachersCountNumber')}</p>
                    </div>
                    <div className={`${styles.infoBlock} ${styles.anthem}`}>
                      <h3>{t('lyceumAnthemTitle')}</h3>
                      <p><a href="https://www.youtube.com/watch?v=7RArC-RZP74&t=2s" target="_blank" rel="noopener noreferrer">{t('anthemLink')} &gt;</a></p>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={`${styles.infoBlock} ${styles.totalStaff}`}>
                      <h3>{t('totalStaffCount')}</h3>
                      <p>{t('totalStaffNumber')}</p>
                    </div>
                    <div className={`${styles.infoBlock} ${styles.language}`}>
                      <h3>{t('languageOfStudyTitle')}</h3>
                      <p>{t('ukrainianLanguage')}</p>
                    </div>
                  </div>
                </div>
                <div className={`${styles.infoBlock} ${styles.license}`}>
                  <h3>{t('licensedCapacityTitle')}</h3>
                  <p>{t('licensedCapacityNumber')}</p>
                </div>
              </div>
              <div className={styles.infoRow}>
                <div className={`${styles.infoBlock} ${styles.name}`}>
                  <h3>{t('ownNameTitle')}</h3>
                  <p>{t('sunCityName')}</p>
                </div>
                <div className={`${styles.infoBlock} ${styles.classes}`}>
                  <h3>{t('classesCountTitle')}</h3>
                  <p>{t('classesCountNumber')}</p>
                </div>
                <div className={`${styles.infoBlock} ${styles.students}`}>
                  <h3>{t('actualStudentsCountTitle')}</h3>
                  <p>{t('actualStudentsCountNumber')}</p>
                </div>
              </div>
              <div className={`${styles.infoBlock} ${styles.contacts}`}>
                <div className={styles.address}>
                  <h3>{t('addressTitle')}</h3>
                  <p>{t('fullAddressText').split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      {idx < t('fullAddressText').split('\n').length - 1 && <br />}
                    </span>
                  ))}</p>
                </div>
                <div className={styles.contactInfo}>
                  <h3>{t('contactsTitle')}</h3>
                  <p>{t('contactPhone')}<br />{t('contactEmail')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Секція: Територія обслуговування */}
        <section id="service-area" className={styles.section}>
          <h1 className={styles.serviceAreaTitle}>{t('serviceAreaTitle')}</h1>
          <div className={styles.serviceAreaContent}>
            <div className={styles.addressColumn}>
              <div className={styles.addressBlock}><p>{t('serviceAreaAddress1')}</p></div>
              <div className={styles.addressBlock}><p>{t('serviceAreaAddress2')}</p></div>
              <div className={styles.addressBlock}><p>{t('serviceAreaAddress3')}</p></div>
            </div>
            <div className={styles.addressColumn}>
              <div className={styles.addressBlock}><p>{t('serviceAreaAddress4')}</p></div>
              <div className={styles.addressBlock}><p>{t('serviceAreaAddress5')}</p></div>
              <div className={styles.addressBlock}><p>{t('serviceAreaAddress6')}</p></div>
            </div>
            <div className={styles.addressColumn}>
              <div className={styles.addressBlock}><p>{t('serviceAreaAddress7')}</p></div>
              <div className={styles.addressBlock}><p>{t('serviceAreaAddress8')}</p></div>
              <div className={styles.addressBlock}><p>{t('serviceAreaAddress9')}</p></div>
            </div>
          </div>
        </section>

        {/* Секція: В ліцеї працюють */}
        <section id="staff" className={styles.section}>
          <div className={styles.staffContent}>
            <h1 className={styles.staffTitle}>{t('lyceumWorksTitle')}</h1>
            <div className={styles.staffItem}>
              <div className={styles.staffMarker}></div>
              <div className={styles.staffInfo}>
                <h3 className={styles.staffName}>{t('divosvitSociety')}</h3>
                <p className={styles.staffDescription}>{t('scientificSocietyDescription')}</p>
              </div>
            </div>
            <div className={styles.staffItem}>
              <div className={styles.staffMarker}></div>
              <div className={styles.staffInfo}>
                <h3 className={styles.staffName}>{t('linkClub')}</h3>
                <p className={styles.staffDescription}>{t('europeanClubDescription')}</p>
              </div>
            </div>
            <div className={styles.staffItem}>
              <div className={styles.staffMarker}></div>
              <div className={styles.staffInfo}>
                <h3 className={styles.staffName}>{t('divotsvitStudio')}</h3>
                <p className={styles.staffDescription}>{t('artStudioDescription')}</p>
              </div>
            </div>
            <div className={styles.staffItem}>
              <div className={styles.staffMarker}></div>
              <div className={styles.staffInfo}>
                <h3 className={styles.staffName}>{t('valeriEnsemble')}</h3>
                <p className={styles.staffDescription}>{t('vocalEnsembleDescription')}</p>
              </div>
            </div>
            <div className={styles.staffItem}>
              <div className={styles.staffMarker}></div>
              <div className={styles.staffInfo}>
                <h3 className={styles.staffName}>{t('kardenGroup')}</h3>
                <p className={styles.staffDescription}>{t('danceGroupDescription')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Секція: Матеріальна база */}
        <section id="facilities" className={styles.section}>
          <h1 className={styles.facilitiesTitle}>{t('facilitiesTitle')}</h1>
          <div className={styles.facilitiesContent}>
            <div className={styles.facilitiesImage}>
              <Image 
                src={materialBasis} 
                alt={t('facilitiesPhotoAlt')} 
                width={700} 
                height={450} 
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  maxWidth: '700px',
                  marginTop: '50px',
                  borderRadius: '15px'
                }}
              />
            </div>
            <div className={styles.facilitiesInfo}>
              <h2 className={styles.facilitiesSubtitle}>{t('threeFloorBuildingTitle')}</h2>
              <div className={styles.facilitiesList}>
                <div className={styles.facilityItem}>
                  <Image src={galochka} alt={t('checkmarkAlt')} className={styles.checkIcon} width={24} height={24} />
                  <p>{t('classrooms26Description')}</p>
                </div>
                <div className={styles.facilityItem}>
                  <Image src={galochka} alt={t('checkmarkAlt')} className={styles.checkIcon} width={24} height={24} />
                  <p>{t('englishCabinets10Description')}</p>
                </div>
                <div className={styles.facilityItem}>
                  <Image src={galochka} alt={t('checkmarkAlt')} className={styles.checkIcon} width={24} height={24} />
                  <p>{t('modernCabinetsDescription')}</p>
                </div>
                <div className={styles.facilityItem}>
                  <Image src={galochka} alt={t('checkmarkAlt')} className={styles.checkIcon} width={24} height={24} />
                  <p>{t('resourceCenterDescription')}</p>
                </div>
                <div className={styles.facilityItem}>
                  <Image src={galochka} alt={t('checkmarkAlt')} className={styles.checkIcon} width={24} height={24} />
                  <p>{t('hallsDescription')}</p>
                </div>
                <div className={styles.facilityItem}>
                  <Image src={galochka} alt={t('checkmarkAlt')} className={styles.checkIcon} width={24} height={24} />
                  <p>{t('multimediaCenterDescription')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Динамічний контент з адмін-панелі */}
        {!isLoading && dynamicData.length > 0 && (
          <section className={styles.section}>
            <div className={styles.dynamicSection}>
              {dynamicData.map((item) => {
                const localized = getLocalizedContent(item);
                
                return (
                  <div key={item.id} className={styles.dynamicDocument}>
                    {/* Текстова частина */}
                    <div className={styles.documentContent}>
                      {localized.title && (
                        <h3 style={{
                          fontFamily: 'Montserrat Alternates, sans-serif',
                          fontSize: '28px',
                          color: '#000000',
                          marginBottom: '12px'
                        }}>
                          {localized.title}
                        </h3>
                      )}

                      {localized.content && (
                        <div
                          style={{
                            color: '#000000',
                            fontSize: '16px',
                            paddingLeft: '20px',
                            marginBottom: '12px',
                            lineHeight: '1.5'
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
                              fontSize: '16px',
                              fontFamily: 'Montserrat Alternates, sans-serif',
                              lineHeight: '1.4',
                              padding: '6px 0',
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

                    {/* Фото справа */}
                    {item.photoUrls && item.photoUrls.length > 0 && (
                      <div className={styles.documentPhotos}>
                        <div className={styles.photosRow}>
                          {item.photoUrls.map((url, i) => (
                            <div key={i} className={styles.photoItem}>
                              <img
                                src={`http://localhost:3002${url}`}
                                alt={`Visiting card photo ${i + 1}`}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
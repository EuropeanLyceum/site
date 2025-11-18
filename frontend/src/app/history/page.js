'use client';
import styles from "@/styles/history.module.css";
import Image from "next/image";
import schoolPhoto1 from "@/assets/school_photo1.jpg";
import schoolPhoto2 from "@/assets/school_photo2.jpg";
import schoolPhoto3 from "@/assets/school_photo3.jpg";
import development1 from "@/assets/development1.jpg";
import development2 from "@/assets/development2.jpg";
import development3 from "@/assets/development3.jpg";
import founders from "@/assets/founders.jpg";
import oranskyi from "@/assets/oranskyi.jpg";
import bondar from "@/assets/bondar.jpg";
import sakhno from "@/assets/sakhno.jpg";
import chabanenko from "@/assets/chabanenko.jpg";
import klyushnichenko from "@/assets/klyushnichenko.jpg";
import tkachenko from "@/assets/tkachenko.jpg";
import rohozha from "@/assets/rohozha.jpg";
import nikitenko from "@/assets/nikitenko.jpg";
import dmytrenko from "@/assets/dmytrenko.jpg";
import kochergina from "@/assets/kochergina.jpg";
import derkach from "@/assets/derkach.jpg";
import dribna from "@/assets/dribna.jpg";
import kapishevska from "@/assets/kapishevska.jpg";
import bova from "@/assets/bova.jpg";
import vorozhbyt from "@/assets/vorozhbyt.jpg";
import { useTranslation } from "@/contexts/TranslationProvider";
import { useEffect, useState } from 'react';

export default function HistoryPage() {
  const { t, locale } = useTranslation();
  const [schoolHistoryData, setSchoolHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/school-history');
        if (response.ok) {
          const data = await response.json();
          setSchoolHistoryData(data);
        }
      } catch (error) {
        console.error('Error fetching school history data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Функція для отримання локалізованого контенту
  const getLocalizedContent = (item) => {
    if (locale === 'en') {
      return {
        title: item.titleEn || item.title, // fallback до української
        content: item.contentEn || item.content
      };
    }
    return {
      title: item.title,
      content: item.content
    };
  };

  return (
    <div className="container" lang={locale}>
      <main className={styles.historyContent}>
        {/* Фундатори */}
        <section className={styles.historySection}>
          <h2 className={styles.sectionTitle}>{t('foundersTitle')}</h2>
          <div className={styles.historyBlock}>
            <div className={styles.historyText}>
              <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                {t('foundersDescription')}
              </p>
              <div style={{overflow: "hidden"}}>
                <div className={styles.historyImage}>
                  <Image 
                    src={founders}
                    alt={t('foundersImageAlt')}
                    width={900}
                    height={400}
                    style={{objectFit: "cover"}}
                  />
                </div>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('foundersDescription2')}
                </p>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('foundersDescription3')}
                </p>
              </div>
              <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                {t('foundersDescription4')}
              </p>
            </div>
          </div>
        </section>

        {/* Будівля школи */}
        <section className={styles.historySection}>
          <h2 className={styles.sectionTitle}>{t('schoolBuildingTitle')}</h2>
          <div className={styles.historyBlock}>
            <div className={styles.historyText}>
              <div style={{overflow: "hidden", marginBottom: "10px"}}>
                <div className={styles.historyImage} style={{width: "45%", borderRadius: "15px"}}>
                  <Image 
                    src={schoolPhoto1}
                    alt={t('schoolBuildingImage1Alt')}
                    width={450}
                    height={300}
                    style={{objectFit: "cover", borderRadius: "15px"}}
                  />
                </div>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px', marginTop: '0' }}>
                  {t('schoolBuildingDescription1')}
                </p>
              </div>

              <div style={{overflow: "hidden", marginBottom: "10px"}}>
                <div className={styles.historyImage} style={{float: "right", margin: "0 0 5px 15px", width: "45%", borderRadius: "15px"}}>
                  <Image 
                    src={schoolPhoto2}
                    alt={t('schoolBuildingImage2Alt')}
                    width={450}
                    height={300}
                    style={{objectFit: "cover", borderRadius: "15px"}}
                  />
                </div>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px', marginTop: '0' }}>
                  {t('schoolBuildingDescription2')}
                </p>
              </div>

              <div style={{overflow: "hidden"}}>
                <div className={styles.historyImage} style={{width: "45%", borderRadius: "15px", marginBottom: "5px"}}>
                  <Image 
                    src={schoolPhoto3}
                    alt={t('schoolBuildingImage3Alt')}
                    width={450}
                    height={300}
                    style={{objectFit: "cover", borderRadius: "15px"}}
                  />
                </div>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px', marginTop: '0' }}>
                  {t('schoolBuildingDescription3')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Етапи розвитку */}
        <section className={styles.historySection}>
          <h2 className={styles.sectionTitle}>{t('developmentStagesTitle')}</h2>
          <div className={styles.historyBlock}>
            <div className={styles.historyText}>
              <div style={{overflow: "hidden", marginBottom: "10px"}}>
                <div className={styles.historyImage} style={{width: "45%", borderRadius: "15px"}}>
                  <Image 
                    src={development1}
                    alt={t('developmentImage1Alt')}
                    width={450}
                    height={300}
                    style={{objectFit: "cover", borderRadius: "15px"}}
                  />
                </div>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px', marginTop: '0' }}>
                  {t('developmentDescription1')}
                </p>
              </div>

              <div style={{overflow: "hidden", marginBottom: "10px"}}>
                <div className={styles.historyImage} style={{float: "right", margin: "0 0 5px 15px", width: "45%", borderRadius: "15px"}}>
                  <Image 
                    src={development2}
                    alt={t('developmentImage2Alt')}
                    width={450}
                    height={300}
                    style={{objectFit: "cover", borderRadius: "15px"}}
                  />
                </div>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px', marginTop: '0' }}>
                  {t('developmentDescription2')}
                </p>
              </div>

              <div style={{overflow: "hidden"}}>
                <div className={styles.historyImage} style={{width: "45%", borderRadius: "15px"}}>
                  <Image 
                    src={development3}
                    alt={t('developmentImage3Alt')}
                    width={450}
                    height={300}
                    style={{objectFit: "cover", borderRadius: "15px"}}
                  />
                  <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '16px', textAlign: 'center', marginTop: '5px' }}>
                    {t('schoolBuildingCaption')}
                  </p>
                </div>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px', marginTop: '0' }}>
                  {t('developmentDescription3')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Керівники */}
        <section className={styles.historySection}>
          <h2 className={styles.sectionTitle}>{t('leadersTitle')}</h2>
          <div className={styles.historyBlock}>
            <div className={styles.historyText}>
              <div className={styles.directorsGrid}>
                {/* 1-й директор */}
                <div className={styles.directorCard}>
                  <div className={styles.directorImage}>
                    <Image
                      src={oranskyi}
                      alt="Оранський Яків Олександрович"
                      width={400}
                      height={400}
                    />
                  </div>
                  <p className={styles.imageCaption}>{t('oranskyiCaption')}</p>
                  <div className={styles.directorInfo}>
                    <h3>{t('oranskyiName')}</h3>
                    <p>{t('oranskyiDescription')}</p>
                  </div>
                </div>

                {/* 2-й директор */}
                <div className={styles.directorCard}>
                  <div className={styles.directorImage}>
                    <Image
                      src={bondar}
                      alt="Бондар Михайло Сергійович"
                      width={400}
                      height={400}
                    />
                  </div>
                  <div className={styles.directorInfo}>
                    <h3>{t('bondarName')}</h3>
                    <p>{t('bondarDescription')}</p>
                  </div>
                </div>

                {/* 3-й директор */}
                <div className={styles.directorCard}>
                  <div className={styles.directorImage}>
                    <Image
                      src={sakhno}
                      alt="Сахно Володимир Іванович"
                      width={400}
                      height={400}
                    />
                  </div>
                  <p className={styles.imageCaption}>{t('sakhnoCaption')}</p>
                  <div className={styles.directorInfo}>
                    <h3>{t('sakhnoName')}</h3>
                    <p>{t('sakhnoDescription')}</p>
                  </div>
                </div>

                {/* 4-й директор */}
                <div className={styles.directorCard}>
                  <div className={styles.directorImage} data-director="chabanenko">
                    <Image
                      src={chabanenko}
                      alt="Чабаненко Олександра Іванівна"
                      width={400}
                      height={400}
                    />
                  </div>
                  <div className={styles.directorInfo}>
                    <h3>{t('chabanenkoName')}</h3>
                    <p>{t('chabanenkoDescription')}</p>
                  </div>
                </div>

                {/* 5-й директор */}
                <div className={styles.directorCard}>
                  <div className={styles.directorImage}>
                    <Image
                      src={klyushnichenko}
                      alt="Клюшніченко Микола Степанович"
                      width={400}
                      height={400}
                    />
                  </div>
                  <p className={styles.imageCaption}>{t('klyushnichenkoCaption')}</p>
                  <div className={styles.directorInfo}>
                    <h3>{t('klyushnichenkoName')}</h3>
                    <p>{t('klyushnichenkoDescription')}</p>
                  </div>
                </div>

                {/* 6-й директор */}
                <div className={styles.directorCard}>
                  <div className={styles.directorImage} data-director="tkachenko">
                    <Image
                      src={tkachenko}
                      alt="Ткаченко Володимир Іванович"
                      width={400}
                      height={400}
                    />
                  </div>
                  <div className={styles.directorInfo}>
                    <h3>{t('tkachenkoName')}</h3>
                    <p>{t('tkachenkoDescription')}</p>
                  </div>
                </div>

                {/* 7-й директор */}
                <div className={styles.directorCard}>
                  <div className={styles.directorImage} data-director="rohozha">
                    <Image
                      src={rohozha}
                      alt="Рогожа Михайло Миколайович"
                      width={400}
                      height={400}
                    />
                  </div>
                  <p className={styles.imageCaption}>{t('rohozhaCaption')}</p>
                  <div className={styles.directorInfo}>
                    <h3>{t('rohozhaName')}</h3>
                    <p>{t('rohozhaDescription')}</p>
                  </div>
                </div>

                {/* 8-й директор */}
                <div className={styles.directorCard}>
                  <div className={styles.directorImage}>
                    <Image
                      src={nikitenko}
                      alt="Нікітенко Микола Михайлович"
                      width={400}
                      height={400}
                    />
                  </div>
                  <p className={styles.imageCaption}>{t('nikitenkoCaption')}</p>
                  <div className={styles.directorInfo}>
                    <h3>{t('nikitenkoName')}</h3>
                    <p>{t('nikitenkoDescription')}</p>
                  </div>
                </div>

                {/* 9-й директор */}
                <div className={styles.directorCard}>
                  <div className={styles.directorImage} data-director="dmytrenko">
                    <Image
                      src={dmytrenko}
                      alt="Дмитренко Василь Едуардович"
                      width={400}
                      height={400}
                    />
                  </div>
                  <div className={styles.directorInfo}>
                    <h3>{t('dmytrenkoName')}</h3>
                    <p>{t('dmytrenkoDescription')}</p>
                  </div>
                </div>

                {/* 10-й директор */}
                <div className={styles.directorCard}>
                  <div className={styles.directorImage} data-director="kochergina">
                    <Image
                      src={kochergina}
                      alt="Кочергіна Світлана Олександрівна"
                      width={400}
                      height={400}
                    />
                  </div>
                  <div className={styles.directorInfo}>
                    <h3>{t('kocherginaName')}</h3>
                    <p>{t('kocherginaDescription')}</p>
                  </div>
                </div>

                {/* Поточний директор */}
                <div className={styles.directorCard}>
                  <div className={styles.directorImage} data-director="derkach">
                    <Image
                      src={derkach}
                      alt="Деркач Лариса Анатоліївна"
                      width={400}
                      height={400}
                    />
                  </div>
                  <div className={styles.directorInfo}>
                    <h3>{t('derkachName')}</h3>
                    <p>{t('derkachDescription')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Учителі (знакові постаті) */}
        <section className={styles.historySection}>
          <h2 className={styles.sectionTitle}>{t('teachersTitle')}</h2>
          <div className={styles.historyBlock}>
            <div className={styles.historyText}>
              {/* Дрібна Надія Микитівна */}
              <div style={{overflow: "hidden", marginBottom: "20px"}}>
                <div className={styles.historyImage} style={{float: "right", margin: "0 0 10px 20px", width: "300px"}}>
                  <Image
                    src={dribna}
                    alt="Дрібна Надія Микитівна"
                    width={300}
                    height={400}
                    style={{objectFit: "cover"}}
                  />
                </div>
                <h3 style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '24px', marginBottom: '15px', marginTop: '30px' }}>{t('dribnaName')}</h3>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('dribnaDescription1')}
                </p>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('dribnaDescription2')}
                </p>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('dribnaDescription3')}
                </p>
              </div>

              {/* Капішевська Фаїна Федорівна */}
              <div style={{overflow: "hidden", marginBottom: "20px"}}>
                <div className={styles.historyImage} style={{float: "right", margin: "0 0 10px 20px", width: "300px"}}>
                  <Image
                    src={kapishevska}
                    alt="Капішевська Фаїна Федорівна"
                    width={300}
                    height={400}
                    style={{objectFit: "cover"}}
                  />
                </div>
                <h3 style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '24px', marginBottom: '15px', marginTop: '30px' }}>{t('kapishevskaName')}</h3>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('kapishevskaDescription1')}
                </p>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('kapishevskaDescription2')}
                </p>
              </div>

              {/* Бова Лідія Олексіївна */}
              <div style={{overflow: "hidden", marginBottom: "20px"}}>
                <div className={styles.historyImage} style={{float: "right", margin: "0 0 10px 20px", width: "300px"}}>
                  <Image
                    src={bova}
                    alt="Бова Лідія Олексіївна"
                    width={300}
                    height={400}
                    style={{objectFit: "cover"}}
                  />
                </div>
                <h3 style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '24px', marginBottom: '15px', marginTop: '30px' }}>{t('bovaName')}</h3>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('bovaDescription1')}
                </p>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('bovaDescription2')}
                </p>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('bovaDescription3')}
                </p>
              </div>

              {/* Ворожбит Ніна Миколаївна */}
              <div style={{overflow: "hidden", marginBottom: "20px"}}>
                <div className={styles.historyImage} style={{float: "right", margin: "0 0 10px 20px", width: "300px"}}>
                  <Image
                    src={vorozhbyt}
                    alt="Ворожбит Ніна Миколаївна"
                    width={300}
                    height={400}
                    style={{objectFit: "cover", borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px"}}
                  />
                </div>
                <h3 style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '24px', marginBottom: '15px', marginTop: '30px' }}>{t('vorozhbytName')}</h3>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('vorozhbytDescription1')}
                </p>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('vorozhbytDescription2')}
                </p>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('vorozhbytDescription3')}
                </p>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('vorozhbytDescription4')}
                </p>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('vorozhbytDescription5')}
                </p>
              </div>

              {/* Кочергіна Світлана Олександрівна */}
              <div style={{overflow: "hidden", marginBottom: "20px"}}>
                <div className={styles.historyImage} style={{float: "right", margin: "0 0 10px 20px", width: "300px"}}>
                  <Image
                    src={kochergina}
                    alt="Кочергіна Світлана Олександрівна"
                    width={300}
                    height={400}
                    style={{objectFit: "cover"}}
                  />
                </div>
                <h3 style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '24px', marginBottom: '15px', marginTop: '30px' }}>{t('kocherginaTeacherName')}</h3>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('kocherginaTeacherDescription1')}
                </p>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('kocherginaTeacherDescription2')}
                </p>
                <p style={{ color: 'white', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                  {t('kocherginaTeacherDescription3')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Динамічний контент з адмін-панелі */}
        {!isLoading && schoolHistoryData.length > 0 && (
          <div className="space-y-8">
            {schoolHistoryData.map((item) => {
              const localized = getLocalizedContent(item);
              
              return (
                <section key={item.id} className={styles.historySection}>
                  {localized.title && (
                    <h2 className={styles.sectionTitle}>{localized.title}</h2>
                  )}
                  <div className={styles.historyBlock}>
                    <div className={styles.historyText}>
                      {/* Текст */}
                      {localized.content && (
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: localized.content.replace(/\n/g, '<br>') 
                          }} 
                          style={{ 
                            color: 'white', 
                            fontFamily: 'Montserrat Alternates, sans-serif', 
                            fontSize: '18px', 
                            lineHeight: '1.6',
                            marginBottom: '20px'
                          }}
                        />
                      )}
                      
                      {/* Фото */}
                      {item.photoUrls && item.photoUrls.length > 0 && (
                        <div style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: '15px',
                          justifyContent: 'flex-start',
                          marginTop: '20px'
                        }}>
                          {item.photoUrls.map((url, index) => (
                            <div key={index} style={{ 
                              flex: '0 0 auto',
                              maxWidth: 'calc(33.333% - 10px)',
                              minWidth: '200px'
                            }}>
                              <img
                                src={`http://localhost:3002${url}`}
                                alt={`Photo ${index + 1}`}
                                style={{ 
                                  width: '100%', 
                                  height: 'auto',
                                  objectFit: 'cover', 
                                  borderRadius: '15px',
                                  maxHeight: '300px'
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
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
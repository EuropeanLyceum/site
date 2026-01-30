'use client';

import Image from 'next/image';
import styles from '@/app/about-lyceum/history/history.module.css';
import kochergina from "@/assets/photos/history/kochergina.jpg";
import dribna from "@/assets/photos/history/dribna.jpg";
import kapishevska from "@/assets/photos/history/kapishevska.jpg";
import bova from "@/assets/photos/history/bova.jpg";
import vorozhbyt from "@/assets/photos/history/vorozhbyt.jpg";

export default function Teachers({t}) {

    return (
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
    );
}
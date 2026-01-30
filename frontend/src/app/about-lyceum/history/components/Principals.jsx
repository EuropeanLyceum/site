'use client';

import Image from 'next/image';
import styles from '@/app/about-lyceum/history/history.module.css';
import oranskyi from "@/assets/photos/history/oranskyi.jpg";
import bondar from "@/assets/photos/history/bondar.jpg";
import sakhno from "@/assets/photos/history/sakhno.jpg";
import chabanenko from "@/assets/photos/history/chabanenko.jpg";
import klyushnichenko from "@/assets/photos/history/klyushnichenko.jpg";
import tkachenko from "@/assets/photos/history/tkachenko.jpg";
import rohozha from "@/assets/photos/history/rohozha.jpg";
import nikitenko from "@/assets/photos/history/nikitenko.jpg";
import dmytrenko from "@/assets/photos/history/dmytrenko.jpg";
import kochergina from "@/assets/photos/history/kochergina.jpg";
import derkach from "@/assets/photos/history/derkach.jpg";

export default function Principals({t}) {

    return (
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
    );
}
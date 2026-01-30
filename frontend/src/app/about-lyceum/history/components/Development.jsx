'use client';
import {Box, Typography} from "@mui/material"
import {useState, useEffect} from 'react';
import Image from 'next/image';
import teachers from '@/assets/photos/teachers.jpg';
import logoPictureVisitCard from '@/assets/photos/icons/logo_picture_visit_card.jpg';
import styles from '@/app/about-lyceum/history/history.module.css';
import {Grid} from "@mui/material";
import founders from "@/assets/photos/history/founders.jpg";
import development1 from "@/assets/photos/history/development1.jpg";
import development2 from "@/assets/photos/history/development2.jpg";
import development3 from "@/assets/photos/history/development3.jpg";

export default function Development({t}) {

    return (
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
    );
}
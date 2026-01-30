'use client';
import {Box, Typography} from "@mui/material"
import {useState, useEffect} from 'react';
import Image from 'next/image';
import teachers from '@/assets/photos/teachers.jpg';
import logoPictureVisitCard from '@/assets/photos/icons/logo_picture_visit_card.jpg';
import styles from '@/app/about-lyceum/history/history.module.css';
import {Grid} from "@mui/material";
import founders from "@/assets/photos/history/founders.jpg";
import schoolPhoto1 from "@/assets/photos/history/school_photo1.jpg";
import schoolPhoto2 from "@/assets/photos/history/school_photo2.jpg";
import schoolPhoto3 from "@/assets/photos/history/school_photo3.jpg";

export default function Building({t}) {

    return (
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
    );
}
'use client';
import {Box, Typography} from "@mui/material"
import {useState, useEffect} from 'react';
import Image from 'next/image';
import teachers from '@/assets/photos/teachers.jpg';
import logoPictureVisitCard from '@/assets/photos/icons/logo_picture_visit_card.jpg';
import styles from '@/app/about-lyceum/history/history.module.css';
import {Grid} from "@mui/material";
import founders from "@/assets/photos/history/founders.jpg";

export default function Founders({t}) {

    return (
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
    );
}
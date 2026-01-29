'use client';
import {Box, Typography} from "@mui/material"
import {useState, useEffect} from 'react';
import Image from 'next/image';
import teachers from '@/assets/photos/teachers.jpg';
import logoPictureVisitCard from '@/assets/photos/icons/logo_picture_visit_card.jpg';
import styles from '@/app/about-lyceum/visiting-card/visiting-card.module.css';
import materialBasis from "@/assets/photos/building/material_basis.jpg";
import galochka from "@/assets/photos/icons/galochka-icon.png";

export default function Clubs({t}) {

    return (
        <Box id="staff" className={styles.section}>
            <Box className={styles.staffContent}>
                <h1 className={styles.staffTitle}>{t('lyceumWorksTitle')}</h1>
                <Box className={styles.staffItem}>
                    <Box className={styles.staffMarker}></Box>
                    <Box className={styles.staffInfo}>
                        <h3 className={styles.staffName}>{t('divosvitSociety')}</h3>
                        <Typography className={styles.staffDescription}>{t('scientificSocietyDescription')}</Typography>
                    </Box>
                </Box>
                <Box className={styles.staffItem}>
                    <Box className={styles.staffMarker}></Box>
                    <Box className={styles.staffInfo}>
                        <h3 className={styles.staffName}>{t('linkClub')}</h3>
                        <Typography className={styles.staffDescription}>{t('europeanClubDescription')}</Typography>
                    </Box>
                </Box>
                <Box className={styles.staffItem}>
                    <Box className={styles.staffMarker}></Box>
                    <Box className={styles.staffInfo}>
                        <h3 className={styles.staffName}>{t('divotsvitStudio')}</h3>
                        <Typography className={styles.staffDescription}>{t('artStudioDescription')}</Typography>
                    </Box>
                </Box>
                <Box className={styles.staffItem}>
                    <Box className={styles.staffMarker}></Box>
                    <Box className={styles.staffInfo}>
                        <h3 className={styles.staffName}>{t('valeriEnsemble')}</h3>
                        <Typography className={styles.staffDescription}>{t('vocalEnsembleDescription')}</Typography>
                    </Box>
                </Box>
                <Box className={styles.staffItem}>
                    <Box className={styles.staffMarker}></Box>
                    <Box className={styles.staffInfo}>
                        <h3 className={styles.staffName}>{t('kardenGroup')}</h3>
                        <Typography className={styles.staffDescription}>{t('danceGroupDescription')}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>


    );
}
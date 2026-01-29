'use client';
import {Box, Grid, Typography} from "@mui/material"
import styles from '@/app/about-lyceum/visiting-card/visiting-card.module.css';
import galochka from '@/assets/photos/icons/galochka-icon.png';
import materialBasis from '@/assets/photos/building/material_basis.jpg';
import Image from 'next/image';
import teachers from "@/assets/photos/teachers.jpg";

export default function MaterialBase({t}) {

    return (
        <Box id="facilities" className={styles.section}>
            <h1 className={styles.facilitiesTitle}>{t('facilitiesTitle')}</h1>
            <Grid container spacing={3} className={styles.facilitiesContent}>
                <Grid item size={{xs: 12, md: 12, lg: 6}} className={styles.facilitiesImageContainer}>
                    <Image
                        src={materialBasis}
                        alt={t('facilitiesPhotoAlt')}
                        className={styles.facilitiesImage}
                        fill
                    />
                </Grid>
                <Grid item size={{xs: 12, md: 12, lg: 6}} className={styles.facilitiesInfo}>
                    <h2 className={styles.facilitiesSubtitle}>{t('threeFloorBuildingTitle')}</h2>
                    <Box className={styles.facilitiesList}>
                        <Box className={styles.facilityItem}>
                            <Image src={galochka} alt={t('checkmarkAlt')} className={styles.checkIcon} width={24} height={24} />
                            <Typography>{t('classrooms26Description')}</Typography>
                        </Box>
                        <Box className={styles.facilityItem}>
                            <Image src={galochka} alt={t('checkmarkAlt')} className={styles.checkIcon} width={24} height={24} />
                            <Typography>{t('englishCabinets10Description')}</Typography>
                        </Box>
                        <Box className={styles.facilityItem}>
                            <Image src={galochka} alt={t('checkmarkAlt')} className={styles.checkIcon} width={24} height={24} />
                            <Typography>{t('modernCabinetsDescription')}</Typography>
                        </Box>
                        <Box className={styles.facilityItem}>
                            <Image src={galochka} alt={t('checkmarkAlt')} className={styles.checkIcon} width={24} height={24} />
                            <Typography>{t('resourceCenterDescription')}</Typography>
                        </Box>
                        <Box className={styles.facilityItem}>
                            <Image src={galochka} alt={t('checkmarkAlt')} className={styles.checkIcon} width={24} height={24} />
                            <Typography>{t('hallsDescription')}</Typography>
                        </Box>
                        <Box className={styles.facilityItem}>
                            <Image src={galochka} alt={t('checkmarkAlt')} className={styles.checkIcon} width={24} height={24} />
                            <Typography>{t('multimediaCenterDescription')}</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
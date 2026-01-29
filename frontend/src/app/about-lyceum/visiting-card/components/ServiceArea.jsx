'use client';
import {Box, Grid, Typography} from "@mui/material"
import styles from '@/app/about-lyceum/visiting-card/visiting-card.module.css';

export default function ServiceArea({t}) {

    return (
        <Box id="service-area" className={styles.section}>
            <h1 className={styles.serviceAreaTitle}>{t('serviceAreaTitle')}</h1>
            <Grid container spacing={3} className={styles.serviceAreaContent}>
                <Grid className={styles.addressBlock} item size={{xs: 12, md: 6, lg: 4}}>
                    <Typography className={styles.addressBlockP}>{t('serviceAreaAddress1')}</Typography>
                </Grid>
                <Grid className={styles.addressBlock} item size={{xs: 12, md: 6, lg: 4}}>
                    <Typography className={styles.addressBlockP}>{t('serviceAreaAddress2')}</Typography>
                </Grid>
                <Grid className={styles.addressBlock} item size={{xs: 12, md: 6, lg: 4}}>
                    <Typography className={styles.addressBlockP}>{t('serviceAreaAddress3')}</Typography>
                </Grid>
                <Grid className={styles.addressBlock} item size={{xs: 12, md: 6, lg: 4}}>
                    <Typography className={styles.addressBlockP}>{t('serviceAreaAddress4')}</Typography>
                </Grid>
                <Grid className={styles.addressBlock} item size={{xs: 12, md: 6, lg: 4}}>
                    <Typography className={styles.addressBlockP}>{t('serviceAreaAddress5')}</Typography>
                </Grid>
                <Grid className={styles.addressBlock} item size={{xs: 12, md: 6, lg: 4}}>
                    <Typography className={styles.addressBlockP}>{t('serviceAreaAddress6')}</Typography>
                </Grid>
                <Grid className={styles.addressBlock} item size={{xs: 12, md: 6, lg: 4}}>
                    <Typography className={styles.addressBlockP}>{t('serviceAreaAddress7')}</Typography>
                </Grid>
                <Grid className={styles.addressBlock} item size={{xs: 12, md: 6, lg: 4}}>
                    <Typography className={styles.addressBlockP}>{t('serviceAreaAddress8')}</Typography>
                </Grid>
                <Grid className={styles.addressBlock} item size={{xs: 12, md: 6, lg: 4}}>
                    <Typography className={styles.addressBlockP}>{t('serviceAreaAddress9')}</Typography>
                </Grid>
            </Grid>
        </Box>


    );
}
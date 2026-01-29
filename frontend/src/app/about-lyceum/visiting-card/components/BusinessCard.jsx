'use client';
import {Box, Typography} from "@mui/material"
import {useState, useEffect} from 'react';
import Image from 'next/image';
import teachers from '@/assets/photos/teachers.jpg';
import logoPictureVisitCard from '@/assets/photos/icons/logo_picture_visit_card.jpg';
import styles from '@/app/about-lyceum/visiting-card/visiting-card.module.css';
import {Grid} from "@mui/material";

export default function BusinessCard({t}) {

    return (
        <Box className={`${styles.section} ${styles.ourCard} ${styles.active}`}>
            <Grid container spacing={3} className={styles.ourCardContent}>
                <Grid item size={{xs: 12, md: 12, lg: 6}}>
                    <h1 className={styles.ourCardTitle}>{t('ourCardTitle')}</h1>
                    <Box className={styles.ourCardImageContainer}>
                        <Image
                            src={teachers}
                            alt={t('teachersTeamAlt')}
                            className={styles.ourCardImage}
                            fill
                        />
                    </Box>
                </Grid>
                <Grid item size={{xs: 12, md: 12, lg: 6}}>
                    <Grid container spacing={3}>
                        {/* === ГОЛОВНА КАРТКА === */}
                        <Grid item size={{xs: 12, md: 8}}>
                            <Box className={`${styles.infoBlock} ${styles.mainInfo}`}>
                                <Box>
                                    <h3>
                                        <span>{t('academicLyceumEuropean')}</span><br/>
                                        <span>{t('europeanLyceum')}</span>
                                    </h3>
                                    <Typography>{t('locationLubnyPoltava')}</Typography>
                                    <Typography className={styles.motto}>
                                        {t('ourKnowledgeMotto')}
                                    </Typography>
                                </Box>

                                <Image
                                    src={logoPictureVisitCard}
                                    alt={t('logoAlt')}
                                    className={styles.infoLogo}
                                    width={105}
                                    height={105}
                                />
                            </Box>
                        </Grid>

                        <Grid item size={{xs: 12, md: 4}}>
                            <Box className={styles.infoBlock}>
                                <h3>{t('specializationTitle')}</h3>
                                <Typography>{t('inDepthEnglishStudy')}</Typography>
                            </Box>
                        </Grid>

                        {/* === СТАТИСТИКА 1 === */}
                        <Grid item size={{xs: 12, md: 4}}>
                            <Box className={styles.infoBlock}>
                                <h3>{t('teachersCount')}</h3>
                                <Typography>{t('teachersCountNumber')}</Typography>
                            </Box>
                        </Grid>

                        <Grid item size={{xs: 12, md: 4}}>
                            <Box className={styles.infoBlock}>
                                <h3>{t('lyceumAnthemTitle')}</h3>
                                <Typography>
                                    <a href="https://www.youtube.com/watch?v=7RArC-RZP74" target="_blank">
                                        {t('anthemLink')} &gt;
                                    </a>
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item size={{xs: 12, md: 4}}>
                            <Box className={styles.infoBlock}>
                                <h3>{t('licensedCapacityTitle')}</h3>
                                <Typography>{t('licensedCapacityNumber')}</Typography>
                            </Box>
                        </Grid>

                        {/* === СТАТИСТИКА 2 === */}
                        <Grid item size={{xs: 12, md: 4}}>
                            <Box className={styles.infoBlock}>
                                <h3>{t('totalStaffCount')}</h3>
                                <Typography>{t('totalStaffNumber')}</Typography>
                            </Box>
                        </Grid>

                        <Grid item size={{xs: 12, md: 4}}>
                            <Box className={styles.infoBlock}>
                                <h3>{t('languageOfStudyTitle')}</h3>
                                <Typography>{t('ukrainianLanguage')}</Typography>
                            </Box>
                        </Grid>

                        <Grid item size={{xs: 12, md: 4}}>
                            <Box className={styles.infoBlock}>
                                <h3>{t('actualStudentsCountTitle')}</h3>
                                <Typography>{t('actualStudentsCountNumber')}</Typography>
                            </Box>
                        </Grid>

                        {/* === АДРЕСА + КОНТАКТИ === */}
                        <Grid item size={{xs: 12, md: 6}}>
                            <Box className={styles.infoBlock}>
                                <h3>{t('addressTitle')}</h3>
                                <Typography whiteSpace="pre-line">
                                    {t('fullAddressText')}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item size={{xs: 12, md: 6}}>
                            <Box className={styles.infoBlock}>
                                <h3>{t('contactsTitle')}</h3>
                                <Typography>
                                    {t('contactPhone')}<br/>
                                    {t('contactEmail')}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>


    );
}
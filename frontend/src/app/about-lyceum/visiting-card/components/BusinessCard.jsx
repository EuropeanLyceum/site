'use client';

import { Box, Typography, Grid } from '@mui/material';
import Image from 'next/image';
import teachers from '@/assets/photos/teachers.jpg';
import logoPictureVisitCard from '@/assets/photos/icons/logo_picture_visit_card.jpg';

export default function BusinessCard({ t }) {
    return (
        <Box sx={sectionSx}>
            <Grid container spacing={3} sx={{ mt: '100px' }}>
                <Grid item size={{xs: 12, md: 12, lg: 6}}>
                    <Typography component="h1" sx={ourCardTitleSx}>
                        {t('ourCardTitle')}
                    </Typography>

                    <Box className="ImageContainerFull">
                        <Image
                            src={teachers}
                            alt={t('teachersTeamAlt')}
                            className="ImageFull"
                            fill
                        />
                    </Box>
                </Grid>

                <Grid item size={{xs: 12, md: 12, lg: 6}} sx={{mt: 2}}>
                    <Grid container spacing={3}>
                        <Grid item size={{xs: 12, md: 8}}>
                            <Box sx={{ ...infoBlockSx, ...mainInfoSx }}>
                                <Box>
                                    <Typography component="h3" sx={h3Sx}>
                                        {t('academicLyceumEuropean')}
                                        <br />
                                        {t('europeanLyceum')}
                                    </Typography>

                                    <Typography>{t('locationLubnyPoltava')}</Typography>

                                    <Typography sx={mottoSx}>
                                        {t('ourKnowledgeMotto')}
                                    </Typography>
                                </Box>

                                <Image
                                    src={logoPictureVisitCard}
                                    alt={t('logoAlt')}
                                    width={105}
                                    height={105}
                                />
                            </Box>
                        </Grid>

                        <Grid item size={{xs: 12, md: 4}}>
                            <InfoBlock
                                title={t('specializationTitle')}
                                value={t('inDepthEnglishStudy')}
                            />
                        </Grid>

                        <Grid item size={{xs: 12, md: 4}}>
                            <InfoBlock
                                title={t('teachersCount')}
                                value={t('teachersCountNumber')}
                            />
                        </Grid>

                        <Grid item size={{xs: 12, md: 4}}>
                            <Box sx={infoBlockSx}>
                                <Typography sx={h3Sx}>
                                    {t('lyceumAnthemTitle')}
                                </Typography>
                                <Typography>
                                    <a
                                        href="https://www.youtube.com/watch?v=7RArC-RZP74"
                                        target="_blank"
                                    >
                                        {t('anthemLink')} &gt;
                                    </a>
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item size={{xs: 12, md: 4}}>
                            <InfoBlock
                                title={t('licensedCapacityTitle')}
                                value={t('licensedCapacityNumber')}
                            />
                        </Grid>

                        <Grid item size={{xs: 12, md: 4}}>
                            <InfoBlock
                                title={t('totalStaffCount')}
                                value={t('totalStaffNumber')}
                            />
                        </Grid>

                        <Grid item size={{xs: 12, md: 4}}>
                            <InfoBlock
                                title={t('languageOfStudyTitle')}
                                value={t('ukrainianLanguage')}
                            />
                        </Grid>

                        <Grid item size={{xs: 12, md: 4}}>
                            <InfoBlock
                                title={t('actualStudentsCountTitle')}
                                value={t('actualStudentsCountNumber')}
                            />
                        </Grid>

                        <Grid item size={{xs: 12, md: 6}}>
                            <Box sx={infoBlockSx}>
                                <Typography sx={h3Sx}>
                                    {t('addressTitle')}
                                </Typography>
                                <Typography whiteSpace="pre-line">
                                    {t('fullAddressText')}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item size={{xs: 12, md: 6}}>
                            <Box sx={infoBlockSx}>
                                <Typography sx={h3Sx}>
                                    {t('contactsTitle')}
                                </Typography>
                                <Typography>
                                    {t('contactPhone')}
                                    <br />
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

/* ================== styles ================== */

const sectionSx = {
    background:
        'radial-gradient(50% 50% at 50% 50%, #fff 0%, rgba(187,188,192,0.3) 61.92%, #d5e0f0 100%)',
    width: '100%',
    position: 'relative',
    mt: '-83px',
    pt: '83px',
    pb: '20px',
    px: '20px',
    mb: '80px',
};

const ourCardTitleSx = {
    fontFamily: 'Montserrat Alternates',
    fontWeight: 700,
    fontSize: '50px',
    lineHeight: '60px',
    color: '#182BA1',
    mb: '24px',
};

const infoBlockSx = {
    background: '#fff',
    borderRadius: '24px',
    p: '20px',
    height: '130px',
};

const mainInfoSx = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const h3Sx = {
    color: '#182BA1',
    fontSize: '18px',
    fontWeight: 600,
    mb: '6px',
    fontFamily: 'Montserrat Alternates',
};

const mottoSx = {
    fontStyle: 'italic',
    fontSize: '12px',
    whiteSpace: 'nowrap',
};

/* ===== reusable ===== */

function InfoBlock({ title, value }) {
    return (
        <Box sx={infoBlockSx}>
            <Typography sx={h3Sx}>{title}</Typography>
            <Typography>{value}</Typography>
        </Box>
    );
}
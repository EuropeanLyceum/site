'use client';
import { Box, Typography, Grid, alpha, Container } from '@mui/material';
import Image from 'next/image';
import teachers from '@/assets/photos/teachers.jpg';
import logoPictureVisitCard from '@/assets/photos/icons/logo_picture_visit_card.jpg';

export default function BusinessCard({ t }) {
    return (
        <Box sx={{ pt: { xs: 4 }, pb: 8 }}>
            <Container maxWidth="xl">
                <Typography variant="h1" sx={ourCardTitleSx}>
                    {t('ourCardTitle')}
                </Typography>

                <Grid container spacing={4}>
                    {/* Ліва частина: Велика фотографія команди */}
                    <Grid item size={{xs: 12, lg: 6}}>
                        <Box sx={{
                            position: 'relative',
                            height: { xs: 300, md: 500 },
                            borderRadius: 8,
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(12, 43, 161, 0.2)',
                            border: '1px solid #fff'
                        }}>
                            <Image src={teachers} alt={t('teachersTeamAlt')} fill style={{ objectFit: 'cover' }} priority />
                        </Box>
                    </Grid>

                    {/* Права частина: Плитки з інфо */}
                    <Grid item size={{xs: 12, lg: 6}}>
                        <Box sx={{
                            background: 'linear-gradient(135deg, #0c1865 0%, #1e2b8d 100%)',
                            borderRadius: 8,
                            p: { xs: 3, md: 4 },
                            height: '100%',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                        }}>
                            <Grid container spacing={2}>
                                {/* Головний блок з лого */}
                                <Grid item size={{xs: 12}}>
                                    <Box sx={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        background: alpha('#fff', 0.1), backdropFilter: 'blur(10px)',
                                        p: 3, borderRadius: 6, border: `1px solid ${alpha('#fff', 0.1)}`, mb: 1
                                    }}>
                                        <Box>
                                            <Typography sx={{ color: '#fff', fontSize: { xs: 18, md: 22 }, fontWeight: 800, fontFamily: 'Montserrat Alternates' }}>
                                                {t('academicLyceumEuropean')} {t('europeanLyceum')}
                                            </Typography>
                                            <Typography sx={{ color: alpha('#fff', 0.7), mt: 1 }}>{t('locationLubnyPoltava')}</Typography>
                                            <Typography sx={{ color: '#f97316', mt: 1, fontStyle: 'italic', fontWeight: 600 }}>{t('ourKnowledgeMotto')}</Typography>
                                        </Box>
                                        <Box sx={{ bgcolor: '#fff', p: 1, borderRadius: 4, display: { xs: 'none', sm: 'block' } }}>
                                            <Image src={logoPictureVisitCard} alt="logo" width={80} height={80} />
                                        </Box>
                                    </Box>
                                </Grid>

                                <InfoTile title={t('specializationTitle')} value={t('inDepthEnglishStudy')} xs={12} sm={6} />
                                <InfoTile title={t('languageOfStudyTitle')} value={t('ukrainianLanguage')} xs={12} sm={6} />
                                <InfoTile title={t('teachersCount')} value={t('teachersCountNumber')} xs={6} sm={4} />
                                <InfoTile title={t('totalStaffCount')} value={t('totalStaffNumber')} xs={6} sm={4} />
                                <InfoTile title={t('licensedCapacityTitle')} value={t('licensedCapacityNumber')} xs={12} sm={4} />

                                <Grid item size={{xs: 12, sm: 6}}>
                                    <Box sx={tileStyle}>
                                        <Typography sx={tileTitle}>{t('addressTitle')}</Typography>
                                        <Typography sx={tileValue}>{t('fullAddressText')}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item size={{xs: 12, sm: 6}}>
                                    <Box sx={tileStyle}>
                                        <Typography sx={tileTitle}>{t('contactsTitle')}</Typography>
                                        <Typography sx={tileValue}>{t('contactPhone')}<br/>{t('contactEmail')}</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

function InfoTile({ title, value, xs, sm }) {
    return (
        <Grid item size={{xs: xs, sm: sm}}>
            <Box sx={tileStyle}>
                <Typography sx={tileTitle}>{title}</Typography>
                <Typography sx={tileValue}>{value}</Typography>
            </Box>
        </Grid>
    );
}

const ourCardTitleSx = {
    fontFamily: 'Montserrat Alternates',
    fontWeight: 900,
    fontSize: { xs: 32, md: 56 },
    color: '#182BA1',
    mb: 4,
    textAlign: 'center'
};

const tileStyle = {
    background: alpha('#fff', 0.05),
    border: `1px solid ${alpha('#fff', 0.1)}`,
    borderRadius: 5,
    p: 2,
    height: '100%',
    transition: '0.3s',
    '&:hover': { background: alpha('#fff', 0.1) }
};

const tileTitle = { color: '#f97316', fontWeight: 700, fontSize: 13, mb: 0.5, textTransform: 'uppercase' };
const tileValue = { color: '#fff', fontWeight: 600, fontSize: 15 };
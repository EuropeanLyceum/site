'use client';

import Image from 'next/image';
import { Box, Grid, Typography, Card, CardContent, alpha } from '@mui/material';

import oranskyi from '@/assets/photos/history/oranskyi.jpg';
import bondar from '@/assets/photos/history/bondar.jpg';
import sakhno from '@/assets/photos/history/sakhno.jpg';
import chabanenko from '@/assets/photos/history/chabanenko.jpg';
import klyushnichenko from '@/assets/photos/history/klyushnichenko.jpg';
import tkachenko from '@/assets/photos/history/tkachenko.jpg';
import rohozha from '@/assets/photos/history/rohozha.jpg';
import nikitenko from '@/assets/photos/history/nikitenko.jpg';
import dmytrenko from '@/assets/photos/history/dmytrenko.jpg';
import kochergina from '@/assets/photos/history/kochergina.jpg';
import derkach from '@/assets/photos/history/derkach.jpg';


export default function Principals({ t }) {
    const directors = [
        {
            key: 'oranskyi',
            image: oranskyi,
            alt: 'Оранський Яків Олександрович',
            name: 'oranskyiName',
            description: 'oranskyiDescription',
            caption: 'oranskyiCaption',
        },
        {
            key: 'bondar',
            image: bondar,
            alt: 'Бондар Михайло Сергійович',
            name: 'bondarName',
            description: 'bondarDescription',
        },
        {
            key: 'sakhno',
            image: sakhno,
            alt: 'Сахно Володимир Іванович',
            name: 'sakhnoName',
            description: 'sakhnoDescription',
            caption: 'sakhnoCaption',
        },
        {
            key: 'chabanenko',
            image: chabanenko,
            alt: 'Чабаненко Олександра Іванівна',
            name: 'chabanenkoName',
            description: 'chabanenkoDescription',
            objectPosition: 'center 20%',
        },
        {
            key: 'klyushnichenko',
            image: klyushnichenko,
            alt: 'Клюшніченко Микола Степанович',
            name: 'klyushnichenkoName',
            description: 'klyushnichenkoDescription',
            caption: 'klyushnichenkoCaption',
        },
        {
            key: 'tkachenko',
            image: tkachenko,
            alt: 'Ткаченко Володимир Іванович',
            name: 'tkachenkoName',
            description: 'tkachenkoDescription',
            objectPosition: 'left center',
        },
        {
            key: 'rohozha',
            image: rohozha,
            alt: 'Рогожа Михайло Миколайович',
            name: 'rohozhaName',
            description: 'rohozhaDescription',
            caption: 'rohozhaCaption',
            objectPosition: 'right center',
        },
        {
            key: 'nikitenko',
            image: nikitenko,
            alt: 'Нікітенко Микола Михайлович',
            name: 'nikitenkoName',
            description: 'nikitenkoDescription',
            caption: 'nikitenkoCaption',
        },
        {
            key: 'dmytrenko',
            image: dmytrenko,
            alt: 'Дмитренко Василь Едуардович',
            name: 'dmytrenkoName',
            description: 'dmytrenkoDescription',
            objectPosition: 'center 30%',
        },
        {
            key: 'kochergina',
            image: kochergina,
            alt: 'Кочергіна Світлана Олександрівна',
            name: 'kocherginaName',
            description: 'kocherginaDescription',
            objectPosition: 'center 30%',
        },
        {
            key: 'derkach',
            image: derkach,
            alt: 'Деркач Лариса Анатоліївна',
            name: 'derkachName',
            description: 'derkachDescription',
            objectPosition: 'center 30%',
        },
    ];

    return (
        <Box component="section" sx={{ mb: 10 }}>
            <Box sx={{ background: 'linear-gradient(165deg, #0c1865 0%, #2539b8 100%)', borderRadius: 8, p: { xs: 4, md: 8 } }}>
                <Typography variant="h2" align="center" sx={{ ...titleSx, mb: 6 }}>
                    {t('leadersTitle')}
                </Typography>

                <Grid container spacing={3}>
                    {directors.map((director) => (
                        <Grid item key={director.key} size={{xs: 12, md: 6, lg: 4}}>
                            <Card sx={{
                                height: '100%',
                                background: alpha('#fff', 0.05),
                                backdropFilter: 'blur(10px)',
                                borderRadius: 6,
                                border: `1px solid ${alpha('#fff', 0.1)}`,
                                p: 2,
                                transition: '0.3s',
                                '&:hover': { transform: 'translateY(-5px)', background: alpha('#fff', 0.1) }
                            }}>
                                <Box sx={{ position: 'relative', height: 300, borderRadius: 4, overflow: 'hidden', mb: 2 }}>
                                    <Image src={director.image} alt={director.alt} fill style={{ objectFit: 'cover' }} />
                                </Box>
                                <CardContent sx={{ textAlign: 'center', p: 1 }}>
                                    <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 18, mb: 1 }}>{t(director.name)}</Typography>
                                    <Typography sx={{ color: alpha('#fff', 0.7), fontSize: 14 }}>{t(director.description)}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}
const titleSx = { fontFamily: "'Montserrat Alternates', sans-serif", fontSize: { xs: 28, md: 42 }, fontWeight: 800, color: '#fff' };
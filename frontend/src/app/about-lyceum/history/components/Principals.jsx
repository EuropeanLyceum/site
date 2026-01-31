'use client';

import Image from 'next/image';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
} from '@mui/material';

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

export default function Principals({ t }) {
    return (
        <Box component="section" sx={{ mb: 10 }}>
            <Typography
                variant="h2"
                align="center"
                sx={{
                    fontWeight: 700,
                    color: '#182BA1',
                    mb: 6,
                    fontSize: { xs: 24, sm: 32, md: 42 },
                }}
            >
                {t('leadersTitle')}
            </Typography>

            <Box
                sx={{
                    backgroundColor: 'rgba(24, 43, 161, 0.5)',
                    borderRadius: 4,
                    p: { xs: 2, sm: 4 },
                    width: '95%',
                    mx: 'auto',
                }}
            >
                <Grid container spacing={4}>
                    {directors.map((director) => (
                        <Grid key={director.key} size={{ xs: 12, md: 6, lg: 4 }}>
                            <Card
                                sx={{
                                    height: '100%',
                                    textAlign: 'center',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: 4,
                                    p: 3,
                                }}
                            >
                                <Box
                                    className={"ImageContainerProfile"}
                                >
                                    <Image
                                        src={director.image}
                                        alt={director.alt}
                                        fill
                                        className={"ImageProfile"}
                                    />
                                </Box>

                                {director.caption && (
                                    <Typography
                                        variant="body2"
                                        sx={{ fontStyle: 'italic', mb: 1, color: '#fff' }}
                                    >
                                        {t(director.caption)}
                                    </Typography>
                                )}

                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        sx={{ color: '#fff', fontWeight: 600, mb: 1 }}
                                    >
                                        {t(director.name)}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#fff' }}>
                                        {t(director.description)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

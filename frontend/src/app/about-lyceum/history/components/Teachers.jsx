'use client';

import Image from 'next/image';
import {Box, Typography, Grid, Card} from '@mui/material';

import kochergina from '@/assets/photos/history/kochergina.jpg';
import dribna from '@/assets/photos/history/dribna.jpg';
import kapishevska from '@/assets/photos/history/kapishevska.jpg';
import bova from '@/assets/photos/history/bova.jpg';
import vorozhbyt from '@/assets/photos/history/vorozhbyt.jpg';

const teachers = [
    {
        key: 'dribna',
        image: dribna,
        alt: 'Дрібна Надія Микитівна',
        name: 'dribnaName',
        descriptions: [
            'dribnaDescription1',
            'dribnaDescription2',
            'dribnaDescription3',
        ],
    },
    {
        key: 'kapishevska',
        image: kapishevska,
        alt: 'Капішевська Фаїна Федорівна',
        name: 'kapishevskaName',
        descriptions: [
            'kapishevskaDescription1',
            'kapishevskaDescription2',
        ],
    },
    {
        key: 'bova',
        image: bova,
        alt: 'Бова Лідія Олексіївна',
        name: 'bovaName',
        descriptions: [
            'bovaDescription1',
            'bovaDescription2',
            'bovaDescription3',
        ],
    },
    {
        key: 'vorozhbyt',
        image: vorozhbyt,
        alt: 'Ворожбит Ніна Миколаївна',
        name: 'vorozhbytName',
        descriptions: [
            'vorozhbytDescription1',
            'vorozhbytDescription2',
            'vorozhbytDescription3',
            'vorozhbytDescription4',
            'vorozhbytDescription5',
        ],
    },
    {
        key: 'kochergina',
        image: kochergina,
        alt: 'Кочергіна Світлана Олександрівна',
        name: 'kocherginaTeacherName',
        descriptions: [
            'kocherginaTeacherDescription1',
            'kocherginaTeacherDescription2',
            'kocherginaTeacherDescription3',
        ],
    },
];

export default function Teachers({t}) {
    return (
        <Box sx={{mb: 10}}>
            {/* Заголовок */}
            <Typography
                variant="h2"
                sx={{
                    fontFamily: 'Montserrat Alternates',
                    fontWeight: 700,
                    fontSize: {xs: 24, sm: 32, md: 42},
                    color: '#182BA1',
                    textAlign: 'center',
                    mb: 6,
                }}
            >
                {t('teachersTitle')}
            </Typography>

            {/* Контент */}
            <Box
                sx={{
                    backgroundColor: 'rgba(24, 43, 161, 0.5)',
                    borderRadius: 4,
                    px: {xs: 2, sm: 4},
                    pt: {xs: 2, sm: 4},
                    pb: 1
                }}
            >
                {teachers.map((teacher) => (
                    <Box key={teacher.key}>
                        <Card
                            sx={{
                                height: '100%',
                                textAlign: 'center',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: 4,
                                mb: 5,
                                p: 2,

                            }}
                        >
                            <Grid
                                container
                                spacing={4}
                            >

                                {/* Фото */}
                                <Grid size={{xs: 12, md: 5}}>
                                    <Box
                                        className={"ImageContainerProfile"}
                                    >
                                        <Image
                                            src={teacher.image}
                                            alt={teacher.alt}
                                            fill
                                            className={"ImageProfile"}
                                        />
                                    </Box>
                                </Grid>

                                {/* Текст */}
                                <Grid size={{xs: 12, md: 7}}>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontFamily: 'Montserrat Alternates',
                                            fontSize: 24,
                                            color: 'white',
                                            mb: 2,
                                        }}
                                    >
                                        {t(teacher.name)}
                                    </Typography>

                                    {teacher.descriptions.map((desc) => (
                                        <Typography
                                            key={desc}
                                            sx={{
                                                fontFamily: 'Montserrat Alternates',
                                                fontSize: {xs: 14, sm: 16, md: 18},
                                                lineHeight: 1.7,
                                                color: 'white',
                                                my: 1,
                                                textAlign: 'justify',
                                            }}
                                        >
                                            {t(desc)}
                                        </Typography>
                                    ))}
                                </Grid>
                            </Grid>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

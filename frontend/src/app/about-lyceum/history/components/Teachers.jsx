'use client';

import Image from 'next/image';
import {Box, Typography, Grid, alpha} from '@mui/material';

import kochergina from '@/assets/photos/history/kochergina.jpg';
import dribna from '@/assets/photos/history/dribna.jpg';
import kapishevska from '@/assets/photos/history/kapishevska.jpg';
import bova from '@/assets/photos/history/bova.jpg';
import vorozhbyt from '@/assets/photos/history/vorozhbyt.jpg';


export default function Teachers({t}) {

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

    return (
        <Box sx={{mb: 5}}>
            <Box sx={{background: '#0c1865', borderRadius: 8, p: {xs: 4, md: 8}}}>
                <Typography variant="h2" sx={{...titleSx, textAlign: 'center', mb: 8}}>
                    {t('teachersTitle')}
                </Typography>

                {teachers.map((teacher) => (
                    <Box key={teacher.key} sx={{
                        mb: 6,
                        p: 4,
                        background: alpha('#fff', 0.03),
                        borderRadius: 6,
                        border: `1px solid ${alpha('#fff', 0.05)}`
                    }}>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item size={{xs: 12, md: 4}}>
                                <Box sx={{position: 'relative', height: 350, borderRadius: 4, overflow: 'hidden'}}>
                                    <Image src={teacher.image} fill style={{objectFit: 'cover'}} alt={teacher.alt}/>
                                </Box>
                            </Grid>
                            <Grid item size={{xs: 12, md: 8}}>
                                <Typography variant="h4" sx={{
                                    color: '#f97316',
                                    fontWeight: 800,
                                    mb: 2,
                                    fontFamily: "'Montserrat Alternates', sans-serif"
                                }}>
                                    {t(teacher.name)}
                                </Typography>
                                {teacher.descriptions.map((desc, i) => (
                                    <Typography key={i} sx={{...paragraphSx, mb: 1.5}}>{t(desc)}</Typography>
                                ))}
                            </Grid>
                        </Grid>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
const titleSx = {
    fontFamily: "'Montserrat Alternates', sans-serif",
    fontSize: {xs: 28, md: 42},
    fontWeight: 800,
    color: '#fff'
};
const paragraphSx = {fontSize: {xs: 15, md: 17}, lineHeight: 1.7, color: alpha('#fff', 0.8), textAlign: 'justify'};
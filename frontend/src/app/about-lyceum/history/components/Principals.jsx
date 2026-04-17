'use client';
import { Box, Grid, Typography, Card, CardContent, alpha } from '@mui/material';
import Image from 'next/image';
import RichText from "../../../../RichText"; // Ensure this path is correct

export default function Principals({ items, locale, t }) {
    if (!items?.length) return null;

    return (
        <Box component="section" sx={{ mb: 10 }}>
            <Box sx={{ background: 'linear-gradient(165deg, #0c1865 0%, #2539b8 100%)', borderRadius: 8, p: { xs: 4, md: 8 } }}>
                <Typography variant="h2" align="center" sx={{ ...titleSx, mb: 6 }}>
                    {t('leadersTitle')}
                </Typography>

                <Grid container spacing={3}>
                    {items.sort((a, b) => a.order - b.order).map((person) => {
                        const isEn = locale === 'en';
                        const description = isEn ? person.descriptionEn : person.descriptionUk;
                        
                        return (
                            <Grid item key={person.id} size={{xs: 12, md: 6, lg: 4}}>
                                <Card sx={cardSx}>
                                    <Box sx={{ position: 'relative', height: 350, borderRadius: 4, overflow: 'hidden', mb: 2 }}>
                                        <Image 
                                            src={person.photo || ''} 
                                            alt={isEn ? person.fullNameEn : person.fullNameUk} 
                                            fill 
                                            style={{ objectFit: 'cover' }} 
                                        />
                                    </Box>
                                    <CardContent sx={{ textAlign: 'center', p: 1 }}>
                                        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 20, mb: 1 }}>
                                            {isEn ? person.fullNameEn : person.fullNameUk}
                                        </Typography>
                                        <Typography sx={{ color: '#f97316', fontWeight: 700, fontSize: 14, mb: 1, textTransform: 'uppercase' }}>
                                            {isEn ? person.positionEn : person.positionUk}
                                        </Typography>
                                        
                                        {/* RICH TEXT IMPLEMENTATION */}
                                        <RichText 
                                            html={description}
                                            sx={{ 
                                                color: alpha('#fff', 0.6), 
                                                fontSize: 14, 
                                                lineHeight: 1.6,
                                                // Center align the rich text content to match the card style
                                                '& p': { textAlign: 'center' },
                                                '& ul': { display: 'inline-block', textAlign: 'left' } 
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Box>
    );
}

const titleSx = { fontFamily: "'Montserrat Alternates', sans-serif", fontSize: { xs: 28, md: 42 }, fontWeight: 800, color: '#fff' };
const cardSx = {
    height: '100%', background: alpha('#fff', 0.05),
    backdropFilter: 'blur(10px)', borderRadius: 6,
    border: `1px solid ${alpha('#fff', 0.1)}`, p: 2,
    transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', background: alpha('#fff', 0.1) }
};

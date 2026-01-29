import Image from 'next/image';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import teachers from '@/assets/photos/teachers.jpg';
import logoPictureVisitCard from '@/assets/photos/icons/logo_picture_visit_card.jpg';
import InfoGrid from './InfoGrid';

export default function OurCardSection({ t }) {
    return (
        <Box my={5}>
            <Typography variant="h4" gutterBottom>{t('ourCardTitle')}</Typography>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Image src={teachers} alt={t('teachersTeamAlt')} width={710} height={400} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h5">{t('academicLyceumEuropean')} "{t('europeanLyceum')}"</Typography>
                                    <Typography>{t('locationLubnyPoltava')}</Typography>
                                    <Typography>{t('ourKnowledgeMotto')}</Typography>
                                    <Box mt={2}>
                                        <Image src={logoPictureVisitCard} alt={t('logoAlt')} width={105} height={105} />
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6">{t('specializationTitle')}</Typography>
                                    <Typography>{t('inDepthEnglishStudy')}</Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Box mt={3}>
                            <InfoGrid t={t} />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
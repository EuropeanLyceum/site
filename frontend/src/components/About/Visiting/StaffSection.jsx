import { Box, Paper, Typography, Grid } from '@mui/material';

export default function StaffSection({ t }) {
    const staffItems = [
        { name: t('divosvitSociety'), description: t('scientificSocietyDescription') },
        { name: t('linkClub'), description: t('europeanClubDescription') },
        { name: t('divotsvitStudio'), description: t('artStudioDescription') },
        { name: t('valeriEnsemble'), description: t('vocalEnsembleDescription') },
        { name: t('kardenGroup'), description: t('danceGroupDescription') },
    ];

    return (
        <Box my={5}>
            <Typography variant="h4" gutterBottom>{t('lyceumWorksTitle')}</Typography>
            <Grid container spacing={2}>
                {staffItems.map((staff, idx) => (
                    <Grid item xs={12} md={6} key={idx}>
                        <Paper sx={{ p: 2, display: 'flex', gap: 2 }}>
                            <Box sx={{ width: 10, backgroundColor: '#182BA1', borderRadius: 1 }} />
                            <Box>
                                <Typography variant="h6">{staff.name}</Typography>
                                <Typography>{staff.description}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
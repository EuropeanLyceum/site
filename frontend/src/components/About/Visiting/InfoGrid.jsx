import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function InfoGrid({ t }) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1">{t('teachersCount')}</Typography>
                            <Typography variant="h6">{t('teachersCountNumber')}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1">{t('lyceumAnthemTitle')}</Typography>
                            <Typography>
                                <a href="https://www.youtube.com/watch?v=7RArC-RZP74&t=2s" target="_blank" rel="noopener noreferrer">{t('anthemLink')}</a>
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1">{t('totalStaffCount')}</Typography>
                            <Typography variant="h6">{t('totalStaffNumber')}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1">{t('languageOfStudyTitle')}</Typography>
                            <Typography>{t('ukrainianLanguage')}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1">{t('licensedCapacityTitle')}</Typography>
                    <Typography variant="h6">{t('licensedCapacityNumber')}</Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}
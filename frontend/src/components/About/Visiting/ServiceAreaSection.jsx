import { Grid, Paper, Typography, Box } from '@mui/material';

export default function ServiceAreaSection({ t }) {
    const addresses = Array.from({ length: 9 }, (_, i) => t(`serviceAreaAddress${i+1}`));
    return (
        <Box my={5}>
            <Typography variant="h4" gutterBottom>{t('serviceAreaTitle')}</Typography>
            <Grid container spacing={2}>
                {Array.from({ length: 3 }, (_, col) => (
                    <Grid item xs={12} md={4} key={col}>
                        {addresses.slice(col*3, col*3+3).map((addr, i) => (
                            <Paper sx={{ p: 2, mb: 1 }} key={i}>
                                <Typography>{addr}</Typography>
                            </Paper>
                        ))}
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
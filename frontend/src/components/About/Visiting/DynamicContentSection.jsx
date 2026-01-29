import { Grid, Paper, Typography, Box } from '@mui/material';

export default function DynamicContentSection({ data, getLocalizedContent }) {
    const formatText = (text) => text?.split('\n').map((line, idx) => <span key={idx}>{line}<br /></span>);
    return (
        <Box my={5}>
            <Grid container spacing={4}>
                {data.map((item) => {
                    const localized = getLocalizedContent(item);
                    return (
                        <Grid item xs={12} key={item.id}>
                            <Paper sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ flex: 1, minWidth: 300 }}>
                                    {localized.title && <Typography variant="h5" gutterBottom>{localized.title}</Typography>}
                                    {localized.content && <Typography sx={{ mb: 1 }}>{formatText(localized.content)}</Typography>}
                                    {item.url && <Typography><a href={item.url} target="_blank" rel="noopener noreferrer">{localized.linkText || item.url}</a></Typography>}
                                </Box>
                                {item.photoUrls && item.photoUrls.length > 0 && (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {item.photoUrls.map((url, i) => (
                                            <img key={i} src={url} alt={`photo-${i}`} style={{ width: 150, height: 'auto', borderRadius: 4 }} />
                                        ))}
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}
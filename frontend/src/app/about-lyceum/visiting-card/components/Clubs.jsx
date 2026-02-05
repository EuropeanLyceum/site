'use client';
import { Box, Typography, Container, alpha } from "@mui/material";

export default function Clubs({ t, clubs, locale }) {
    if (!clubs || clubs.length === 0) return null;

    return (
        <Container maxWidth="lg" sx={{ mb: 10 }}>
            <Box sx={{ background: '#fff', borderRadius: 8, p: { xs: 4, md: 8 }, boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                <Typography variant="h2" sx={{
                    fontFamily: 'Montserrat Alternates', fontWeight: 900,
                    color: '#182BA1', mb: 6, fontSize: { xs: 30, md: 48 }
                }}>
                    {t('lyceumWorksTitle')}
                </Typography>

                {clubs.map((club, idx) => {
                    const name = locale === 'en' ? (club.nameEn || club.nameUk) : club.nameUk;
                    const desc = locale === 'en' ? (club.descriptionEn || club.descriptionUk) : club.descriptionUk;

                    return (
                        <Box key={club.id} sx={{
                            display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4, pb: 4,
                            borderBottom: idx !== clubs.length - 1 ? '1px solid #E2E8F0' : 'none'
                        }}>
                            <Typography sx={{
                                fontSize: 40, fontWeight: 900, color: alpha('#182BA1', 0.1),
                                lineHeight: 1, minWidth: 50
                            }}>
                                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                            </Typography>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography sx={{
                                    fontSize: { xs: 20, md: 26 }, fontWeight: 800,
                                    color: '#182BA1', mb: 1, fontFamily: 'Montserrat Alternates'
                                }}>
                                    {name}
                                </Typography>
                                <Typography sx={{ color: '#64748B', fontSize: 17, lineHeight: 1.6 }}>
                                    {desc}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Container>
    );
}
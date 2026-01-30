'use client';
import { Box, Typography } from "@mui/material";

export default function Clubs({ t }) {
    return (
        <Box id="staff" sx={{ background: 'transparent' }}>
            <Box
                sx={{
                    width: '90%',
                    minHeight: '650px',
                    margin: '100px auto 0',
                    background: '#ebebeb',
                    borderRadius: '30px',
                    padding: { xs: '30px 30px 20px', lg: '60px 60px 40px' },
                    position: 'relative',
                }}
            >
                <Typography
                    component="h1"
                    sx={{
                        fontFamily: '"Montserrat Alternates", sans-serif',
                        fontSize: '40px',
                        fontWeight: 700,
                        color: '#182BA1',
                        marginBottom: '60px',
                    }}
                >
                    {t('lyceumWorksTitle')}
                </Typography>

                {[
                    ['divosvitSociety', 'scientificSocietyDescription'],
                    ['linkClub', 'europeanClubDescription'],
                    ['divotsvitStudio', 'artStudioDescription'],
                    ['valeriEnsemble', 'vocalEnsembleDescription'],
                    ['kardenGroup', 'danceGroupDescription'],
                ].map(([title, desc]) => (
                    <Box
                        key={title}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '36px',
                            padding: '15px 0',
                            borderBottom: '1px solid #000',
                            marginBottom: '30px',
                            width: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                width: '20px',
                                height: '19px',
                                backgroundColor: '#FF5700',
                                borderRadius: '50%',
                                flexShrink: 0,
                            }}
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: { xs: '12px', md: 0 },
                            }}
                        >
                            <Typography
                                component="h3"
                                sx={{
                                    fontSize: '28px',
                                    fontWeight: 700,
                                    color: 'rgba(12, 24, 102, 0.85)',
                                    marginLeft: { md: '-20px', xs: 0 },
                                }}
                            >
                                {t(title)}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    color: '#000',
                                    textAlign: { xs: 'left', md: 'right' },
                                }}
                            >
                                {t(desc)}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
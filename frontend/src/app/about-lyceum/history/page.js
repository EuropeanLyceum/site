'use client';

import { Box, Typography, alpha } from '@mui/material';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';

import Founders from './components/Founders';
import Building from './components/Building';
import Development from './components/Development';
import Principals from './components/Principals';
import Teachers from './components/Teachers';

export default function HistoryPage() {
    const { t, locale } = useTranslation('history');

    return (
        <Box
            lang={locale}
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #F5F7FA 0%, #E8ECF2 100%)', // Світлий фон сторінки
                pb: 10
            }}
        >
            <Box
                sx={{
                    maxWidth: 1200,
                    mx: 'auto',
                    px: { xs: 2, md: 4 },
                    pt: { xs: 5 },
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                {/* Головний заголовок сторінки */}
                <Box sx={{ mb: 5, textAlign: 'center', position: 'relative' }}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: 34, md: 64 },
                            color: '#182BA1',
                            fontWeight: 900,
                            fontFamily: "'Montserrat Alternates', sans-serif",
                            textTransform: 'uppercase',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {t('historyTitle') || 'Наша Історія'}
                    </Typography>
                    <Box sx={{ width: 80, height: 6, bgcolor: '#f97316', mx: 'auto', mt: 2, borderRadius: 3 }} />
                </Box>

                <Founders t={t} />
                <Building t={t} />
                <Development t={t} />
                <Principals t={t} />
                <Teachers t={t} />
            </Box>
        </Box>
    );
}
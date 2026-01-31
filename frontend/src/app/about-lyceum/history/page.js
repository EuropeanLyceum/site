'use client';

import { Box } from '@mui/material';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';

import Founders from '@/app/about-lyceum/history/components/Founders.jsx';
import Building from '@/app/about-lyceum/history/components/Building.jsx';
import Development from '@/app/about-lyceum/history/components/Development.jsx';
import Principals from '@/app/about-lyceum/history/components/Principals.jsx';
import Teachers from '@/app/about-lyceum/history/components/Teachers.jsx';

export default function HistoryPage() {
  const { t, locale } = useTranslation('history');

  return (
      <Box lang={locale}>
        {/* Контент сторінки */}
        <Box
            sx={{
              maxWidth: '100%',
              mx: 'auto',
              mb: 8,
              px: { xs: 1.5, sm: 2, md: 3 },
              pt: { xs: 3, sm: 4 },
              position: 'relative',
              zIndex: 2,
            }}
        >
          <Founders t={t} />
          <Building t={t} />
          <Development t={t} />
          <Principals t={t} />
          <Teachers t={t} />
        </Box>
      </Box>
  );
}

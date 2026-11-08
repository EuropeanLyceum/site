'use client';

import { Box, Typography, Grid, Paper, Card, CardContent, alpha } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CollectionsIcon from '@mui/icons-material/Collections';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import InfoIcon from '@mui/icons-material/Info';

export default function DashboardClient() {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, color: '#0c1865' }}>
                🏠 Головна панель
            </Typography>

            <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 6, border: '1px solid #e2e8f0', bgcolor: '#fff', mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#182BA1' }}>
                    Вітаємо у системі керування ліцеєм!
                </Typography>

                <Typography sx={{ color: '#64748b', mb: 4, maxWidth: '800px', lineHeight: 1.7 }}>
                    Ця панель розроблена для зручного оновлення контенту ліцею "Європейський".
                </Typography>

                <Box sx={{ mt: 5, p: 3, bgcolor: alpha('#182BA1', 0.04), borderRadius: 4, display: 'flex', gap: 2, alignItems: 'center', border: '1px dashed', borderColor: alpha('#182BA1', 0.2) }}>
                    <InfoIcon sx={{ color: '#182BA1' }} />
                    <Typography variant="body2" sx={{ color: '#182BA1', fontWeight: 600 }}>
                        Порада: Для початку роботи виберіть потрібний розділ у лівому меню.
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}
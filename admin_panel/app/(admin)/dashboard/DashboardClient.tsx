'use client';

import { Box, Typography, Grid, Paper, Card, CardContent, alpha } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CollectionsIcon from '@mui/icons-material/Collections';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import InfoIcon from '@mui/icons-material/Info';

export default function DashboardClient() {
    const stats = [
        { title: "Редагування контенту", desc: "Тексти...", icon: <EditNoteIcon />, color: "#182BA1" },
        { title: "Управління фото", desc: "Галереї...", icon: <CollectionsIcon />, color: "#10b981" },
        { title: "Посилання та файли", desc: "Документи...", icon: <AttachmentIcon />, color: "#7c3aed" },
        { title: "Структура сайту", desc: "Розділи...", icon: <AccountTreeIcon />, color: "#f97316" }
    ];

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
                    Виберіть потрібний розділ у лівому меню, щоб почати редагування.
                </Typography>

                <Grid container spacing={3}>
                    {stats.map((item, index) => (
                        <Grid size={{xs: 12, sm: 6}} key={index}> {/* Використовуй стару нотацію Grid item для надійності */}
                            <Card sx={{
                                borderRadius: 4, border: '1px solid #f1f5f9', boxShadow: 'none', transition: '0.3s',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.05)', borderColor: alpha(item.color, 0.3) }
                            }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: alpha(item.color, 0.1), color: item.color, display: 'flex' }}>
                                        {item.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0c1865' }}>{item.title}</Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b' }}>{item.desc}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

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
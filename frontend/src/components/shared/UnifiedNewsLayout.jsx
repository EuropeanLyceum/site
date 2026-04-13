'use client';
import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, CircularProgress, Container, TextField, InputAdornment, Pagination, alpha } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from '@/contexts/TranslationProvider';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard.jsx";
import { useDebounce } from '@/hooks/useDebounce'; // Створіть цей хук або напишіть логіку нижче

export default function UnifiedNewsLayout({
                                              translationKey,
                                              data = [],
                                              isLoading = false,
                                              totalCount = 0,
                                              onParamsChange // Новий колбек для запитів до API
                                          }) {
    const { t, locale } = useTranslation(translationKey);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [expandedItem, setExpandedItem] = useState(null);

    const itemsPerPage = 5;

    // Дебаунс: чекаємо 500мс після останнього введення, перш ніж робити запит
    useEffect(() => {
        const handler = setTimeout(() => {
            onParamsChange({ search: searchQuery, page: page });
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery, page]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(1); // Скидаємо на першу сторінку при пошуку
    };

    const count = Math.ceil(totalCount / itemsPerPage);

    return (
        <Box sx={{ minHeight: '100vh', pb: 10 }}>
            <Box sx={{ position: 'fixed', inset: 0, zIndex: -1, background: 'linear-gradient(180deg, #F5F7FA 0%, #E8ECF2 100%)' }} />

            <Box sx={{ mb: 4, pt: 6, textAlign: 'center' }}>
                <Typography variant="h1" sx={{ fontSize: { xs: 32, md: 52 }, color: '#182BA1', fontWeight: 900 }}>
                    {t('pageTitle')}
                </Typography>
            </Box>

            <Container maxWidth="lg">
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
                    <TextField
                        fullWidth
                        placeholder={t('searchPlaceholder') || "Пошук по новинах..."}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#182BA1' }} /></InputAdornment>,
                        }}
                        sx={{ maxWidth: 600, bgcolor: '#fff', borderRadius: 4 }}
                    />
                </Box>

                {isLoading ? (
                    <Box sx={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress sx={{ color: '#182BA1' }} />
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={2}>
                            {data.map(item => (
                                <Grid item xs={12} key={item.id}>
                                    <UndefinedNewsCard
                                        item={item}
                                        locale={locale}
                                        t={t}
                                        isExpanded={expandedItem === item.id}
                                        onReadMore={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {count > 1 && (
                            <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                                <Pagination
                                    count={count}
                                    page={page}
                                    onChange={(e, v) => setPage(v)}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
}
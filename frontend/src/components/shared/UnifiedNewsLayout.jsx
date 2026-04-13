'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress, Container, TextField, InputAdornment, Pagination, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from '@/contexts/TranslationProvider';
import UndefinedNewsCard from "@/components/shared/UndefinedNewsCard.jsx";

export default function UnifiedNewsLayout({
                                              translationKey,
                                              data = [],
                                              isLoading = false,
                                              totalCount = 0,
                                              onParamsChange,
                                                heroOff = false,
                                          }) {
    const { t, locale } = useTranslation(translationKey);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [expandedItem, setExpandedItem] = useState(null);

    const itemsPerPage = 5;

    // Скрол вгору при зміні сторінки
    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            onParamsChange({ search: searchQuery, page: page });
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery, page, onParamsChange]);

    const count = Math.ceil(totalCount / itemsPerPage);

    return (
        <Box sx={{ minHeight: '100vh', pb: 10, bgcolor: '#F8FAFC' }}>
            {!heroOff &&
            <Box sx={{
                py: { xs: 6, md: 10 },
                background: 'linear-gradient(135deg, #0c1865 0%, #182BA1 100%)',
                color: '#fff',
                mb: 6,
                clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0% 100%)'
            }}>
                <Container maxWidth="lg">
                    <Typography variant="h1" sx={{
                        fontSize: { xs: 32, md: 52 },
                        fontWeight: 900,
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        fontFamily: "'Montserrat Alternates', sans-serif"
                    }}>
                        {t('pageTitle')}
                    </Typography>
                </Container>
            </Box>
            }

            <Container maxWidth="lg">
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
                    <TextField
                        fullWidth
                        placeholder={t('searchPlaceholder') || "Пошук..."}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#182BA1' }} /></InputAdornment>,
                        }}
                        sx={{
                            maxWidth: 600,
                            bgcolor: '#fff',
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            '& .MuiOutlinedInput-root': { borderRadius: 3 }
                        }}
                    />
                </Box>

                {isLoading ? (
                    <Box sx={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress size={60} thickness={4} sx={{ color: '#182BA1' }} />
                    </Box>
                ) : (
                    <>
                        <Stack spacing={4}>
                            {data.map(item => (
                                <UndefinedNewsCard
                                    key={item.id}
                                    item={item}
                                    locale={locale}
                                    isExpanded={expandedItem === item.id}
                                    onReadMore={(id) => setExpandedItem(expandedItem === id ? null : id)}
                                />
                            ))}
                        </Stack>

                        {data.length === 0 && !isLoading && (
                            <Typography sx={{ textAlign: 'center', py: 10, color: 'text.secondary', fontStyle: 'italic' }}>
                                {locale === 'en' ? "No news found" : "Новин не знайдено"}
                            </Typography>
                        )}

                        {count > 1 && (
                            <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                                <Pagination
                                    count={count}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                    sx={{ '& .MuiPaginationItem-root': { fontWeight: 700 } }}
                                />
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
}
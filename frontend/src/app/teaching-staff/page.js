'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Button, Menu, MenuItem, CircularProgress,
    Grid, Container, TextField, InputAdornment, Pagination, Stack
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from '@/contexts/TranslationProvider';
import StaffCard from "@/app/teaching-staff/components/StaffCard.jsx";

export default function TeachingStaffPage() {
    const { t, locale } = useTranslation("teachers");

    // Категорії
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    // Дані персоналу та пагінація
    const [staffData, setStaffData] = useState([]);
    const [totalStaff, setTotalStaff] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Кількість карток на сторінці

    const isEn = locale === 'en';

    // 1. Завантажуємо категорії лише один раз
    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await fetch('/admin/api/admin/personCategory');
                const json = await res.json();
                const cats = json.data || [];
                setCategories(cats);
                if (cats.length > 0) setSelectedCategory(cats[0]);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCats();
    }, []);

    // 2. Функція серверного завантаження персоналу
    const fetchStaff = useCallback(async (category, search, page) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                type: 'TEACHER',
                limit: itemsPerPage.toString(),
                page: page.toString(),
            });

            if (category?.id) params.append('categoryId', category.id);
            if (search) params.append('search', search);

            const res = await fetch(`/admin/api/admin/person?${params}`);
            const json = await res.json();

            setStaffData(json.data || []);
            setTotalStaff(json.meta?.total || 0);
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 3. Дебаунс для пошуку та вибору категорії
    useEffect(() => {
        const handler = setTimeout(() => {
            // Завантажуємо дані лише якщо категорії вже завантажені або список порожній
            if (selectedCategory || categories.length === 0) {
                fetchStaff(selectedCategory, searchQuery, currentPage);
            }
        }, 400);

        return () => clearTimeout(handler);
    }, [selectedCategory, searchQuery, currentPage, categories.length, fetchStaff]);

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Скидаємо на першу сторінку при зміні категорії
        setAnchorEl(null);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Скидаємо на першу сторінку при пошуку
    };

    const displayCategoryName = selectedCategory
        ? (isEn ? selectedCategory.nameEn || selectedCategory.nameUk : selectedCategory.nameUk)
        : "";

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)', pt: 2, pb: 8 }}>

            <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, textAlign: 'center', mb: 6, mt: 4 }}>
                <Typography variant="h1" sx={{ fontWeight: 900, color: '#182BA1', mb: 4, fontSize: { xs: 32, md: 48 }, fontFamily: "'Montserrat Alternates', sans-serif" }}>
                    {t('pedagogicalTeam')}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                    {/* Вибір категорії */}
                    <Button
                        endIcon={<KeyboardArrowDownIcon />}
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{
                            background: '#fff', borderRadius: '12px', px: 4, py: 1.5, color: '#1e293b', fontWeight: 700,
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textTransform: 'none', border: '1px solid #E2E8F0',
                            minWidth: { md: 300 }, height: 56, '&:hover': { borderColor: '#182BA1' }
                        }}
                    >
                        {displayCategoryName || (isLoading && categories.length === 0 ? t('loading') : t('choose'))}
                    </Button>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        PaperProps={{ sx: { borderRadius: 3, mt: 1, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', minWidth: 300 } }}
                    >
                        {categories.map((cat) => (
                            <MenuItem
                                key={cat.id}
                                selected={selectedCategory?.id === cat.id}
                                onClick={() => handleSelectCategory(cat)}
                                sx={{ py: 1.5, fontWeight: 500 }}
                            >
                                {isEn ? cat.nameEn || cat.nameUk : cat.nameUk}
                            </MenuItem>
                        ))}
                    </Menu>

                    {/* Пошук */}
                    <TextField
                        placeholder={t('searchTeacher') || "Пошук викладача..."}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{
                            maxWidth: { xs: '100%', md: 400 }, width: '100%', bgcolor: '#fff', borderRadius: '12px',
                            '& .MuiOutlinedInput-root': { borderRadius: '12px' }
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#182BA1' }} /></InputAdornment>,
                        }}
                    />
                </Box>
            </Box>

            <Container maxWidth="xl">
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress size={60} /></Box>
                ) : (
                    <>
                        {staffData.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 10 }}>
                                <Typography sx={{ color: '#64748B', fontSize: 18 }}>
                                    {searchQuery ? t('noMatches') : t('noTeachersInCategory')}
                                </Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={4}>
                                {staffData.map((staff) => (
                                    <Grid size={{xs: 12, md: 6}} key={staff.id}>
                                        <StaffCard staff={staff} locale={locale} t={t} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        {/* ПАГІНАЦІЯ */}
                        {totalStaff > itemsPerPage && (
                            <Stack alignItems="center" sx={{ mt: 8 }}>
                                <Pagination
                                    count={Math.ceil(totalStaff / itemsPerPage)}
                                    page={currentPage}
                                    onChange={(_, v) => {
                                        setCurrentPage(v);
                                        window.scrollTo({ top: 200, behavior: 'smooth' });
                                    }}
                                    color="primary"
                                    size="large"
                                    sx={{
                                        '& .MuiPaginationItem-root': { fontWeight: 700 }
                                    }}
                                />
                            </Stack>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
}
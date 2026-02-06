'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Menu, MenuItem, CircularProgress, Grid, Container, TextField, InputAdornment } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from '@/contexts/TranslationProvider';
import StaffCard from "@/app/teaching-staff/components/StaffCard.jsx";

export default function TeachingStaffPage() {
    const { t, locale } = useTranslation("teachers");
    const [staffData, setStaffData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const isEn = locale === 'en';

    // 1. Завантажуємо категорії лише один раз при старті
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

    // 2. Завантажуємо персонал кожного разу, коли змінюється категорія АБО пошуковий запит
    useEffect(() => {
        const fetchStaff = async () => {
            setIsLoading(true);
            try {
                // Формуємо параметри: тип, категорія та пошук (якщо є)
                let url = `/admin/api/admin/person?type=TEACHER`;
                if (selectedCategory) url += `&categoryId=${selectedCategory.id}`;
                if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

                const res = await fetch(url);
                const json = await res.json();
                setStaffData(json.data || []);
            } catch (error) {
                console.error('Error fetching staff:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Реалізуємо Debounce для пошуку (чекаємо 400мс після останнього натискання клавіші)
        const timeoutId = setTimeout(() => {
            if (selectedCategory || categories.length === 0) {
                fetchStaff();
            }
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [selectedCategory, searchQuery, categories.length]);

    const handleSelect = (category) => {
        setSelectedCategory(category);
        setAnchorEl(null);
        // Не скидаємо пошук, щоб можна було шукати в межах нової категорії,
        // або скиньте за потреби: setSearchQuery("");
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
                                onClick={() => handleSelect(cat)}
                                sx={{ py: 1.5, fontWeight: 500 }}
                            >
                                {isEn ? cat.nameEn || cat.nameUk : cat.nameUk}
                            </MenuItem>
                        ))}
                    </Menu>

                    {/* Пошук — тепер працює через API */}
                    <TextField
                        placeholder={t('searchTeacher') || "Пошук викладача..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                ) : staffData.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography sx={{ color: '#64748B', fontSize: 18 }}>
                            {searchQuery ? t('noMatches') : t('noTeachersInCategory')}
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {staffData.map((staff) => (
                            <Grid item size={{xs: 12, lg: 6}} key={staff.id}>
                                <StaffCard staff={staff} locale={locale} t={t} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
    Box, Typography, Container, CircularProgress, Grid, Paper, Stack,
    TextField, InputAdornment, Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LaunchIcon from '@mui/icons-material/Launch';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';
import RichText from "@/components/shared/RichText.tsx";

export default function StudentsPage() {
    const { locale } = useTranslation("students");

    // Статичні дані (Hero та зовнішні ресурси)
    const [staticData, setStaticData] = useState({ section: null, externalLinks: [] });

    // Динамічні статті з пошуком
    const [articles, setArticles] = useState([]);
    const [totalArticles, setTotalArticles] = useState(0);

    const [isLoadingStatic, setIsLoadingStatic] = useState(true);
    const [isLoadingArticles, setIsLoadingArticles] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;

    const isEn = locale === 'en';
    const l = (uk, en) => (isEn ? en || uk : uk);

    // 1. Завантаження статичних елементів (Hero, Посилання)
    useEffect(() => {
        const loadStatic = async () => {
            try {
                const [secRes, linkRes] = await Promise.all([
                    fetch('/admin/api/admin/pageSection?type=STUDENTS_INFO'),
                    fetch('/admin/api/admin/externalLink?pageKey=STUDENTS')
                ]);
                const sJson = await secRes.json();
                const lJson = await linkRes.json();

                setStaticData({
                    section: sJson.data?.[0] || null,
                    externalLinks: lJson.data || []
                });
            } catch (err) {
                console.error("Static fetch error:", err);
            } finally {
                setIsLoadingStatic(false);
            }
        };
        loadStatic();
    }, []);

    // 2. Функція серверного завантаження статей
    const fetchArticles = useCallback(async (search, currentPage) => {
        setIsLoadingArticles(true);
        try {
            const params = new URLSearchParams({
                type: 'FOR_STUDENTS',
                limit: itemsPerPage.toString(),
                page: currentPage.toString(),
                search: search || ''
            });

            const res = await fetch(`/admin/api/admin/content?${params}`);
            const json = await res.json();

            setArticles(json.data || []);
            setTotalArticles(json.meta?.total || 0);
        } catch (err) {
            console.error("Articles fetch error:", err);
        } finally {
            setIsLoadingArticles(false);
        }
    }, []);

    // 3. Дебаунс для пошуку (400мс)
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchArticles(searchQuery, page);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery, page, fetchArticles]);

    if (isLoadingStatic) return <Box sx={{ py: 20, textAlign: 'center' }}><CircularProgress /></Box>;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 10 }}>
            {/* HERO */}
            <Box sx={{
                position: 'relative', py: { xs: 10, md: 15 },
                background: 'linear-gradient(135deg, #0c1865 0%, #182BA1 100%)',
                color: '#fff', overflow: 'hidden', clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0% 100%)'
            }}>
                <Container maxWidth="lg">
                    <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 64 }, fontWeight: 900, fontFamily: "'Montserrat Alternates', sans-serif", mb: 2, textTransform: 'uppercase' }}>
                        {l(staticData.section?.titleUk, staticData.section?.titleEn) || "STUDENTS"}
                    </Typography>
                    <Typography sx={{ maxWidth: '700px', fontSize: '1.2rem', opacity: 0.9, fontWeight: 500 }}>
                        {l(staticData.section?.contentUk, staticData.section?.contentEn)}
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 10 }}>
                {/* Зовнішні ресурси */}
                <Grid container spacing={2} sx={{ mb: 8 }}>
                    {staticData.externalLinks.map((link) => (
                        <Grid key={link.id} item xs={12} sm={6} md={4}>
                            <Paper component="a" href={link.url} target="_blank" sx={{
                                p: 3, borderRadius: 5, display: 'flex', alignItems: 'center', gap: 2,
                                textDecoration: 'none', border: '1px solid #e2e8f0', transition: '0.3s',
                                '&:hover': { bgcolor: '#182BA1', '& *': { color: '#fff' }, transform: 'translateY(-3px)' }
                            }}>
                                <LaunchIcon sx={{ color: '#f97316' }} />
                                <Typography sx={{ fontWeight: 700, color: '#0c1865' }}>{l(link.titleUk, link.titleEn)}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Пошук та заголовок */}
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#0c1865', fontFamily: "'Montserrat Alternates', sans-serif" }}>
                        {l(staticData.section?.subTitleUk, staticData.section?.subTitleEn) || "Information"}
                    </Typography>
                    <TextField
                        size="small"
                        placeholder={isEn ? "Search info..." : "Пошук інформації..."}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#182BA1' }} /></InputAdornment> }}
                        sx={{
                            width: { xs: '100%', md: 350 },
                            bgcolor: '#fff',
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}
                    />
                </Stack>

                {isLoadingArticles ? (
                    <Box sx={{ py: 10, textAlign: 'center' }}><CircularProgress /></Box>
                ) : (
                    <>
                        <Grid container spacing={3}>
                            {articles.map((item) => (
                                <Grid key={item.id} item xs={12} md={6}>
                                    <Paper sx={{ p: 4, height: '100%', borderRadius: 6, border: '1px solid #e2e8f0', boxShadow: 'none', transition: '0.4s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 30px rgba(0,0,0,0.08)' } }}>
                                        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                                            <MenuBookIcon sx={{ color: '#182BA1' }} />
                                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0c1865' }}>{l(item.titleUk, item.titleEn)}</Typography>
                                        </Box>
                                        <RichText sx={{ whiteSpace: 'pre-wrap', color: '#475569', mb: 3, lineHeight: 1.7 }} html={l(item.textUk, item.textEn)}/>
                                        {item.photoGallery?.length > 0 && (
                                            <Box sx={{ mt: 'auto', pt: 2 }}>
                                                <Grid container spacing={1}>
                                                    {item.photoGallery.slice(0, 2).map((img, i) => (
                                                        <Grid key={i} item xs={6}>
                                                            <Box sx={{ position: 'relative', height: 140, borderRadius: 3, overflow: 'hidden' }}>
                                                                <Image src={img} alt="" fill style={{ objectFit: 'cover' }} />
                                                            </Box>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>
                                        )}
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                        {articles.length === 0 && (
                            <Typography sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
                                {isEn ? "No information found" : "Інформацію не знайдено"}
                            </Typography>
                        )}

                        {totalArticles > itemsPerPage && (
                            <Stack alignItems="center" sx={{ mt: 6 }}>
                                <Pagination
                                    count={Math.ceil(totalArticles / itemsPerPage)}
                                    page={page}
                                    onChange={(_, v) => {
                                        setPage(v);
                                        window.scrollTo({ top: 500, behavior: 'smooth' });
                                    }}
                                    color="primary"
                                />
                            </Stack>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
}
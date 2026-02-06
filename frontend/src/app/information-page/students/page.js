'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
    Box, Typography, Container, CircularProgress, Grid, Paper, Stack,
    TextField, InputAdornment, Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LaunchIcon from '@mui/icons-material/Launch';
import firebird from '@/assets/photos/firebird/firebird2.png';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';

const ITEMS_PER_PAGE = 6;

export default function StudentsPage() {
    const { locale } = useTranslation("students");
    const [data, setData] = useState({ section: null, articles: [], externalLinks: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    const isEn = locale === 'en';
    const l = (uk, en) => (isEn ? en || uk : uk);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const [secRes, artRes, linkRes] = await Promise.all([
                    fetch('/admin/api/admin/pageSection?type=STUDENTS_INFO'),
                    fetch('/admin/api/admin/content?type=FOR_STUDENTS'),
                    fetch('/admin/api/admin/externalLink?pageKey=STUDENTS')
                ]);
                const [sJson, aJson, lJson] = await Promise.all([secRes.json(), artRes.json(), linkRes.json()]);
                setData({
                    section: sJson.data?.[0] || null,
                    articles: aJson.data || [],
                    externalLinks: lJson.data || []
                });
            } catch (err) { console.error("Fetch error:", err); }
            finally { setIsLoading(false); }
        };
        loadData();
    }, [locale]);

    const filteredArticles = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return data.articles.filter(item =>
            l(item.titleUk, item.titleEn)?.toLowerCase().includes(query) ||
            l(item.textUk, item.textEn)?.toLowerCase().includes(query)
        );
    }, [data.articles, searchQuery, locale]);

    const count = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
    const paginatedArticles = filteredArticles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    if (isLoading) return <Box sx={{ py: 20, textAlign: 'center' }}><CircularProgress /></Box>;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 10 }}>
            {/* HERO - Повністю з БД */}
            <Box sx={{
                position: 'relative', py: { xs: 10, md: 15 },
                background: 'linear-gradient(135deg, #0c1865 0%, #182BA1 100%)',
                color: '#fff', overflow: 'hidden', clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0% 100%)'
            }}>
                <Container maxWidth="lg">
                    <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 64 }, fontWeight: 900, fontFamily: "'Montserrat Alternates', sans-serif", mb: 2, textTransform: 'uppercase' }}>
                        {l(data.section?.titleUk, data.section?.titleEn) || "STUDENTS"}
                    </Typography>
                    <Typography sx={{ maxWidth: '700px', fontSize: '1.2rem', opacity: 0.9, fontWeight: 500 }}>
                        {l(data.section?.contentUk, data.section?.contentEn)}
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 10 }}>
                {/* Зовнішні ресурси з БД */}
                <Grid container spacing={2} sx={{ mb: 8 }}>
                    {data.externalLinks.map((link) => (
                        <Grid key={link.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Paper component="a" href={link.url} target="_blank" sx={{
                                p: 3, borderRadius: 5, display: 'flex', alignItems: 'center', gap: 2,
                                textDecoration: 'none', border: '1px solid #e2e8f0', transition: '0.3s',
                                '&:hover': { bgcolor: '#182BA1', '& *': { color: '#fff' } }
                            }}>
                                <LaunchIcon sx={{ color: '#f97316' }} />
                                <Typography sx={{ fontWeight: 700, color: '#0c1865' }}>{l(link.titleUk, link.titleEn)}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Пошук та заголовок секції */}
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#0c1865', fontFamily: "'Montserrat Alternates', sans-serif" }}>
                        {l(data.section?.subTitleUk, data.section?.subTitleEn) || "Information"}
                    </Typography>
                    <TextField
                        size="small"
                        placeholder="..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#182BA1' }} /></InputAdornment> }}
                        sx={{ width: { xs: '100%', md: 350 }, bgcolor: '#fff', borderRadius: 2 }}
                    />
                </Stack>

                <Grid container spacing={3}>
                    {paginatedArticles.map((item) => (
                        <Grid key={item.id} size={{ xs: 12, md: 6 }}>
                            <Paper sx={{ p: 4, height: '100%', borderRadius: 6, border: '1px solid #e2e8f0', boxShadow: 'none', transition: '0.4s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 30px rgba(0,0,0,0.08)' } }}>
                                <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                                    <MenuBookIcon sx={{ color: '#182BA1' }} />
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0c1865' }}>{l(item.titleUk, item.titleEn)}</Typography>
                                </Box>
                                <Typography sx={{ whiteSpace: 'pre-wrap', color: '#475569', mb: 3, lineHeight: 1.7 }}>
                                    {l(item.textUk, item.textEn)}
                                </Typography>
                                {item.photoGallery?.length > 0 && (
                                    <Box sx={{ mt: 'auto', pt: 2 }}>
                                        <Grid container spacing={1}>
                                            {item.photoGallery.slice(0, 2).map((img, i) => (
                                                <Grid key={i} size={{ xs: 6 }}>
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

                {count > 1 && (
                    <Stack alignItems="center" sx={{ mt: 6 }}>
                        <Pagination count={count} page={page} onChange={(_, v) => setPage(v)} color="primary" />
                    </Stack>
                )}
            </Container>
        </Box>
    );
}
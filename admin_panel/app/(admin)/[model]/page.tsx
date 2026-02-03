'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
    Box, Typography, Paper, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Pagination, TextField, IconButton, Stack, Chip, CircularProgress
} from '@mui/material';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
import { ADMIN_MODELS } from '@/lib/admin-config';

export default function ListPage() {
    // 1. Отримуємо параметри. Важливо: використовуємо params?.model
    const params = useParams();
    const model = params?.model as string;

    const router = useRouter();
    const searchParams = useSearchParams();

    const filterType = searchParams.get('type');
    const filterCategory = searchParams.get('category');
    const filterPageKey = searchParams.get('pageKey');

    const config = ADMIN_MODELS[model as keyof typeof ADMIN_MODELS];

    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    // 2. Стабільна функція завантаження
    const load = useCallback(async () => {
        if (!model) return;
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                search,
                ...(filterType && { type: filterType }),
                ...(filterCategory && { category: filterCategory }),
                ...(filterPageKey && { pageKey: filterPageKey }),
            });


            const res = await fetch(`/api/admin/${model}?${query}`);
            const { data, meta } = await res.json();
            setItems(data || []);
            setTotalPages(meta?.totalPages || 1);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [model, page, search, filterType, filterCategory, filterPageKey]);

    useEffect(() => {
        load();
    }, [load]);

    // 3. Абсолютний шлях для видалення
    const remove = async (id: number | string) => {
        if (confirm('Видалити запис?')) {
            await fetch(`/api/admin/${model}/${id}`, { method: 'DELETE' });
            load();
        }
    };

    // 4. Виправлений перехід на створення (Абсолютний шлях)
    const handleCreate = () => {
        const query = new URLSearchParams();
        if (filterType) query.set('type', filterType);
        if (filterCategory) query.set('category', filterCategory);
        if (filterPageKey) query.set('pageKey', filterPageKey);
        const pathname = `/${encodeURIComponent(model)}/new?${query.toString()}`;
        router.push(pathname);
    };

    if (!model) return <Box p={4}><CircularProgress /></Box>;

    const pageTitle = filterType
        ? `${config?.label || model} (${filterType})`
        : filterCategory
            ? `${config?.label || model} (${filterCategory})`
            : config?.label || model;

    return (
        <Box p={4}>
            <Stack direction="row" justifyContent="space-between" mb={3} alignItems="center">
                <Box>
                    <Typography variant="h4" fontWeight={800}>{pageTitle}</Typography>
                    {(filterType || filterCategory || filterPageKey) && (
                        <Typography variant="body2" color="text.secondary">Фільтр активний</Typography>
                    )}
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={handleCreate} sx={{ bgcolor: '#182BA1' }}>
                    Створити
                </Button>
            </Stack>

            <Paper sx={{ p: 2, mb: 2 }}>
                <TextField
                    fullWidth size="small" placeholder="Пошук..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'gray' }} /> }}
                />
            </Paper>

            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            {config?.tableFields?.map(f => (
                                <TableCell key={f} sx={{ fontWeight: 700, color: '#475569' }}>{f}</TableCell>
                            ))}
                            <TableCell align="right">Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={10} align="center" sx={{ py: 4 }}><CircularProgress size={24} /></TableCell></TableRow>
                        ) : items.length > 0 ? items.map((item: any) => (
                            <TableRow key={item.id} hover>
                                {config?.tableFields?.map(f => (
                                    <TableCell key={f}>
                                        {['type', 'category', 'pageKey'].includes(f) ? (
                                            <Chip label={item[f]} size="small" color="primary" variant="outlined" />
                                        ) : (
                                            String(item[f] || '')
                                        )}
                                    </TableCell>
                                ))}
                                <TableCell align="right">
                                    {/* ВИПРАВЛЕНО: Додано /admin/ перед ${model} */}
                                    <IconButton
                                        onClick={() => router.push(`/${encodeURIComponent(model)}/${item.id}`)}
                                        color="primary"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => remove(item.id)} color="error"><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={10} align="center" sx={{ py: 4, color: 'gray' }}>
                                    Записів не знайдено
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {totalPages > 1 && (
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, v) => setPage(v)}
                    sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
                />
            )}
        </Box>
    );
}
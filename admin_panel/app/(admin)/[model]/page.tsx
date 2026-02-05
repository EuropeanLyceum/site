'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
    Box, Typography, Paper, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Pagination, TextField,
    IconButton, Stack, Chip, CircularProgress, Tooltip, AvatarGroup, Avatar,
} from '@mui/material';
import { Edit, Delete, Add, Search, FilterListOff } from '@mui/icons-material';
import { ADMIN_MODELS, FIELD_LABELS } from '@/lib/admin-config';

export default function ListPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    // -- Конфігурація моделі --
    const model = params?.model as string;
    const config = ADMIN_MODELS[model as keyof typeof ADMIN_MODELS];

    // -- Стан --
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    // Пошук: inputValue для миттєвого відображення в інпуті,
    // debouncedSearch для запитів до API
    const [inputValue, setInputValue] = useState(searchParams.get('search') || '');
    const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');

    // Параметри пагінації та фільтрів з URL
    const page = Number(searchParams.get('page')) || 1;
    const activeFilters = useMemo(() => {
        const filters: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            if (!['page', 'search'].includes(key)) filters[key] = value;
        });
        return filters;
    }, [searchParams]);

    // -- Логіка: Дебаунс пошуку --
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(inputValue);
            updateQueryParams({ search: inputValue, page: '1' });
        }, 500);
        return () => clearTimeout(timer);
    }, [inputValue]);

    // -- Логіка: Оновлення URL --
    const updateQueryParams = (newParams: Record<string, string | null>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === '') current.delete(key);
            else current.set(key, value);
        });

        router.replace(`?${current.toString()}`, { scroll: false });
    };

    // -- Логіка: Завантаження даних --
    const loadData = useCallback(async () => {
        if (!model) return;
        setLoading(true);

        try {
            const query = new URLSearchParams({
                page: page.toString(),
                search: debouncedSearch,
                ...activeFilters,
            });

            const res = await fetch(`/api/admin/${model}?${query.toString()}`);
            const { data, meta } = await res.json();

            setItems(data || []);
            setTotalPages(meta?.totalPages || 1);
        } catch (e) {
            console.error('Fetch error:', e);
        } finally {
            setLoading(false);
        }
    }, [model, page, debouncedSearch, activeFilters]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // -- Обробники подій --
    const handleRemove = async (id: number | string) => {
        if (!confirm('Видалити цей запис назавжди?')) return;
        const res = await fetch(`/api/admin/${model}/${id}`, { method: 'DELETE' });
        if (res.ok) loadData();
    };

    // -- Рендеринг комірок --
    const renderCell = (item: any, field: string) => {
        const value = item[field];

        if (Array.isArray(value)) {
            if (field.toLowerCase().includes('photo') || field.toLowerCase().includes('gallery')) {
                return (
                    <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                        {value.map((url, idx) => (
                            <Avatar key={idx} src={url} variant="rounded" />
                        ))}
                    </AvatarGroup>
                );
            }
            return <Chip label={value.length} size="small" variant="outlined" />;
        }

        if (['type', 'category', 'pageKey'].includes(field)) {
            return (
                <Chip
                    label={value}
                    size="small"
                    color="primary"
                    variant="soft"
                    sx={{ fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase' }}
                />
            );
        }

        if (typeof value === 'boolean') {
            return (
                <Chip
                    label={value ? "Так" : "Ні"}
                    color={value ? "success" : "default"}
                    size="small"
                    variant={value ? "filled" : "outlined"}
                />
            );
        }

        if (field.endsWith('At') || field.includes('Date')) {
            return value ? new Date(value).toLocaleDateString('uk-UA') : '-';
        }

        const text = String(value ?? '');
        return text.length > 50 ? `${text.substring(0, 50)}...` : text;
    };

    if (!model || !config) return <Box p={6} textAlign="center"><CircularProgress /></Box>;

    return (
        <Box p={4} sx={{ maxWidth: 1400, mx: 'auto' }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={900} color="#0c1865">
                        {config.label || model}
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                        {Object.entries(activeFilters).map(([k, v]) => (
                            <Chip
                                key={k}
                                label={`${FIELD_LABELS[k] || k}: ${v}`}
                                size="small"
                                onDelete={() => updateQueryParams({ [k]: null })}
                            />
                        ))}
                    </Stack>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => router.push(`/${model}/new?${new URLSearchParams(activeFilters)}`)}
                    sx={{ bgcolor: '#182BA1', borderRadius: 2, px: 3 }}
                >
                    Створити
                </Button>
            </Stack>

            {/* Search */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Швидкий пошук..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
                />
            </Paper>

            {/* Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                        <TableRow>
                            {config.tableFields?.map((f) => (
                                <TableCell key={f} sx={{ fontWeight: 800, color: '#475569' }}>
                                    {FIELD_LABELS[f] || f}
                                </TableCell>
                            ))}
                            <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={10} align="center" sx={{ py: 8 }}><CircularProgress /></TableCell>
                            </TableRow>
                        ) : items.length > 0 ? (
                            items.map((item) => (
                                <TableRow key={item.id} hover>
                                    {config.tableFields?.map((f) => (
                                        <TableCell key={f}>{renderCell(item, f)}</TableCell>
                                    ))}
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <IconButton
                                                size="small"
                                                onClick={() => router.push(`/${model}/${item.id}`)}
                                                sx={{ color: '#182BA1', bgcolor: '#f0f2ff' }}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemove(item.id)}
                                                sx={{ color: '#ef4444', bgcolor: '#fff1f1' }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={10} align="center" sx={{ py: 8 }}>
                                    <FilterListOff sx={{ fontSize: 40, color: '#CBD5E1', mb: 1 }} />
                                    <Typography color="text.secondary">Нічого не знайдено</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <Stack alignItems="center" mt={4}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, v) => updateQueryParams({ page: v.toString() })}
                        color="primary"
                    />
                </Stack>
            )}
        </Box>
    );
}
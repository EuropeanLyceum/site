'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
    Box, Paper, TextField, Button, Typography, Stack, MenuItem,
    CircularProgress, IconButton, FormControlLabel, Switch
} from '@mui/material';
import { Save, ArrowBack, AutoFixHigh } from '@mui/icons-material';
import { ADMIN_MODELS, FIELD_LABELS } from '@/lib/admin-config';
import FileUploader from '@/components/FileUploader';

export default function EditPage() {
    const params = useParams();
    const model = params?.model as string;
    const id = params?.id as string;

    const searchParams = useSearchParams();
    const router = useRouter();
    const config = ADMIN_MODELS[model as keyof typeof ADMIN_MODELS];

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            if (id === 'new') {
                setData({
                    isPublished: true,
                    order: 0,
                    type: searchParams.get('type') || '',
                    category: searchParams.get('category') || '',
                    pageKey: searchParams.get('pageKey') || '',
                });
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/admin/${model}/${id}`);
                if (res.ok) {
                    setData(await res.json());
                } else {
                    setError('Запис не знайдено');
                }
            } catch (e) {
                setError('Помилка завантаження');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, model, searchParams]);

    const handleSlugGen = () => {
        const source = data.titleUk || data.fullNameUk || data.nameUk;
        if (source) {
            const slug = source.toString().toLowerCase()
                .replace(/[^a-zа-яіїєґ0-9]+/gi, '-')
                .replace(/^-+|-+$/g, '');
            setData({ ...data, slug });
        }
    };

    const save = async () => {
        const isNew = id === 'new';
        const method = isNew ? 'POST' : 'PATCH';
        const url = isNew ? `/api/admin/${model}` : `/api/admin/${model}/${id}`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push(`/${encodeURIComponent(model)}`);
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Помилка: ${err.error || 'Щось пішло не так'}`);
            }
        } catch (e) {
            alert('Помилка мережі');
        }
    };

    if (loading) return <Box p={10} textAlign="center"><CircularProgress /></Box>;
    if (error) return <Box p={10} textAlign="center"><Typography color="error">{error}</Typography></Box>;

    // Жорстко фільтруємо ID та системні дати, щоб вони не потрапили в цикл редагування
    const fieldsToShow = (config?.allFields || Object.keys(data))
        .filter(k => !['id', 'createdAt', 'updatedAt'].includes(k));

    return (
        <Box p={4} maxWidth={900} mx="auto">
            <Stack direction="row" justifyContent="space-between" mb={3}>
                <Button startIcon={<ArrowBack />} onClick={() => router.back()}>Назад</Button>
                <Button variant="contained" startIcon={<Save />} onClick={save} sx={{ bgcolor: '#182BA1' }}>
                    Зберегти
                </Button>
            </Stack>

            <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight={800} mb={4} color="primary">
                    {id === 'new' ? 'Новий запис' : 'Редагування'}: {config?.label || model}
                </Typography>

                <Stack spacing={3}>
                    {/* ID завжди заблокований для зміни */}
                    {!['new'].includes(id) && (
                        <TextField label="ID / Системний ключ" value={data.id} disabled fullWidth variant="filled" />
                    )}

                    {fieldsToShow.map(key => {
                        const label = FIELD_LABELS[key] || key;
                        const val = data[key];

                        if (key === 'slug') return (
                            <Stack direction="row" spacing={1} key={key}>
                                <TextField fullWidth label={label} value={val || ''} onChange={e => setData({...data, slug: e.target.value})} />
                                <IconButton onClick={handleSlugGen} color="primary"><AutoFixHigh /></IconButton>
                            </Stack>
                        );

                        if (typeof val === 'boolean' || key.startsWith('is')) return (
                            <FormControlLabel key={key} control={<Switch checked={!!data[key]} onChange={e => setData({...data, [key]: e.target.checked})}/>} label={label} />
                        );

                        if (config?.enums?.[key as keyof typeof config.enums]) return (
                            <TextField key={key} select fullWidth label={label} value={val || ''} onChange={e => setData({...data, [key]: e.target.value})}>
                                {config.enums[key as keyof typeof config.enums].map((opt: string) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                            </TextField>
                        );

                        if (['attributes', 'socialLinks', 'question'].includes(key)) return (
                            <TextField key={key} fullWidth multiline rows={4} label={`${label} (JSON)`}
                                       value={typeof val === 'object' ? JSON.stringify(val, null, 2) : val}
                                       onChange={e => { try { setData({...data, [key]: JSON.parse(e.target.value)}); } catch(e) {} }}
                                       helperText="Тільки валідний JSON"
                            />
                        );

                        if (key.toLowerCase().includes('photo') || key.toLowerCase().includes('url') || key === 'logoUrl') return (
                            <Box key={key} p={2} sx={{ border: '1px dashed #ccc', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>{label}</Typography>
                                <Stack direction="row" spacing={2}>
                                    <TextField size="small" fullWidth value={val || ''} onChange={e => setData({...data, [key]: e.target.value})} />
                                    <FileUploader onUpload={(file: any) => setData({...data, [key]: file.url})} />
                                </Stack>
                            </Box>
                        );

                        return (
                            <TextField
                                key={key}
                                fullWidth
                                label={label}
                                multiline={['descriptionUk', 'descriptionEn', 'bodyUk', 'bodyEn', 'contentUk', 'quoteUk', 'quoteEn'].includes(key)}
                                rows={['bodyUk', 'bodyEn', 'contentUk'].includes(key) ? 6 : 1}
                                value={val ?? ''}
                                onChange={e => setData({...data, [key]: e.target.value})}
                            />
                        );
                    })}
                </Stack>
            </Paper>
        </Box>
    );
}
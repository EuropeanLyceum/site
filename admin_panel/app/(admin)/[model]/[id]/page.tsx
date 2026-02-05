'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
    Box, Paper, TextField, Button, Typography, Stack, MenuItem,
    CircularProgress, IconButton, FormControlLabel, Switch, Grid,
    Card, CardMedia, Tooltip, Divider, Chip, Link, CardContent, CardActions, CardHeader,
} from '@mui/material';
import { Save, ArrowBack, CloudUpload, Delete, AutoFixHigh, Link as LinkIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { ADMIN_MODELS, FIELD_LABELS } from '@/lib/admin-config';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function EditPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const model = params?.model as string;
    const id = params?.id as string;
    const config = ADMIN_MODELS[model as keyof typeof ADMIN_MODELS];

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (id === 'new') {
                const initialData: any = {};
                // Pre-fill from URL (e.g. ?type=NEWS)
                searchParams.forEach((val, key) => { initialData[key] = val; });

                // Initialize arrays for specific models
                if (model === 'content') initialData.photoGallery = [];
                if (model === 'location') initialData.imagePhotos = [];

                setData(initialData);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/admin/${model}/${id}`);
                if (!res.ok) throw new Error();
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error("Load error", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, model, searchParams]);

    // --- Logic: File Upload ---
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append('files', file));

        try {
            // Point this to your actual upload route (e.g., S3 or local storage)
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const { urls } = await res.json();

            if (Array.isArray(data[key])) {
                setData((prev: any) => ({ ...prev, [key]: [...(prev[key] || []), ...urls] }));
            } else {
                setData((prev: any) => ({ ...prev, [key]: urls[0] }));
            }
        } catch (error) {
            alert('Помилка завантаження файлів');
        } finally {
            setUploading(false);
        }
    };

    // --- Logic: Slug Generation ---
    const generateSlug = () => {
        const source = data.titleUk || data.nameUk || data.fullNameUk || '';
        const slug = source
            .toLowerCase()
            .trim()
            .replace(/[^\w\sа-яіїєґ-]/gi, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        setData({ ...data, slug });
    };

    const handleSave = async () => {
        const isNew = id === 'new';
        const url = isNew ? `/api/admin/${model}` : `/api/admin/${model}/${id}`;

        const res = await fetch(url, {
            method: isNew ? 'POST' : 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            router.push(`/${model}`);
            router.refresh();
        }
    };

    if (loading) return <Box p={8} textAlign="center"><CircularProgress /></Box>;

    const fields = config?.allFields || Object.keys(data || {}).filter(k =>
        !['id', 'createdAt', 'updatedAt', 'attributes'].includes(k)
    );

    return (
        <Box p={4} maxWidth={1100} mx="auto">
            {/* Action Bar */}
            <Stack direction="row" justifyContent="space-between" mb={4} alignItems="center">
                <Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ color: 'text.secondary' }}>
                    Назад
                </Button>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                        onClick={handleSave}
                        disabled={uploading}
                        sx={{ bgcolor: '#182BA1', px: 4, py: 1, borderRadius: 2 }}
                    >
                        Зберегти зміни
                    </Button>
                </Stack>
            </Stack>

            <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
                <Typography variant="h4" fontWeight={900} mb={1} color="#0c1865">
                    {id === 'new' ? 'Новий запис' : 'Редагування'}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={4}>
                    Модель: <Chip label={model} size="small" variant="outlined" sx={{ ml: 1 }} />
                </Typography>

                <Grid container spacing={4}>
                    {fields.map((key) => {
                        const label = FIELD_LABELS[key] || key;
                        const value = data[key];

                        // 1. Slugs with Auto-generator
                        if (key === 'slug') {
                            return (
                                <Grid size={12} key={key}>
                                    <Stack direction="row" spacing={1} alignItems="flex-start">
                                        <TextField
                                            fullWidth
                                            label={label}
                                            value={value || ''}
                                            onChange={e => setData({ ...data, slug: e.target.value })}
                                            InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1, color: 'action.active' }} /> }}
                                            helperText="URL-адреса сторінки (генерується автоматично з назви)"
                                        />
                                        <Tooltip title="Згенерувати">
                                            <IconButton onClick={generateSlug} sx={{ mt: 1, bgcolor: '#f0f2ff' }}>
                                                <AutoFixHigh color="primary" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Grid>
                            );
                        }

                        // 2. Media Uploads
                        if (key.toLowerCase().includes('photo') || key.toLowerCase().includes('gallery')) {
                            const isArray = Array.isArray(value);
                            return (
                                <Grid size={12} key={key}>
                                    <Typography variant="subtitle2" fontWeight={700} mb={1.5}>{label}</Typography>
                                    <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                                        {isArray ? value.map((url: string, idx: number) => (
                                            <Box key={idx} sx={{ position: 'relative', flexShrink: 0 }}>
                                                <CardMedia component="img" image={url} sx={{ width: 140, height: 140, borderRadius: 3, objectFit: 'cover', border: '1px solid #eee' }} />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        const updated = [...data[key]];
                                                        updated.splice(idx, 1);
                                                        setData({ ...data, [key]: updated });
                                                    }}
                                                    sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: '#ff4d4d', color: 'white' } }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        )) : value && (
                                            <Box sx={{ position: 'relative' }}>
                                                <CardMedia component="img" image={value} sx={{ width: 200, height: 140, borderRadius: 3, objectFit: 'cover', border: '1px solid #eee' }} />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setData({ ...data, [key]: null })}
                                                    sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: '#ff4d4d', color: 'white' } }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        )}
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            sx={{ width: 140, height: 140, borderRadius: 3, borderStyle: 'dashed', flexDirection: 'column', gap: 1, color: 'text.secondary' }}
                                        >
                                            <CloudUpload />
                                            <Typography variant="caption" fontWeight={600}>Додати</Typography>
                                            <VisuallyHiddenInput type="file" onChange={(e) => handleUpload(e, key)} multiple={isArray} accept="image/*" />
                                        </Button>
                                    </Stack>
                                </Grid>
                            );
                        }

                        // 3. Boolean / Switches
                        if (typeof value === 'boolean' || key.startsWith('is')) {
                            return (
                                <Grid size={{ xs: 12, sm: 4 }} key={key}>
                                    <FormControlLabel
                                        control={<Switch checked={!!value} onChange={e => setData({ ...data, [key]: e.target.checked })} />}
                                        label={<Typography variant="body2" fontWeight={600}>{label}</Typography>}
                                        sx={{ bgcolor: '#f8fafc', p: 1, pr: 2, borderRadius: 2, width: '100%', ml: 0 }}
                                    />
                                </Grid>
                            );
                        }

                        // 4. Enums / Selects
                        if (config?.enums?.[key]) {
                            return (
                                <Grid size={{ xs: 12, sm: 6 }} key={key}>
                                    <TextField select fullWidth label={label} value={value || ''} onChange={e => setData({ ...data, [key]: e.target.value })}>
                                        {config.enums[key].map((opt: string) => (
                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            );
                        }

                        // 5. Text / Content
                        return (
                            <Grid size={12} key={key}>
                                <TextField
                                    fullWidth
                                    label={label}
                                    value={value || ''}
                                    multiline={key.includes('text') || key.includes('content') || key.includes('description') || key.includes('quote')}
                                    rows={key.includes('text') || key.includes('description') ? 6 : 1}
                                    onChange={e => setData({ ...data, [key]: e.target.value })}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            </Paper>
        </Box>
    );
}
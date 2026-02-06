'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
    Box, Paper, TextField, Button, Typography, Stack, MenuItem,
    CircularProgress, IconButton, FormControlLabel, Switch,
    CardMedia, Tooltip, Chip, Divider, Autocomplete
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    Save, ArrowBack, CloudUpload, Delete, AutoFixHigh,
    Link as LinkIcon, FilePresent, Close, Add
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { ADMIN_MODELS, FIELD_LABELS } from '@/lib/admin-config';

// --- CONFIG: PREDEFINED ICONS ---
const ICON_OPTIONS = [
    "MeetingRoom", "Class", "Science", "Biotech", "Computer",
    "LaptopMac", "LibraryBooks", "MenuBook", "SportsBasketball",
    "Pool", "Restaurant", "LocalCafe", "Wc", "LocalHospital",
    "TheaterComedy", "School", "BusinessCenter", "SupervisorAccount",
    "Park", "Apartment", "Stairs", "Elevator", "InfoOutlined", "Map"
];

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

    const [options, setOptions] = useState<Record<string, any[]>>({});
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [fileUploading, setFileUploading] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (id === 'new') {
                const initialData: any = {};
                searchParams.forEach((val, key) => { initialData[key] = val; });
                if (model === 'content') initialData.photoGallery = [];
                if (model === 'location') initialData.imagePhotos = [];
                if (model === 'documentreport') initialData.documents = [];
                // Default icon
                if (model === 'location') initialData.iconName = "MeetingRoom";

                setData(initialData);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/admin/api/admin/${model}/${id}`);
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

    useEffect(() => {
        const fetchOptions = async () => {
            if (loading || !data || !config?.relations) return;

            const newOptions: Record<string, any[]> = {};

            for (const [field, rel] of Object.entries(config.relations)) {
                const targetModel = (rel as any).model;
                let url = `/admin/api/admin/options/${targetModel}`;

                const query = new URLSearchParams();
                if (data.category) query.append('category', data.category);
                if (model.toLowerCase() === 'disciplinesubitem' && field === 'disciplineId') {
                    query.append('hasSubItems', 'true');
                }

                const finalUrl = query.toString() ? `${url}?${query.toString()}` : url;

                try {
                    const res = await fetch(finalUrl);
                    if (res.ok) {
                        newOptions[field] = await res.json();
                    }
                } catch (err) {
                    console.error("Error fetching options", err);
                }
            }
            setOptions(newOptions);
        };

        fetchOptions();
    }, [loading, model, config, data?.category]);

    const [specializations, setSpecializations] = useState<any[]>([]);

    useEffect(() => {
        if (model === 'testQuestion' || model === 'testquestion') {
            (async () => {
                try {
                    const res = await fetch('/admin/api/admin/specialization?limit=1000');
                    if (res.ok) setSpecializations(await res.json().then(r => r.data || r));
                } catch (e) { console.error(e); }
            })();
        }
    }, [model]);

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

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append('files', file));
        try {
            const res = await fetch('/admin/api/upload', { method: 'POST', body: formData });
            const { urls } = await res.json();
            if (Array.isArray(data[key])) {
                setData((prev: any) => ({ ...prev, [key]: [...(prev[key] || []), ...urls] }));
            } else {
                setData((prev: any) => ({ ...prev, [key]: urls[0] }));
            }
        } catch (error) {
            alert('Помилка завантаження зображень');
        } finally {
            setUploading(false);
        }
    };

    const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        if (id === 'new') {
            alert("Спочатку збережіть документ, щоб додати до нього файли");
            return;
        }

        setFileUploading(true);
        const formData = new FormData();
        const fileList = Array.from(files);
        fileList.forEach(file => formData.append('files', file));

        try {
            const res = await fetch('/admin/api/upload', { method: 'POST', body: formData });
            const { urls, files: filesMeta } = await res.json();

            for (let i = 0; i < urls.length; i++) {
                const originalFile = fileList[i];
                const fileName = filesMeta?.[i]?.originalName || originalFile.name;
                const mimeType = filesMeta?.[i]?.mimetype || originalFile.type;
                const size = filesMeta?.[i]?.size || `${(originalFile.size / 1024).toFixed(1)} KB`;

                await fetch('/admin/api/admin/fileasset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nameUk: fileName,
                        nameEn: fileName,
                        url: urls[i],
                        reportId: Number(id),
                        fileType: mimeType,
                        fileSize: String(size)
                    })
                });
            }

            const refresh = await fetch(`/admin/api/admin/${model}/${id}`);
            setData(await refresh.json());
        } catch (error) {
            alert('Помилка при завантаженні документів');
        } finally {
            setFileUploading(false);
        }
    };

    const handleDeleteFile = async (fileId: number) => {
        if (!confirm('Видалити цей файл?')) return;
        try {
            await fetch(`/admin/api/admin/fileasset/${fileId}`, { method: 'DELETE' });
            setData({ ...data, documents: data.documents.filter((f: any) => f.id !== fileId) });
        } catch (e) {
            alert('Помилка видалення');
        }
    };

    const handleSave = async () => {
        const isNew = id === 'new';
        const url = isNew ? `/admin/api/admin/${model}` : `/admin/api/admin/${model}/${id}`;

        // 1. Clone the data to avoid mutating state
        const payload = JSON.parse(JSON.stringify(data));
        const dataType = payload.type;
        const dataCategory = payload.category;

        // 2. CLEANUP: Specific fix for testQuestion options
        if ((model.toLowerCase() === 'testquestion' || model.toLowerCase() === 'testquestion') && payload.options) {
            payload.options = payload.options.map((opt: any) => {
                const cleanedOpt = { ...opt };

                // Convert empty string or 0 to null for the relation field
                if (!cleanedOpt.specializationId || cleanedOpt.specializationId === '') {
                    delete cleanedOpt.specializationId;
                    delete cleanedOpt.specialization; // Remove if exists to avoid Prisma conflicts
                } else {
                    cleanedOpt.specializationId = Number(cleanedOpt.specializationId);
                }

                // Ensure Enums or other fields aren't empty strings if they should be null
                if (cleanedOpt.optionEn === "") cleanedOpt.optionEn = null;

                return cleanedOpt;
            });
        }

        // Existing deletions
        delete payload.documents;
        delete payload.subReports;
        delete payload.id;
        delete payload.createdAt;
        delete payload.updatedAt;

        const res = await fetch(url, {
            method: isNew ? 'POST' : 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            if (isNew) {
                const saved = await res.json();
                router.replace(`/${model}/${saved.id}`);
            } else {
                let query = '';
                if (dataType) query = `?type=${dataType}`;
                else if (dataCategory) query = `?category=${dataCategory}`;
                router.push(`/${model}${query}`);
                router.refresh();
            }
        }
    };

    if (loading) return <Box p={8} textAlign="center"><CircularProgress /></Box>;

    const fields = config?.allFields || Object.keys(data || {}).filter(k =>
        !['id', 'createdAt', 'updatedAt', 'attributes', 'documents', 'subReports'].includes(k)
    );

    return (
        <Box p={4} maxWidth={1100} mx="auto">
            <Stack direction="row" justifyContent="space-between" mb={4} alignItems="center">
                <Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ color: 'text.secondary' }}>
                    Назад
                </Button>
                <Button
                    variant="contained"
                    startIcon={(uploading || fileUploading) ? <CircularProgress size={20} color="inherit" /> : <Save />}
                    onClick={handleSave}
                    disabled={uploading || fileUploading}
                    sx={{ bgcolor: '#182BA1', px: 4, py: 1, borderRadius: 2 }}
                >
                    {id === 'new' ? 'Створити' : 'Зберегти зміни'}
                </Button>
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

                        // 1. SPECIFIC FIELD: ICON NAME (AUTOCOMPLETE)
                        if (key === 'iconName') {
                            return (
                                <Grid size={{xs: 12, sm: 6}} key={key}>
                                    <Autocomplete
                                        options={ICON_OPTIONS}
                                        value={value || "MeetingRoom"}
                                        onChange={(event, newValue) => {
                                            setData({ ...data, [key]: newValue });
                                        }}
                                        freeSolo
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={label}
                                                helperText="Оберіть іконку зі списку або введіть назву"
                                            />
                                        )}
                                    />
                                </Grid>
                            );
                        }

                        // 2. Dates
                        const isDateField = key.endsWith('At') || key.includes('Date') || key === 'publicationDate';
                        if (isDateField) {
                            let dateValue = "";
                            if (value) {
                                const d = new Date(value);
                                if (!isNaN(d.getTime())) {
                                    dateValue = d.toISOString().split('T')[0];
                                }
                            }
                            return (
                                <Grid size={{xs: 12, sm: 6}} key={key}>
                                    <TextField
                                        fullWidth label={label} type="date" value={dateValue}
                                        onChange={e => setData({ ...data, [key]: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            );
                        }

                        // 3. Slug
                        if (key === 'slug') {
                            return (
                                <Grid size={{xs: 12}} key={key}>
                                    <Stack direction="row" spacing={1}>
                                        <TextField fullWidth label={label} value={value || ''} onChange={e => setData({ ...data, slug: e.target.value })}
                                                   InputProps={{ startAdornment: <LinkIcon sx={{ mr: 1, color: 'action.active' }} /> }} />
                                        <Tooltip title="Згенерувати">
                                            <IconButton onClick={generateSlug} sx={{ bgcolor: '#f0f2ff' }}><AutoFixHigh color="primary" /></IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Grid>
                            );
                        }

                        // 4. Photos
                        if (key.toLowerCase().includes('photo') || key.toLowerCase().includes('gallery')) {
                            const isArray = Array.isArray(value);
                            return (
                                <Grid size={{xs: 12}} key={key}>
                                    <Typography variant="subtitle2" fontWeight={700} mb={1.5}>{label}</Typography>
                                    <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                                        {isArray ? value.map((url: string, idx: number) => (
                                            <Box key={idx} sx={{ position: 'relative', flexShrink: 0 }}>
                                                <CardMedia component="img" image={url} sx={{ width: 140, height: 140, borderRadius: 3, objectFit: 'cover' }} />
                                                <IconButton size="small" onClick={() => {
                                                    const updated = [...data[key]]; updated.splice(idx, 1);
                                                    setData({ ...data, [key]: updated });
                                                }} sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'white' }}><Delete fontSize="small" /></IconButton>
                                            </Box>
                                        )) : value && (
                                            <Box sx={{ position: 'relative' }}>
                                                <CardMedia component="img" image={value} sx={{ width: 200, height: 140, borderRadius: 3, objectFit: 'cover' }} />
                                                <IconButton size="small" onClick={() => setData({ ...data, [key]: null })} sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'white' }}><Delete fontSize="small" /></IconButton>
                                            </Box>
                                        )}
                                        <Button component="label" variant="outlined" sx={{ width: 140, height: 140, borderRadius: 3, borderStyle: 'dashed' }}>
                                            <CloudUpload /><VisuallyHiddenInput type="file" onChange={(e) => handleUpload(e, key)} multiple={isArray} accept="image/*" />
                                        </Button>
                                    </Stack>
                                </Grid>
                            );
                        }

                        // 5. Switches
                        if (typeof value === 'boolean' || key.startsWith('is') || key.startsWith('has')) {
                            return (
                                <Grid size={{xs: 12, sm: 4}} key={key}>
                                    <FormControlLabel control={<Switch checked={!!value} onChange={e => setData({ ...data, [key]: e.target.checked })} />} label={label} />
                                </Grid>
                            );
                        }

                        // 6. COLOR PICKER (RESTORED)
                        if (key.toLowerCase().includes('color')) {
                            return (
                                <Grid size={{ xs: 12, sm: 4 }} key={key}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <TextField
                                            fullWidth
                                            label={label}
                                            value={value || '#182BA1'}
                                            onChange={e => setData({ ...data, [key]: e.target.value })}
                                            InputProps={{
                                                startAdornment: (
                                                    <Box sx={{
                                                        width: 24, height: 24, borderRadius: '50%',
                                                        bgcolor: value || '#182BA1', mr: 1,
                                                        border: '1px solid #ddd', flexShrink: 0
                                                    }} />
                                                ),
                                            }}
                                        />
                                        <IconButton component="label" sx={{
                                            bgcolor: '#f0f2ff', width: 56, height: 56, borderRadius: 2,
                                            '&:hover': { bgcolor: '#e0e4ff' }
                                        }}>
                                            <input
                                                type="color"
                                                value={value || '#182BA1'}
                                                onChange={e => setData({ ...data, [key]: e.target.value })}
                                                style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }}
                                            />
                                            <AutoFixHigh color="primary" />
                                        </IconButton>
                                    </Stack>
                                </Grid>
                            );
                        }

                        if (key === 'options' && model.toLowerCase() === 'testquestion') {
                            const opts: any[] = Array.isArray(value) ? value : [];
                            return (
                                <Grid size={{ xs: 12 }} key={key}>
                                    <Typography variant="subtitle2" fontWeight={700} mb={1.5}>{label}</Typography>
                                    <Stack spacing={2}>
                                        {opts.map((opt, idx) => (
                                            <Paper key={idx} sx={{ p: 2, borderRadius: 2 }}>
                                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                                                    <TextField label="Відповідь" value={opt.option || ''} onChange={e => {
                                                        const updated = [...opts]; updated[idx] = { ...updated[idx], option: e.target.value }; setData({ ...data, options: updated });
                                                    }} fullWidth />


                                                    <TextField label="Answer (EN)" value={opt.optionEn || ''} onChange={e => {
                                                        const updated = [...opts]; updated[idx] = { ...updated[idx], optionEn: e.target.value }; setData({ ...data, options: updated });
                                                    }} fullWidth />


                                                    <TextField
                                                        select
                                                        label="Спеціалізація"
                                                        // Спрощуємо логіку отримання ID для відображення
                                                        value={opt.specializationId || ''}
                                                        onChange={e => {
                                                            const val = e.target.value;
                                                            const updated = [...opts];
                                                            // Зберігаємо як число, якщо вибрано щось, або null, якщо порожньо
                                                            updated[idx] = {
                                                                ...updated[idx],
                                                                specializationId: val !== "" ? Number(val) : null
                                                            };
                                                            setData({ ...data, options: updated });
                                                        }}
                                                        sx={{ minWidth: 220 }}
                                                    >
                                                        <MenuItem value=""><em>Не обрано</em></MenuItem>
                                                        {specializations.map(s => (
                                                            <MenuItem key={s.id} value={s.id}>
                                                                {s.nameUk || s.nameEn || `ID: ${s.id}`}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>


                                                    <IconButton onClick={() => { const updated = [...opts]; updated.splice(idx, 1); setData({ ...data, options: updated }); }}><Delete /></IconButton>
                                                </Stack>
                                            </Paper>
                                        ))}


                                        <Button onClick={() => {
                                            // Використовуйте null замість порожнього рядка для ID
                                            const newOpt = { option: '', optionEn: '', specializationId: null };
                                            setData({ ...data, options: [...(data.options || []), newOpt] });
                                        }} startIcon={<Add />}>Додати відповідь</Button>
                                    </Stack>
                                </Grid>
                            );
                        }

                        // 7. Relations
                        if (config?.relations?.[key]) {
                            return (
                                <Grid size={{xs: 12, sm: 4}} key={key}>
                                    <TextField select fullWidth label={label} value={value || ''} onChange={e => setData({ ...data, [key]: e.target.value })}>
                                        <MenuItem value=""><em>Не обрано</em></MenuItem>
                                        {(options[key] || []).map((opt: any) => <MenuItem key={opt.id} value={opt.id}>{opt.name || opt.nameUk || opt.titleUk || opt.fullNameUk || opt.id}</MenuItem>)}
                                    </TextField>
                                </Grid>
                            );
                        }

                        // 8. Enums
                        if (config?.enums?.[key]) {
                            return (
                                <Grid size={{xs: 12, sm: 4}} key={key}>
                                    <TextField select fullWidth label={label} value={value || ''} onChange={e => setData({ ...data, [key]: e.target.value })}>
                                        {config.enums[key].map((opt: string) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                                    </TextField>
                                </Grid>
                            );
                        }

                        // 9. Default Text Fields
                        return (
                            <Grid size={{xs: 12}} key={key}>
                                <TextField
                                    fullWidth
                                    label={label}
                                    value={value || ''}
                                    multiline={key.includes('description') || key.includes('text') || key.includes('highlights')}
                                    rows={key.includes('description') || key.includes('text') || key.includes('highlights') ? 5 : 1}
                                    onChange={e => setData({ ...data, [key]: e.target.value })}
                                />
                            </Grid>
                        );
                    })}
                </Grid>

                {/* --- DOCUMENTS SECTION --- */}
                {model.toLowerCase() === 'documentreport' && (
                    <>
                        <Divider sx={{ my: 6 }} />
                        <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                                <Box>
                                    <Typography variant="h5" fontWeight={800} color="#182BA1">Файли та активи</Typography>
                                    <Typography variant="body2" color="text.secondary">PDF, DOCX та інші документи</Typography>
                                </Box>
                                <Button component="label" variant="outlined" startIcon={fileUploading ? <CircularProgress size={20} /> : <CloudUpload />} disabled={id === 'new' || fileUploading}>
                                    Завантажити файли
                                    <VisuallyHiddenInput type="file" onChange={handleDocumentUpload} multiple />
                                </Button>
                            </Stack>

                            <Grid container spacing={2}>
                                {data?.documents?.map((file: any) => (
                                    <Grid size={{xs: 12, sm: 4}} key={file.id}>
                                        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', borderRadius: 3, position: 'relative' }}>
                                            <FilePresent sx={{ mr: 2, color: '#182BA1', fontSize: 32 }} />
                                            <Box sx={{ overflow: 'hidden', pr: 4 }}>
                                                <Typography variant="subtitle2" noWrap fontWeight={700}>{file.nameUk}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {file.fileType?.split('/')[1]?.toUpperCase() || 'FILE'} • {file.fileSize || '---'}
                                                </Typography>
                                            </Box>
                                            <IconButton size="small" onClick={() => handleDeleteFile(file.id)} sx={{ position: 'absolute', right: 8, top: 8, color: '#ef4444' }}><Close fontSize="small" /></IconButton>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
}
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

import {
    MeetingRoom, Class, Science, Biotech, Computer,
    LaptopMac, LibraryBooks, MenuBook, SportsBasketball,
    Pool, Restaurant, LocalCafe, Wc, LocalHospital,
    TheaterComedy, School, BusinessCenter, SupervisorAccount,
    Park, Apartment, Stairs, Elevator, InfoOutlined, Map,
    HelpOutline
} from '@mui/icons-material';
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

/* ------------------------------------------------------------------ */
/* TYPES – тільки локальні, без втручання в логіку */
/* ------------------------------------------------------------------ */

type GenericRecord = Record<string, unknown>;

type RelationOption = {
    id: number | string;
    name?: string;
    nameUk?: string;
    titleUk?: string;
    fullNameUk?: string;
};

type FileAsset = {
    id: number;
    nameUk: string;
    fileType?: string;
    fileSize?: string;
};

type TestQuestionOption = {
    option: string;
    optionEn?: string | null;
    specializationId?: number | null;
};

type Specialization = {
    id: number;
    nameUk?: string;
    nameEn?: string;
};

/* ------------------------------------------------------------------ */

const ICON_COMPONENTS: Record<string, React.ElementType> = {
    MeetingRoom, Class, Science, Biotech, Computer,
    LaptopMac, LibraryBooks, MenuBook, SportsBasketball,
    Pool, Restaurant, LocalCafe, Wc, LocalHospital,
    TheaterComedy, School, BusinessCenter, SupervisorAccount,
    Park, Apartment, Stairs, Elevator, InfoOutlined, Map
};

const ICON_OPTIONS = Object.keys(ICON_COMPONENTS);

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

    const [options, setOptions] = useState<Record<string, RelationOption[]>>({});
    const [data, setData] = useState<GenericRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [fileUploading, setFileUploading] = useState(false);

    /* -------------------- LOAD DATA -------------------- */

    useEffect(() => {
        const load = async () => {
            if (id === 'new') {
                const initialData: GenericRecord = {};
                searchParams.forEach((val, key) => { initialData[key] = val; });
                if (model === 'content') initialData.photoGallery = [];
                if (model === 'location') initialData.imagePhotos = [];
                if (model === 'documentreport') initialData.documents = [];
                if (model === 'location') initialData.iconName = 'MeetingRoom';

                setData(initialData);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/admin/api/admin/${model}/${id}`);
                if (!res.ok) throw new Error();
                setData(await res.json());
            } catch (err) {
                console.error('Load error', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, model, searchParams]);

    /* -------------------- RELATION OPTIONS -------------------- */

    useEffect(() => {
        const fetchOptions = async () => {
            if (loading || !data || !config?.relations) return;

            const newOptions: Record<string, RelationOption[]> = {};

            for (const [field, rel] of Object.entries(config.relations)) {
                const targetModel = (rel as { model: string }).model;
                let url = `/admin/api/admin/options/${targetModel}`;

                const query = new URLSearchParams();
                if (data.category) query.append('category', String(data.category));
                if (model.toLowerCase() === 'disciplinesubitem' && field === 'disciplineId') {
                    query.append('hasSubItems', 'true');
                }

                const finalUrl = query.toString() ? `${url}?${query}` : url;

                try {
                    const res = await fetch(finalUrl);
                    if (res.ok) newOptions[field] = await res.json();
                } catch (err) {
                    console.error('Error fetching options', err);
                }
            }

            setOptions(newOptions);
        };

        fetchOptions();
    }, [loading, model, config, data?.category]);

    /* -------------------- SPECIALIZATIONS -------------------- */

    const [specializations, setSpecializations] = useState<Specialization[]>([]);

    useEffect(() => {
        if (model === 'testQuestion' || model === 'testquestion') {
            (async () => {
                try {
                    const res = await fetch('/admin/api/admin/specialization?limit=1000');
                    if (res.ok) {
                        const json = await res.json();
                        setSpecializations(json.data || json);
                    }
                } catch (e) {
                    console.error(e);
                }
            })();
        }
    }, [model]);

    /* -------------------- HELPERS -------------------- */

    const generateSlug = () => {
        if (!data) return;
        const source =
            (data.titleUk as string) ||
            (data.nameUk as string) ||
            (data.fullNameUk as string) ||
            '';

        const slug = source
            .toLowerCase()
            .trim()
            .replace(/[^\w\sа-яіїєґ-]/gi, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        setData({ ...data, slug });
    };

    /* -------------------- UPLOADS -------------------- */

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
        if (!data) return;
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append('files', file));

        try {
            const res = await fetch('/admin/api/upload?mode=temp', { method: 'POST', body: formData });
            const { urls } = await res.json();

            if (Array.isArray(data[key])) {
                setData(prev => ({
                    ...prev!,
                    [key]: [...((prev![key] as string[]) || []), ...urls]
                }));
            } else {
                setData(prev => ({ ...prev!, [key]: urls[0] }));
            }
        } catch {
            alert('Помилка завантаження зображень');
        } finally {
            setUploading(false);
        }
    };

    const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!data) return;
        const files = event.target.files;
        if (!files || files.length === 0) return;

        if (id === 'new') {
            alert('Спочатку збережіть документ, щоб додати до нього файли');
            return;
        }

        setFileUploading(true);
        const formData = new FormData();
        const fileList = Array.from(files);
        fileList.forEach(file => formData.append('files', file));

        try {
            const res = await fetch('/admin/api/upload?mode=permanent', { method: 'POST', body: formData });
            const { urls, files: filesMeta } = await res.json();

            for (let i = 0; i < urls.length; i++) {
                const originalFile = fileList[i];
                const meta = filesMeta?.[i];

                await fetch('/admin/api/admin/fileAsset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nameUk: meta?.originalName || originalFile.name,
                        nameEn: meta?.originalName || originalFile.name,
                        url: urls[i],
                        reportId: Number(id),
                        fileType: meta?.mimetype || originalFile.type,
                        fileSize: meta?.size || `${(originalFile.size / 1024).toFixed(1)} KB`,
                    }),
                });
            }

            const refresh = await fetch(`/admin/api/admin/${model}/${id}`);
            setData(await refresh.json());
        } catch {
            alert('Помилка при завантаженні документів');
        } finally {
            setFileUploading(false);
        }
    };

    const handleDeleteFile = async (fileId: number) => {
        if (!data) return;
        if (!confirm('Видалити цей файл?')) return;

        try {
            await fetch(`/admin/api/admin/fileAsset/${fileId}`, { method: 'DELETE' });
            setData({
                ...data,
                documents: (data.documents as FileAsset[]).filter(f => f.id !== fileId),
            });
        } catch {
            alert('Помилка видалення');
        }
    };

    /* -------------------- SAVE -------------------- */

    const handleSave = async () => {
        if (!data) return;

        const isNew = id === 'new';
        const url = isNew ? `/admin/api/admin/${model}` : `/admin/api/admin/${model}/${id}`;

        const payload: any = JSON.parse(JSON.stringify(data));

        // Cleanup TestQuestion options if applicable
        if (model.toLowerCase() === 'testquestion' && payload.options) {
            payload.options = (payload.options as TestQuestionOption[]).map(opt => {
                const cleaned = { ...opt };
                if (!cleaned.specializationId) delete cleaned.specializationId;
                if (cleaned.optionEn === '') cleaned.optionEn = null;
                return cleaned;
            });
        }

        // 1. Map models to their specific classification fields based on your schema
        const classificationMap: Record<string, string> = {
            content: 'type',
            pagesection: 'type',
            externallink: 'pageKey',
            person: 'type',
            documentreport: 'category',
        };

        const currentModel = model.toLowerCase();

        // Determine the correct field name for this specific model (e.g., "pageKey")
        const queryParamName = classificationMap[currentModel];

        // Extract the actual value from the payload (e.g., "PARENTS")
        const classificationValue = queryParamName ? payload[queryParamName] : null;

        // 2. Build the redirect path using the dynamic query parameter name
        // Example outputs:
        // /content?type=NEWS&page=1
        // /externallink?pageKey=PARENTS&page=1
        // /documentreport?category=GENERAL&page=1
        const redirectPath = classificationValue
            ? `/${model}?${queryParamName}=${classificationValue}&page=1`
            : `/${model}`;

        // Clean up payload before sending to the database
        delete payload.documents;
        delete payload.subReports;
        delete payload.id;
        delete payload.createdAt;
        delete payload.updatedAt;

        try {
            const res = await fetch(url, {
                method: isNew ? 'POST' : 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                // 3. Redirect using the dynamically generated path
                router.push(redirectPath);

                if (!isNew) {
                    router.refresh();
                }
            } else {
                console.error("Failed to save data", await res.text());
            }
        } catch (error) {
            console.error("Error during save operation:", error);
        }
    };
    /* -------------------- RENDER -------------------- */

    if (loading) {
        return <Box p={8} textAlign="center"><CircularProgress /></Box>;
    }

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
                            const SelectedIcon = ICON_COMPONENTS[value] || HelpOutline;

                            return (
                                <Grid size={{ xs: 12, sm: 6 }} key={key}>
                                    <Autocomplete
                                        options={ICON_OPTIONS}
                                        value={value || "MeetingRoom"}
                                        onChange={(event, newValue) => {
                                            setData({ ...data, [key]: newValue });
                                        }}
                                        freeSolo
                                        renderOption={(props, option) => {
                                            const IconComponent = ICON_COMPONENTS[option] || HelpOutline;
                                            return (
                                                <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                                                    <IconComponent sx={{ color: '#182BA1', fontSize: 20 }} />
                                                    <Typography variant="body2">{option}</Typography>
                                                </Box>
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={label}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <>
                                                            <SelectedIcon sx={{ ml: 1, mr: -0.5, color: '#182BA1' }} />
                                                            {params.InputProps.startAdornment}
                                                        </>
                                                    ),
                                                }}
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

                        const isRichText = key.includes('description') || key.includes('text') || key.includes('highlights');

                        const quillModules = {
                            toolbar: [
                                [{'header': [1, 2, 3, false]}],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{'list': 'ordered'}, {'list': 'bullet'}],
                                ['link', 'clean']
                            ],
                        };

                        return (
                            <Grid size={{xs: 12}} key={key}>
                                {isRichText ? (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                                            {label}
                                        </Typography>
                                        <ReactQuill
                                            theme="snow"
                                            value={value || ''}
                                            modules={quillModules}
                                            onChange={(content: any) => setData({ ...data, [key]: content })}
                                        />
                                    </Box>
                                ) : (
                                    <TextField
                                        fullWidth
                                        label={label}
                                        value={value || ''}
                                        onChange={e => setData({ ...data, [key]: e.target.value })}
                                    />
                                )}
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
                                <Button component="label" variant="outlined" startIcon={fileUploading ? <CircularProgress size={20} /> : <CloudUpload />} disabled={fileUploading}>
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
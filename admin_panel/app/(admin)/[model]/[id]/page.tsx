'use client';

import {useState, useEffect, useMemo, useCallback} from 'react';
import {useParams, useRouter, useSearchParams} from 'next/navigation';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Stack,
    MenuItem,
    CircularProgress,
    IconButton,
    FormControlLabel,
    Switch,
    CardMedia,
    Tooltip,
    Chip,
    Divider,
    Autocomplete,
    Grid
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {
    Save,
    ArrowBack,
    CloudUpload,
    Delete,
    AutoFixHigh,
    Link as LinkIcon,
    FilePresent,
    Close,
    Add,
    HelpOutline,
    MeetingRoom,
    Class,
    Science,
    Biotech,
    Computer,
    LaptopMac,
    LibraryBooks,
    MenuBook,
    SportsBasketball,
    Pool,
    Restaurant,
    LocalCafe,
    Wc,
    LocalHospital,
    TheaterComedy,
    School,
    BusinessCenter,
    SupervisorAccount,
    Park,
    Apartment,
    Stairs,
    Elevator,
    InfoOutlined,
    Map,
} from '@mui/icons-material';
import {ADMIN_MODELS, FIELD_LABELS} from '@/lib/admin-config';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

/* ------------------------------------------------------------------ */
/* TYPES */
/* ------------------------------------------------------------------ */

type GenericRecord = Record<string, any>;

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

type EditConfig = (typeof ADMIN_MODELS)[keyof typeof ADMIN_MODELS];

/* ------------------------------------------------------------------ */
/* CONSTANTS */
/* ------------------------------------------------------------------ */

const ICON_COMPONENTS: Record<string, React.ElementType> = {
    MeetingRoom,
    Class,
    Science,
    Biotech,
    Computer,
    LaptopMac,
    LibraryBooks,
    MenuBook,
    SportsBasketball,
    Pool,
    Restaurant,
    LocalCafe,
    Wc,
    LocalHospital,
    TheaterComedy,
    School,
    BusinessCenter,
    SupervisorAccount,
    Park,
    Apartment,
    Stairs,
    Elevator,
    InfoOutlined,
    Map,
};

const ICON_OPTIONS = Object.keys(ICON_COMPONENTS);

const QUILL_MODULES = {
    toolbar: [
        [{header: [1, 2, 3, false]}],
        ['bold', 'italic', 'underline', 'strike'],
        [{list: 'ordered'}, {list: 'bullet'}],
        ['link', 'clean'],
    ],
};

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

/* ------------------------------------------------------------------ */
/* MAIN PAGE */
/* ------------------------------------------------------------------ */

export default function EditPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const model = String(params?.model ?? '');
    const id = String(params?.id ?? '');
    const config = ADMIN_MODELS[model as keyof typeof ADMIN_MODELS] as EditConfig;

    const {
        data,
        setData,
        options,
        specializations,
        loading,
        uploading,
        fileUploading,
        handleSave,
        handleUpload,
        handleDocumentUpload,
        handleDeleteFile,
        generateSlug,
    } = useEditRecord({
        model,
        id,
        searchParams,
        router,
        config,
    });

    if (loading) {
        return (
            <Box p={8} textAlign="center">
                <CircularProgress/>
            </Box>
        );
    }

    if (!data) {
        return (
            <Box p={8} textAlign="center">
                <Typography color="error">Не вдалося завантажити запис</Typography>
            </Box>
        );
    }

    const fields =
        config?.allFields ||
        Object.keys(data).filter((k) => !['id', 'createdAt', 'updatedAt', 'attributes', 'documents', 'subReports'].includes(k));

    return (
        <Box p={4} maxWidth={1100} mx="auto">
            <Stack direction="row" justifyContent="space-between" mb={4} alignItems="center">
                <Button startIcon={<ArrowBack/>} onClick={() => router.back()} sx={{color: 'text.secondary'}}>
                    Назад
                </Button>

                <Button
                    variant="contained"
                    startIcon={uploading || fileUploading ? <CircularProgress size={20} color="inherit"/> : <Save/>}
                    onClick={handleSave}
                    disabled={uploading || fileUploading}
                    sx={{bgcolor: '#182BA1', px: 4, py: 1, borderRadius: 2}}
                >
                    {id === 'new' ? 'Створити' : 'Зберегти зміни'}
                </Button>
            </Stack>

            <Paper sx={{p: {xs: 3, md: 5}, borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.04)'}}>
                <Typography variant="h4" fontWeight={900} mb={1} color="#0c1865">
                    {id === 'new' ? 'Новий запис' : 'Редагування'}
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={4}>
                    Модель: <Chip label={model} size="small" variant="outlined" sx={{ml: 1}}/>
                </Typography>

                <Grid container spacing={4}>
                    {fields.map((key) => (
                        <RecordField
                            key={key}
                            fieldKey={key}
                            model={model}
                            label={FIELD_LABELS[key] || key}
                            value={data[key]}
                            data={data}
                            setData={setData}
                            config={config}
                            options={options}
                            specializations={specializations}
                            onUpload={handleUpload}
                            onGenerateSlug={generateSlug}
                        />
                    ))}
                </Grid>

                {model.toLowerCase() === 'documentreport' && (
                    <>
                        <Divider sx={{my: 6}}/>

                        <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                                <Box>
                                    <Typography variant="h5" fontWeight={800} color="#182BA1">
                                        Файли та активи
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        PDF, DOCX та інші документи
                                    </Typography>
                                </Box>

                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={fileUploading ? <CircularProgress size={20}/> : <CloudUpload/>}
                                    disabled={fileUploading}
                                >
                                    Завантажити файли
                                    <VisuallyHiddenInput type="file" onChange={handleDocumentUpload} multiple/>
                                </Button>
                            </Stack>

                            <Grid container spacing={2}>
                                {(data.documents as FileAsset[] | undefined)?.map((file) => (
                                    <Grid key={file.id} size={{xs: 12, sm: 4}}>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                borderRadius: 3,
                                                position: 'relative',
                                            }}
                                        >
                                            <FilePresent sx={{mr: 2, color: '#182BA1', fontSize: 32}}/>
                                            <Box sx={{overflow: 'hidden', pr: 4}}>
                                                <Typography variant="subtitle2" noWrap fontWeight={700}>
                                                    {file.nameUk}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {file.fileType?.split('/')[1]?.toUpperCase() || 'FILE'} • {file.fileSize || '---'}
                                                </Typography>
                                            </Box>

                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteFile(file.id)}
                                                sx={{position: 'absolute', right: 8, top: 8, color: '#ef4444'}}
                                            >
                                                <Close fontSize="small"/>
                                            </IconButton>
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

/* ------------------------------------------------------------------ */
/* HOOK */

/* ------------------------------------------------------------------ */

function useEditRecord({
                           model,
                           id,
                           searchParams,
                           router,
                           config,
                       }: {
    model: string;
    id: string;
    searchParams: ReturnType<typeof useSearchParams>;
    router: ReturnType<typeof useRouter>;
    config: EditConfig;
}) {
    const [data, setData] = useState<GenericRecord | null>(null);
    const [options, setOptions] = useState<Record<string, RelationOption[]>>({});
    const [specializations, setSpecializations] = useState<Specialization[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [fileUploading, setFileUploading] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (id === 'new') {
                const initialData: GenericRecord = {};
                searchParams.forEach((val, key) => {
                    initialData[key] = val;
                });

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
                if (!res.ok) throw new Error('Failed to load record');
                setData(await res.json());
            } catch (err) {
                console.error('Load error', err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, model, searchParams]);

    useEffect(() => {
        const fetchOptions = async () => {
            if (loading || !data || !config?.relations) return;

            const newOptions: Record<string, RelationOption[]> = {};

            for (const [field, rel] of Object.entries(config.relations)) {
                const targetModel = (rel as { model: string }).model;
                const query = new URLSearchParams();

                if (data.category) query.append('category', String(data.category));
                if (model.toLowerCase() === 'disciplinesubitem' && field === 'disciplineId') {
                    query.append('hasSubItems', 'true');
                }

                const finalUrl = query.toString()
                    ? `/admin/api/admin/options/${targetModel}?${query.toString()}`
                    : `/admin/api/admin/options/${targetModel}`;

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
    }, [loading, model, config, data?.category, data]);

    useEffect(() => {
        if (model.toLowerCase() !== 'testquestion') return;

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
    }, [model]);

    const generateSlug = useCallback(() => {
        setData((prev) => {
            if (!prev) return prev;

            const source = (prev.titleUk as string) || (prev.nameUk as string) || (prev.fullNameUk as string) || '';

            const slug = source
                .toLowerCase()
                .trim()
                .replace(/[^\w\sа-яіїєґ-]/gi, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');

            return {...prev, slug};
        });
    }, []);

    const handleUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
            const files = event.target.files;
            if (!files || files.length === 0) return;

            setUploading(true);

            const formData = new FormData();
            Array.from(files).forEach((file) => formData.append('files', file));

            try {
                const res = await fetch('/admin/api/upload?mode=temp', {
                    method: 'POST',
                    body: formData,
                });

                const {urls} = await res.json();

                setData((prev) => {
                    if (!prev) return prev;

                    if (Array.isArray(prev[key])) {
                        return {
                            ...prev,
                            [key]: [...((prev[key] as string[]) || []), ...urls],
                        };
                    }

                    return {...prev, [key]: urls[0]};
                });
            } catch {
                alert('Помилка завантаження зображень');
            } finally {
                setUploading(false);
            }
        },
        []
    );

    const handleDocumentUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files;
            if (!files || files.length === 0) return;

            if (id === 'new') {
                alert('Спочатку збережіть документ, щоб додати до нього файли');
                return;
            }

            setFileUploading(true);

            const formData = new FormData();
            const fileList = Array.from(files);
            fileList.forEach((file) => formData.append('files', file));

            try {
                const res = await fetch('/admin/api/upload?mode=permanent', {
                    method: 'POST',
                    body: formData,
                });

                const {urls, files: filesMeta} = await res.json();

                for (let i = 0; i < urls.length; i++) {
                    const originalFile = fileList[i];
                    const meta = filesMeta?.[i];

                    await fetch('/admin/api/admin/fileAsset', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
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
        },
        [id, model]
    );

    const handleDeleteFile = useCallback(async (fileId: number) => {
        setData((prev) => {
            if (!prev) return prev;
            return prev;
        });

        if (!confirm('Видалити цей файл?')) return;

        try {
            await fetch(`/admin/api/admin/fileAsset/${fileId}`, {method: 'DELETE'});

            setData((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    documents: ((prev.documents as FileAsset[] | undefined) || []).filter((f) => f.id !== fileId),
                };
            });
        } catch {
            alert('Помилка видалення');
        }
    }, []);

    const handleSave = useCallback(async () => {
        if (!data) return;

        const isNew = id === 'new';
        const url = isNew ? `/admin/api/admin/${model}` : `/admin/api/admin/${model}/${id}`;
        const payload: any = JSON.parse(JSON.stringify(data));

        if (model.toLowerCase() === 'testquestion' && payload.options) {
            payload.options = (payload.options as TestQuestionOption[]).map((opt) => {
                const cleaned = {...opt};
                if (!cleaned.specializationId) delete cleaned.specializationId;
                if (cleaned.optionEn === '') cleaned.optionEn = null;
                return cleaned;
            });
        }

        const classificationMap: Record<string, string> = {
            content: 'type',
            pagesection: 'type',
            externallink: 'pageKey',
            person: 'type',
            documentreport: 'category',
        };

        const currentModel = model.toLowerCase();
        const queryParamName = classificationMap[currentModel];
        const classificationValue = queryParamName ? payload[queryParamName] : null;

        const redirectPath = classificationValue
            ? `/${model}?${queryParamName}=${classificationValue}&page=1`
            : `/${model}`;

        delete payload.documents;
        delete payload.subReports;
        delete payload.id;
        delete payload.createdAt;
        delete payload.updatedAt;

        try {
            const res = await fetch(url, {
                method: isNew ? 'POST' : 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push(redirectPath);
                if (!isNew) router.refresh();
            } else {
                console.error('Failed to save data', await res.text());
            }
        } catch (error) {
            console.error('Error during save operation:', error);
        }
    }, [data, id, model, router]);

    return {
        data,
        setData,
        options,
        specializations,
        loading,
        uploading,
        fileUploading,
        handleSave,
        handleUpload,
        handleDocumentUpload,
        handleDeleteFile,
        generateSlug,
    };
}

/* ------------------------------------------------------------------ */
/* FIELD RENDERER */

/* ------------------------------------------------------------------ */

function RecordField({
                         fieldKey,
                         model,
                         label,
                         value,
                         data,
                         setData,
                         config,
                         options,
                         specializations,
                         onUpload,
                         onGenerateSlug,
                     }: {
    fieldKey: string;
    model: string;
    label: string;
    value: any;
    data: GenericRecord;
    setData: React.Dispatch<React.SetStateAction<GenericRecord | null>>;
    config: EditConfig;
    options: Record<string, RelationOption[]>;
    specializations: Specialization[];
    onUpload: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
    onGenerateSlug: () => void;
}) {
    const isRichText = useMemo(
        () => ['description', 'text', 'highlights'].some((kw) => fieldKey.toLowerCase().includes(kw.toLowerCase())),
        [fieldKey]
    );

    const isJson = useMemo(
        () => ['socialLinks', 'attributes'].some((kw) => fieldKey.toLowerCase().includes(kw.toLowerCase())),
        [fieldKey]
    );

    const isNumber = useMemo(
        () => ['order', 'count'].some((kw) => fieldKey.toLowerCase().includes(kw.toLowerCase())),
        [fieldKey]
    );

    const updateField = useCallback(
        (newValue: any) => {
            setData((prev) => (prev ? {...prev, [fieldKey]: newValue} : prev));
        },
        [fieldKey, setData]
    );

    if (fieldKey === 'iconName') {
        const SelectedIcon = ICON_COMPONENTS[value] || HelpOutline;

        return (
            <Grid size={{xs: 12}}>
                <Autocomplete
                    options={ICON_OPTIONS}
                    value={value || 'MeetingRoom'}
                    onChange={(_, newValue) => updateField(newValue)}
                    freeSolo
                    renderOption={(props, option) => {
                        const IconComponent = ICON_COMPONENTS[option] || HelpOutline;
                        return (
                            <Box component="li" {...props} sx={{display: 'flex', alignItems: 'center', gap: 2, py: 1}}>
                                <IconComponent sx={{color: '#182BA1', fontSize: 20}}/>
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
                                        <SelectedIcon sx={{ml: 1, mr: -0.5, color: '#182BA1'}}/>
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

    const isDateField = fieldKey.endsWith('At') || fieldKey.includes('Date') || fieldKey === 'publicationDate';
    if (isDateField) {
        let dateValue = '';
        if (value) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) {
                dateValue = d.toISOString().split('T')[0];
            }
        }

        return (
            <Grid size={{xs: 12}}>
                <TextField
                    fullWidth
                    label={label}
                    type="date"
                    value={dateValue}
                    onChange={(e) => updateField(e.target.value)}
                    InputLabelProps={{shrink: true}}
                />
            </Grid>
        );
    }

    if (fieldKey === 'slug') {
        return (
            <Grid size={{xs: 12}}>
                <Stack direction="row" spacing={1}>
                    <TextField
                        fullWidth
                        label={label}
                        value={value || ''}
                        onChange={(e) => updateField(e.target.value)}
                        InputProps={{
                            startAdornment: <LinkIcon sx={{mr: 1, color: 'action.active'}}/>,
                        }}
                    />
                    <Tooltip title="Згенерувати">
                        <IconButton onClick={onGenerateSlug} sx={{bgcolor: '#f0f2ff'}}>
                            <AutoFixHigh color="primary"/>
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Grid>
        );
    }

    if (fieldKey.toLowerCase().includes('photo') || fieldKey.toLowerCase().includes('gallery')) {
        const isArray = Array.isArray(value);

        return (
            <Grid size={{xs: 12}}>
                <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
                    {label}
                </Typography>

                <Stack direction="row" spacing={2} sx={{overflowX: 'auto', pb: 1}}>
                    {isArray
                        ? value.map((url: string, idx: number) => (
                            <Box key={idx} sx={{position: 'relative', flexShrink: 0}}>
                                <CardMedia
                                    component="img"
                                    image={url}
                                    sx={{width: 140, height: 140, borderRadius: 3, objectFit: 'cover'}}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        const updated = [...value];
                                        updated.splice(idx, 1);
                                        updateField(updated);
                                    }}
                                    sx={{position: 'absolute', top: 5, right: 5, bgcolor: 'white'}}
                                >
                                    <Delete fontSize="small"/>
                                </IconButton>
                            </Box>
                        ))
                        : value && (
                        <Box sx={{position: 'relative'}}>
                            <CardMedia
                                component="img"
                                image={value}
                                sx={{width: 200, height: 140, borderRadius: 3, objectFit: 'cover'}}
                            />
                            <IconButton
                                size="small"
                                onClick={() => updateField(null)}
                                sx={{position: 'absolute', top: 5, right: 5, bgcolor: 'white'}}
                            >
                                <Delete fontSize="small"/>
                            </IconButton>
                        </Box>
                    )}

                    <Button
                        component="label"
                        variant="outlined"
                        sx={{width: 140, height: 140, borderRadius: 3, borderStyle: 'dashed'}}
                    >
                        <CloudUpload/>
                        <VisuallyHiddenInput
                            type="file"
                            onChange={(e) => onUpload(e, fieldKey)}
                            multiple={isArray}
                            accept="image/*"
                        />
                    </Button>
                </Stack>
            </Grid>
        );
    }

    if (typeof value === 'boolean' || fieldKey.startsWith('is') || fieldKey.startsWith('has')) {
        return (
            <Grid size={{xs: 12, sm: 4}}>
                <FormControlLabel
                    control={<Switch checked={!!value} onChange={(e) => updateField(e.target.checked)}/>}
                    label={label}
                />
            </Grid>
        );
    }

    if (fieldKey.toLowerCase().includes('color')) {
        return (
            <Grid size={{xs: 12, sm: 4}}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                        fullWidth
                        label={label}
                        value={value || '#182BA1'}
                        onChange={(e) => updateField(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <Box
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        bgcolor: value || '#182BA1',
                                        mr: 1,
                                        border: '1px solid #ddd',
                                        flexShrink: 0,
                                    }}
                                />
                            ),
                        }}
                    />

                    <IconButton
                        component="label"
                        sx={{
                            bgcolor: '#f0f2ff',
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            '&:hover': {bgcolor: '#e0e4ff'},
                        }}
                    >
                        <input
                            type="color"
                            value={value || '#182BA1'}
                            onChange={(e) => updateField(e.target.value)}
                            style={{
                                opacity: 0,
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                cursor: 'pointer',
                            }}
                        />
                        <AutoFixHigh color="primary"/>
                    </IconButton>
                </Stack>
            </Grid>
        );
    }

    if (fieldKey === 'options' && model.toLowerCase() === 'testquestion') {
        const opts: TestQuestionOption[] = Array.isArray(value) ? value : [];

        return (
            <Grid size={{xs: 12}}>
                <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
                    {label}
                </Typography>

                <Stack spacing={2}>
                    {opts.map((opt, idx) => (
                        <Paper key={idx} sx={{p: 2, borderRadius: 2}}>
                            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} alignItems="center">
                                <TextField
                                    label="Відповідь"
                                    value={opt.option || ''}
                                    onChange={(e) => {
                                        const updated = [...opts];
                                        updated[idx] = {...updated[idx], option: e.target.value};
                                        updateField(updated);
                                    }}
                                    fullWidth
                                />

                                <TextField
                                    label="Answer (EN)"
                                    value={opt.optionEn || ''}
                                    onChange={(e) => {
                                        const updated = [...opts];
                                        updated[idx] = {...updated[idx], optionEn: e.target.value};
                                        updateField(updated);
                                    }}
                                    fullWidth
                                />

                                <TextField
                                    select
                                    label="Спеціалізація"
                                    value={opt.specializationId || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const updated = [...opts];
                                        updated[idx] = {
                                            ...updated[idx],
                                            specializationId: val !== '' ? Number(val) : null,
                                        };
                                        updateField(updated);
                                    }}
                                    sx={{minWidth: 220}}
                                >
                                    <MenuItem value="">
                                        <em>Не обрано</em>
                                    </MenuItem>

                                    {specializations.map((s) => (
                                        <MenuItem key={s.id} value={s.id}>
                                            {s.nameUk || s.nameEn || `ID: ${s.id}`}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <IconButton
                                    onClick={() => {
                                        const updated = [...opts];
                                        updated.splice(idx, 1);
                                        updateField(updated);
                                    }}
                                >
                                    <Delete/>
                                </IconButton>
                            </Stack>
                        </Paper>
                    ))}

                    <Button
                        onClick={() => {
                            const newOpt: TestQuestionOption = {option: '', optionEn: '', specializationId: null};
                            updateField([...(data.options || []), newOpt]);
                        }}
                        startIcon={<Add/>}
                    >
                        Додати відповідь
                    </Button>
                </Stack>
            </Grid>
        );
    }

    if (config?.relations?.[fieldKey]) {
        return (
            <Grid size={{xs: 12, sm: 4}}>
                <TextField
                    select
                    fullWidth
                    label={label}
                    value={value || ''}
                    onChange={(e) => updateField(e.target.value)}
                >
                    <MenuItem value="">
                        <em>Не обрано</em>
                    </MenuItem>

                    {(options[fieldKey] || []).map((opt: RelationOption) => (
                        <MenuItem key={opt.id} value={opt.id}>
                            {opt.name || opt.nameUk || opt.titleUk || opt.fullNameUk || opt.id}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
        );
    }

    if (config?.enums?.[fieldKey]) {
        return (
            <Grid size={{xs: 12, sm: 4}}>
                <TextField
                    select
                    fullWidth
                    label={label}
                    value={value || ''}
                    onChange={(e) => updateField(e.target.value)}
                >
                    {config.enums[fieldKey].map((opt: string) => (
                        <MenuItem key={opt} value={opt}>
                            {opt}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
        );
    }

    if (isRichText) {
        return (
            <Grid size={{xs: 12}}>
                <Box
                    sx={{
                        mb: 2,
                        '& .ql-container': {minHeight: '150px', borderRadius: '0 0 4px 4px'},
                        '& .ql-toolbar': {borderRadius: '4px 4px 0 0'},
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{color: 'text.secondary', fontWeight: 600, mb: 0.5, display: 'block'}}
                    >
                        {label}
                    </Typography>

                    <ReactQuill theme="snow" value={value || ''} modules={QUILL_MODULES} onChange={updateField}/>
                </Box>
            </Grid>
        );
    }

    if (isJson) {
        return (
            <Grid size={{xs: 12}}>
                <TextField
                    fullWidth
                    multiline
                    minRows={5}
                    label={fieldKey}
                    value={value || ''}
                    onChange={(e) => {
                        try {
                            updateField(e.target.value ? JSON.parse(e.target.value) : null);
                        } catch {}
                    }}
                />
            </Grid>
        );
    }


    if (isNumber) {
        return (
            <Grid size={{xs: 12}}>
                <TextField
                    fullWidth
                    type="number"
                    label={fieldKey}
                    value={value ?? ''}
                    onChange={(e) => updateField(e.target.value)}
                />
            </Grid>
        );
    }

    return (
        <Grid size={{xs: 12}}>
            <TextField
                fullWidth
                label={label}
                value={value || ''}
                onChange={(e) => updateField(e.target.value)}
            />
        </Grid>
    );
}
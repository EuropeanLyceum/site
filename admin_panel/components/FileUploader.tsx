import { useState } from 'react';
import { Button, CircularProgress, Typography, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function FileUploader({ onUpload, label = "Завантажити файл" }: { onUpload: (data: any) => void, label?: string }) {
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            onUpload(data); // Передаємо дані назад у форму
        } catch (err) {
            alert('Помилка завантаження');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ border: '1px dashed #182BA1', p: 2, borderRadius: 2, textAlign: 'center' }}>
            <input type="file" id="file-input" hidden onChange={handleFileChange} />
            <label htmlFor="file-input">
                <Button variant="outlined" component="span" startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}>
                    {loading ? 'Завантаження...' : label}
                </Button>
            </label>
        </Box>
    );
}
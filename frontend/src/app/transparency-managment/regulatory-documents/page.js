'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Box, Typography, Link, Container, Stack,
    Accordion, AccordionSummary, AccordionDetails,
    CircularProgress, Paper, TextField, InputAdornment, Pagination
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SearchIcon from '@mui/icons-material/Search';

import firebird3 from '@/assets/photos/firebird/firebird3.png';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';

const RegDocsPage = () => {
    const { t, locale } = useTranslation("regdocs");
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const isEn = locale === 'en';
    const l = (uk, en) => (isEn ? en || uk : uk);

    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: '10',
                    parentId: 'null',
                    category: 'REGULATORY', // Категорія для цієї сторінки
                });
                if (searchQuery) params.append('search', searchQuery);

                const res = await fetch(`/api/admin/documentreport?${params.toString()}`);
                if (res.ok) {
                    const json = await res.json();
                    setReports(json.data || []);
                    setTotalPages(json.meta?.totalPages || 1);
                }
            } catch (e) {
                console.error('Error:', e);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchReports, 400);
        return () => clearTimeout(timeoutId);
    }, [page, searchQuery]);

    return (
        <Container maxWidth="lg" sx={{ py: 2, mb: 1, minHeight: "450px" }}>
            <Box sx={{
                position: 'relative', mb: 6, p: { xs: 2, md: 6 }, borderRadius: 4, overflow: 'hidden',
                background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: { xs: "150px", md: '300px' }
            }}>
                <Typography variant="h1" sx={{
                    fontFamily: 'Montserrat Alternates, sans-serif', fontWeight: 800,
                    fontSize: { xs: '26px', sm: '36px', md: '52px' }, color: '#182BA1', zIndex: 2, textAlign: 'center'
                }}>
                    {t('regulatoryDocumentsTitle')}
                </Typography>
                <Box sx={{ position: 'absolute', right: '-5%', width: { xs: '180px', md: '300px' }, opacity: 0.2, zIndex: 1 }}>
                    <Image src={firebird3} alt="" priority style={{ width: '100%', height: 'auto' }} />
                </Box>
            </Box>

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                <TextField
                    sx={{ maxWidth: 600 }}
                    fullWidth
                    placeholder={t('searchPlaceholder') || "Пошук документів..."}
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment>,
                        sx: { borderRadius: 3, bgcolor: '#fff' }
                    }}
                />
            </Box>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress sx={{ color: '#182BA1' }} /></Box>
            ) : reports.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 10 }}><Typography color="text.secondary">Нічого не знайдено</Typography></Box>
            ) : (
                <Stack spacing={4}>
                    {reports.map((report) => (
                        <ReportSection key={report.id} report={report} l={l} />
                    ))}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" shape="rounded" />
                        </Box>
                    )}
                </Stack>
            )}
        </Container>
    );
};

// Спільні компоненти
const ReportSection = ({ report, l }) => (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#182BA1', mb: 3, fontSize: { xs: 20, md: 28 }, borderLeft: '4px solid #182BA1', pl: 2 }}>
            {l(report.titleUk, report.titleEn)}
        </Typography>
        {report.documents?.length > 0 && <DocumentList documents={report.documents} l={l} />}
        {report.subReports?.map((sub) => (
            <Accordion key={sub.id} elevation={0} sx={{ bgcolor: 'transparent', borderBottom: '1px solid #CBD5E1', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 600 }}>{l(sub.titleUk, sub.titleEn)}</Typography></AccordionSummary>
                <AccordionDetails>
                    {sub.descriptionUk && <Typography sx={{ mb: 2, fontSize: 14, color: '#475569' }}>{l(sub.descriptionUk, sub.descriptionEn)}</Typography>}
                    <DocumentList documents={sub.documents} l={l} />
                </AccordionDetails>
            </Accordion>
        ))}
    </Paper>
);

const DocumentList = ({ documents, l }) => (
    <Stack spacing={1.5} sx={{ my: 1 }}>
        {documents.map((doc) => (
            <Box key={doc.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 1.5, borderRadius: 2, '&:hover': { bgcolor: 'rgba(24, 43, 161, 0.04)' }, transition: '0.2s' }}>
                <InsertDriveFileIcon sx={{ color: '#182BA1', mt: 0.5 }} />
                <Box>
                    <Link href={doc.url} target="_blank" sx={{ fontWeight: 600, color: '#182BA1', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        {l(doc.nameUk, doc.nameEn)}
                    </Link>
                    <Typography sx={{ fontSize: 12, color: '#64748B' }}>
                        {doc.fileType?.split('/')[1]?.toUpperCase() || 'FILE'} {doc.fileSize && `• ${doc.fileSize}`}
                    </Typography>
                </Box>
            </Box>
        ))}
    </Stack>
);

export default RegDocsPage;
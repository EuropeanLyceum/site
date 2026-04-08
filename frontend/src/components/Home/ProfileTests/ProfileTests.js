"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Box, Typography, Container, Paper, Button, Stack, LinearProgress,
    Grid, Chip, alpha, Zoom, Fade, CircularProgress
} from "@mui/material";
import {
    TimerOutlined, HelpOutline, SchoolOutlined, Replay,
    HomeOutlined, CheckCircleOutline, KeyboardArrowRight
} from "@mui/icons-material";
import { useTranslation } from "@/contexts/TranslationProvider.jsx";

const ProfileTests = () => {
    const { t, locale } = useTranslation("test");
    const router = useRouter();

    const [dbQuestions, setDbQuestions] = useState([]);
    const [dbSpecializations, setDbSpecializations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showResult, setShowResult] = useState(null);
    const [testStarted, setTestStarted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [qRes, sRes] = await Promise.all([
                    fetch('/admin/api/admin/testquestion'),
                    fetch('/admin/api/admin/specialization')
                ]);

                if (qRes.ok && sRes.ok) {
                    const qJson = await qRes.json();
                    const sJson = await sRes.json();
                    setDbQuestions(qJson.data || []);
                    setDbSpecializations(sJson.data || []);
                }
            } catch (err) {
                console.error("Failed to load test data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAnswer = (specId) => {
        const newAnswers = [...answers, Number(specId)];
        setAnswers(newAnswers);

        if (currentQuestion < dbQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = (userAnswers) => {
        if (!userAnswers.length) return;

        // 1. Рахуємо бали для кожної спеціалізації
        const scores = userAnswers.reduce((acc, id) => {
            if (id) acc[id] = (acc[id] || 0) + 1;
            return acc;
        }, {});

        // 2. Знаходимо максимальний бал
        const maxScore = Math.max(...Object.values(scores));

        // 3. Знаходимо всі спеціалізації, які набрали цей бал
        const topSpecIds = Object.keys(scores)
            .filter(id => scores[id] === maxScore)
            .map(Number);

        // 4. Логіка вибору при нічиї:
        // Якщо є кілька лідерів, беремо той, що зустрічався останнім (або рандомізуємо)
        const winnerId = topSpecIds.length > 1
            ? topSpecIds[Math.floor(Math.random() * topSpecIds.length)]
            : topSpecIds[0];

        const winner = dbSpecializations.find(s => s.id === winnerId);
        setShowResult(winner || { error: true });
    };

    const resetTest = () => {
        setCurrentQuestion(0);
        setAnswers([]);
        setShowResult(null);
        setTestStarted(false);
    };

    const getLangField = (obj, fieldBase) => {
        if (!obj) return "";
        const suffix = locale.charAt(0).toUpperCase() + locale.slice(1);
        const localized = obj[`${fieldBase}${suffix}`];
        return localized || obj[`${fieldBase}Uk`] || obj[fieldBase] || "";
    };

    // Додано обробку завантаження, щоб уникнути помилок undefined
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // 1. Welcome Screen
    if (!testStarted) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
                <Box sx={{
                    py: { xs: 8, md: 12 },
                    background: 'linear-gradient(135deg, #0c1865 0%, #182BA1 100%)',
                    color: '#fff',
                    clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0% 100%)',
                    textAlign: 'center',
                }}>
                    <Container>
                        <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontFamily: "'Montserrat Alternates', sans-serif" }}>
                            {t("profileTestsTitle")} <span style={{ color: '#f97316' }}>TEST</span>
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
                            {t("profileTestsSubtitle")}
                        </Typography>
                    </Container>
                </Box>

                <Container maxWidth="md" sx={{ mt: 10, pb: 10 }}>
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        {[
                            { icon: <TimerOutlined sx={{ color: '#f97316' }} />, title: t("timeToComplete"), sub: t("timeToCompleteSubtitle") },
                            { icon: <SchoolOutlined color="success" />, title: t("accurateRecommendation"), sub: t("accurateRecommendationSubtitle") }
                        ].map((item, i) => (
                            <Grid item size={{xs: 12, md: 6}} key={i}>
                                <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 6, height: '100%', border: '1px solid #e2e8f0' }}>
                                    <Box sx={{ mb: 2 }}>{item.icon}</Box>
                                    <Typography variant="subtitle1" fontWeight={800}>{item.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{item.sub}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    <Paper sx={{ p: 4, borderRadius: 8, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                        <Typography variant="h6" fontWeight={800} mb={3}>{t("studyDirections")}</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center', mb: 4 }}>
                            {dbSpecializations.map((spec) => (
                                <Chip
                                    key={spec.id}
                                    label={getLangField(spec, 'name')}
                                    sx={{ fontWeight: 700, bgcolor: alpha('#182BA1', 0.05), color: '#182BA1', border: '1px solid', borderColor: alpha('#182BA1', 0.1) }}
                                />
                            ))}
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => setTestStarted(true)}
                            sx={{
                                px: 6, py: 2, borderRadius: 50, fontWeight: 900, fontSize: '1.1rem',
                                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 20px rgba(249, 115, 22, 0.4)' }
                            }}
                        >
                            {t("startTesting")}
                        </Button>
                    </Paper>
                </Container>
            </Box>
        );
    }

    // 2. Result Screen
    if (showResult) {
        const isError = showResult.error;

        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', py: 10 }}>
                <Container maxWidth="md">
                    <Fade in timeout={800}>
                        <Paper sx={{ p: { xs: 4, md: 8 }, borderRadius: 10, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            {isError ? (
                                <Typography variant="h4">{t("errorMessage")}</Typography>
                            ) : (
                                <>
                                    <Typography variant="h6" color="text.secondary" fontWeight={700}>{t("yourResult")}</Typography>
                                    <Typography variant="h2" sx={{ fontWeight: 900, color: '#182BA1', mb: 4, fontFamily: "'Montserrat Alternates', sans-serif" }}>
                                        {getLangField(showResult, 'name')}
                                    </Typography>

                                    <Typography variant="body1" sx={{ fontSize: '1.2rem', color: '#475569', mb: 6, lineHeight: 1.8 }}>
                                        {getLangField(showResult, 'description')}
                                    </Typography>

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" mt={4}>
                                        <Button variant="outlined" startIcon={<Replay />} onClick={resetTest} sx={{ borderRadius: 4, px: 4, py: 1.5, fontWeight: 800 }}>
                                            {t("retakeTest")}
                                        </Button>
                                        <Button variant="contained" startIcon={<HomeOutlined />} onClick={() => router.push('/')} sx={{ borderRadius: 4, px: 4, py: 1.5, fontWeight: 800, bgcolor: '#182BA1' }}>
                                            {t("returnToHome")}
                                        </Button>
                                    </Stack>
                                </>
                            )}
                        </Paper>
                    </Fade>
                </Container>
            </Box>
        );
    }

    // 3. Active Test Screen
    const activeQuestion = dbQuestions[currentQuestion];
    const progressValue = dbQuestions.length ? ((currentQuestion + 1) / dbQuestions.length) * 100 : 0;

    // Захист від відсутності питання під час переходу станів
    if (!activeQuestion) return null;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', py: { xs: 4, md: 10 } }}>
            <Container maxWidth="sm">
                <Box sx={{ mb: 6 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary">
                            {t("question")} {currentQuestion + 1} / {dbQuestions.length}
                        </Typography>
                        <Typography variant="caption" fontWeight={800} color="primary">
                            {Math.round(progressValue)}%
                        </Typography>
                    </Stack>
                    <LinearProgress
                        variant="determinate"
                        value={progressValue}
                        sx={{ height: 10, borderRadius: 5, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: '#182BA1' } }}
                    />
                </Box>

                <Zoom in={true} key={currentQuestion}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 5, textAlign: 'center', color: '#0c1865' }}>
                            {getLangField(activeQuestion, 'question')}
                        </Typography>

                        <Stack spacing={2}>
                            {activeQuestion.options?.map((option, index) => (
                                <Button
                                    key={option.id || index}
                                    variant="outlined"
                                    onClick={() => handleAnswer(option.specializationId)}
                                    sx={{
                                        p: 3, justifyContent: 'flex-start', textAlign: 'left', borderRadius: 5,
                                        border: '2px solid #e2e8f0', color: '#1e293b', transition: 'all 0.2s',
                                        '&:hover': {
                                            border: '2px solid #182BA1',
                                            bgcolor: alpha('#182BA1', 0.04),
                                            transform: 'translateX(8px)'
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        minWidth: 40, height: 40, borderRadius: '50%', bgcolor: '#182BA1',
                                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 900, mr: 2
                                    }}>
                                        {String.fromCharCode(65 + index)}
                                    </Box>
                                    <Typography variant="body1" fontWeight={600}>
                                        {getLangField(option, 'option')}
                                    </Typography>
                                    <KeyboardArrowRight sx={{ ml: 'auto', opacity: 0.5 }} />
                                </Button>
                            ))}
                        </Stack>
                    </Box>
                </Zoom>
            </Container>
        </Box>
    );
};

export default ProfileTests;
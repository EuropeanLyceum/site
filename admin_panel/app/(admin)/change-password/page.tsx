'use client';

import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Paper, TextField, Button,
  Stepper, Step, StepLabel, Alert, InputAdornment,
  IconButton, List, ListItem, ListItemIcon, ListItemText,
  alpha, CircularProgress
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// Використовуємо твій новий консолідований файл
import { PASSWORD_RULES, validatePassword } from '@/lib/auth/password';

type FormState = {
  currentPassword: string;
  newUsername: string;
  newPassword: string;
};

type RequestState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
};

const INITIAL_FORM_STATE: FormState = {
  currentPassword: '',
  newUsername: '',
  newPassword: ''
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const [verificationState, setVerificationState] = useState<RequestState>({ status: 'idle', message: '' });
  const [updateState, setUpdateState] = useState<RequestState>({ status: 'idle', message: '' });

  const isLoading = verificationState.status === 'loading' || updateState.status === 'loading';

  // Валідація пароля "на льоту"
  const passwordValidationError = useMemo(() => {
    if (formState.newPassword.length === 0) return '';
    const validation = validatePassword(formState.newPassword);
    return validation.valid ? '' : (validation as any).error;
  }, [formState.newPassword]);

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    // Скидаємо помилки при введенні
    setVerificationState({ status: 'idle', message: '' });
    setUpdateState({ status: 'idle', message: '' });
  }, []);

  // КРОК 1: Тільки перевірка пароля
  const handleVerifyCredentials = async (event: FormEvent) => {
    event.preventDefault();
    setVerificationState({ status: 'loading', message: '' });

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formState.currentPassword
        })
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Неправильний пароль');

      setVerificationState({ status: 'success', message: 'Особу підтверджено' });
      setActiveStep(1);
    } catch (error: any) {
      setVerificationState({ status: 'error', message: error.message });
    }
  };

  // КРОК 2: Оновлення даних
  const handleChangeData = async (event: FormEvent) => {
    event.preventDefault();
    if (passwordValidationError) return;

    setUpdateState({ status: 'loading', message: '' });

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formState.currentPassword,
          newPassword: formState.newPassword || undefined,
          newUsername: formState.newUsername.trim() || undefined
        })
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Помилка оновлення');

      setUpdateState({ status: 'success', message: 'Дані успішно змінено!' });

      // Даємо час користувачу побачити успіх і рефрешимо сесію
      setTimeout(() => {
        router.refresh();
        router.push('/dashboard');
      }, 1500);
    } catch (error: any) {
      setUpdateState({ status: 'error', message: error.message });
    }
  };

  return (
      <Box sx={{ maxWidth: 600, mx: 'auto', py: 4, px: 2 }}>
        <Typography variant="h4" sx={{
          fontWeight: 900, mb: 4, color: '#0c1865', textAlign: 'center'
        }}>
          Налаштування акаунту
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
          <Step><StepLabel>Перевірка</StepLabel></Step>
          <Step><StepLabel>Нові дані</StepLabel></Step>
        </Stepper>

        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 6, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          {activeStep === 0 ? (
              /* ФОРМА КРОКУ 1 */
              <Box component="form" onSubmit={handleVerifyCredentials} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Підтвердіть пароль</Typography>
                <Typography variant="body2" color="text.secondary">Для зміни налаштувань потрібно підтвердити, що це ви.</Typography>

                {verificationState.status === 'error' && (
                    <Alert severity="error" sx={{ borderRadius: 3 }}>{verificationState.message}</Alert>
                )}

                <TextField
                    fullWidth
                    type={showCurrentPassword ? 'text' : 'password'}
                    label="Поточний пароль"
                    name="currentPassword"
                    value={formState.currentPassword}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><LockIcon color="primary"/></InputAdornment>,
                      endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                              {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                      ),
                      sx: { borderRadius: 3 }
                    }}
                />

                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ArrowBackIcon />}
                      onClick={() => router.back()}
                      sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
                  >
                    Скасувати
                  </Button>
                  <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      sx={{ py: 1.5, borderRadius: 3, fontWeight: 700, bgcolor: '#182BA1', '&:hover': { bgcolor: '#0c1865' } }}
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Продовжити'}
                  </Button>
                </Box>
              </Box>
          ) : (
              /* ФОРМА КРОКУ 2 */
              <Box component="form" onSubmit={handleChangeData} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Оновлення профілю</Typography>

                {updateState.status === 'success' ? (
                    <Alert severity="success" sx={{ borderRadius: 3 }}>{updateState.message}</Alert>
                ) : updateState.status === 'error' ? (
                    <Alert severity="error" sx={{ borderRadius: 3 }}>{updateState.message}</Alert>
                ) : null}

                <TextField
                    fullWidth
                    label="Новий логін"
                    name="newUsername"
                    placeholder="Залиште порожнім, якщо не змінюєте"
                    value={formState.newUsername}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><PersonIcon color="secondary"/></InputAdornment>,
                      sx: { borderRadius: 3 }
                    }}
                    helperText="Мінімум 3 символи"
                />

                <TextField
                    fullWidth
                    type={showNewPassword ? 'text' : 'password'}
                    label="Новий пароль"
                    name="newPassword"
                    value={formState.newPassword}
                    onChange={handleInputChange}
                    required
                    error={!!passwordValidationError}
                    helperText={passwordValidationError}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><LockIcon color="secondary"/></InputAdornment>,
                      endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                              {showNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                      ),
                      sx: { borderRadius: 3 }
                    }}
                />

                <Box sx={{ bgcolor: alpha('#182BA1', 0.04), p: 2, borderRadius: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0c1865', display: 'block', mb: 1 }}>
                    Вимоги до нового пароля:
                  </Typography>
                  <List dense disablePadding>
                    {PASSWORD_RULES.map((rule) => (
                        <ListItem key={rule.id} disablePadding sx={{ py: 0.2 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckCircleOutlineIcon sx={{
                              fontSize: 16,
                              color: rule.test(formState.newPassword) ? '#10b981' : '#cbd5e1'
                            }} />
                          </ListItemIcon>
                          <ListItemText
                              primaryTypographyProps={{
                                variant: 'caption',
                                color: rule.test(formState.newPassword) ? 'text.primary' : 'text.secondary'
                              }}
                              primary={rule.error}
                          />
                        </ListItem>
                    ))}
                  </List>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setActiveStep(0)}
                      sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
                  >
                    Назад
                  </Button>
                  <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      color="secondary"
                      disabled={isLoading || !!passwordValidationError || (!formState.newPassword && !formState.newUsername)}
                      sx={{ py: 1.5, borderRadius: 3, fontWeight: 700, color: '#fff' }}
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Зберегти зміни'}
                  </Button>
                </Box>
              </Box>
          )}
        </Paper>
      </Box>
  );
}
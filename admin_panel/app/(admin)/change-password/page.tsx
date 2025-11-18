'use client';

import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PASSWORD_REQUIREMENTS, validatePassword } from '@/lib/auth/password';

type Step = 'verify' | 'update';

type FormState = {
  currentUsername: string;
  currentPassword: string;
  newUsername: string;
  newPassword: string;
};

type RequestState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
};

const INITIAL_FORM_STATE: FormState = {
  currentUsername: '',
  currentPassword: '',
  newUsername: '',
  newPassword: ''
};

const STEPS_COPY: Record<Step, string> = {
  verify: 'Спочатку підтвердіть поточні дані для входу',
  update: 'Тепер введіть нові дані для входу'
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('verify');
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const [verificationState, setVerificationState] = useState<RequestState>({ status: 'idle', message: '' });
  const [updateState, setUpdateState] = useState<RequestState>({ status: 'idle', message: '' });

  const isLoading = verificationState.status === 'loading' || updateState.status === 'loading';

  const passwordValidationError = useMemo(() => {
    if (formState.newPassword.length === 0) {
      return '';
    }

    const validation = validatePassword(formState.newPassword);
    return validation.valid ? '' : validation.error;
  }, [formState.newPassword]);

  const resetMessages = useCallback(() => {
    setVerificationState({ status: 'idle', message: '' });
    setUpdateState({ status: 'idle', message: '' });
  }, []);

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    resetMessages();
  }, [resetMessages]);

  const handleVerifyCredentials = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    setVerificationState({ status: 'loading', message: '' });

    try {
      const response = await fetch('/api/auth/verify-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formState.currentUsername.trim(),
          password: formState.currentPassword
        })
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || 'Неправильний логін або пароль');
      }

      setVerificationState({
        status: 'success',
        message: 'Поточні дані підтверджені. Тепер ви можете ввести нові дані.'
      });
      setStep('update');
    } catch (error) {
      console.error('Помилка при перевірці даних:', error);
      const message = error instanceof Error ? error.message : 'Помилка з\'єднання з сервером';
      setVerificationState({ status: 'error', message });
    }
  }, [formState.currentPassword, formState.currentUsername, resetMessages]);

  const handleChangeData = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();

    if (passwordValidationError) {
      setUpdateState({ status: 'error', message: passwordValidationError });
      return;
    }

    setUpdateState({ status: 'loading', message: '' });

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formState.currentPassword,
          newPassword: formState.newPassword,
          newUsername: formState.newUsername.trim() || undefined
        })
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || 'Помилка при зміні даних');
      }

      setUpdateState({
        status: 'success',
        message: payload.message || 'Дані успішно змінено!'
      });
      setFormState(INITIAL_FORM_STATE);
      setStep('verify');
    } catch (error) {
      console.error('Помилка при зміні даних:', error);
      const message = error instanceof Error ? error.message : 'Помилка з\'єднання з сервером';
      setUpdateState({ status: 'error', message });
    }
  }, [formState.currentPassword, formState.newPassword, formState.newUsername, passwordValidationError, resetMessages]);

  const goBackToPreviousPage = useCallback(() => {
    if (step === 'update') {
      setStep('verify');
      resetMessages();
      return;
    }

    router.back();
  }, [resetMessages, router, step]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Зміна даних входу</h1>
          <p className="mt-2 text-gray-600">{STEPS_COPY[step]}</p>

          <div className="mt-4 flex justify-center">
            <div className="flex items-center space-x-3">
              <StepBadge number={1} active />
              <div className={`h-0.5 w-12 ${step === 'update' ? 'bg-blue-600' : 'bg-gray-300'}`} />
              <StepBadge number={2} active={step === 'update'} />
            </div>
          </div>
        </div>

        {step === 'verify' ? (
          <form className="space-y-4" onSubmit={handleVerifyCredentials}>
            <Alert state={verificationState} />

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="currentUsername">
                Поточний логін
              </label>
              <input
                autoComplete="username"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="currentUsername"
                name="currentUsername"
                onChange={handleInputChange}
                required
                type="text"
                value={formState.currentUsername}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="currentPassword">
                Поточний пароль
              </label>
              <input
                autoComplete="current-password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="currentPassword"
                name="currentPassword"
                onChange={handleInputChange}
                required
                type="password"
                value={formState.currentPassword}
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={goBackToPreviousPage}
                type="button"
              >
                Назад
              </button>
              <button
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? 'Перевірка...' : 'Підтвердити'}
              </button>
            </div>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleChangeData}>
            <Alert state={updateState} />

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="newUsername">
                Новий логін (за бажанням)
              </label>
              <input
                autoComplete="username"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="newUsername"
                minLength={3}
                name="newUsername"
                onChange={handleInputChange}
                placeholder="Залиште пустим, щоб не змінювати"
                type="text"
                value={formState.newUsername}
              />
              <p className="mt-1 text-xs text-gray-500">Мінімум 3 символи</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="newPassword">
                Новий пароль
              </label>
              <input
                autoComplete="new-password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="newPassword"
                minLength={8}
                name="newPassword"
                onChange={handleInputChange}
                required
                type="password"
                value={formState.newPassword}
              />
              <PasswordRequirements validationError={passwordValidationError} />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={goBackToPreviousPage}
                type="button"
              >
                Назад
              </button>
              <button
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? 'Зміна...' : 'Змінити дані'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function StepBadge({ number, active }: { number: number; active?: boolean }) {
  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
        active ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
      }`}
    >
      {number}
    </div>
  );
}

function Alert({ state }: { state: RequestState }) {
  if (state.status === 'idle') {
    return null;
  }

  const baseClasses = 'rounded px-4 py-3 text-sm';

  if (state.status === 'loading') {
    return (
      <div className={`${baseClasses} border border-blue-300 bg-blue-50 text-blue-700`}>
        Зачекайте, виконується запит...
      </div>
    );
  }

  if (state.status === 'success') {
    return (
      <div className={`${baseClasses} border border-green-400 bg-green-100 text-green-700`}>
        {state.message}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} border border-red-400 bg-red-100 text-red-700`}>
      {state.message || 'Сталася невідома помилка'}
    </div>
  );
}

function PasswordRequirements({ validationError }: { validationError: string }) {
  return (
    <div className="mt-2 space-y-1 text-xs text-gray-500">
      <p>Вимоги до пароля:</p>
      <ul className="list-disc space-y-0.5 pl-5">
        {PASSWORD_REQUIREMENTS.map(requirement => (
          <li key={requirement}>{requirement}</li>
        ))}
      </ul>
      {validationError ? <p className="text-red-600">{validationError}</p> : null}
    </div>
  );
}

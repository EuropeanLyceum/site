'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import React from 'react';
import '@/styles/login.css';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('🔄 Attempting login with:', { username, password });

    try {
      console.log('📡 Sending request to /api/auth/login...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('📡 Response received:', { 
        status: response.status, 
        statusText: response.statusText,
        ok: response.ok,
        contentType: response.headers.get('content-type')
      });

      // Перевіряємо чи відповідь JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ API повернув не JSON:', text.substring(0, 200));
        throw new Error('Сервер повернув некоректну відповідь. Перевірте консоль сервера.');
      }

      const data = await response.json();
      console.log('📄 Response data:', data);

      if (response.ok && data.success) {
        console.log('✅ Login successful, redirecting to dashboard...');
        console.log('Current URL:', window.location.href);
        console.log('Target URL:', '/dashboard');
        
        // Спробуємо кілька способів перенаправлення
        console.log('🔄 Trying window.location.replace...');
        window.location.replace('/dashboard');
        
        // Якщо не спрацює, спробуємо через router
        setTimeout(() => {
          console.log('🔄 Trying router.push as fallback...');
          router.push('/dashboard');
        }, 100);
        
        // Якщо і це не спрацює, спробуємо window.location.href
        setTimeout(() => {
          console.log('🔄 Trying window.location.href as final fallback...');
          window.location.href = '/dashboard';
        }, 200);
        
      } else {
        console.log('❌ Login failed:', data.error || 'Unknown error');
        router.push('/login?error=1');
      }
    } catch (error) {
      console.error('Login error:', error);
      router.push('/login?error=1');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="login-page">
      {/* Градієнтний фон */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'linear-gradient(135deg, #FFCB8B 0%, #D7DCE8 50%, #182AA1 100%)'
        }}
      ></div>
      
      {/* Основний контент */}
      <div className="relative z-10 login-container px-4" style={{ position: 'relative' }}>
        {/* Логотип */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <div className="login-logo-icon-inner"></div>
          </div>
                     <span className="text-white text-xl font-normal">Європейський</span>
        </div>

        {/* Заголовок */}
        <div className="login-title">
          <div>Вхід для</div>
          <div>адміністратора</div>
        </div>

        {/* Форма входу */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              Неправильний логін або пароль
            </div>
          )}
          
          {/* Поле логіну */}
          <input
            id="username"
            type="text"
            placeholder="Логін"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
          />

          {/* Поле пароля */}
          <input
            id="password"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />

          {/* Кнопка входу */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>
      </div>
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 API: Отримано запит на аутентифікацію');
    
    const { username, password } = await request.json();
    console.log('👤 API: Логін:', JSON.stringify(username));
    console.log('👤 API: Логін (довжина):', username?.length);
    console.log('🔑 API: Пароль (довжина):', password?.length);
    console.log('🔑 API: Пароль (перші символи):', password ? password.substring(0, 3) + '...' : 'пустий');

    // Валідація вхідних даних
    if (!username || !password) {
      console.log('❌ API: Відсутні логін або пароль');
      return NextResponse.json(
        { error: 'Логін та пароль обов\'язкові' },
        { status: 400 }
      );
    }

    console.log('🔍 API: Початок аутентифікації користувача...');
    
    // Аутентифікація користувача
    const user = await authenticateUser(username, password);

    if (!user) {
      console.log('❌ API: Неправильний логін або пароль');
      return NextResponse.json(
        { error: 'Неправильний логін або пароль' },
        { status: 401 }
      );
    }

    console.log('🎫 API: Створення JWT токена...');
    console.log('🔑 API: JWT_SECRET встановлено:', !!process.env.JWT_SECRET);
    console.log('🔑 API: JWT_SECRET довжина:', process.env.JWT_SECRET?.length || 0);
    
    // Створення JWT токена
    let token: string;
    try {
      token = createToken({
        userId: user.id,
        username: user.username,
        role: user.role
      });
    } catch (tokenError: any) {
      console.error('❌ API: Помилка при створенні токена:', tokenError.message);
      console.error('❌ API: JWT_SECRET:', process.env.JWT_SECRET ? 'встановлено' : 'НЕ ВСТАНОВЛЕНО');
      return NextResponse.json(
        { error: `Помилка сервера при створенні токена: ${tokenError.message}. Перевірте JWT_SECRET в env.local та перезапустіть сервер.` },
        { status: 500 }
      );
    }

    console.log('🍪 API: Встановлення токена в cookies...');

    // Створення відповіді з токеном
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

    // Встановлення JWT токена в cookies
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/', // доступний на всіх маршрутах
      maxAge: 24 * 60 * 60 // 24 години
    });

    // Короткочасний маркер, що користувач щойно авторизувався
    response.cookies.set('recent-login', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60, // 1 хвилина для доступу до dashboard після логіну
    });

    console.log('✅ API: Аутентифікація завершена успішно');
    return response;

  } catch (error) {
    console.error('Помилка аутентифікації:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}

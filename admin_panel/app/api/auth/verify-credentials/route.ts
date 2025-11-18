import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 API: Отримано запит на перевірку поточних даних');
    
    // Отримуємо токен з cookies
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      console.log('❌ API: Токен не знайдено');
      return NextResponse.json(
        { error: 'Необхідна авторизація' },
        { status: 401 }
      );
    }

    // Перевіряємо токен
    const payload = verifyToken(token);
    if (!payload) {
      console.log('❌ API: Недійсний токен');
      return NextResponse.json(
        { error: 'Недійсний токен' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const username = typeof body?.username === 'string' ? body.username.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    console.log('👤 API: Перевірка даних для користувача:', payload.username);

    // Валідація вхідних даних
    if (!username || !password) {
      console.log('❌ API: Відсутні логін або пароль');
      return NextResponse.json(
        { error: 'Логін та пароль обов\'язкові' },
        { status: 400 }
      );
    }

    // Отримуємо користувача з бази даних
    const user = await prisma.adminUser.findUnique({
      where: { id: payload.userId }
    });

    if (!user) {
      console.log('❌ API: Користувач не знайдений');
      return NextResponse.json(
        { error: 'Користувач не знайдений' },
        { status: 404 }
      );
    }

    // Перевіряємо логін
    if (user.username !== username) {
      console.log('❌ API: Неправильний логін');
      return NextResponse.json(
        { error: 'Неправильний логін' },
        { status: 400 }
      );
    }

    // Перевіряємо пароль
    console.log('🔐 API: Перевірка пароля...');
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      console.log('❌ API: Неправильний пароль');
      return NextResponse.json(
        { error: 'Неправильний пароль' },
        { status: 400 }
      );
    }

    console.log('✅ API: Поточні дані підтверджені');
    return NextResponse.json({
      success: true,
      message: 'Поточні дані підтверджені'
    });

  } catch (error) {
    console.error('❌ API: Помилка при перевірці даних:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}

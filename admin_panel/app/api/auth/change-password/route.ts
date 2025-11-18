import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, hashPassword, verifyPassword, validatePasswordStrength } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Простий rate limiting (в пам'яті) - для продакшену краще використовувати Redis
const passwordChangeAttempts = new Map<number, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5; // Максимум спроб за період
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 хвилин

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 API: Отримано запит на зміну пароля');
    
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
    const currentPassword = typeof body?.currentPassword === 'string' ? body.currentPassword : '';
    const newPassword = typeof body?.newPassword === 'string' ? body.newPassword : '';
    const rawNewUsername = typeof body?.newUsername === 'string' ? body.newUsername : undefined;
    const newUsername = rawNewUsername?.trim();
    console.log('👤 API: Зміна пароля для користувача:', payload.username);

    // Валідація вхідних даних
    if (!currentPassword || !newPassword) {
      console.log('❌ API: Відсутні обов\'язкові поля');
      return NextResponse.json(
        { error: 'Поточний пароль та новий пароль обов\'язкові' },
        { status: 400 }
      );
    }

    // Валідація нового логіну (якщо вказано)
    if (newUsername && newUsername.length < 3) {
      console.log('❌ API: Логін занадто короткий');
      return NextResponse.json(
        { error: 'Логін повинен містити мінімум 3 символи' },
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

    // Rate limiting: перевірка кількості спроб
    const now = Date.now();
    const userAttempts = passwordChangeAttempts.get(user.id);
    
    if (userAttempts) {
      // Якщо минуло достатньо часу, скидаємо лічильник
      if (now - userAttempts.lastAttempt > ATTEMPT_WINDOW) {
        passwordChangeAttempts.delete(user.id);
      } else if (userAttempts.count >= MAX_ATTEMPTS) {
        console.log(`⚠️ API: Занадто багато спроб змінити пароль для користувача ${user.id}`);
        return NextResponse.json(
          { error: `Занадто багато спроб. Спробуйте пізніше (через ${Math.ceil((ATTEMPT_WINDOW - (now - userAttempts.lastAttempt)) / 60000)} хвилин)` },
          { status: 429 }
        );
      }
    }

    // Валідація складності нового пароля
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      console.log('❌ API: Пароль не відповідає вимогам складності');
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Перевіряємо поточний пароль
    console.log('🔐 API: Перевірка поточного пароля...');
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      // Збільшуємо лічильник невдалих спроб
      const currentAttempts = passwordChangeAttempts.get(user.id) || { count: 0, lastAttempt: now };
      passwordChangeAttempts.set(user.id, {
        count: currentAttempts.count + 1,
        lastAttempt: now
      });
      
      console.log(`⚠️ API: Неправильний поточний пароль для користувача ${user.id}. Спроба ${currentAttempts.count + 1}/${MAX_ATTEMPTS}`);
      return NextResponse.json(
        { error: 'Неправильний поточний пароль' },
        { status: 400 }
      );
    }

    // Перевіряємо, що новий пароль відрізняється від поточного
    const isSamePassword = await verifyPassword(newPassword, user.password);
    if (isSamePassword) {
      console.log(`⚠️ API: Новий пароль збігається з поточним для користувача ${user.id}`);
      return NextResponse.json(
        { error: 'Новий пароль не може збігатися з поточним' },
        { status: 400 }
      );
    }

    // Перевіряємо, чи новий логін не зайнятий (якщо вказано)
    if (newUsername && newUsername !== user.username) {
      console.log('🔍 API: Перевірка доступності нового логіну...');
      const existingUser = await prisma.adminUser.findUnique({
        where: { username: newUsername }
      });
      
      if (existingUser) {
        console.log('❌ API: Логін вже зайнятий');
        return NextResponse.json(
          { error: 'Цей логін вже використовується' },
          { status: 400 }
        );
      }
    }

    // Хешуємо новий пароль
    console.log('🔐 API: Хешування нового пароля...');
    const hashedNewPassword = await hashPassword(newPassword);

    // Підготовляємо дані для оновлення
    const updateData: any = {
      password: hashedNewPassword,
      updatedAt: new Date()
    };

    // Додаємо новий логін, якщо вказано
    if (newUsername && newUsername !== user.username) {
      updateData.username = newUsername;
      console.log('👤 API: Оновлення логіну на:', newUsername);
    }

    // Оновлюємо дані в базі даних
    console.log('💾 API: Оновлення даних в базі даних...');
    await prisma.adminUser.update({
      where: { id: user.id },
      data: updateData
    });

    // Очищаємо лічильник спроб після успішної зміни
    passwordChangeAttempts.delete(user.id);
    
    console.log(`✅ API: Дані успішно оновлено для користувача ${user.id}`);
    return NextResponse.json({
      success: true,
      message: newUsername && newUsername !== user.username 
        ? 'Логін та пароль успішно змінено' 
        : 'Пароль успішно змінено'
    });

  } catch (error) {
    console.error('❌ API: Помилка при зміні пароля:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}

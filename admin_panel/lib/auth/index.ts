import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import { validatePassword, type PasswordValidationResult } from './password';
import type { JWTPayload } from './token';
import { createToken, verifyToken, getJWTSecret } from './token';

// Хешування пароля
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Перевірка пароля
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Валідація складності пароля
export function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
  const result: PasswordValidationResult = validatePassword(password);
  if (result.valid) {
    return { valid: true };
  }

  return { valid: false, error: result.error };
}

// Аутентифікація користувача
export async function authenticateUser(username: string, password: string) {
  console.log('🔍 AUTH: Пошук користувача в БД...');
  console.log('🔍 AUTH: Шукаємо username:', JSON.stringify(username), '(довжина:', username?.length, ')');
  
  const user = await prisma.adminUser.findUnique({
    where: { username }
  });

  console.log('👤 AUTH: Користувач знайдений:', user ? `так (${user.username})` : 'ні');
  if (user) {
    console.log('👤 AUTH: Знайдений username:', JSON.stringify(user.username), '(довжина:', user.username?.length, ')');
    console.log('👤 AUTH: isActive:', user.isActive);
  }

  if (!user || !user.isActive) {
    console.log('❌ AUTH: Користувач не знайдений або неактивний');
    return null;
  }

  console.log('🔐 AUTH: Перевірка пароля...');
  console.log('🔐 AUTH: Введений пароль (довжина):', password?.length);
  const isValidPassword = await verifyPassword(password, user.password);
  console.log('✅ AUTH: Пароль вірний:', isValidPassword);
  
  if (!isValidPassword) {
    console.log('❌ AUTH: Неправильний пароль');
    return null;
  }

  console.log('⏰ AUTH: Оновлення часу останнього входу...');
  
  // Оновлюємо час останнього входу
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });

  console.log('✅ AUTH: Аутентифікація успішна');

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
}

// Створення першого адміністратора
export async function createInitialAdmin() {
  const existingAdmin = await prisma.adminUser.findFirst();
  
  if (existingAdmin) {
    console.log('Адміністратор вже існує');
    return;
  }

  const hashedPassword = await hashPassword('EuropeanSchool2024!');
  
  await prisma.adminUser.create({
    data: {
      username: 'european_admin',
      password: hashedPassword,
      email: 'admin@european-school.com',
      role: 'admin',
      isActive: true
    }
  });

  console.log('Перший адміністратор створений');
  console.log('Логін: european_admin');
  console.log('Пароль: EuropeanSchool2024!');
}

export { createToken, verifyToken, getJWTSecret };
export type { JWTPayload };

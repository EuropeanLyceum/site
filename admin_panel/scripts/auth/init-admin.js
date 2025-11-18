const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createInitialAdmin() {
  try {
    // Перевіряємо чи вже є адміністратор
    const existingAdmin = await prisma.adminUser.findFirst();
    
    if (existingAdmin) {
      console.log('✅ Адміністратор вже існує');
      return;
    }

    // Хешуємо пароль
    const hashedPassword = await bcrypt.hash('EuropeanSchool2024!', 12);
    
    // Створюємо адміністратора
    await prisma.adminUser.create({
      data: {
        username: 'european_admin',
        password: hashedPassword,
        email: 'admin@european-school.com',
        role: 'admin',
        isActive: true
      }
    });

    console.log('✅ Перший адміністратор створений успішно!');
    console.log('');
    console.log('🔐 Дані для входу:');
    console.log('👤 Логін: european_admin');
    console.log('🔑 Пароль: EuropeanSchool2024!');
    console.log('');
    console.log('⚠️  ВАЖЛИВО: Змініть цей пароль після першого входу!');
    console.log('🌐 Сайт: http://localhost:3000/login');
    
  } catch (error) {
    console.error('❌ Помилка при створенні адміністратора:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createInitialAdmin();

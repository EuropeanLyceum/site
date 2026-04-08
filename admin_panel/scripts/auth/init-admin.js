const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createInitialAdmin() {
  try {
    const existingAdmin = await prisma.adminUser.findFirst();

    if (existingAdmin) {
      console.log('✅ Адміністратор вже існує');
      return;
    }

    const hashedPassword = await bcrypt.hash('EuropeanSchool2024!', 12);

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
    console.log('👤 Логін: european_admin');
    console.log('🔑 Пароль: EuropeanSchool2024!');

  } catch (error) {
    console.error('❌ Помилка при створенні адміністратора:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createInitialAdmin();
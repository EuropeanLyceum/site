const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkPassword() {
  try {
    console.log('🔍 Перевірка пароля в базі даних...');
    
    // Знаходимо адміністратора
    const admin = await prisma.adminUser.findFirst({
      where: { username: 'new' }
    });
    
    if (!admin) {
      console.log('❌ Адміністратор не знайдений');
      return;
    }

    console.log('👤 Знайдено адміністратора:', admin.username);
    console.log('📧 Email:', admin.email);
    console.log('🔐 Роль:', admin.role);
    console.log('✅ Активний:', admin.isActive);
    
    // Тестуємо різні паролі
    const testPasswords = [
      'Euro202509220034@Secure',
      '12345678',
      'EuroSchool2024@Secure'
    ];
    
    console.log('');
    console.log('🔑 Тестування паролів...');
    
    for (const password of testPasswords) {
      const isValid = await bcrypt.compare(password, admin.password);
      console.log(`Пароль "${password}": ${isValid ? '✅ ПРАВИЛЬНИЙ' : '❌ неправильний'}`);
    }
    
    console.log('');
    console.log('💡 Використовуйте пароль, який показав ✅ ПРАВИЛЬНИЙ');
    
  } catch (error) {
    console.error('❌ Помилка при перевірці:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPassword();

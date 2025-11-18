const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAdminCredentials() {
  try {
    console.log('🔍 Перевірка адміністраторів в базі даних...\n');
    
    // Знаходимо всіх адміністраторів
    const admins = await prisma.adminUser.findMany();
    
    if (admins.length === 0) {
      console.log('❌ Адміністраторів не знайдено в базі даних!');
      console.log('💡 Запустіть: node scripts/auth/init-admin.js\n');
      return;
    }

    console.log(`✅ Знайдено ${admins.length} адміністраторів:\n`);

    // Список стандартних паролів для перевірки
    const testPasswords = [
      'EuropeanSchool2024!',
      'EuropeanSchool2024',
      'EuroSchool2024!',
      'EuroSchool2024',
      'european_admin',
      'admin',
      'password',
      '12345678',
      'Euro202509220034@Secure',
      'EuroSchool2024@Secure'
    ];

    for (const admin of admins) {
      console.log('─'.repeat(60));
      console.log(`👤 Логін: ${admin.username}`);
      console.log(`📧 Email: ${admin.email || 'не вказано'}`);
      console.log(`🔐 Роль: ${admin.role}`);
      console.log(`✅ Активний: ${admin.isActive ? 'Так' : 'НІ'}`);
      console.log(`📅 Створено: ${admin.createdAt}`);
      console.log(`🕐 Останній вхід: ${admin.lastLogin || 'ніколи'}`);
      console.log('');
      
      console.log('🔑 Тестування стандартних паролів:');
      let foundPassword = false;
      
      for (const password of testPasswords) {
        try {
          const isValid = await bcrypt.compare(password, admin.password);
          if (isValid) {
            console.log(`   ✅ ПРАВИЛЬНИЙ: "${password}"`);
            foundPassword = true;
          }
        } catch (error) {
          // Ігноруємо помилки порівняння
        }
      }
      
      if (!foundPassword) {
        console.log('   ❌ Жоден з тестових паролів не підійшов');
        console.log('   💡 Пароль був змінений або не відповідає стандартним');
      }
      
      console.log('');
    }

    console.log('─'.repeat(60));
    console.log('\n💡 Якщо пароль не знайдено:');
    console.log('   1. Перевірте, чи ви вводите правильний логін');
    console.log('   2. Можливо пароль був змінений через /change-password');
    console.log('   3. Можна скинути пароль через базу даних або створити нового адміна\n');
    
  } catch (error) {
    console.error('❌ Помилка при перевірці:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminCredentials();

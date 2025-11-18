const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🔍 Тестування входу...\n');
    
    // Знаходимо адміністратора
    const admin = await prisma.adminUser.findFirst({
      where: { username: 'new' }
    });
    
    if (!admin) {
      console.log('❌ Адміністратор з логіном "new" не знайдений!');
      const allAdmins = await prisma.adminUser.findMany();
      console.log(`\nЗнайдено ${allAdmins.length} адміністраторів:`);
      allAdmins.forEach(a => console.log(`  - Логін: "${a.username}"`));
      return;
    }

    console.log(`✅ Знайдено адміністратора: ${admin.username}`);
    console.log(`📧 Email: ${admin.email}`);
    console.log(`✅ Активний: ${admin.isActive}`);
    console.log(`🔐 Хеш пароля: ${admin.password.substring(0, 20)}...`);
    console.log('');

    // Тестуємо різні варіанти пароля
    const testPasswords = [
      '12345678',
      ' 12345678',  // з пробілом на початку
      '12345678 ',  // з пробілом в кінці
      ' 12345678 ', // з пробілами
      '12345678\n', // з переносом рядка
    ];

    console.log('🔑 Тестування паролів:');
    for (const password of testPasswords) {
      try {
        const isValid = await bcrypt.compare(password, admin.password);
        console.log(`   "${password.replace(/\s/g, '·')}" (довжина: ${password.length}): ${isValid ? '✅ ПРАВИЛЬНИЙ' : '❌ неправильний'}`);
      } catch (error) {
        console.log(`   "${password}": ❌ Помилка: ${error.message}`);
      }
    }

    console.log('\n📝 Симуляція процесу входу:');
    console.log('1. Користувач вводить: username="new", password="12345678"');
    
    // Симулюємо authenticateUser
    const inputUsername = 'new';
    const inputPassword = '12345678';
    
    console.log(`2. Пошук користувача з username="${inputUsername}"...`);
    const user = await prisma.adminUser.findUnique({
      where: { username: inputUsername }
    });
    
    if (!user) {
      console.log('   ❌ Користувач не знайдений!');
      return;
    }
    
    console.log(`   ✅ Користувач знайдений: ${user.username}`);
    console.log(`   ✅ Активний: ${user.isActive}`);
    
    console.log(`3. Перевірка пароля...`);
    const isValidPassword = await bcrypt.compare(inputPassword, user.password);
    console.log(`   Результат: ${isValidPassword ? '✅ ПРАВИЛЬНИЙ' : '❌ НЕПРАВИЛЬНИЙ'}`);
    
    if (!isValidPassword) {
      console.log('\n⚠️  ПРОБЛЕМА: Пароль не співпадає!');
      console.log('   Можливі причини:');
      console.log('   - Пароль був змінений');
      console.log('   - Проблема з кодуванням символів');
      console.log('   - Проблема в коді аутентифікації');
    } else {
      console.log('\n✅ Все працює правильно! Пароль вірний.');
    }
    
  } catch (error) {
    console.error('❌ Помилка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();



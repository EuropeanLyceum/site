const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    const username = process.argv[2] || 'new';
    const newPassword = process.argv[3] || '12345678';
    
    console.log('🔐 Скидання пароля...\n');
    console.log(`👤 Логін: ${username}`);
    console.log(`🔑 Новий пароль: ${newPassword}\n`);
    
    // Знаходимо користувача
    const user = await prisma.adminUser.findUnique({
      where: { username }
    });
    
    if (!user) {
      console.log(`❌ Користувач з логіном "${username}" не знайдений!`);
      const allAdmins = await prisma.adminUser.findMany();
      console.log(`\nЗнайдено ${allAdmins.length} адміністраторів:`);
      allAdmins.forEach(a => console.log(`  - Логін: "${a.username}"`));
      return;
    }
    
    // Хешуємо новий пароль
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Оновлюємо пароль
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Пароль успішно скинуто!');
    console.log(`\n🔐 Дані для входу:`);
    console.log(`👤 Логін: ${username}`);
    console.log(`🔑 Пароль: ${newPassword}\n`);
    
  } catch (error) {
    console.error('❌ Помилка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();



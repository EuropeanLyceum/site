// Перевірка змінних оточення
console.log('🔍 Перевірка змінних оточення:\n');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Встановлено' : '❌ НЕ ВСТАНОВЛЕНО');
console.log('JWT_SECRET значення:', process.env.JWT_SECRET || '(порожньо)');
console.log('JWT_SECRET довжина:', process.env.JWT_SECRET?.length || 0);
console.log('\nІнші змінні:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅' : '❌');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅' : '❌');



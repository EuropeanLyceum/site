const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const initialCategories = [
  { name: 'Адміністрація', order: 1 },
  { name: 'Початкових класів', order: 2 },
  { name: 'Гуманітарних та суспільних дисциплін', order: 3 },
  { name: 'Іноземних мов', order: 4 },
  { name: 'Точних та природничих наук', order: 5 },
  { name: 'Виховної роботи', order: 6 },
  { name: 'Фізичної культури, ЗУ та трудового навчання', order: 7 },
  { name: 'Ресурсний інформаційно-методичний центр', order: 8 },
  { name: 'Обслуговуючий персонал', order: 9 },
  { name: 'Майстри педагогічної ниви', order: 10 }
];

async function initCategories() {
  try {
    console.log('🚀 Початок ініціалізації категорій персоналу...');
    
    // Перевіряємо чи вже є категорії
    const existingCategories = await prisma.staffCategory.findMany();
    
    if (existingCategories.length > 0) {
      console.log('ℹ️ Категорії вже існують, пропускаємо ініціалізацію');
      return;
    }
    
    // Створюємо категорії
    for (const category of initialCategories) {
      await prisma.staffCategory.create({
        data: category
      });
      console.log(`✅ Створено категорію: ${category.name}`);
    }
    
    console.log('🎉 Всі категорії успішно створені!');
  } catch (error) {
    console.error('❌ Помилка ініціалізації категорій:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initCategories();

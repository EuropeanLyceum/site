import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Файл не надано' }, { status: 400 });
    }

    // Перевіряємо тип файлу
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Тільки зображення дозволені' }, { status: 400 });
    }

    // Перевіряємо розмір файлу (максимум 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Файл занадто великий. Максимальний розмір: 5MB' }, { status: 400 });
    }

    console.log('📤 Завантаження файлу:', file.name, 'розмір:', file.size, 'тип:', file.type);

    // Створюємо папку uploads якщо її немає
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
      console.log('📁 Створено папку uploads');
    }

    // Генеруємо унікальне ім'я файлу
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Конвертуємо File в Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Зберігаємо файл
    await writeFile(filePath, buffer);
    console.log('💾 Файл збережено:', filePath);
    
    // Перевіряємо, чи файл дійсно існує
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log('✅ Файл існує, розмір:', stats.size, 'байт');
      
      // Додаткова перевірка - читаємо файл назад
      const readBuffer = fs.readFileSync(filePath);
      console.log('📖 Файл прочитано назад, розмір:', readBuffer.length, 'байт');
      
      if (buffer.length !== readBuffer.length) {
        console.error('⚠️ Розмір збереженого файлу не співпадає з оригіналом!');
      }
    } else {
      console.error('❌ Файл не знайдено після збереження!');
    }

    // Повертаємо URL для доступу до файлу через API
    const fileUrl = `/api/images/${fileName}`;
    
    console.log('✅ Файл успішно завантажено:', fileUrl);
    console.log('📁 Повний шлях до файлу:', filePath);
    console.log('🌐 URL для браузера:', fileUrl);
    
    return NextResponse.json({ 
      url: fileUrl,
      fileName: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type
    });
  } catch (err) {
    console.error('❌ Помилка завантаження файлу:', err);
    return NextResponse.json(
      { error: 'Помилка при завантаженні файлу', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

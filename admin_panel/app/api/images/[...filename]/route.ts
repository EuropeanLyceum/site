import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  try {
    const awaitedParams = await params;
    if (!awaitedParams.filename || awaitedParams.filename.length === 0) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const filename = awaitedParams.filename.join('/');
    const filePath = join(process.cwd(), 'public', 'uploads', filename);

    console.log('🖼️ Запит зображення:', filename);
    console.log('🔍 Повний шлях:', filePath);

    // Перевіряємо, чи файл існує
    if (!existsSync(filePath)) {
      console.error('❌ Файл не знайдено:', filePath);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Читаємо файл синхронно для кращої надійності
    const fs = require('fs');
    const fileBuffer = fs.readFileSync(filePath);
    const stats = fs.statSync(filePath);
    
    // Визначаємо MIME тип на основі розширення
    const ext = filename.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
    }

    console.log('✅ Зображення успішно прочитано:', filename, 'розмір:', stats.size, 'тип:', contentType);
    console.log('📤 Відправка заголовків:', {
      'Content-Type': contentType,
      'Content-Length': stats.size.toString(),
      'Cache-Control': 'public, max-age=31536000'
    });

    // Повертаємо файл з правильними заголовками
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Кешуємо на рік
        'Content-Length': stats.size.toString(),
      },
    });
  } catch (error) {
    console.error('❌ Помилка читання зображення:', error);
    return NextResponse.json(
      { error: 'Failed to read image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

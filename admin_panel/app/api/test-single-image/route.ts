import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ error: 'Папка uploads не існує' }, { status: 404 });
    }
    
    const fs = require('fs');
    const files = fs.readdirSync(uploadsDir);
    const imageFiles = files.filter((file: string) => 
      file !== '.gitkeep' && 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    
    if (imageFiles.length === 0) {
      return NextResponse.json({ 
        message: 'Немає зображень для тестування',
        uploadsDir,
        files: files
      });
    }
    
    // Беремо перше зображення для тесту
    const testFile = imageFiles[0];
    const filePath = join(uploadsDir, testFile);
    
    console.log('🧪 Тестування зображення:', testFile);
    console.log('🔍 Повний шлях:', filePath);
    
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const stats = fs.statSync(filePath);
      
      // Визначаємо MIME тип
      const ext = testFile.split('.').pop()?.toLowerCase();
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
      
      console.log('✅ Зображення прочитано:', testFile, 'розмір:', stats.size, 'тип:', contentType);
      
      // Повертаємо зображення
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000',
          'Content-Length': stats.size.toString(),
        },
      });
    } catch (readError) {
      console.error('❌ Помилка читання файлу:', readError);
      return NextResponse.json({
        error: 'Помилка читання файлу',
        testFile,
        readError: readError instanceof Error ? readError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ Помилка тестування:', error);
    return NextResponse.json({
      error: 'Помилка тестування',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

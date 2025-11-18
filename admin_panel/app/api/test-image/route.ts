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
    
    const files = await readdir(uploadsDir);
    const imageFiles = files.filter(file => 
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
    
    try {
      const fileBuffer = await readFile(filePath);
      const stats = await stat(filePath);
      
      return NextResponse.json({
        message: 'Тест зображення успішний',
        testFile,
        fileSize: stats.size,
        bufferSize: fileBuffer.length,
        uploadsDir,
        allFiles: files
      });
    } catch (readError) {
      return NextResponse.json({
        error: 'Помилка читання тестового файлу',
        testFile,
        readError: readError instanceof Error ? readError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      error: 'Помилка тестування',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function readdir(dir: string): Promise<string[]> {
  const fs = require('fs').promises;
  return await fs.readdir(dir);
}

async function stat(file: string) {
  const fs = require('fs').promises;
  return await fs.stat(file);
}

import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    console.log('🔍 Перевірка папки uploads:', uploadsDir);
    
    if (!existsSync(uploadsDir)) {
      console.log('❌ Папка uploads не існує');
      return NextResponse.json({
        error: 'Папка uploads не існує',
        uploadsDir,
        exists: false
      });
    }
    
    const files = await readdir(uploadsDir);
    console.log('📁 Файли в папці uploads:', files);
    
    const fileStats = await Promise.all(
      files.map(async (fileName) => {
        if (fileName === '.gitkeep') return null;
        const filePath = join(uploadsDir, fileName);
        const stats = await stat(filePath);
                 return {
           name: fileName,
           size: stats.size,
           created: stats.birthtime,
           modified: stats.mtime,
           path: filePath,
           url: `/api/images/${fileName}`,
           directUrl: `/uploads/${fileName}`
         };
      })
    );
    
    const validFiles = fileStats.filter(Boolean);
    
    return NextResponse.json({
      message: 'Debug інформація про uploads',
      uploadsDir,
      exists: true,
      totalFiles: validFiles.length,
      files: validFiles,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Помилка debug:', error);
    return NextResponse.json({
      error: 'Помилка debug',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const schoolHistory = await prisma.schoolHistory.findMany({
      orderBy: { createdAt: 'asc' }
    });
    
    // Парсимо photoUrls з JSON рядка в масив
    const parsedHistory = schoolHistory.map(item => ({
      ...item,
      photoUrls: item.photoUrls ? JSON.parse(item.photoUrls) : []
    }));
    
    return NextResponse.json(parsedHistory);
  } catch (error) {
    console.error('Error fetching school history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch school history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📥 POST запит для school history:', body);
    
    const { title, content, titleEn, contentEn, photoUrls } = body;
    
    // Валідація - принаймні одне поле має бути заповнене
    const hasTitle = title && title.trim() !== '';
    const hasContent = content && content.trim() !== '';
    const hasTitleEn = titleEn && titleEn.trim() !== '';
    const hasContentEn = contentEn && contentEn.trim() !== '';
    const hasPhotos = photoUrls && photoUrls.length > 0;
    
    if (!hasTitle && !hasContent && !hasTitleEn && !hasContentEn && !hasPhotos) {
      console.error('❌ Відсутні всі поля:', { title, content, titleEn, contentEn, photoUrls });
      return NextResponse.json(
        { error: 'At least one field must be provided: title, content, titleEn, contentEn, or photoUrls' },
        { status: 400 }
      );
    }

    console.log('💾 Створення нового запису:', { title, content, titleEn, contentEn, photoUrls });

    // Конвертуємо масив photoUrls в JSON рядок
    const photoUrlsJson = photoUrls && Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';

    const schoolHistory = await prisma.schoolHistory.create({
      data: {
        title: title && title.trim() !== '' ? title.trim() : null,
        content: content && content.trim() !== '' ? content.trim() : null,
        titleEn: titleEn && titleEn.trim() !== '' ? titleEn.trim() : null,
        contentEn: contentEn && contentEn.trim() !== '' ? contentEn.trim() : null,
        photoUrls: photoUrlsJson,
      } as any,
    });

    console.log('✅ Успішно створено:', schoolHistory);
    
    // Повертаємо з парсеними photoUrls
    const response = {
      ...schoolHistory,
      photoUrls: JSON.parse(schoolHistory.photoUrls)
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Помилка створення school history:', error);
    
    if (error instanceof Error) {
      console.error('📋 Деталі помилки:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create school history',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


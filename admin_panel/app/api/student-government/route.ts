import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 GET /api/student-government - початок виконання');
    
    const items = await prisma.studentGovernment.findMany({
      orderBy: { createdAt: 'desc' },
    });

    console.log('📊 Отримано записів з БД:', items.length);

    // Конвертуємо JSON рядок назад в масив для кожного запису
    const itemsWithParsedPhotos = items.map(item => {
      try {
        return {
          ...item,
          photoUrls: item.photoUrls ? JSON.parse(item.photoUrls) : []
        };
      } catch (error) {
        console.error('❌ Помилка парсингу photoUrls для запису', item.id, error);
        return {
          ...item,
          photoUrls: []
        };
      }
    });

    console.log('✅ Повертаємо записи:', itemsWithParsedPhotos.length);
    return NextResponse.json(itemsWithParsedPhotos);
  } catch (error) {
    console.error('❌ Error fetching student-government:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student-government', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/student-government - початок виконання');
    console.log('📋 Headers:', Object.fromEntries(request.headers.entries()));
    
    const body = await request.json();
    console.log('📦 Отримані дані:', JSON.stringify(body, null, 2));
    
    const { heading, description, headingEn, descriptionEn, photoUrls, imagePosition } = body;

    console.log('Extracted fields:', { heading, description, headingEn, descriptionEn, photoUrls, imagePosition });

    // Валідація даних - принаймні одне поле має бути заповнене
    const hasHeading = heading && heading.trim() !== '';
    const hasDescription = description && description.trim() !== '';
    const hasHeadingEn = headingEn && headingEn.trim() !== '';
    const hasDescriptionEn = descriptionEn && descriptionEn.trim() !== '';
    const hasPhotos = photoUrls && photoUrls.length > 0;
    
    if (!hasHeading && !hasDescription && !hasHeadingEn && !hasDescriptionEn && !hasPhotos) {
      console.log('❌ Відсутні всі поля');
      return NextResponse.json(
        { 
          error: 'At least one field must be provided: heading, description, headingEn, descriptionEn, or photoUrls',
          received: { heading, description, headingEn, descriptionEn, photoUrls, imagePosition }
        },
        { status: 400 }
      );
    }

    // Конвертуємо масив photoUrls в JSON рядок для збереження
    const photoUrlsString = Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';
    const position = imagePosition || 'center';
    console.log('🖼️ Конвертовані photoUrls:', photoUrlsString);
    console.log('📍 Позиція фото:', position);

    console.log('💾 Зберігаємо в БД...');
    const item = await prisma.studentGovernment.create({
      data: {
        heading: heading || '',
        description: description || '',
        headingEn: headingEn || null,
        descriptionEn: descriptionEn || null,
        photoUrls: photoUrlsString,
        imagePosition: position,
        publicationDate: new Date(),
      } as any,
    });

    console.log('✅ Запис створено:', item.id);

    // Повертаємо запис з розпарсеними photoUrls
    const result = {
      ...item,
      photoUrls: JSON.parse(item.photoUrls)
    };
    
    console.log('📤 Повертаємо результат:', JSON.stringify(result, null, 2));
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Error creating student-government:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Повертаємо детальну помилку
    const errorResponse = {
      error: 'Failed to create student-government',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    };
    
    console.log('📤 Повертаємо помилку:', JSON.stringify(errorResponse, null, 2));
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

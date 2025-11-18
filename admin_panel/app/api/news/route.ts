import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 GET /api/news - початок виконання');
    
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });

    console.log('📊 Отримано новин з БД:', news.length);

    // Конвертуємо JSON рядок назад в масив для кожного запису
    const newsWithParsedPhotos = news.map(item => {
      try {
        return {
          ...item,
          photoUrls: item.photoUrls ? JSON.parse(item.photoUrls) : []
        };
      } catch (error) {
        console.error('❌ Помилка парсингу photoUrls для новини', item.id, error);
        return {
          ...item,
          photoUrls: []
        };
      }
    });

    console.log('✅ Повертаємо новини:', newsWithParsedPhotos.length);
    
    // Додаємо CORS заголовки явно
    const response = NextResponse.json(newsWithParsedPhotos);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  } catch (error) {
    console.error('❌ Error fetching news:', error);
    
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch news', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    
    // Додаємо CORS заголовки для помилки
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return errorResponse;
  }
}

// Додаємо OPTIONS метод для CORS preflight запитів
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/news - початок виконання');
    console.log('📋 Headers:', Object.fromEntries(request.headers.entries()));
    
    const body = await request.json();
    console.log('📦 Отримані дані:', JSON.stringify(body, null, 2));
    
    const { heading, description, headingEn, descriptionEn, photoUrls, imagePosition } = body;

    // Валідація даних - принаймні одне поле має бути заповнене
    const hasHeading = heading && heading.trim() !== '';
    const hasDescription = description && description.trim() !== '';
    const hasHeadingEn = headingEn && headingEn.trim() !== '';
    const hasDescriptionEn = descriptionEn && descriptionEn.trim() !== '';
    const hasPhotos = photoUrls && photoUrls.length > 0;
    
    if (!hasHeading && !hasDescription && !hasHeadingEn && !hasDescriptionEn && !hasPhotos) {
      console.log('❌ Відсутні всі поля');
      const errorResponse = NextResponse.json(
        { 
          error: 'At least one field must be provided: heading, description, headingEn, descriptionEn, or photoUrls',
          received: { heading, description, headingEn, descriptionEn, photoUrls }
        },
        { status: 400 }
      );
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return errorResponse;
    }

    // Конвертуємо масив photoUrls в JSON рядок для збереження
    const photoUrlsString = Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';
    console.log('🖼️ Конвертовані photoUrls:', photoUrlsString);

    console.log('💾 Зберігаємо в БД...');
    const news = await prisma.news.create({
      data: {
        heading: heading || '',
        description: description || '',
        headingEn: headingEn || null,
        descriptionEn: descriptionEn || null,
        photoUrls: photoUrlsString,
        publicationDate: new Date(),
        imagePosition: imagePosition || 'center',
      } as any,
    });

    console.log('✅ Новину створено:', news.id);

    // Повертаємо новину з розпарсеними photoUrls
    const result = {
      ...news,
      photoUrls: JSON.parse(news.photoUrls)
    };
    
    console.log('📤 Повертаємо результат:', JSON.stringify(result, null, 2));
    
    const response = NextResponse.json(result);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  } catch (error) {
    console.error('❌ Error creating news:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Повертаємо детальну помилку
    const errorResponse = NextResponse.json({
      error: 'Failed to create news',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
    
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    console.log('📤 Повертаємо помилку:', JSON.stringify(errorResponse, null, 2));
    return errorResponse;
  }
}

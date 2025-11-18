import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 GET /api/clubs-studios - початок виконання');
    
    const clubsStudios = await prisma.clubsStudios.findMany({
      orderBy: { createdAt: 'desc' },
    });

    console.log('📊 Отримано записів з БД:', clubsStudios.length);

    // Конвертуємо JSON рядок назад в масив для кожного запису
    const clubsStudiosWithParsedPhotos = clubsStudios.map(item => {
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

    console.log('✅ Повертаємо записи:', clubsStudiosWithParsedPhotos.length);
    
    // Додаємо CORS заголовки
    const response = NextResponse.json(clubsStudiosWithParsedPhotos);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
  } catch (error) {
    console.error('❌ Error fetching clubs studios:', error);
    
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch clubs studios', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    
    // Додаємо CORS заголовки для помилки
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return errorResponse;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/clubs-studios - початок виконання');
    
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
      
      const errorResponse = NextResponse.json(
        { 
          error: 'At least one field must be provided: heading, description, headingEn, descriptionEn, or photoUrls',
          received: { heading, description, headingEn, descriptionEn, photoUrls, imagePosition }
        },
        { status: 400 }
      );
      
      // Додаємо CORS заголовки для помилки
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      
      return errorResponse;
    }

    // Конвертуємо масив photoUrls в JSON рядок для збереження
    const photoUrlsString = Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';
    console.log('🖼️ Конвертовані photoUrls:', photoUrlsString);

    console.log('💾 Зберігаємо в БД...');
    
    // Підготовлюємо дані для збереження
    const data: any = {
      heading: heading || '',
      description: description || '',
      headingEn: headingEn || null,
      descriptionEn: descriptionEn || null,
      photoUrls: photoUrlsString,
      publicationDate: new Date(),
    };

    // Додаємо imagePosition тільки якщо є фото
    if (photoUrls && photoUrls.length > 0) {
      data.imagePosition = imagePosition || 'center';
    }

    const clubsStudios = await prisma.clubsStudios.create({ data });

    console.log('✅ Запис створено:', clubsStudios.id);

    // Повертаємо запис з розпарсеними photoUrls
    const result = {
      ...clubsStudios,
      photoUrls: JSON.parse(clubsStudios.photoUrls)
    };
    
    console.log('📤 Повертаємо результат:', JSON.stringify(result, null, 2));
    
    const response = NextResponse.json(result);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
  } catch (error) {
    console.error('❌ Error creating clubs studios:', error);
    
    const errorResponse = NextResponse.json(
      { error: 'Failed to create clubs studios', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    
    // Додаємо CORS заголовки для помилки
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return errorResponse;
  }
}

// Додаємо OPTIONS метод для CORS preflight запитів
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

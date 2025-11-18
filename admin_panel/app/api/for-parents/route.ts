import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 GET /api/for-parents - початок виконання');
    
    const forParents = await prisma.forParents.findMany({
      orderBy: { createdAt: 'asc' }
    });

    console.log('📊 Отримано записів з БД:', forParents.length);

    // Конвертуємо JSON рядок назад в масив для кожного запису
    const forParentsWithParsedPhotos = forParents.map(item => {
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

    console.log('✅ Повертаємо записи:', forParentsWithParsedPhotos.length);
    return NextResponse.json(forParentsWithParsedPhotos);
  } catch (error) {
    console.error('❌ Error fetching for-parents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch for-parents', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/for-parents - початок виконання');
    console.log('📋 Headers:', Object.fromEntries(request.headers.entries()));
    
    const body = await request.json();
    console.log('📦 Отримані дані:', JSON.stringify(body, null, 2));
    
    const { heading, content, url, photoUrls, headingEn, contentEn } = body;

    // Валідація даних: принаймні одне з полів має бути заповнене
    const hasHeading = heading && heading.trim() !== '';
    const hasContent = content && content.trim() !== '';
    const hasUrl = url && url.trim() !== '';
    const hasPhotoUrls = photoUrls && photoUrls.length > 0;
    const hasHeadingEn = headingEn && headingEn.trim() !== '';
    const hasContentEn = contentEn && contentEn.trim() !== '';
    
    if (!hasHeading && !hasContent && !hasUrl && !hasPhotoUrls && !hasHeadingEn && !hasContentEn) {
      console.log('❌ Всі поля порожні');
      return NextResponse.json(
        { 
          error: 'At least one field must be filled: heading, content, url, photoUrls, headingEn, or contentEn',
          received: { heading, content, url, photoUrls, headingEn, contentEn }
        },
        { status: 400 }
      );
    }

    // Конвертуємо масив photoUrls в JSON рядок для збереження
    const photoUrlsString = Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';
    console.log('🖼️ Конвертовані photoUrls:', photoUrlsString);

    console.log('💾 Зберігаємо в БД...');
    const forParentsItem = await prisma.forParents.create({
      data: {
        heading: heading?.trim() || null,
        content: content?.trim() || null,
        url: url?.trim() || null,
        photoUrls: photoUrlsString,
        headingEn: headingEn?.trim() || null,
        contentEn: contentEn?.trim() || null,
        publicationDate: new Date(),
      } as any,
    });

    console.log('✅ Запис створено:', forParentsItem.id);

    // Повертаємо запис з розпарсеними photoUrls
    const result = {
      ...forParentsItem,
      photoUrls: JSON.parse(forParentsItem.photoUrls)
    };
    
    console.log('📤 Повертаємо результат:', JSON.stringify(result, null, 2));
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Error creating for-parents:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Повертаємо детальну помилку
    const errorResponse = {
      error: 'Failed to create for-parents',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    };
    
    console.log('📤 Повертаємо помилку:', JSON.stringify(errorResponse, null, 2));
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

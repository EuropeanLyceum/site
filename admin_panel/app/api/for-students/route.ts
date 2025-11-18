import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 GET /api/for-students - початок виконання');
    
    const forStudents = await prisma.forStudents.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log('📊 Отримано записів з БД:', forStudents.length);

    // Конвертуємо JSON рядок назад в масив для кожного запису
    const forStudentsWithParsedPhotos = forStudents.map(item => {
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

    console.log('✅ Повертаємо записи:', forStudentsWithParsedPhotos.length);
    return NextResponse.json(forStudentsWithParsedPhotos);
  } catch (error) {
    console.error('❌ Error fetching for-students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch for-students', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/for-students - початок виконання');
    console.log('📋 Headers:', Object.fromEntries(request.headers.entries()));
    
    const body = await request.json();
    console.log('📦 Отримані дані:', JSON.stringify(body, null, 2));
    
    const { heading, content, textOnly, url, photoUrls, headingEn, contentEn, textOnlyEn } = body;

    // Валідація даних: принаймні одне з полів має бути заповнене
    const hasHeading = heading && heading.trim() !== '';
    const hasContent = content && content.trim() !== '';
    const hasTextOnly = textOnly && textOnly.trim() !== '';
    const hasUrl = url && url.trim() !== '';
    const hasPhotoUrls = photoUrls && photoUrls.length > 0;
    const hasHeadingEn = headingEn && headingEn.trim() !== '';
    const hasContentEn = contentEn && contentEn.trim() !== '';
    const hasTextOnlyEn = textOnlyEn && textOnlyEn.trim() !== '';
    
    if (!hasHeading && !hasContent && !hasTextOnly && !hasUrl && !hasPhotoUrls && !hasHeadingEn && !hasContentEn && !hasTextOnlyEn) {
      console.log('❌ Всі поля порожні');
      return NextResponse.json(
        { 
          error: 'At least one field must be filled: heading, content, textOnly, url, photoUrls, headingEn, contentEn, or textOnlyEn',
          received: { heading, content, textOnly, url, photoUrls, headingEn, contentEn, textOnlyEn }
        },
        { status: 400 }
      );
    }

    // Конвертуємо масив photoUrls в JSON рядок для збереження
    const photoUrlsString = Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';
    console.log('🖼️ Конвертовані photoUrls:', photoUrlsString);

    console.log('💾 Зберігаємо в БД...');
    const forStudentsItem = await prisma.forStudents.create({
      data: {
        heading: heading?.trim() || null,
        content: content?.trim() || null,
        textOnly: textOnly?.trim() || null,
        url: url?.trim() || null,
        photoUrls: photoUrlsString,
        headingEn: headingEn?.trim() || null,
        contentEn: contentEn?.trim() || null,
        textOnlyEn: textOnlyEn?.trim() || null,
        publicationDate: new Date(),
      } as any,
    });

    console.log('✅ Запис створено:', forStudentsItem.id);

    // Повертаємо запис з розпарсеними photoUrls
    const result = {
      ...forStudentsItem,
      photoUrls: JSON.parse(forStudentsItem.photoUrls)
    };
    
    console.log('📤 Повертаємо результат:', JSON.stringify(result, null, 2));
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Error creating for-students:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Повертаємо детальну помилку
    const errorResponse = {
      error: 'Failed to create for-students',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    };
    
    console.log('📤 Повертаємо помилку:', JSON.stringify(errorResponse, null, 2));
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

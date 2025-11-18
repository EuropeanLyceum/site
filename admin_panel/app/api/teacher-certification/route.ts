import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('🔍 GET /api/teacher-certification - початок виконання');
    
    const items = await prisma.teacherCertification.findMany({
      orderBy: [
        { publicationDate: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    console.log('📊 Отримано записів з БД:', items.length);

    // Конвертуємо JSON рядок назад в масив для кожного запису
    const itemsWithParsedPhotos = items.map(item => {
      try {
        let parsedPhotoUrls = [];
        
        if (item.photoUrls) {
          if (typeof item.photoUrls === 'string') {
            // Якщо це рядок, парсимо його
            parsedPhotoUrls = JSON.parse(item.photoUrls);
          } else if (Array.isArray(item.photoUrls)) {
            // Якщо це вже масив, використовуємо як є
            parsedPhotoUrls = item.photoUrls;
          }
        }
        
        console.log(`📸 Запис ${item.id}: photoUrls = "${item.photoUrls}" (тип: ${typeof item.photoUrls}) -> парсований:`, parsedPhotoUrls);
        
        return {
          ...item,
          photoUrls: parsedPhotoUrls
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
    console.error('❌ Error fetching teacher certification items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/teacher-certification - початок виконання');
    console.log('📋 Headers:', Object.fromEntries(request.headers.entries()));
    
    const body = await request.json();
    console.log('📦 Отримані дані:', JSON.stringify(body, null, 2));
    
    const { heading, description, text, url, linkText, headingEn, descriptionEn, textEn, linkTextEn } = body;

    // Валідація - принаймні одне поле має бути заповнене
    const hasHeading = heading && heading.trim() !== '';
    const hasDescription = description && description.trim() !== '';
    const hasText = text && text.trim() !== '';
    const hasUrl = url && url.trim() !== '';
    const hasLinkText = linkText && linkText.trim() !== '';
    const hasHeadingEn = headingEn && headingEn.trim() !== '';
    const hasDescriptionEn = descriptionEn && descriptionEn.trim() !== '';
    const hasTextEn = textEn && textEn.trim() !== '';
    const hasLinkTextEn = linkTextEn && linkTextEn.trim() !== '';
    
    if (!hasHeading && !hasDescription && !hasText && !hasUrl && !hasLinkText && !hasHeadingEn && !hasDescriptionEn && !hasTextEn && !hasLinkTextEn) {
      console.log('❌ Відсутні обов\'язкові поля');
      return NextResponse.json(
        { error: 'At least one field must be provided: heading, description, text, url, linkText, headingEn, descriptionEn, textEn, or linkTextEn' },
        { status: 400 }
      );
    }

    // Конвертуємо масив photoUrls в JSON рядок для збереження
    const photoUrlsString = Array.isArray(body.photoUrls) ? JSON.stringify(body.photoUrls) : '[]';
    console.log('🖼️ Конвертовані photoUrls:', photoUrlsString);

    console.log('💾 Зберігаємо в БД...');
    // Створюємо новий запис
    const data: any = {
      heading: heading?.trim() || '',
      description: description?.trim() || '',
      text: text?.trim() || null,
      url: url?.trim() || null,
      linkText: linkText?.trim() || null,
      headingEn: headingEn?.trim() || null,
      descriptionEn: descriptionEn?.trim() || null,
      textEn: textEn?.trim() || null,
      linkTextEn: linkTextEn?.trim() || null,
      photoUrls: photoUrlsString,
      publicationDate: body.publicationDate ? new Date(body.publicationDate) : new Date()
    };

    // Додаємо imagePosition тільки якщо є фото
    if (body.photoUrls && body.photoUrls.length > 0) {
      data.imagePosition = body.imagePosition || 'center';
    }

    const newItem = await prisma.teacherCertification.create({ data });

    console.log('✅ Запис створено:', newItem.id);

    // Повертаємо запис з розпарсеними photoUrls
    const result = {
      ...newItem,
      photoUrls: JSON.parse(newItem.photoUrls)
    };
    
    console.log('📤 Повертаємо результат:', JSON.stringify(result, null, 2));
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating teacher certification item:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Повертаємо детальну помилку
    const errorResponse = {
      error: 'Failed to create item',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    };
    
    console.log('📤 Повертаємо помилку:', JSON.stringify(errorResponse, null, 2));
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

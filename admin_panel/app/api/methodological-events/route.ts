import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 GET /api/methodological-events - початок виконання');
    
    const events = await prisma.methodologicalEvents.findMany({
      orderBy: { createdAt: 'desc' },
    });

    console.log('📊 Отримано методичних заходів з БД:', events.length);

    // Конвертуємо JSON рядок назад в масив для кожного запису
    const eventsWithParsedPhotos = events.map(item => {
      try {
        return {
          ...item,
          photoUrls: item.photoUrls ? JSON.parse(item.photoUrls) : [],
          imagePosition: item.imagePosition || 'center'
        };
      } catch (error) {
        console.error('❌ Помилка парсингу photoUrls для методичного заходу', item.id, error);
        return {
          ...item,
          photoUrls: [],
          imagePosition: item.imagePosition || 'center'
        };
      }
    });

    console.log('✅ Повертаємо методичні заходи:', eventsWithParsedPhotos.length);
    return NextResponse.json(eventsWithParsedPhotos);
  } catch (error) {
    console.error('❌ Error fetching methodological events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch methodological events', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/methodological-events - початок виконання');
    console.log('📋 Headers:', Object.fromEntries(request.headers.entries()));
    
    const body = await request.json();
    console.log('📦 Отримані дані:', JSON.stringify(body, null, 2));
    
    const { heading, description, photoUrls, imagePosition = 'center', headingEn, descriptionEn } = body;

    // Валідація даних - принаймні один заголовок та опис мають бути заповнені
    const hasHeading = heading && heading.trim() !== '';
    const hasDescription = description && description.trim() !== '';
    const hasHeadingEn = headingEn && headingEn.trim() !== '';
    const hasDescriptionEn = descriptionEn && descriptionEn.trim() !== '';
    
    if (!hasHeading && !hasHeadingEn) {
      console.log('❌ Відсутній заголовок');
      return NextResponse.json(
        { 
          error: 'At least one heading (heading or headingEn) is required',
          received: { heading, description, headingEn, descriptionEn, photoUrls, imagePosition }
        },
        { status: 400 }
      );
    }

    if (!hasDescription && !hasDescriptionEn) {
      console.log('❌ Відсутній опис');
      return NextResponse.json(
        { 
          error: 'At least one description (description or descriptionEn) is required',
          received: { heading, description, headingEn, descriptionEn, photoUrls, imagePosition }
        },
        { status: 400 }
      );
    }

    // Конвертуємо масив photoUrls в JSON рядок для збереження
    const photoUrlsString = Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';
    console.log('🖼️ Конвертовані photoUrls:', photoUrlsString);
    console.log('📍 ImagePosition:', imagePosition);

    console.log('💾 Зберігаємо в БД...');
    
    // Підготовлюємо дані для збереження
    const data: any = {
      heading: heading?.trim() || '',
      description: description?.trim() || '',
      headingEn: headingEn?.trim() || null,
      descriptionEn: descriptionEn?.trim() || null,
      photoUrls: photoUrlsString,
      publicationDate: new Date(),
    } as any;

    // Додаємо imagePosition тільки якщо є фото
    if (photoUrls && photoUrls.length > 0) {
      data.imagePosition = imagePosition || 'center';
    }

    const event = await prisma.methodologicalEvents.create({
      data,
    });

    console.log('✅ Методичний захід створено:', event.id);

    // Повертаємо методичний захід з розпарсеними photoUrls
    const result = {
      ...event,
      photoUrls: JSON.parse(event.photoUrls)
    };
    
    console.log('📤 Повертаємо результат:', JSON.stringify(result, null, 2));
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Error creating methodological event:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Повертаємо детальну помилку
    const errorResponse = {
      error: 'Failed to create methodological event',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    };
    
    console.log('📤 Повертаємо помилку:', JSON.stringify(errorResponse, null, 2));
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('✏️ PUT /api/methodological-events - початок виконання');
    
    const body = await request.json();
    console.log('📦 Отримані дані для оновлення:', JSON.stringify(body, null, 2));
    
    const { id, heading, description, photoUrls, imagePosition = 'center', headingEn, descriptionEn } = body;

    // Валідація даних - принаймні один заголовок та опис мають бути заповнені
    const hasHeading = heading && heading.trim() !== '';
    const hasDescription = description && description.trim() !== '';
    const hasHeadingEn = headingEn && headingEn.trim() !== '';
    const hasDescriptionEn = descriptionEn && descriptionEn.trim() !== '';
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    if (!hasHeading && !hasHeadingEn) {
      return NextResponse.json(
        { error: 'At least one heading (heading or headingEn) is required' },
        { status: 400 }
      );
    }

    if (!hasDescription && !hasDescriptionEn) {
      return NextResponse.json(
        { error: 'At least one description (description or descriptionEn) is required' },
        { status: 400 }
      );
    }

    // Конвертуємо масив photoUrls в JSON рядок для збереження
    const photoUrlsString = Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';

    // Підготовлюємо дані для оновлення
    const data: any = {
      heading: heading?.trim() || '',
      description: description?.trim() || '',
      headingEn: headingEn?.trim() || null,
      descriptionEn: descriptionEn?.trim() || null,
      photoUrls: photoUrlsString,
      updatedAt: new Date(),
    } as any;

    // Додаємо або видаляємо imagePosition залежно від наявності фото
    if (photoUrls && photoUrls.length > 0) {
      data.imagePosition = imagePosition || 'center';
    } else {
      data.imagePosition = null; // Видаляємо позиціонування якщо немає фото
    }

    const updatedEvent = await prisma.methodologicalEvents.update({
      where: { id: parseInt(id) },
      data,
    });

    console.log('✅ Методичний захід оновлено:', updatedEvent.id);

    // Повертаємо оновлений методичний захід з розпарсеними photoUrls
    const result = {
      ...updatedEvent,
      photoUrls: JSON.parse(updatedEvent.photoUrls)
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Error updating methodological event:', error);
    return NextResponse.json(
      { error: 'Failed to update methodological event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    await prisma.methodologicalEvents.delete({
      where: { id: parseInt(id) },
    });

    console.log('✅ Методичний захід видалено:', id);
    return NextResponse.json({ message: 'Methodological event deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting methodological event:', error);
    return NextResponse.json(
      { error: 'Failed to delete methodological event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

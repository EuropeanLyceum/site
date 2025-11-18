import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Додаємо GET метод для отримання конкретного запису
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);

    console.log('🔍 GET запит для sport life з ID:', id);

    const sportLife = await prisma.sportLife.findUnique({
      where: { id },
    });

    if (!sportLife) {
      const errorResponse = NextResponse.json(
        { error: 'Sport life record not found' },
        { status: 404 }
      );
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      return errorResponse;
    }

    const result = {
      ...sportLife,
      photoUrls: sportLife.photoUrls ? JSON.parse(sportLife.photoUrls) : []
    };

    const response = NextResponse.json(result);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Error fetching sport life:', error);
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch sport life' },
      { status: 500 }
    );
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return errorResponse;
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);
    const body = await req.json();

    console.log('🔄 PUT запит для sport life з ID:', id);
    console.log('📦 Body:', JSON.stringify(body, null, 2));

    const { heading, description, headingEn, descriptionEn, photoUrls, imagePosition } = body;

    // Перевіряємо, чи передано ID
    if (!id || isNaN(id)) {
      const errorResponse = NextResponse.json(
        { error: 'Valid ID is required for update' },
        { status: 400 }
      );
      
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      
      return errorResponse;
    }

    // Валідація - принаймні одне поле має бути заповнене
    const hasHeading = heading && heading.trim() !== '';
    const hasDescription = description && description.trim() !== '';
    const hasHeadingEn = headingEn && headingEn.trim() !== '';
    const hasDescriptionEn = descriptionEn && descriptionEn.trim() !== '';
    const hasPhotos = photoUrls && photoUrls.length > 0;
    
    if (!hasHeading && !hasDescription && !hasHeadingEn && !hasDescriptionEn && !hasPhotos) {
      const errorResponse = NextResponse.json(
        { error: 'At least one field must be provided: heading, description, headingEn, descriptionEn, or photoUrls' },
        { status: 400 }
      );
      
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      
      return errorResponse;
    }

    // Конвертуємо масив photoUrls в JSON рядок для збереження
    const photoUrlsString = Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';

    // Підготовлюємо дані для оновлення
    const data: any = {
      heading: heading || '',
      description: description || '',
      headingEn: headingEn || null,
      descriptionEn: descriptionEn || null,
      photoUrls: photoUrlsString,
    };

    // Додаємо або видаляємо imagePosition залежно від наявності фото
    if (photoUrls && photoUrls.length > 0) {
      data.imagePosition = imagePosition || 'center';
    } else {
      data.imagePosition = null; // Видаляємо позиціонування якщо немає фото
    }

    const sportLife = await prisma.sportLife.update({
      where: { id },
      data
    });

    // Повертаємо запис з розпарсеними photoUrls
    const result = {
      ...sportLife,
      photoUrls: JSON.parse(sportLife.photoUrls)
    };

    const response = NextResponse.json(result);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Error updating sport life:', error);
    const errorResponse = NextResponse.json(
      { error: 'Failed to update sport life' },
      { status: 500 }
    );
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return errorResponse;
  }
}

export async function DELETE(
  request: NextRequest, // Виправлено тип
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);

    await prisma.sportLife.delete({
      where: { id },
    });

    const response = NextResponse.json({ success: true });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Error deleting sport life:', error);
    const errorResponse = NextResponse.json(
      { error: 'Failed to delete sport life' },
      { status: 500 }
    );
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

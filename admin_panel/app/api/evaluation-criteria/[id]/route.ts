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

    console.log('🔍 GET запит для evaluation criteria з ID:', id);

    const evaluationCriteria = await prisma.evaluationCriteria.findUnique({
      where: { id },
    });

    if (!evaluationCriteria) {
      const errorResponse = NextResponse.json(
        { error: 'Evaluation criteria not found' },
        { status: 404 }
      );
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      return errorResponse;
    }

    const result = {
      ...evaluationCriteria,
      subItems: evaluationCriteria.subItems ? JSON.parse(evaluationCriteria.subItems) : []
    };

    const response = NextResponse.json(result);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Error fetching evaluation criteria:', error);
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch evaluation criteria' },
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

    console.log('🔄 PUT запит для evaluation criteria з ID:', id);
    console.log('📦 Body:', JSON.stringify(body, null, 2));

    const { name, nameEn, url, color, hasSubItems, subItems, order } = body;

    // Перевіряємо, чи передано ID
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'Valid ID is required for update' },
        { status: 400 }
      );
    }

    // Валідація - принаймні одне поле має бути заповнене
    const hasName = name && name.trim() !== '';
    const hasNameEn = nameEn && nameEn.trim() !== '';
    
    if (!hasName && !hasNameEn) {
      return NextResponse.json(
        { error: 'At least one field must be provided: name or nameEn' },
        { status: 400 }
      );
    }

    // Конвертуємо масив subItems в JSON рядок для збереження
    const subItemsString = Array.isArray(subItems) ? JSON.stringify(subItems) : '[]';

    const evaluationCriteria = await prisma.evaluationCriteria.update({
      where: { id },
      data: {
        name: name || '',
        nameEn: nameEn || null,
        url: url || null,
        color: color || '#FF6B6B',
        hasSubItems: hasSubItems || false,
        subItems: subItemsString,
        order: order || 0,
      } as any,
    });

    // Повертаємо запис з розпарсеними subItems
    const result = {
      ...evaluationCriteria,
      subItems: JSON.parse(evaluationCriteria.subItems)
    };

    const response = NextResponse.json(result);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Error updating evaluation criteria:', error);
    const errorResponse = NextResponse.json(
      { error: 'Failed to update evaluation criteria' },
      { status: 500 }
    );
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return errorResponse;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);

    console.log('🗑️ DELETE запит для evaluation criteria з ID:', id);

    await prisma.evaluationCriteria.delete({
      where: { id },
    });

    const response = NextResponse.json({ success: true });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Error deleting evaluation criteria:', error);
    const errorResponse = NextResponse.json(
      { error: 'Failed to delete evaluation criteria' },
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

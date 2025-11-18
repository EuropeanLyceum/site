import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 GET /api/evaluation-criteria - початок виконання');
    
    const evaluationCriteria = await prisma.evaluationCriteria.findMany({
      orderBy: { order: 'asc' },
    });

    console.log('📊 Отримано записів з БД:', evaluationCriteria.length);

    // Конвертуємо JSON рядок назад в масив для кожного запису
    const criteriaWithParsedSubItems = evaluationCriteria.map(item => {
      try {
        return {
          ...item,
          subItems: item.subItems ? JSON.parse(item.subItems) : []
        };
      } catch (error) {
        console.error('❌ Помилка парсингу subItems для запису', item.id, error);
        return {
          ...item,
          subItems: []
        };
      }
    });

    console.log('✅ Повертаємо записи:', criteriaWithParsedSubItems.length);
    
    const response = NextResponse.json(criteriaWithParsedSubItems);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
  } catch (error) {
    console.error('❌ Error fetching evaluation criteria:', error);
    
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch evaluation criteria', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return errorResponse;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/evaluation-criteria - початок виконання');
    
    const body = await request.json();
    console.log('📦 Отримані дані:', JSON.stringify(body, null, 2));
    
    const { name, nameEn, url, color, hasSubItems, subItems, order } = body;

    console.log('Extracted fields:', { name, nameEn, url, color, hasSubItems, subItems, order });

    // Валідація даних - принаймні одне поле має бути заповнене
    const hasName = name && name.trim() !== '';
    const hasNameEn = nameEn && nameEn.trim() !== '';
    
    if (!hasName && !hasNameEn) {
      console.log('❌ Відсутні всі поля');
      return NextResponse.json(
        { 
          error: 'At least one field must be provided: name or nameEn',
          received: { name, nameEn, url, color, hasSubItems, subItems, order }
        },
        { status: 400 }
      );
    }

    // Конвертуємо масив subItems в JSON рядок для збереження
    const subItemsString = Array.isArray(subItems) ? JSON.stringify(subItems) : '[]';
    console.log('🖼️ Конвертовані subItems:', subItemsString);

    console.log('💾 Зберігаємо в БД...');
    const evaluationCriteria = await prisma.evaluationCriteria.create({
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

    console.log('✅ Запис створено:', evaluationCriteria.id);

    // Повертаємо запис з розпарсеними subItems
    const result = {
      ...evaluationCriteria,
      subItems: JSON.parse(evaluationCriteria.subItems)
    };
    
    console.log('📤 Повертаємо результат:', JSON.stringify(result, null, 2));
    
    const response = NextResponse.json(result);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
  } catch (error) {
    console.error('❌ Error creating evaluation criteria:', error);
    
    const errorResponse = NextResponse.json(
      { error: 'Failed to create evaluation criteria', details: error instanceof Error ? error.message : 'Unknown error' },
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

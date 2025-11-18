import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Отримуємо вчителів з бази даних
    const teachers = await prisma.staff.findMany({
      where: {
        category: {
          name: 'Вчителі'
        }
      },
      include: {
        category: true
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error('Помилка отримання вчителів:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}

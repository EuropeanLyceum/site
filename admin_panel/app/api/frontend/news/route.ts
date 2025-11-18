import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Отримуємо новини з бази даних
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10 // Останні 10 новин
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Помилка отримання новин:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}

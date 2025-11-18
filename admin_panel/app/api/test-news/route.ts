import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🧪 Тестування створення новини...');
    
    const testNews = await prisma.news.create({
      data: {
        heading: 'Тестова новина',
        description: 'Це тестова новина для перевірки API',
        photoUrls: JSON.stringify(['https://via.placeholder.com/300x200']),
        publicationDate: new Date(),
      },
    });
    
    console.log('✅ Тестову новину створено:', testNews);
    
    return NextResponse.json({
      success: true,
      message: 'Тестову новину створено успішно',
      news: {
        ...testNews,
        photoUrls: JSON.parse(testNews.photoUrls)
      }
    });
  } catch (error) {
    console.error('❌ Помилка створення тестової новини:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create test news',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

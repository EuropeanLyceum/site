import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🧪 Тестування створення intellect-talent...');
    
    const testEvent = await prisma.intellectTalent.create({
      data: {
        heading: 'Тестова подія "Інтелект та обдарованість"',
        description: 'Це тестова подія для перевірки API сторінки "Інтелект та обдарованість". Подія містить опис науково-практичної конференції та конкурсів МАН.',
        photoUrls: JSON.stringify(['https://via.placeholder.com/400x300/182BA1/FFFFFF?text=Intellect+Event+1', 'https://via.placeholder.com/400x300/CC8B6A/FFFFFF?text=Intellect+Event+2']),
        publicationDate: new Date(),
      },
    });
    
    console.log('✅ Тестову подію створено:', testEvent);
    
    return NextResponse.json({
      success: true,
      message: 'Тестову подію створено успішно',
      event: {
        ...testEvent,
        photoUrls: JSON.parse(testEvent.photoUrls)
      }
    });
  } catch (error) {
    console.error('❌ Помилка створення тестової події:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create test intellect-talent event',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

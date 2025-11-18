import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const innovationActivities = await prisma.innovationActivity.findMany({
      orderBy: { createdAt: 'asc' }
    });
    
    // Парсимо photoUrls з JSON рядка в масив
    const parsedInnovationActivities = innovationActivities.map(item => ({
      ...item,
      photoUrls: item.photoUrls ? JSON.parse(item.photoUrls) : []
    }));
    
    return NextResponse.json(parsedInnovationActivities);
  } catch (error) {
    console.error('Error fetching innovative activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch innovative activities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, photoUrls } = body;

    // Валідація - принаймні одне поле має бути заповнене
    // Дозволяємо зберігати тільки заголовок, тільки текст або тільки фото
    const hasTitle = title && title.trim() !== '';
    const hasContent = content && content.trim() !== '';
    const hasPhotos = photoUrls && Array.isArray(photoUrls) && photoUrls.length > 0;
    
    if (!hasTitle && !hasContent && !hasPhotos) {
      return NextResponse.json(
        { error: 'At least one field must be provided: title, content, or photoUrls' },
        { status: 400 }
      );
    }

    // Конвертуємо масив photoUrls в JSON рядок
    const photoUrlsJson = photoUrls && Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';

    const innovationActivity = await prisma.innovationActivity.create({
      data: {
        title: title || null,
        content: content || null,
        photoUrls: photoUrlsJson,
      },
    });

    // Повертаємо з парсеними photoUrls
    const response = {
      ...innovationActivity,
      photoUrls: JSON.parse(photoUrlsJson)
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating innovative activity:', error);
    return NextResponse.json(
      { error: 'Failed to create innovative activity' },
      { status: 500 }
    );
  }
}

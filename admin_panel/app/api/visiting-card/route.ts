import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const visitingCards = await prisma.businessCard.findMany({
      orderBy: { createdAt: 'asc' }
    });
    
    // Парсимо photoUrls з JSON рядка в масив
    const parsedVisitingCards = visitingCards.map(item => ({
      ...item,
      photoUrls: item.photoUrls ? JSON.parse(item.photoUrls) : []
    }));
    
    return NextResponse.json(parsedVisitingCards);
  } catch (error) {
    console.error('Error fetching visiting cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visiting cards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, titleEn, contentEn, photoUrls } = body;

    // Валідація - принаймні одне поле має бути заповнене
    // Дозволяємо зберігати тільки заголовок, тільки текст або тільки фото
    const hasTitle = title && title.trim() !== '';
    const hasContent = content && content.trim() !== '';
    const hasTitleEn = titleEn && titleEn.trim() !== '';
    const hasContentEn = contentEn && contentEn.trim() !== '';
    const hasPhotos = photoUrls && Array.isArray(photoUrls) && photoUrls.length > 0;
    
    if (!hasTitle && !hasContent && !hasTitleEn && !hasContentEn && !hasPhotos) {
      return NextResponse.json(
        { error: 'At least one field must be provided: title, content, titleEn, contentEn, or photoUrls' },
        { status: 400 }
      );
    }

    // Конвертуємо масив photoUrls в JSON рядок
    const photoUrlsJson = photoUrls && Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';

    const visitingCard = await prisma.businessCard.create({
      data: {
        title: title || null,
        content: content || null,
        titleEn: titleEn || null,
        contentEn: contentEn || null,
        photoUrls: photoUrlsJson,
      } as any,
    });

    // Повертаємо з парсеними photoUrls
    const response = {
      ...visitingCard,
      photoUrls: JSON.parse(photoUrlsJson)
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating visiting card:', error);
    return NextResponse.json(
      { error: 'Failed to create visiting card' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const innovationActivity = await prisma.innovationActivity.findMany({
      orderBy: { createdAt: 'asc' }
    });
    
    // Конвертуємо JSON рядок в масив
    const formattedData = innovationActivity.map(item => ({
      ...item,
      photoUrls: item.photoUrls ? JSON.parse(item.photoUrls) : []
    }));
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching innovation activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch innovation activity' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, titleEn, contentEn, photoUrls } = body;

    // Валідація - принаймні одне поле має бути заповнене
    const hasTitle = title && title.trim() !== '';
    const hasContent = content && content.trim() !== '';
    const hasTitleEn = titleEn && titleEn.trim() !== '';
    const hasContentEn = contentEn && contentEn.trim() !== '';
    const hasPhotos = photoUrls && photoUrls.length > 0;
    
    if (!hasTitle && !hasContent && !hasTitleEn && !hasContentEn && !hasPhotos) {
      return NextResponse.json(
        { error: 'At least one field must be provided: title, content, titleEn, contentEn, or photoUrls' },
        { status: 400 }
      );
    }

    // Зберігаємо масив photoUrls як JSON рядок
    const photoUrlsString = photoUrls && Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : "[]";

    const innovationActivity = await prisma.innovationActivity.create({
      data: {
        title: title || null,
        content: content || null,
        titleEn: titleEn || null,
        contentEn: contentEn || null,
        photoUrls: photoUrlsString,
      } as any,
    });

    // Повертаємо з photoUrls масивом
    return NextResponse.json({
      ...innovationActivity,
      photoUrls: JSON.parse(photoUrlsString)
    });
  } catch (error) {
    console.error('Error creating innovation activity:', error);
    return NextResponse.json(
      { error: 'Failed to create innovation activity' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const items = await prisma.qualificationImprovement.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    // Парсимо photoUrls з JSON рядка в масив
    const parsedItems = items.map(item => ({
      ...item,
      photoUrls: item.photoUrls ? JSON.parse(item.photoUrls) : []
    }));

    return NextResponse.json(parsedItems);
  } catch (error) {
    console.error('Error fetching qualification improvement items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch qualification improvement items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, photoUrls, text, link, linkText, titleEn, contentEn, textEn, linkTextEn } = body;

    console.log('Extracted fields:', { title, content, photoUrls, text, link, linkText, titleEn, contentEn, textEn, linkTextEn });

    // Валідація - принаймні одне поле має бути заповнене
    const hasTitle = title && title.trim() !== '';
    const hasContent = content && content.trim() !== '';
    const hasPhotos = photoUrls && Array.isArray(photoUrls) && photoUrls.length > 0;
    const hasText = text && text.trim() !== '';
    const hasLink = link && link.trim() !== '';
    const hasTitleEn = titleEn && titleEn.trim() !== '';
    const hasContentEn = contentEn && contentEn.trim() !== '';
    const hasTextEn = textEn && textEn.trim() !== '';
    const hasLinkTextEn = linkTextEn && linkTextEn.trim() !== '';
    
    if (!hasTitle && !hasContent && !hasPhotos && !hasText && !hasLink && !hasTitleEn && !hasContentEn && !hasTextEn && !hasLinkTextEn) {
      return NextResponse.json(
        { 
          error: 'At least one field must be provided: title, content, photoUrls, text, link, titleEn, contentEn, textEn, or linkTextEn',
          received: { title, content, photoUrls, text, link, linkText, titleEn, contentEn, textEn, linkTextEn }
        },
        { status: 400 }
      );
    }

    // Конвертуємо масив photoUrls в JSON рядок
    const photoUrlsJson = photoUrls && Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';

    const item = await prisma.qualificationImprovement.create({
      data: {
        title: title?.trim() || null,
        content: content?.trim() || null,
        photoUrls: photoUrlsJson,
        text: text?.trim() || null,
        link: link?.trim() || null,
        linkText: linkText?.trim() || null,
        titleEn: titleEn?.trim() || null,
        contentEn: contentEn?.trim() || null,
        textEn: textEn?.trim() || null,
        linkTextEn: linkTextEn?.trim() || null,
        order: 0,
      } as any,
    });

    // Повертаємо з парсеними photoUrls
    const response = {
      ...item,
      photoUrls: JSON.parse(photoUrlsJson)
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating qualification improvement item:', error);
    return NextResponse.json(
      { error: 'Failed to create qualification improvement item' },
      { status: 500 }
    );
  }
}

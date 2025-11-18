import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);
    const body = await request.json();
    const { title, content, titleEn, contentEn, photoUrls } = body;

    // Перевіряємо, чи передано ID
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'Valid ID is required for update' },
        { status: 400 }
      );
    }

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

    const visitingCard = await prisma.businessCard.update({
      where: { id },
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
    console.error('Error updating visiting card:', error);
    return NextResponse.json(
      { error: 'Failed to update visiting card' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'Valid ID is required for deletion' },
        { status: 400 }
      );
    }

    const visitingCard = await prisma.businessCard.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'Visiting card deleted successfully',
      deletedId: visitingCard.id 
    });
  } catch (error) {
    console.error('Error deleting visiting card:', error);
    return NextResponse.json(
      { error: 'Failed to delete visiting card' },
      { status: 500 }
    );
  }
}

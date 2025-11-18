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
    const { title, content, photoUrls } = body;

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
    const hasPhotos = photoUrls && Array.isArray(photoUrls) && photoUrls.length > 0;
    
    if (!hasTitle && !hasContent && !hasPhotos) {
      return NextResponse.json(
        { error: 'At least one field must be provided: title, content, or photoUrls' },
        { status: 400 }
      );
    }

    // Конвертуємо масив photoUrls в JSON рядок
    const photoUrlsJson = photoUrls && Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';

    const innovationActivity = await prisma.innovationActivity.update({
      where: { id },
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
    console.error('Error updating innovative activity:', error);
    return NextResponse.json(
      { error: 'Failed to update innovative activity' },
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

    const innovationActivity = await prisma.innovationActivity.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'Innovative activity deleted successfully',
      deletedId: innovationActivity.id 
    });
  } catch (error) {
    console.error('Error deleting innovative activity:', error);
    return NextResponse.json(
      { error: 'Failed to delete innovative activity' },
      { status: 500 }
    );
  }
}

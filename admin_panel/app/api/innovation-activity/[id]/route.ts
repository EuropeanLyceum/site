import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);
    const body = await req.json();
    const { title, content, titleEn, contentEn, photoUrls } = body;

    // Перевіряємо, чи передано ID
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'Valid ID is required for update' },
        { status: 400 }
      );
    }

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

    // Оновлюємо всі поля
    const updateData: any = {
      title: title || null,
      content: content || null,
      titleEn: titleEn || null,
      contentEn: contentEn || null,
    };
    
    if (photoUrls !== undefined) {
      // Конвертуємо масив photoUrls в JSON рядок
      updateData.photoUrls = Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';
    }

    const innovationActivity = await prisma.innovationActivity.update({
      where: { id },
      data: updateData as any,
    });

    // Повертаємо з photoUrls масивом
    const response = {
      ...innovationActivity,
      photoUrls: innovationActivity.photoUrls ? JSON.parse(innovationActivity.photoUrls) : []
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating innovation activity:', error);
    return NextResponse.json(
      { error: 'Failed to update innovation activity' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
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
      message: 'Innovation activity deleted successfully',
      deletedId: innovationActivity.id 
    });
  } catch (error) {
    console.error('Error deleting innovation activity:', error);
    return NextResponse.json(
      { error: 'Failed to delete innovation activity' },
      { status: 500 }
    );
  }
}

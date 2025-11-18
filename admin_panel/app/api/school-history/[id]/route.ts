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

    // Конвертуємо масив photoUrls в JSON рядок
    const photoUrlsJson = photoUrls && Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';

    const schoolHistory = await prisma.schoolHistory.update({
      where: { id },
      data: {
        title: title && title.trim() !== '' ? title.trim() : null,
        content: content && content.trim() !== '' ? content.trim() : null,
        titleEn: titleEn && titleEn.trim() !== '' ? titleEn.trim() : null,
        contentEn: contentEn && contentEn.trim() !== '' ? contentEn.trim() : null,
        photoUrls: photoUrlsJson,
      } as any,
    });

    // Повертаємо з парсеними photoUrls
    const response = {
      ...schoolHistory,
      photoUrls: JSON.parse(schoolHistory.photoUrls)
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating school history:', error);
    return NextResponse.json(
      { error: 'Failed to update school history' },
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

    const schoolHistory = await prisma.schoolHistory.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'School history deleted successfully',
      deletedId: schoolHistory.id 
    });
  } catch (error) {
    console.error('Error deleting school history:', error);
    return NextResponse.json(
      { error: 'Failed to delete school history' },
      { status: 500 }
    );
  }
}


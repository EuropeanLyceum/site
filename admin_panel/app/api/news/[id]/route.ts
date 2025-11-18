import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log('📝 PUT /api/news/[id] - редагування новини', resolvedParams.id);
    
    const body = await request.json();
    const { heading, description, headingEn, descriptionEn, photoUrls, imagePosition } = body;

    // Перевіряємо, чи передано ID
    const id = parseInt(resolvedParams.id);
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'Valid ID is required for update' },
        { status: 400 }
      );
    }

    // Валідація даних - принаймні одне поле має бути заповнене
    const hasHeading = heading && heading.trim() !== '';
    const hasDescription = description && description.trim() !== '';
    const hasHeadingEn = headingEn && headingEn.trim() !== '';
    const hasDescriptionEn = descriptionEn && descriptionEn.trim() !== '';
    const hasPhotos = photoUrls && photoUrls.length > 0;
    
    if (!hasHeading && !hasDescription && !hasHeadingEn && !hasDescriptionEn && !hasPhotos) {
      return NextResponse.json(
        { error: 'At least one field must be provided: heading, description, headingEn, descriptionEn, or photoUrls' },
        { status: 400 }
      );
    }

    // Конвертуємо масив photoUrls в JSON рядок для збереження
    const photoUrlsString = Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        heading: heading || '',
        description: description || '',
        headingEn: headingEn || null,
        descriptionEn: descriptionEn || null,
        photoUrls: photoUrlsString,
        imagePosition: imagePosition || 'center',
      } as any,
    });

    console.log('✅ Новину оновлено:', updatedNews.id);

    // Повертаємо новину з розпарсеними photoUrls
    return NextResponse.json({
      ...updatedNews,
      photoUrls: JSON.parse(updatedNews.photoUrls)
    });
  } catch (error) {
    console.error('❌ Error updating news:', error);
    return NextResponse.json(
      { error: 'Failed to update news', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log('🗑️ DELETE /api/news/[id] - видалення новини', resolvedParams.id);
    
    const id = parseInt(resolvedParams.id);
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'Valid ID is required for deletion' },
        { status: 400 }
      );
    }

    const news = await prisma.news.delete({
      where: { id },
    });

    console.log('✅ Новину видалено:', id);
    return NextResponse.json({ 
      message: 'News deleted successfully',
      deletedId: news.id 
    });
  } catch (error) {
    console.error('❌ Error deleting news:', error);
    return NextResponse.json(
      { error: 'Failed to delete news', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

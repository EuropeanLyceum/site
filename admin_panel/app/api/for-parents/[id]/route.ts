import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const { heading, content, url, photoUrls, headingEn, contentEn } = body;

    // Валідація даних: принаймні одне з полів має бути заповнене
    const hasHeading = heading && heading.trim() !== '';
    const hasContent = content && content.trim() !== '';
    const hasUrl = url && url.trim() !== '';
    const hasPhotoUrls = photoUrls && photoUrls.length > 0;
    const hasHeadingEn = headingEn && headingEn.trim() !== '';
    const hasContentEn = contentEn && contentEn.trim() !== '';
    
    if (!hasHeading && !hasContent && !hasUrl && !hasPhotoUrls && !hasHeadingEn && !hasContentEn) {
      return NextResponse.json(
        { error: 'At least one field must be filled: heading, content, url, photoUrls, headingEn, or contentEn' },
        { status: 400 }
      );
    }

    // Конвертуємо масив photoUrls в JSON рядок для збереження
    const photoUrlsString = Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';

    const updatedItem = await prisma.forParents.update({
      where: { id },
      data: {
        heading: heading?.trim() || null,
        content: content?.trim() || null,
        url: url?.trim() || null,
        photoUrls: photoUrlsString,
        headingEn: headingEn?.trim() || null,
        contentEn: contentEn?.trim() || null,
      } as any,
    });

    // Повертаємо запис з розпарсеними photoUrls
    const result = {
      ...updatedItem,
      photoUrls: JSON.parse(updatedItem.photoUrls)
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating for-parents:', error);
    return NextResponse.json(
      { error: 'Failed to update for-parents' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.forParents.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting for-parents:', error);
    return NextResponse.json(
      { error: 'Failed to delete for-parents' },
      { status: 500 }
    );
  }
}

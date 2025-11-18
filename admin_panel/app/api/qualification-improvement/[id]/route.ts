import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const awaitedParams = await params;
    const body = await request.json();
    const { title, content, photoUrls, text, link, linkText, titleEn, contentEn, textEn, linkTextEn } = body;

    console.log('PUT request - data:', { title, content, photoUrls, text, link, linkText, titleEn, contentEn, textEn, linkTextEn });

    // Перевіряємо, чи передано ID
    if (!awaitedParams.id || isNaN(parseInt(awaitedParams.id))) {
      return NextResponse.json(
        { error: 'Valid ID is required for update' },
        { status: 400 }
      );
    }

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
        { error: 'At least one field must be provided: title, content, photoUrls, text, link, titleEn, contentEn, textEn, or linkTextEn' },
        { status: 400 }
      );
    }

    // Конвертуємо масив photoUrls в JSON рядок
    const photoUrlsJson = photoUrls && Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';

    const updatedItem = await prisma.qualificationImprovement.update({
      where: { id: parseInt(awaitedParams.id) },
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
      ...updatedItem,
      photoUrls: JSON.parse(photoUrlsJson)
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating qualification improvement item:', error);
    return NextResponse.json(
      { error: 'Failed to update qualification improvement item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const awaitedParams = await params;
    await prisma.qualificationImprovement.delete({
      where: { id: parseInt(awaitedParams.id) },
    });

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting qualification improvement item:', error);
    return NextResponse.json(
      { error: 'Failed to delete qualification improvement item' },
      { status: 500 }
    );
  }
}

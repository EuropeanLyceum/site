import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const id = parseInt(params.id);
    console.log('📝 PUT /api/teacher-certification/[id] - редагування запису', id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const { heading, description, text, url, linkText, headingEn, descriptionEn, textEn, linkTextEn } = body;

    // Валідація - принаймні одне поле має бути заповнене
    const hasHeading = heading && heading.trim() !== '';
    const hasDescription = description && description.trim() !== '';
    const hasText = text && text.trim() !== '';
    const hasUrl = url && url.trim() !== '';
    const hasLinkText = linkText && linkText.trim() !== '';
    const hasHeadingEn = headingEn && headingEn.trim() !== '';
    const hasDescriptionEn = descriptionEn && descriptionEn.trim() !== '';
    const hasTextEn = textEn && textEn.trim() !== '';
    const hasLinkTextEn = linkTextEn && linkTextEn.trim() !== '';
    
    if (!hasHeading && !hasDescription && !hasText && !hasUrl && !hasLinkText && !hasHeadingEn && !hasDescriptionEn && !hasTextEn && !hasLinkTextEn) {
      return NextResponse.json(
        { error: 'At least one field must be provided: heading, description, text, url, linkText, headingEn, descriptionEn, textEn, or linkTextEn' },
        { status: 400 }
      );
    }

    // Конвертуємо масив photoUrls в JSON рядок для збереження
    const photoUrlsString = Array.isArray(body.photoUrls) ? JSON.stringify(body.photoUrls) : '[]';

    // Підготовлюємо дані для оновлення
    const data: any = {
      heading: heading?.trim() || '',
      description: description?.trim() || '',
      text: text?.trim() || null,
      url: url?.trim() || null,
      linkText: linkText?.trim() || null,
      headingEn: headingEn?.trim() || null,
      descriptionEn: descriptionEn?.trim() || null,
      textEn: textEn?.trim() || null,
      linkTextEn: linkTextEn?.trim() || null,
      photoUrls: photoUrlsString,
      publicationDate: body.publicationDate ? new Date(body.publicationDate) : new Date()
    };

    // Додаємо або видаляємо imagePosition залежно від наявності фото
    if (body.photoUrls && body.photoUrls.length > 0) {
      data.imagePosition = body.imagePosition || 'center';
    } else {
      data.imagePosition = null; // Видаляємо позиціонування якщо немає фото
    }

    // Оновлюємо запис
    const updatedItem = await prisma.teacherCertification.update({
      where: { id },
      data
    });

    console.log('✅ Запис оновлено:', updatedItem.id);

    // Повертаємо запис з розпарсеними photoUrls
    return NextResponse.json({
      ...updatedItem,
      photoUrls: JSON.parse(updatedItem.photoUrls)
    });
  } catch (error) {
    console.error('❌ Error updating teacher certification item:', error);
    return NextResponse.json(
      { error: 'Failed to update item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    // Видаляємо запис
    await prisma.teacherCertification.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher certification item:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}

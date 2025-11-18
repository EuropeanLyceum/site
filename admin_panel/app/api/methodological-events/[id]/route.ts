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
    const { heading, description, photoUrls, imagePosition = 'center', headingEn, descriptionEn } = body;

    // Валідація даних - принаймні один заголовок та опис мають бути заповнені
    const hasHeading = heading && heading.trim() !== '';
    const hasDescription = description && description.trim() !== '';
    const hasHeadingEn = headingEn && headingEn.trim() !== '';
    const hasDescriptionEn = descriptionEn && descriptionEn.trim() !== '';
    
    if (!hasHeading && !hasHeadingEn) {
      return NextResponse.json(
        { error: 'At least one heading (heading or headingEn) is required' },
        { status: 400 }
      );
    }

    if (!hasDescription && !hasDescriptionEn) {
      return NextResponse.json(
        { error: 'At least one description (description or descriptionEn) is required' },
        { status: 400 }
      );
    }

    // Конвертуємо масив photoUrls в JSON рядок для збереження
    const photoUrlsString = Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';

    // Підготовлюємо дані для оновлення
    const data: any = {
      heading: heading?.trim() || '',
      description: description?.trim() || '',
      headingEn: headingEn?.trim() || null,
      descriptionEn: descriptionEn?.trim() || null,
      photoUrls: photoUrlsString,
    } as any;

    // Додаємо або видаляємо imagePosition залежно від наявності фото
    if (photoUrls && photoUrls.length > 0) {
      data.imagePosition = imagePosition || 'center';
    } else {
      data.imagePosition = null; // Видаляємо позиціонування якщо немає фото
    }

    const updatedItem = await prisma.methodologicalEvents.update({
      where: { id },
      data,
    });

    // Повертаємо методичний захід з розпарсеними photoUrls
    const result = {
      ...updatedItem,
      photoUrls: JSON.parse(updatedItem.photoUrls)
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating methodological event:', error);
    return NextResponse.json(
      { error: 'Failed to update methodological event' },
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
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.methodologicalEvents.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Methodological event deleted successfully' });
  } catch (error) {
    console.error('Error deleting methodological-events:', error);
    return NextResponse.json(
      { error: 'Failed to delete methodological-events' },
      { status: 500 }
    );
  }
}

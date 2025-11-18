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
    const { heading, description, headingEn, descriptionEn, photoUrls, imagePosition } = body;

    // Перевіряємо, чи передано ID
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'Valid ID is required for update' },
        { status: 400 }
      );
    }

    // Валідація - принаймні одне поле має бути заповнене
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

    const photoUrlsString = Array.isArray(photoUrls) ? JSON.stringify(photoUrls) : '[]';
    const position = imagePosition || 'center';

    const updatedItem = await prisma.intellectTalent.update({
      where: { id },
      data: {
        heading: heading || '',
        description: description || '',
        headingEn: headingEn || null,
        descriptionEn: descriptionEn || null,
        photoUrls: photoUrlsString,
        imagePosition: position,
        publicationDate: new Date(),
      } as any,
    });

    return NextResponse.json({
      ...updatedItem,
      photoUrls: JSON.parse(updatedItem.photoUrls)
    });
  } catch (error) {
    console.error('Error updating intellect-talent:', error);
    return NextResponse.json(
      { error: 'Failed to update intellect-talent' },
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
    
    const deletedItem = await prisma.intellectTalent.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'Intellect talent deleted successfully',
      deletedId: deletedItem.id 
    });
  } catch (error) {
    console.error('Error deleting intellect-talent:', error);
    return NextResponse.json(
      { error: 'Failed to delete intellect-talent' },
      { status: 500 }
    );
  }
}



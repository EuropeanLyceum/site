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
    const { title, content, titleEn, contentEn, url, photoUrls, linkText, linkTextEn } = body;

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
    const hasUrl = url && url.trim() !== '';
    const hasLinkText = linkText && linkText.trim() !== '';
    const hasLinkTextEn = linkTextEn && linkTextEn.trim() !== '';
    const hasPhotos = photoUrls && photoUrls.length > 0;
    
    if (!hasTitle && !hasContent && !hasTitleEn && !hasContentEn && !hasUrl && !hasLinkText && !hasLinkTextEn && !hasPhotos) {
      return NextResponse.json(
        { error: 'At least one field must be provided: title, content, titleEn, contentEn, url, linkText, linkTextEn, or photoUrls' },
        { status: 400 }
      );
    }

    const photoUrlsJson = JSON.stringify(photoUrls || []);

    const regulatoryDocument = await prisma.regulatoryDocuments.update({
      where: { id },
      data: {
        title: title || null,
        content: content || null,
        titleEn: titleEn || null,
        contentEn: contentEn || null,
        url: url || null,
        linkText: linkText || null,
        linkTextEn: linkTextEn || null,
        photoUrls: photoUrlsJson,
      } as any,
    });

    return NextResponse.json(regulatoryDocument);
  } catch (error) {
    console.error('Error updating regulatory document:', error);
    return NextResponse.json(
      { error: 'Failed to update regulatory document' },
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

    const regulatoryDocument = await prisma.regulatoryDocuments.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'Regulatory document deleted successfully',
      deletedId: regulatoryDocument.id 
    });
  } catch (error) {
    console.error('Error deleting regulatory document:', error);
    return NextResponse.json(
      { error: 'Failed to delete regulatory document' },
      { status: 500 }
    );
  }
}

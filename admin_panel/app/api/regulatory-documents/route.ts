import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('GET request received for regulatory documents');
    const regulatoryDocuments = await prisma.regulatoryDocuments.findMany({
      orderBy: { createdAt: 'asc' }
    });
    console.log('Found documents:', regulatoryDocuments);
    console.log('Documents count:', regulatoryDocuments.length);
    
    return NextResponse.json(regulatoryDocuments);
  } catch (error) {
    console.error('Error fetching regulatory documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch regulatory documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST request received for regulatory documents');
    const body = await request.json();
    console.log('Request body:', body);
    
    const { title, content, titleEn, contentEn, url, photoUrls, linkText, linkTextEn } = body;

    console.log('Extracted fields:', { title, content, titleEn, contentEn, url, photoUrls, linkText, linkTextEn });

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
      console.log('Validation failed: no fields provided');
      return NextResponse.json(
        { error: 'At least one field must be provided: title, content, titleEn, contentEn, url, linkText, linkTextEn, or photoUrls' },
        { status: 400 }
      );
    }

    const photoUrlsJson = JSON.stringify(photoUrls || []);
    console.log('Photo URLs JSON:', photoUrlsJson);

    const dataToCreate = {
      title: title || null,
      content: content || null,
      titleEn: titleEn || null,
      contentEn: contentEn || null,
      url: url || null,
      linkText: linkText || null,
      linkTextEn: linkTextEn || null,
      photoUrls: photoUrlsJson,
    };
    
    console.log('Data to create:', dataToCreate);
    console.log('Prisma client:', prisma);
    console.log('RegulatoryDocuments model:', prisma.regulatoryDocuments);

    const regulatoryDocument = await prisma.regulatoryDocuments.create({
      data: dataToCreate as any,
    });

    console.log('Created document:', regulatoryDocument);
    return NextResponse.json(regulatoryDocument);
  } catch (error) {
    console.error('Error creating regulatory document:', error);
    console.error('Error name:', (error as Error).name);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    
    // Повертаємо більш детальну інформацію про помилку
    return NextResponse.json(
      { 
        error: 'Failed to create regulatory document',
        details: (error as Error).message,
        name: (error as Error).name
      },
      { status: 500 }
    );
  }
}



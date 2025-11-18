import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const publicInformation = await prisma.publicInformation.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(publicInformation);
  } catch (error) {
    console.error('Error fetching public information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public information' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST request received for public information');
    const body = await request.json();
    console.log('Request body:', body);
    
    const { title, content, titleEn, contentEn, url, linkText, linkTextEn, photoUrls } = body;

    console.log('Extracted fields:', { title, content, titleEn, contentEn, url, linkText, linkTextEn, photoUrls });

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

    const publicInfo = await prisma.publicInformation.create({
      data: dataToCreate as any,
    });

    console.log('Created public information:', publicInfo);
    return NextResponse.json(publicInfo);
  } catch (error) {
    console.error('Error creating public information:', error);
    console.error('Error name:', (error as Error).name);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    
    return NextResponse.json(
      { 
        error: 'Failed to create public information',
        details: (error as Error).message,
        name: (error as Error).name
      },
      { status: 500 }
    );
  }
}

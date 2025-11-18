import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const financialReports = await prisma.financialReports.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(financialReports);
  } catch (error) {
    console.error('Error fetching financial reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch financial reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST request received for financial reports');
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

    const financialReport = await prisma.financialReports.create({
      data: dataToCreate as any,
    });

    console.log('Created financial report:', financialReport);
    return NextResponse.json(financialReport);
  } catch (error) {
    console.error('Error creating financial report:', error);
    console.error('Error name:', (error as Error).name);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    
    return NextResponse.json(
      { 
        error: 'Failed to create financial report',
        details: (error as Error).message,
        name: (error as Error).name
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const articles = await prisma.antiBullying.findMany({
      orderBy: { id: 'desc' }
    });
    
    const response = NextResponse.json(articles);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Error fetching anti-bullying articles:', error);
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return errorResponse;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, text, link, linkText, photoUrls, titleEn, contentEn, linkTextEn } = await request.json();

    console.log('Extracted fields:', { title, content, text, link, linkText, photoUrls, titleEn, contentEn, linkTextEn });

    // Валідація - принаймні одне поле має бути заповнене
    const hasTitle = title && title.trim() !== '';
    const hasContent = content && content.trim() !== '';
    const hasText = text && text.trim() !== '';
    const hasLink = link && link.trim() !== '';
    const hasTitleEn = titleEn && titleEn.trim() !== '';
    const hasContentEn = contentEn && contentEn.trim() !== '';
    const hasLinkTextEn = linkTextEn && linkTextEn.trim() !== '';
    
    if (!hasTitle && !hasContent && !hasText && !hasLink && !hasTitleEn && !hasContentEn && !hasLinkTextEn) {
      const errorResponse = NextResponse.json(
        { 
          error: 'At least one field must be provided: title, content, text, link, titleEn, contentEn, or linkTextEn',
          received: { title, content, text, link, linkText, photoUrls, titleEn, contentEn, linkTextEn }
        },
        { status: 400 }
      );
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      return errorResponse;
    }
    
    const article = await prisma.antiBullying.create({
      data: {
        title: title || null,
        content: content || null,
        text: text || null,
        link: link || null,
        linkText: linkText || null,
        titleEn: titleEn || null,
        contentEn: contentEn || null,
        linkTextEn: linkTextEn || null,
        photoUrls: photoUrls || null
      }
    });
    
    const response = NextResponse.json(article, { status: 201 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Error creating anti-bullying article:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    const errorResponse = NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return errorResponse;
  }
}

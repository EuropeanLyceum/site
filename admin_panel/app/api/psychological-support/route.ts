import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const psychologicalSupport = await prisma.psychologicalSupport.findMany({
      orderBy: { id: 'desc' }
    });

    const response = NextResponse.json(psychologicalSupport);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('❌ Помилка при отриманні психологічної підтримки:', error);
    const errorResponse = NextResponse.json(
      { error: 'Помилка сервера при отриманні даних' },
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
    const body = await request.json();
    const { title, content, text, link, linkText, titleEn, contentEn, textEn, linkTextEn } = body;

    console.log('Extracted fields:', { title, content, text, link, linkText, titleEn, contentEn, textEn, linkTextEn });

    // Валідація - принаймні одне поле має бути заповнене
    const hasTitle = title && title.trim() !== '';
    const hasContent = content && content.trim() !== '';
    const hasText = text && text.trim() !== '';
    const hasLink = link && link.trim() !== '';
    const hasTitleEn = titleEn && titleEn.trim() !== '';
    const hasContentEn = contentEn && contentEn.trim() !== '';
    const hasTextEn = textEn && textEn.trim() !== '';
    const hasLinkTextEn = linkTextEn && linkTextEn.trim() !== '';
    
    if (!hasTitle && !hasContent && !hasText && !hasLink && !hasTitleEn && !hasContentEn && !hasTextEn && !hasLinkTextEn) {
      const errorResponse = NextResponse.json(
        { 
          error: 'At least one field must be provided: title, content, text, link, titleEn, contentEn, textEn, or linkTextEn',
          received: { title, content, text, link, linkText, titleEn, contentEn, textEn, linkTextEn }
        },
        { status: 400 }
      );
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      return errorResponse;
    }

    const psychologicalSupport = await prisma.psychologicalSupport.create({
      data: {
        title: title || null,
        content: content || null,
        text: text || null,
        link: link || null,
        linkText: linkText || null,
        titleEn: titleEn || null,
        contentEn: contentEn || null,
        textEn: textEn || null,
        linkTextEn: linkTextEn || null,
      },
    });

    const response = NextResponse.json(psychologicalSupport);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('❌ Помилка при створенні психологічної підтримки:', error);
    const errorResponse = NextResponse.json(
      { error: 'Помилка сервера при створенні' },
      { status: 500 }
    );
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return errorResponse;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

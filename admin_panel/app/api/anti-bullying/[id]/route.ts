import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const article = await prisma.antiBullying.findUnique({
      where: { id: parseInt(awaitedParams.id) }
    });
    
    if (!article) {
      const errorResponse = NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      return errorResponse;
    }
    
    const response = NextResponse.json(article);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Error fetching article:', error);
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return errorResponse;
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    console.log('PUT request - awaitedParams:', awaitedParams);
    const { title, content, text, link, linkText, photoUrls, titleEn, contentEn, linkTextEn } = await request.json();
    console.log('PUT request - data:', { title, content, text, link, linkText, photoUrls, titleEn, contentEn, linkTextEn });

    // Перевіряємо, чи передано ID
    if (!awaitedParams.id || isNaN(parseInt(awaitedParams.id))) {
      const errorResponse = NextResponse.json(
        { error: 'Valid ID is required for update' },
        { status: 400 }
      );
      
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      
      return errorResponse;
    }

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
        { error: 'At least one field must be provided: title, content, text, link, titleEn, contentEn, or linkTextEn' },
        { status: 400 }
      );
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      return errorResponse;
    }
    
    const article = await prisma.antiBullying.update({
      where: { id: parseInt(awaitedParams.id) },
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
    
    const response = NextResponse.json(article);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Error updating article:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    const errorResponse = NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return errorResponse;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    await prisma.antiBullying.delete({
      where: { id: parseInt(awaitedParams.id) }
    });
    
    const response = NextResponse.json({ message: 'Article deleted successfully' });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('Error deleting article:', error);
    const errorResponse = NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return errorResponse;
  }
}

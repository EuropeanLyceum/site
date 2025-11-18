import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const items = await prisma.helpTeacher.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching help teacher items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch help teacher items' },
      { status: 500 }
    );
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
      return NextResponse.json(
        { 
          error: 'At least one field must be provided: title, content, text, link, titleEn, contentEn, textEn, or linkTextEn',
          received: { title, content, text, link, linkText, titleEn, contentEn, textEn, linkTextEn }
        },
        { status: 400 }
      );
    }

    const item = await prisma.helpTeacher.create({
      data: {
        title: title?.trim() || null,
        content: content?.trim() || null,
        text: text?.trim() || null,
        link: link?.trim() || null,
        linkText: linkText?.trim() || null,
        titleEn: titleEn?.trim() || null,
        contentEn: contentEn?.trim() || null,
        textEn: textEn?.trim() || null,
        linkTextEn: linkTextEn?.trim() || null,
        order: 0,
      } as any,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error creating help teacher item:', error);
    return NextResponse.json(
      { error: 'Failed to create help teacher item' },
      { status: 500 }
    );
  }
}

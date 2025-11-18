import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
      return NextResponse.json(
        { error: 'Category parameter is required' },
        { status: 400 }
      );
    }

    const accordions = await prisma.accordion.findMany({
      where: { category },
      orderBy: { order: 'asc' }
    });
    
    return NextResponse.json(accordions);
  } catch (error) {
    console.error('Error fetching accordions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accordions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, photoUrl, url, category, order } = body;

    const accordion = await prisma.accordion.create({
      data: {
        title,
        content,
        photoUrl: photoUrl || null,
        url: url || null,
        category,
        order,
      },
    });

    return NextResponse.json(accordion);
  } catch (error) {
    console.error('Error creating accordion:', error);
    return NextResponse.json(
      { error: 'Failed to create accordion' },
      { status: 500 }
    );
  }
}




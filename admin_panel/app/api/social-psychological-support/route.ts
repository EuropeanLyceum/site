import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.socialPsychologicalSupport.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching social psychological support:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social psychological support' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    // Валідація - принаймні одне поле має бути заповнене
    if (!title && !content) {
      return NextResponse.json(
        { error: 'At least one field must be filled' },
        { status: 400 }
      );
    }

    const item = await prisma.socialPsychologicalSupport.create({
      data: {
        title: title || null,
        content: content || null,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error creating social psychological support:', error);
    return NextResponse.json(
      { error: 'Failed to create social psychological support' },
      { status: 500 }
    );
  }
}

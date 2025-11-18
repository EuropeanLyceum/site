import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { direction } = body;

    // Отримуємо поточний стаття
    const currentAccordion = await prisma.accordion.findUnique({
      where: { id },
    });

    if (!currentAccordion) {
      return NextResponse.json(
        { error: 'Accordion not found' },
        { status: 404 }
      );
    }

    // Знаходимо стаття для обміну
    const targetOrder = direction === 'up' 
      ? currentAccordion.order - 1 
      : currentAccordion.order + 1;

    const targetAccordion = await prisma.accordion.findFirst({
      where: {
        category: currentAccordion.category,
        order: targetOrder,
      },
    });

    if (!targetAccordion) {
      return NextResponse.json(
        { error: 'Cannot move accordion' },
        { status: 400 }
      );
    }

    // Обмінюємо порядок
    await prisma.$transaction([
      prisma.accordion.update({
        where: { id: currentAccordion.id },
        data: { order: targetAccordion.order },
      }),
      prisma.accordion.update({
        where: { id: targetAccordion.id },
        data: { order: currentAccordion.order },
      }),
    ]);

    return NextResponse.json({ message: 'Accordion moved successfully' });
  } catch (error) {
    console.error('Error moving accordion:', error);
    return NextResponse.json(
      { error: 'Failed to move accordion' },
      { status: 500 }
    );
  }
}




import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);
    const body = await req.json();

    console.log('🔄 PUT запит для переміщення evaluation criteria з ID:', id);
    console.log('📦 Body:', JSON.stringify(body, null, 2));

    const { direction } = body;

    if (!direction || !['up', 'down'].includes(direction)) {
      return NextResponse.json(
        { error: 'Direction must be "up" or "down"' },
        { status: 400 }
      );
    }

    // Отримуємо поточний критерій
    const currentCriteria = await prisma.evaluationCriteria.findUnique({
      where: { id },
      select: { order: true }
    });

    if (!currentCriteria) {
      return NextResponse.json(
        { error: 'Evaluation criteria not found' },
        { status: 404 }
      );
    }

    // Отримуємо всі критерії, впорядковані за порядком
    const allCriteria = await prisma.evaluationCriteria.findMany({
      orderBy: { order: 'asc' },
      select: { id: true, order: true }
    });

    const currentIndex = allCriteria.findIndex(c => c.id === id);
    if (currentIndex === -1) {
      return NextResponse.json(
        { error: 'Evaluation criteria not found in list' },
        { status: 404 }
      );
    }

    let targetIndex: number;
    if (direction === 'up') {
      targetIndex = currentIndex - 1;
    } else {
      targetIndex = currentIndex + 1;
    }

    // Перевіряємо, чи можна перемістити
    if (targetIndex < 0 || targetIndex >= allCriteria.length) {
      return NextResponse.json(
        { error: 'Cannot move evaluation criteria in this direction' },
        { status: 400 }
      );
    }

    const targetCriteria = allCriteria[targetIndex];

    // Обмінюємо порядки
    await prisma.$transaction([
      prisma.evaluationCriteria.update({
        where: { id },
        data: { order: targetCriteria.order }
      }),
      prisma.evaluationCriteria.update({
        where: { id: targetCriteria.id },
        data: { order: currentCriteria.order }
      })
    ]);

    console.log('✅ Evaluation criteria успішно переміщено');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error moving evaluation criteria:', error);
    return NextResponse.json(
      { error: 'Failed to move evaluation criteria' },
      { status: 500 }
    );
  }
}

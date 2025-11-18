import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { direction } = body; // 'up' або 'down'

    const currentItem = await prisma.methodologicalEvents.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!currentItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    let targetItem;
    if (direction === 'up') {
      targetItem = await prisma.methodologicalEvents.findFirst({
        where: { order: { lt: currentItem.order } },
        orderBy: { order: 'desc' }
      });
    } else {
      targetItem = await prisma.methodologicalEvents.findFirst({
        where: { order: { gt: currentItem.order } },
        orderBy: { order: 'asc' }
      });
    }

    if (!targetItem) {
      return NextResponse.json(
        { error: 'Cannot move item' },
        { status: 400 }
      );
    }

    // Міняємо порядок
    await prisma.methodologicalEvents.updateMany({
      where: { id: currentItem.id },
      data: { order: targetItem.order }
    });

    await prisma.methodologicalEvents.updateMany({
      where: { id: targetItem.id },
      data: { order: currentItem.order }
    });

    return NextResponse.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error moving methodological-events:', error);
    return NextResponse.json(
      { error: 'Failed to move item' },
      { status: 500 }
    );
  }
}

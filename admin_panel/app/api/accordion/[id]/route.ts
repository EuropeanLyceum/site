import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { title, content, photoUrl, url, category, order } = body;

    const accordion = await prisma.accordion.update({
      where: { id },
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
    console.error('Error updating accordion:', error);
    return NextResponse.json(
      { error: 'Failed to update accordion' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.accordion.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Accordion deleted successfully' });
  } catch (error) {
    console.error('Error deleting accordion:', error);
    return NextResponse.json(
      { error: 'Failed to delete accordion' },
      { status: 500 }
    );
  }
}




import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const body = await request.json();
    const { title, content } = body;

    // Валідація - принаймні одне поле має бути заповнене
    if (!title && !content) {
      return NextResponse.json(
        { error: 'At least one field must be filled' },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.socialPsychologicalSupport.update({
      where: { id: parseInt(awaitedParams.id) },
      data: {
        title: title || null,
        content: content || null,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating social psychological support:', error);
    return NextResponse.json(
      { error: 'Failed to update social psychological support' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    
    await prisma.socialPsychologicalSupport.delete({
      where: { id: parseInt(awaitedParams.id) },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting social psychological support:', error);
    return NextResponse.json(
      { error: 'Failed to delete social psychological support' },
      { status: 500 }
    );
  }
}

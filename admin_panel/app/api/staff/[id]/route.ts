import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        category: true, // Включаємо дані категорії
      },
    });

    if (!staff) {
      return NextResponse.json(
          { error: "Вчителя не знайдено" },
          { status: 404 }
      );
    }

    return NextResponse.json(staff);
  } catch (error) {
    console.error("❌ Error fetching staff:", error instanceof Error ? error.message : error);
    return NextResponse.json(
        { error: "Помилка при отриманні вчителя" },
        { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);
    const body = await req.json();
    const { fullName, description, fullNameEn, descriptionEn, photoUrl, categoryId, order } = body;

    // Перевіряємо, чи передано ID
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'Valid ID is required for update' },
        { status: 400 }
      );
    }

    // Валідація даних - принаймні одне поле має бути заповнене
    const hasFullName = fullName && fullName.trim() !== '';
    const hasDescription = description && description.trim() !== '';
    const hasFullNameEn = fullNameEn && fullNameEn.trim() !== '';
    const hasDescriptionEn = descriptionEn && descriptionEn.trim() !== '';
    
    if (!hasFullName && !hasDescription && !hasFullNameEn && !hasDescriptionEn) {
      return NextResponse.json(
        { error: 'At least one field must be provided: fullName, description, fullNameEn, descriptionEn' },
        { status: 400 }
      );
    }

    const staff = await prisma.staff.update({
      where: { id },
      data: {
        fullName: fullName || '',
        description: description || '',
        fullNameEn: fullNameEn || null,
        descriptionEn: descriptionEn || null,
        photoUrl: photoUrl || null,
        categoryId: parseInt(categoryId),
        order: order || 0,
      } as any,
      include: {
        category: true, // Включаємо дані категорії
      },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error("❌ Error updating staff:", error instanceof Error ? error.message : error);
    return NextResponse.json(
        { error: "Помилка при оновленні вчителя" },
        { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'Valid ID is required for deletion' },
        { status: 400 }
      );
    }

    const staff = await prisma.staff.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: "Staff member deleted successfully",
      deletedId: staff.id 
    });
  } catch (error) {
    console.error("❌ Error deleting staff:", error instanceof Error ? error.message : error);
    return NextResponse.json(
        { error: "Помилка при видаленні вчителя" },
        { status: 500 }
    );
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 200 });
}

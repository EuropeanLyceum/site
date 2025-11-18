import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    console.log("📝 POST /api/staff - початок виконання");
    const body = await req.json();
    console.log("📦 Дані для створення вчителя:", body);

    const { fullName, description, fullNameEn, descriptionEn, photoUrl, categoryId, order } = body;

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

    // Перевіряємо чи існує категорія
    const categoryExists = await prisma.staffCategory.findUnique({
      where: { id: parseInt(categoryId) }
    });

    if (!categoryExists) {
      return NextResponse.json(
          { error: `Категорія з ID ${categoryId} не існує` },
          { status: 400 }
      );
    }

    console.log("💾 Створюємо запис в БД...");
    const staff = await prisma.staff.create({
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

    console.log("✅ Запис створено:", staff.id);
    console.log("📤 Повертаємо результат:", staff);

    return NextResponse.json(staff, { status: 201 });

  } catch (error) {
    console.error("❌ Error creating staff:", error instanceof Error ? error.message : error);
    return NextResponse.json(
        { error: (error as Error).message || "Щось пішло не так" },
        { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { order: 'asc' }, // Сортуємо за полем order
      include: {
        category: true, // Включаємо дані категорії
      },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error("❌ Error fetching staff:", error);
    return NextResponse.json(
        { error: "Failed to fetch staff" },
        { status: 500 }
    );
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 200 });
}

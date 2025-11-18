import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const id = parseInt(awaitedParams.id);
    
    console.log('🗑️ Спроба видалення категорії з ID:', id);
    
    // Перевіряємо чи існує категорія
    const categoryExists = await prisma.staffCategory.findUnique({
      where: { id }
    });

    if (!categoryExists) {
      console.log('❌ Категорія не знайдена');
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Перевіряємо чи є співробітники з цією категорією
    const staffWithCategory = await prisma.staff.findFirst({
      where: { categoryId: id }
    });

    if (staffWithCategory) {
      console.log('❌ Категорія має співробітників, видалення неможливе');
      return NextResponse.json(
        { error: 'Cannot delete category that has staff members. Please reassign or delete staff members first.' },
        { status: 400 }
      );
    }

    console.log('✅ Видаляємо категорію...');
    await prisma.staffCategory.delete({
      where: { id },
    });

    console.log('✅ Категорія успішно видалена');
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting staff category:', error);
    return NextResponse.json(
      { error: 'Failed to delete staff category' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 200 });
}

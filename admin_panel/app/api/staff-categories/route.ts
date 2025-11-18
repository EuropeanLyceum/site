import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.staffCategory.findMany({
      orderBy: { order: 'asc' }
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching staff categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, nameEn } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Перевіряємо чи категорія вже існує
    const existingCategory = await prisma.staffCategory.findUnique({
      where: { name: name.trim() }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    // Знаходимо максимальний порядок
    const maxOrder = await prisma.staffCategory.aggregate({
      _max: { order: true }
    });

    const newOrder = (maxOrder._max.order || 0) + 1;

    const category = await prisma.staffCategory.create({
      data: {
        name: name.trim(),
        nameEn: nameEn?.trim() || null,
        order: newOrder
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating staff category:', error);
    return NextResponse.json(
      { error: 'Failed to create staff category' },
      { status: 500 }
    );
  }
}

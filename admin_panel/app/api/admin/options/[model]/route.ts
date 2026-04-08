import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// /admin/api/admin/options/[model]/route.ts

export async function GET(req: NextRequest, { params }: { params: Promise<{ model: string }> }) {
    try {
        const { model: modelName } = await params;
        const { searchParams } = new URL(req.url);

        const prismaKey = Object.keys(prisma).find(k => k.toLowerCase() === modelName.toLowerCase());
        const model = (prisma as any)[prismaKey || ''];

        const category = searchParams.get('category');
        // Отримуємо новий параметр фільтрації
        const hasSubItemsParam = searchParams.get('hasSubItems');

        if (!model) return NextResponse.json({ error: 'Model not found' }, { status: 404 });

        const modelMetadata = Prisma.dmmf.datamodel.models.find(
            (m) => m.name.toLowerCase() === modelName.toLowerCase()
        );
        const existingFields = modelMetadata?.fields.map(f => f.name) || [];

        // Формуємо об'єкт WHERE
        const where: any = {};

        // Фільтр по категорії (для звітів)
        if (category && existingFields.includes('category')) {
            where.category = category;
        }

        // Фільтр по hasSubItems (для дисциплін)
        if (hasSubItemsParam !== null && existingFields.includes('hasSubItems')) {
            where.hasSubItems = hasSubItemsParam === 'true';
        }

        const possibleFields = ['id', "name", 'nameUk', 'titleUk', 'fullNameUk', 'questionUk'];
        const selectFields = possibleFields.reduce((acc: any, field) => {
            if (existingFields.includes(field)) acc[field] = true;
            return acc;
        }, {});

        if (Object.keys(selectFields).length === 0) selectFields['id'] = true;

        const items = await model.findMany({
            where, // Використовуємо сформований об'єкт
            select: selectFields,
            take: 100,
            orderBy: existingFields.includes('name')
                ? { name: 'asc' }
                : existingFields.includes('nameUk')
                    ? { nameUk: 'asc' }
                    : undefined
        });

        return NextResponse.json(items);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ model: string }> }) {
    try {
        const { model } = await params;
        const { searchParams } = new URL(req.url);

        const prismaModelName = Object.keys(prisma).find(
            (key) => key.toLowerCase() === model.toLowerCase()
        );

        if (!prismaModelName || prismaModelName.startsWith('_')) {
            return NextResponse.json({ error: `Model ${model} not found` }, { status: 404 });
        }

        const modelClient = (prisma as any)[prismaModelName];

        // Пагінація
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = 20;
        const search = searchParams.get('search') || '';

        // Фільтри (Contextual)
        const type = searchParams.get('type');
        const category = searchParams.get('category');
        const pageKey = searchParams.get('pageKey');

        // Будуємо WHERE
        const where: any = {};

        // 1. Пошук по тексту
        if (search) {
            where.OR = [
                { titleUk: { contains: search, mode: 'insensitive' } },
                { fullNameUk: { contains: search, mode: 'insensitive' } },
                { nameUk: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
            ];
        }

        // 2. Спеціальні фільтри
        if (type) where.type = type;
        if (category) where.category = category;
        if (pageKey) where.pageKey = pageKey;

        // Виконання запиту
        const [data, total] = await Promise.all([
            modelClient.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { id: 'desc' }, // Сортування нові -> старі (для більшості)
            }),
            modelClient.count({ where }),
        ]);

        return NextResponse.json({
            data,
            meta: { totalPages: Math.ceil(total / limit) || 1, total }
        });
    } catch (error: any) {
        console.error("🚨 API GET ERROR:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ model: string }> }) {
    try {
        const { model } = await params;
        const body = await req.json();

        const prismaModelName = Object.keys(prisma).find(
            (key) => key.toLowerCase() === model.toLowerCase()
        );

        if (!prismaModelName) return NextResponse.json({ error: 'Model not found' }, { status: 404 });

        // Видаляємо системні поля, які база генерує сама (окрім ID для PageSection)
        const { createdAt, updatedAt, ...createData } = body;

        // Для PageSection ID потрібен, для інших - видаляємо, якщо це автоінкремент
        if (model !== 'pageSection' && model !== 'location' && model !== 'specialization') {
            delete createData.id;
        }

        const newItem = await (prisma as any)[prismaModelName].create({ data: createData });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error: any) {
        console.error("🚨 API POST ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
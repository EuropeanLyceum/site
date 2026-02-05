import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface RouteContext {
    params: Promise<{ model: string }>;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ model: string }> }) {
    try {
        const { model: modelName } = await params;
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get('page') || 1);
        const limit = Number(searchParams.get('limit') || 10);
        const search = searchParams.get('search') || '';

        const prismaKey = Object.keys(prisma).find(k => k.toLowerCase() === modelName.toLowerCase());
        const model = (prisma as any)[prismaKey || ''];
        if (!model) return NextResponse.json({ error: 'Model not found' }, { status: 404 });

        // Фільтри
        const filters: Record<string, any> = {};
        searchParams.forEach((v, k) => {
            if (['page', 'limit', 'search'].includes(k)) return;
            filters[k] = !isNaN(Number(v)) ? Number(v) : v;
        });

        // ДИНАМІЧНИЙ ПОШУК: Отримуємо список полів моделі
        const modelInfo = Prisma.dmmf.datamodel.models.find(m => m.name.toLowerCase() === modelName.toLowerCase());
        const existingFields = modelInfo?.fields.map(f => f.name) || [];

        const searchFields = ['titleUk', 'nameUk', 'fullNameUk', 'questionUk', 'slug', 'descriptionUk'];
        const activeFields = searchFields.filter(f => existingFields.includes(f));

        const searchWhere = (search && activeFields.length > 0) ? {
            OR: activeFields.map(f => ({ [f]: { contains: search, mode: 'insensitive' } }))
        } : {};

        const [data, total] = await Promise.all([
            model.findMany({
                where: { ...filters, ...searchWhere },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: existingFields.includes('order') ? { order: 'asc' } : { updatedAt: 'desc' },
            }),
            model.count({ where: { ...filters, ...searchWhere } }),
        ]);

        return NextResponse.json({ data, meta: { total, totalPages: Math.ceil(total / limit) } });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: RouteContext) {
    try {
        const { model: modelName } = await params;
        const body = await req.json();

        const prismaKey = Object.keys(prisma).find(k => k.toLowerCase() === modelName.toLowerCase());
        const model = (prisma as any)[prismaKey || ''];

        // Remove system fields that should not be set manually on create
        const { id, createdAt, updatedAt, ...data } = body;

        // Auto-formatting values based on field naming conventions
        const formattedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => {
                // Handle Dates
                if (value && typeof value === 'string' && (key.endsWith('At') || key.includes('Date'))) {
                    return [key, new Date(value)];
                }
                // Handle Numbers (Counts, Order, IDs)
                if (typeof value === 'string' && (key.endsWith('Count') || key === 'order' || key.endsWith('Real'))) {
                    return [key, Number(value)];
                }
                // Handle arrays (Tags, Highlights, Photo Galleries)
                if (Array.isArray(value)) {
                    return [key, value];
                }
                return [key, value];
            })
        );

        const item = await model.create({ data: formattedData });
        return NextResponse.json(item);
    } catch (e: any) {
        console.error("API POST Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
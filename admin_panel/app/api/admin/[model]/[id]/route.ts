import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Моделі, які використовують String ID
const STRING_ID_MODELS = ['location', 'specialization', 'pagesection', 'user'];

export async function GET(req: NextRequest, { params }: { params: Promise<{ model: string, id: string }> }) {
    try {
        const { model, id } = await params;
        const prismaModelName = Object.keys(prisma).find(key => key.toLowerCase() === model.toLowerCase());

        if (!prismaModelName) return NextResponse.json({ error: 'Model not found' }, { status: 404 });

        // Визначаємо тип ID
        const finalId = STRING_ID_MODELS.includes(model.toLowerCase()) ? id : Number(id);

        const item = await (prisma as any)[prismaModelName].findUnique({ where: { id: finalId } });

        if (!item) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        return NextResponse.json(item);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ model: string, id: string }> }) {
    try {
        const { model, id } = await params;
        const body = await req.json();

        const prismaModelName = Object.keys(prisma).find(key => key.toLowerCase() === model.toLowerCase());
        if (!prismaModelName) return NextResponse.json({ error: 'Model not found' }, { status: 404 });

        const finalId = STRING_ID_MODELS.includes(model.toLowerCase()) ? id : Number(id);
        const { id: _, createdAt, updatedAt, ...updateData } = body;

        const updated = await (prisma as any)[prismaModelName].update({
            where: { id: finalId },
            data: updateData
        });
        return NextResponse.json(updated);
    } catch (error: any) {
        console.error("🚨 API PATCH ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ model: string, id: string }> }) {
    try {
        const { model, id } = await params;
        const prismaModelName = Object.keys(prisma).find(key => key.toLowerCase() === model.toLowerCase());

        if (!prismaModelName) return NextResponse.json({ error: 'Model not found' }, { status: 404 });

        const finalId = STRING_ID_MODELS.includes(model.toLowerCase()) ? id : Number(id);

        await (prisma as any)[prismaModelName].delete({ where: { id: finalId } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
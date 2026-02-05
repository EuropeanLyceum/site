import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to determine if a model uses String IDs (CUID/UUID)
const isStringId = (model: string) =>
    ['location', 'specialization', 'user'].includes(model.toLowerCase());

interface RouteContext {
    params: Promise<{ model: string; id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
    try {
        const { model, id } = await params;
        const prismaModel = (prisma as any)[Object.keys(prisma).find(k => k.toLowerCase() === model.toLowerCase()) || ''];

        if (!prismaModel) return NextResponse.json({ error: 'Model not found' }, { status: 404 });

        const item = await prismaModel.findUnique({
            where: { id: isStringId(model) ? id : Number(id) },
            // If it's a DocumentReport, we might want to include sub-relations
            include: model.toLowerCase() === 'documentreport' ? { documents: true, subReports: true } : undefined
        });

        return item ? NextResponse.json(item) : NextResponse.json({ error: 'Not found' }, { status: 404 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
    try {
        const { model, id } = await params;
        const body = await req.json();
        const prismaModel = (prisma as any)[Object.keys(prisma).find(k => k.toLowerCase() === model.toLowerCase()) || ''];

        const { id: _, createdAt, updatedAt, ...data } = body;

        // Auto-cast strings to Dates or Numbers where necessary
        const formattedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => {
                if (value && (key.endsWith('At') || key.includes('Date'))) return [key, new Date(value as string)];
                if (key.endsWith('Count') || key === 'order') return [key, Number(value)];
                return [key, value];
            })
        );

        const updated = await prismaModel.update({
            where: { id: isStringId(model) ? id : Number(id) },
            data: formattedData,
        });

        return NextResponse.json(updated);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
    try {
        const { model, id } = await params;
        const prismaModel = (prisma as any)[Object.keys(prisma).find(k => k.toLowerCase() === model.toLowerCase()) || ''];

        await prismaModel.delete({ where: { id: isStringId(model) ? id : Number(id) } });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}
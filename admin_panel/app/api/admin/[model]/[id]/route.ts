// app/api/admin/[model]/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const isStringId = (model: string) =>
    ['location', 'user'].includes(model.toLowerCase());

interface RouteContext {
    params: Promise<{ model: string; id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
    try {
        const { model, id } = await params;
        const prismaModel = (prisma as any)[Object.keys(prisma).find(k => k.toLowerCase() === model.toLowerCase()) || ''];
        if (!prismaModel) return NextResponse.json({ error: 'Model not found' }, { status: 404 });

        const lowerModel = model.toLowerCase();

        const include =
            lowerModel === 'documentreport'
                ? { documents: true, subReports: true }
                : lowerModel === 'testquestion'
                    ? { options: { include: { specialization: true } } }
                    : undefined;

        const item = await prismaModel.findUnique({
            where: { id: isStringId(model) ? id : Number(id) },
            include
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
        const prismaModel = (prisma as any)[
        Object.keys(prisma).find(k => k.toLowerCase() === model.toLowerCase()) || ''
            ];

        const lowerModel = model.toLowerCase();

        // 🔥 СПЕЦ-ЛОГІКА ДЛЯ TESTQUESTION
        if (lowerModel === 'testquestion') {
            const { options, id: _, createdAt, updatedAt, ...rest } = body;

            await prisma.$transaction(async (tx) => {
                // 1. оновлюємо питання
                await tx.testQuestion.update({
                    where: { id: Number(id) },
                    data: rest,
                });

                if (Array.isArray(options)) {
                    // 2. видаляємо старі відповіді
                    await tx.testOption.deleteMany({
                        where: { questionId: Number(id) }
                    });

                    // 3. створюємо нові
                    if (options.length > 0) {
                        await tx.testOption.createMany({
                            data: options.map((o: any) => ({
                                option: o.option,
                                optionEn: o.optionEn || null,
                                specializationId: o.specializationId,
                                questionId: Number(id),
                            }))
                        });
                    }
                }
            });

            const updated = await prisma.testQuestion.findUnique({
                where: { id: Number(id) },
                include: { options: { include: { specialization: true } } }
            });

            return NextResponse.json(updated);
        }

        // ===== УНІВЕРСАЛЬНА ЛОГІКА (без змін) =====
        const { id: _, createdAt, updatedAt, ...data } = body;

        const formattedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => {
                if (value === '' || value === null) return [key, null];

                if (key.endsWith('Id') && !isStringId(key.replace('Id', ''))) {
                    return [key, Number(value)];
                }
                if (typeof value === 'string' && (key.endsWith('At') || key.includes('Date'))) {
                    return [key, new Date(value)];
                }
                if (typeof value === 'string' && (key.endsWith('Count') || key === 'order' || key.endsWith('Real'))) {
                    return [key, Number(value)];
                }
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
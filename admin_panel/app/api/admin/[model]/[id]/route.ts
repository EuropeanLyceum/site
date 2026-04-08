// app/api/admin/[model]/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {persistTempFiles} from "@/lib/file-utils";
import { Prisma } from '@prisma/client';

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

        // 1. Отримуємо дані
        let body = await req.json();

        // 2. 🔥 ПЕРЕМІЩУЄМО ФАЙЛИ перед будь-якою логікою
        body = await persistTempFiles(body);

        const prismaModel = (prisma as any)[Object.keys(prisma).find(k => k.toLowerCase() === model.toLowerCase()) || ''];
        const lowerModel = model.toLowerCase();

        const modelInfo = Prisma.dmmf.datamodel.models.find(
            (m: { name: string; }) => m.name.toLowerCase() === lowerModel
        );

        // --- TestQuestion ---
        if (lowerModel === 'testquestion') {
            const { options, id: _, createdAt, updatedAt, ...rest } = body;

            await prisma.$transaction(async (tx: { testQuestion: { update: (arg0: { where: { id: number; }; data: any; }) => any; }; testOption: { deleteMany: (arg0: { where: { questionId: number; }; }) => any; createMany: (arg0: { data: { option: any; optionEn: any; specializationId: any; questionId: number; }[]; }) => any; }; }) => {
                // 1. Оновлюємо саме питання
                await tx.testQuestion.update({
                    where: { id: Number(id) },
                    data: rest,
                });

                if (Array.isArray(options)) {
                    // 2. Видаляємо старі (жорсткий підхід, але надійний для зв'язків)
                    await tx.testOption.deleteMany({
                        where: { questionId: Number(id) }
                    });

                    // 3. Створюємо нові (тут вже посилання на картинки виправлені persistTempFiles)
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

        // --- Універсальна логіка ---
        const { id: _, createdAt, updatedAt, ...data } = body;

        const formattedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => {
                // 1. Обробка порожніх значень
                if (value === '' || value === null || value === undefined) return [key, null];

                // Знаходимо опис поля в схемі Prisma
                const fieldInfo = modelInfo?.fields.find((f: { name: string; }) => f.name === key);
                const fieldType = fieldInfo?.type;

                // 2. Автоматичне приведення до числа (Int або Float)
                if (fieldType === 'Int' || fieldType === 'Float' || fieldType === 'BigInt') {
                    return [key, Number(value)];
                }

                // 3. Обробка ID (якщо це не рядок)
                if (key.endsWith('Id') && !isStringId(key.replace('Id', ''))) {
                    return [key, Number(value)];
                }

                // 4. Обробка дат
                if (typeof value === 'string' && (fieldType === 'DateTime' || key.endsWith('At') || key.includes('Date'))) {
                    const date = new Date(value);
                    return [key, isNaN(date.getTime()) ? null : date];
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
        console.error(e);
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
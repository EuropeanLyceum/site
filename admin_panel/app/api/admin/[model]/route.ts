import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';


export async function GET(req: NextRequest, { params }: { params: Promise<{ model: string }> }) {
    try {
        const {model: modelName} = await params;
        const {searchParams} = new URL(req.url);


        const page = Number(searchParams.get('page') || 1);
        const limit = Number(searchParams.get('limit') || 100);
        const search = searchParams.get('search') || '';


        const prismaKey = Object.keys(prisma).find(k => k.toLowerCase() === modelName.toLowerCase());
        const model = (prisma as any)[prismaKey || ''];
        if (!model) return NextResponse.json({error: 'Model not found'}, {status: 404});


        const filters: Record<string, any> = {};
        searchParams.forEach((v, k) => {
            if (['page', 'limit', 'search'].includes(k)) return;
            if (k === 'parentId' && v === 'null') {
                filters[k] = null;
            } else if (k.endsWith('Id')) {
                filters[k] = Number(v);
            } else {
                filters[k] = v;
            }
        });


        const modelInfo = Prisma.dmmf.datamodel.models.find(m => m.name.toLowerCase() === modelName.toLowerCase());
        const existingFields = modelInfo?.fields.map(f => f.name) || [];


// include для testquestion
        let include: any = undefined;
        const lowerModelName = modelName.toLowerCase();
        if (lowerModelName === 'documentreport') {
            include = {
                documents: true,
                subReports: {include: {documents: true}}
            };
        } else if (lowerModelName === 'discipline') {
            include = {subItems: true};
        } else if (lowerModelName === 'testquestion') {
            include = {options: {include: {specialization: true}}};
        }


        const searchFields = ['titleUk', 'nameUk', 'fullNameUk', 'fullNameEn', 'positionUk', 'positionEn'];
        const activeFields = searchFields.filter(f => existingFields.includes(f));


        const searchWhere = (search && activeFields.length > 0) ? {
            OR: activeFields.map(f => ({[f]: {contains: search, mode: 'insensitive'}}))
        } : {};


        const [data, total] = await Promise.all([
            model.findMany({
                where: {...filters, ...searchWhere},
                include,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: existingFields.includes('order') ? {order: 'asc'} : {updatedAt: 'desc'}
            }),
            model.count({where: {...filters, ...searchWhere}}),
        ]);


        return NextResponse.json({data, meta: {total, totalPages: Math.ceil(total / limit)}});
    } catch (e: any) {
        return NextResponse.json({error: e.message}, {status: 500});
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ model: string }> }) {
    try {
        const { model: modelName } = await params;
        const body = await req.json();


        const prismaKey = Object.keys(prisma).find(k => k.toLowerCase() === modelName.toLowerCase());
        const model = (prisma as any)[prismaKey || ''];


// Винятковий випадок: testquestion з опціями
        if (modelName.toLowerCase() === 'testquestion') {
            const { options, ...rest } = body;
            const preparedOptions = Array.isArray(options) ? options.map((o: any) => ({
                option: o.option,
                optionEn: o.optionEn || null,
                specializationId: o.specializationId || o.specialization || null
            })) : undefined;


            const dataToCreate: any = { ...rest };
            if (preparedOptions && preparedOptions.length > 0) {
                dataToCreate.options = { create: preparedOptions };
            }


            const item = await (prisma as any).testQuestion.create({ data: dataToCreate, include: { options: { include: { specialization: true } } } });
            return NextResponse.json(item);
        }


// Загальна логіка (без вкладених опцій)
        const { id, createdAt, updatedAt, ...data } = body;
        const formattedData = Object.fromEntries(
            Object.entries(data)
                .map(([key, value]) => {
                    if (value === '' || value === null || value === undefined) {
                        if (key.endsWith('At') || key.includes('Date') || key === 'publicationDate') return [key, undefined];
                        return [key, null];
                    }
                    if (key.endsWith('Id')) return [key, Number(value)];
                    if (typeof value === 'string' && (key.endsWith('At') || key.includes('Date'))) {
                        const date = new Date(value);
                        return [key, isNaN(date.getTime()) ? undefined : date];
                    }
                    if (typeof value === 'string' && (key.endsWith('Count') || key === 'order' || key.endsWith('Real'))) return [key, Number(value)];
                    return [key, value];
                })
                .filter(([_, v]) => v !== undefined)
        );


        const item = await model.create({ data: formattedData });
        return NextResponse.json(item);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
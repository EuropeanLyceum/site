import { Prisma } from '@prisma/client';

const MODEL_MAP: Record<string, string> = {
    // Адміністрування
    adminUser: 'AdminUser',

    // Контент та сторінки
    content: 'Content',
    pageSection: 'PageSection',
    fAQ: 'FAQ',
    externalLink: 'ExternalLink',

    // Налаштування ліцею та нові таблиці візитки
    lyceumStats: 'LyceumStats',
    clubs: 'Clubs',
    workingArea: 'WorkingArea',

    // Люди та категорії
    person: 'Person',
    personCategory: 'PersonCategory',

    // Документи
    documentReport: 'DocumentReport',
    fileAsset: 'FileAsset',

    // Навчання та профілі
    discipline: 'Discipline',
    disciplineSubItem: 'DisciplineSubItem',
    specialization: 'Specialization',

    // VR та Тести
    location: 'Location',
    testQuestion: 'TestQuestion',
};

export function getPrismaModelName(model: string) {
    return MODEL_MAP[model] || model;
}

export function filterByPrismaModel(modelName: string, data: Record<string, any>) {
    const prismaModelName = getPrismaModelName(modelName);

    const model = Prisma.dmmf.datamodel.models.find(
        (m: { name: string }) => m.name === prismaModelName
    );

    if (!model) return data;

    const allowedFields = model.fields.map((f: { name: any; }) => f.name);

    return Object.fromEntries(
        Object.entries(data).filter(([key]) => allowedFields.includes(key))
    );
}


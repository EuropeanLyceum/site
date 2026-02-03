import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Шлях до папки public/uploads
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // Створюємо папку, якщо її немає
        await mkdir(uploadDir, { recursive: true });

        // Унікальне ім'я файлу
        const uniqueName = `${uuidv4()}-${file.name.replaceAll(' ', '_')}`;
        const filePath = path.join(uploadDir, uniqueName);

        await writeFile(filePath, buffer);

        // Повертаємо посилання для БД
        return NextResponse.json({
            url: `/uploads/${uniqueName}`,
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            type: file.type.split('/')[1]
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
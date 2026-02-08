import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        const relativeUploadDir = '/files/uploads';
        const uploadDir = join(process.cwd(), 'public', relativeUploadDir);

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {}

        const urls = await Promise.all(
            files.map(async (file) => {
                const uniqueId = uuidv4();
                const originalExtension = extname(file.name).toLowerCase();
                const isImage = file.type.startsWith('image/');

                // Якщо це картинка — робимо .webp, якщо документ — лишаємо рідне розширення
                const fileName = isImage ? `${uniqueId}.webp` : `${uniqueId}${originalExtension}`;
                const path = join(uploadDir, fileName);

                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                let processedBuffer: Buffer;

                if (isImage) {
                    // Оптимізація для фото (як і раніше)
                    processedBuffer = await sharp(buffer)
                        .rotate()
                        .resize({ width: 1920, withoutEnlargement: true })
                        .webp({ quality: 80 })
                        .toBuffer();
                } else {
                    // Для PDF, DOC, DOCX, XLS просто використовуємо оригінальний буфер
                    // Стискати їх програмно дуже важко і зазвичай не варто
                    processedBuffer = buffer;
                }

                await writeFile(path, processedBuffer);

                return `/admin/api/media/${fileName}`;
            })
        );

        return NextResponse.json({ urls });
    } catch (e: any) {
        console.error('Upload Error:', e);
        return NextResponse.json({ error: 'Failed to upload' }, { status: 500 });
    }
}
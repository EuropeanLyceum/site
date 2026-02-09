import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        // Отримуємо режим із Query параметрів (temp за замовчуванням)
        const { searchParams } = new URL(req.url);
        const mode = searchParams.get('mode') === 'permanent' ? 'permanent' : 'temp';

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        // Визначаємо папку залежно від режиму
        const relativePath = mode === 'permanent'
            ? '/files/uploads'
            : '/files/uploads/temp';

        const uploadDir = join(process.cwd(), 'public', relativePath);

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {}

        const resultData = await Promise.all(
            files.map(async (file) => {
                const uniqueId = uuidv4();
                const originalExtension = extname(file.name).toLowerCase();
                const isImage = file.type.startsWith('image/');

                const fileName = isImage ? `${uniqueId}.webp` : `${uniqueId}${originalExtension}`;
                const filePath = join(uploadDir, fileName);

                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                let processedBuffer: Buffer<ArrayBufferLike> = buffer;

                if (isImage) {
                    processedBuffer = await sharp(buffer)
                        .rotate()
                        .resize({ width: 1920, withoutEnlargement: true })
                        .webp({ quality: 80 })
                        .toBuffer();
                }

                await writeFile(filePath, processedBuffer);

                // Повертаємо шлях для фронтенду
                // Важливо: в URL ми використовуємо аліас, який налаштуємо в Nginx (media)
                // Але фізично файли лежать там де треба.
                const publicUrl = `/admin/api/media${mode === 'temp' ? '/temp' : ''}/${fileName}`;

                return {
                    url: publicUrl,
                    originalName: file.name,
                    mimetype: file.type,
                    size: `${(file.size / 1024).toFixed(1)} KB`
                };
            })
        );

        // Повертаємо структуру, сумісну з твоїм клієнтом
        return NextResponse.json({
            urls: resultData.map(f => f.url),
            files: resultData // Метадані для документів
        });

    } catch (e: any) {
        console.error('Upload Error:', e);
        return NextResponse.json({ error: 'Failed to upload' }, { status: 500 });
    }
}
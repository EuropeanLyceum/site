// app/api/media/[filename]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
    req: NextRequest,
    { params }: { params: { filename: string } }
) {
    const { filename } = params;

    // ВАЖЛИВО: Шлях має збігатися з тим, куди пише POST-роут
    const filePath = join(process.cwd(), 'public/files/uploads', filename);

    if (!existsSync(filePath)) {
        return new NextResponse('Image Not Found', { status: 404 });
    }

    try {
        const fileBuffer = await readFile(filePath);

        // Визначаємо Content-Type на основі розширення
        const ext = filename.split('.').pop()?.toLowerCase();
        const mimeTypes: Record<string, string> = {
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            webp: 'image/webp',
            svg: 'image/svg+xml',
            gif: 'image/gif'
        };

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': mimeTypes[ext || ''] || 'application/octet-stream',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (e) {
        return new NextResponse('Error reading file', { status: 500 });
    }
}
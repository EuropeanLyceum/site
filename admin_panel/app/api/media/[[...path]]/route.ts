import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
    req: NextRequest,
    { params }: { params: { path?: string[] } } // Змінюємо на масив
) {
    const segments = (await params).path || [];

    // segments буде або ['file.webp'], або ['temp', 'file.webp']
    const filePath = join(process.cwd(), 'public/files/uploads', ...segments);

    if (!existsSync(filePath)) {
        return new NextResponse('File Not Found', { status: 404 });
    }

    try {
        const fileBuffer = await readFile(filePath);
        const filename = segments[segments.length - 1];
        const ext = filename.split('.').pop()?.toLowerCase();

        const mimeTypes: Record<string, string> = {
            webp: 'image/webp',
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            pdf: 'application/pdf',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        // 1. Prepare upload directory
        const relativeUploadDir = '/files/uploads';
        const uploadDir = join(process.cwd(), 'public', relativeUploadDir);

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Directory already exists
        }

        const urls = await Promise.all(
            files.map(async (file) => {
                // 2. Generate unique filename to prevent overwrites
                const uniqueId = uuidv4();
                const extension = file.name.split('.').pop();
                const fileName = `${uniqueId}.${extension}`;

                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // 3. Save to public/uploads
                const path = join(uploadDir, fileName);
                await writeFile(path, buffer);

                // 4. Return the public URL
                return `/admin/api/media/${fileName}`;
            })
        );

        return NextResponse.json({ urls });
    } catch (e: any) {
        console.error('Upload Error:', e);
        return NextResponse.json({ error: 'Failed to upload' }, { status: 500 });
    }
}
import { rename, access } from 'fs/promises';
import { join, basename } from 'path';

export async function persistTempFiles(data: any): Promise<any> {
    // Швидка перевірка: якщо немає рядка "temp" у JSON, не витрачаємо ресурси
    const jsonStr = JSON.stringify(data);
    if (!jsonStr.includes('/media/temp/')) return data;

    const tempDir = join(process.cwd(), 'public/files/uploads/temp');
    const targetDir = join(process.cwd(), 'public/files/uploads');

    // Рекурсивна функція для обходу будь-якого об'єкта
    const traverseAndMove = async (item: any): Promise<any> => {
        if (typeof item === 'string') {
            // Перевіряємо, чи це посилання на temp файл
            if (item.includes('/media/temp/')) {
                const fileName = basename(item); // витягуємо uuid.webp
                const oldPath = join(tempDir, fileName);
                const newPath = join(targetDir, fileName);

                try {
                    await access(oldPath); // Перевіряємо чи файл існує
                    await rename(oldPath, newPath); // Переміщуємо
                    // Повертаємо новий "чистий" URL
                    return `/admin/api/media/${fileName}`;
                } catch (e) {
                    // Файл вже переміщено або не знайдено, лишаємо як є або null
                    console.warn(`File not found in temp: ${oldPath}`);
                    return item.replace('/temp/', '/'); // Спробуємо виправити шлях
                }
            }
            return item;
        }

        if (Array.isArray(item)) {
            return Promise.all(item.map(i => traverseAndMove(i)));
        }

        if (item !== null && typeof item === 'object') {
            const newItem: any = {};
            for (const key in item) {
                newItem[key] = await traverseAndMove(item[key]);
            }
            return newItem;
        }

        return item;
    };

    return await traverseAndMove(data);
}
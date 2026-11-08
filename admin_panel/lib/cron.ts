import cron from 'node-cron';
import fs from 'fs';
import path from 'path';

export function initCronJobs() {
    console.log('🕒 Cron Jobs ініціалізовано');

    // Запуск кожні 12 годин (о 00:00 та 12:00)
    cron.schedule('0 0,12 * * *', () => {
        const tempDir = path.join(process.cwd(), 'public/files/uploads/temp');
        console.log(`🧹 Початок очищення temp папки: ${tempDir}`);

        if (!fs.existsSync(tempDir)) return;

        fs.readdir(tempDir, (err, files) => {
            if (err) return console.error(err);

            const now = Date.now();
            const MAX_AGE = 12 * 60 * 60 * 1000; // 12 годин

            files.forEach(file => {
                const filePath = path.join(tempDir, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) return;

                    // Видаляємо, якщо файл старіший за 12 годин
                    if (now - stats.mtimeMs > MAX_AGE) {
                        fs.unlink(filePath, () => console.log(`🗑️ Видалено сміття: ${file}`));
                    }
                });
            });
        });
    });
}
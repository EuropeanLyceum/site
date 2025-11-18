/*
  Warnings:

  - You are about to drop the column `category` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `fullname` on the `Staff` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Спочатку створюємо тимчасову таблицю з усіма даними
CREATE TABLE "temp_Staff" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullname" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrl" TEXT,
    "category" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Копіюємо дані з оригінальної таблиці
INSERT INTO "temp_Staff" SELECT * FROM "Staff";

-- Видаляємо оригінальну таблицю
DROP TABLE "Staff";

-- Створюємо нову таблицю з правильною структурою
CREATE TABLE "new_Staff" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrl" TEXT,
    "categoryId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Staff_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "StaffCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Копіюємо дані з тимчасової таблиці, встановлюючи categoryId = 1 (перша категорія)
INSERT INTO "new_Staff" ("id", "fullName", "position", "description", "photoUrl", "categoryId", "order", "createdAt", "updatedAt") 
SELECT "id", "fullname", "position", "description", "photoUrl", 1, "order", "createdAt", "updatedAt" FROM "temp_Staff";

-- Видаляємо тимчасову таблицю
DROP TABLE "temp_Staff";

-- Перейменовуємо нову таблицю
ALTER TABLE "new_Staff" RENAME TO "Staff";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

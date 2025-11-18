/*
  Warnings:

  - You are about to drop the column `order` on the `AntiBullying` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BusinessCard" ADD COLUMN "contentEn" TEXT;
ALTER TABLE "BusinessCard" ADD COLUMN "titleEn" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AntiBullying" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "text" TEXT,
    "link" TEXT,
    "linkText" TEXT,
    "photoUrls" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AntiBullying" ("content", "createdAt", "id", "link", "title", "updatedAt") SELECT "content", "createdAt", "id", "link", "title", "updatedAt" FROM "AntiBullying";
DROP TABLE "AntiBullying";
ALTER TABLE "new_AntiBullying" RENAME TO "AntiBullying";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

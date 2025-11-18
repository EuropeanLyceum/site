/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `BusinessCard` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BusinessCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "photoUrls" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_BusinessCard" ("content", "createdAt", "id", "title", "updatedAt") SELECT "content", "createdAt", "id", "title", "updatedAt" FROM "BusinessCard";
DROP TABLE "BusinessCard";
ALTER TABLE "new_BusinessCard" RENAME TO "BusinessCard";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

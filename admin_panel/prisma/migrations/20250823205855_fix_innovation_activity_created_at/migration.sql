/*
  Warnings:

  - Added the required column `updatedAt` to the `InnovationActivity` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InnovationActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "photoUrls" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_InnovationActivity" ("content", "createdAt", "id", "photoUrls", "title") SELECT "content", "createdAt", "id", "photoUrls", "title" FROM "InnovationActivity";
DROP TABLE "InnovationActivity";
ALTER TABLE "new_InnovationActivity" RENAME TO "InnovationActivity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

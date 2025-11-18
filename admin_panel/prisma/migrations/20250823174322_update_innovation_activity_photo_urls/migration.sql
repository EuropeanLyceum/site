/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `InnovationActivity` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InnovationActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "photoUrls" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_InnovationActivity" ("content", "createdAt", "id", "title", "updatedAt") SELECT "content", "createdAt", "id", "title", "updatedAt" FROM "InnovationActivity";
DROP TABLE "InnovationActivity";
ALTER TABLE "new_InnovationActivity" RENAME TO "InnovationActivity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

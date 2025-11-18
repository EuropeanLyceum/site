/*
  Warnings:

  - You are about to drop the column `url` on the `AntiBullying` table. All the data in the column will be lost.
  - Made the column `content` on table `AntiBullying` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `AntiBullying` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AntiBullying" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "link" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AntiBullying" ("content", "createdAt", "id", "title", "updatedAt") SELECT "content", "createdAt", "id", "title", "updatedAt" FROM "AntiBullying";
DROP TABLE "AntiBullying";
ALTER TABLE "new_AntiBullying" RENAME TO "AntiBullying";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

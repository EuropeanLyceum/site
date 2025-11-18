/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `ForParents` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `ForParents` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ForParents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heading" TEXT,
    "content" TEXT,
    "url" TEXT,
    "photoUrls" TEXT NOT NULL DEFAULT '[]',
    "publicationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ForParents" ("content", "createdAt", "id", "updatedAt") SELECT "content", "createdAt", "id", "updatedAt" FROM "ForParents";
DROP TABLE "ForParents";
ALTER TABLE "new_ForParents" RENAME TO "ForParents";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `SchoolHistory` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SchoolHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "photoUrls" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SchoolHistory" ("content", "createdAt", "id", "title", "updatedAt") SELECT "content", "createdAt", "id", "title", "updatedAt" FROM "SchoolHistory";
DROP TABLE "SchoolHistory";
ALTER TABLE "new_SchoolHistory" RENAME TO "SchoolHistory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - You are about to drop the column `content` on the `MethodologicalEvents` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `MethodologicalEvents` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `MethodologicalEvents` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `MethodologicalEvents` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `MethodologicalEvents` table. All the data in the column will be lost.
  - Added the required column `description` to the `MethodologicalEvents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heading` to the `MethodologicalEvents` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MethodologicalEvents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrls" TEXT NOT NULL DEFAULT '[]',
    "publicationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_MethodologicalEvents" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "MethodologicalEvents";
DROP TABLE "MethodologicalEvents";
ALTER TABLE "new_MethodologicalEvents" RENAME TO "MethodologicalEvents";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

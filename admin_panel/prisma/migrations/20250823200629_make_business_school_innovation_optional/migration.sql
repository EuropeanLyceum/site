/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `InnovationActivity` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BusinessCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "photoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_BusinessCard" ("content", "createdAt", "id", "photoUrl", "title", "updatedAt") SELECT "content", "createdAt", "id", "photoUrl", "title", "updatedAt" FROM "BusinessCard";
DROP TABLE "BusinessCard";
ALTER TABLE "new_BusinessCard" RENAME TO "BusinessCard";
CREATE TABLE "new_InnovationActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "photoUrls" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL
);
INSERT INTO "new_InnovationActivity" ("content", "createdAt", "id", "photoUrls", "title") SELECT "content", "createdAt", "id", "photoUrls", "title" FROM "InnovationActivity";
DROP TABLE "InnovationActivity";
ALTER TABLE "new_InnovationActivity" RENAME TO "InnovationActivity";
CREATE TABLE "new_SchoolHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "photoUrls" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SchoolHistory" ("content", "createdAt", "id", "photoUrls", "title", "updatedAt") SELECT "content", "createdAt", "id", "photoUrls", "title", "updatedAt" FROM "SchoolHistory";
DROP TABLE "SchoolHistory";
ALTER TABLE "new_SchoolHistory" RENAME TO "SchoolHistory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

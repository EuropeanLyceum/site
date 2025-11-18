/*
  Warnings:

  - You are about to drop the column `accordionContent` on the `QualificationImprovement` table. All the data in the column will be lost.
  - You are about to drop the column `accordionTitle` on the `QualificationImprovement` table. All the data in the column will be lost.
  - You are about to drop the column `plainText` on the `QualificationImprovement` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `QualificationImprovement` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QualificationImprovement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "text" TEXT,
    "link" TEXT,
    "linkText" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_QualificationImprovement" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "QualificationImprovement";
DROP TABLE "QualificationImprovement";
ALTER TABLE "new_QualificationImprovement" RENAME TO "QualificationImprovement";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

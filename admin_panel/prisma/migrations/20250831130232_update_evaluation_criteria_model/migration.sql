/*
  Warnings:

  - You are about to drop the `EvaluationCriteriaClass` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `subject` on the `EvaluationCriteria` table. All the data in the column will be lost.
  - Added the required column `name` to the `EvaluationCriteria` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EvaluationCriteriaClass";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EvaluationCriteria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "color" TEXT NOT NULL DEFAULT '#FF6B6B',
    "hasSubItems" BOOLEAN NOT NULL DEFAULT false,
    "subItems" TEXT NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_EvaluationCriteria" ("createdAt", "id", "order", "updatedAt", "url") SELECT "createdAt", "id", "order", "updatedAt", "url" FROM "EvaluationCriteria";
DROP TABLE "EvaluationCriteria";
ALTER TABLE "new_EvaluationCriteria" RENAME TO "EvaluationCriteria";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

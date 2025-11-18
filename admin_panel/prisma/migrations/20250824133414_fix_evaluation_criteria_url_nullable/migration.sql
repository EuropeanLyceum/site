-- CreateTable
CREATE TABLE "EvaluationCriteriaClass" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "grade" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "criteriaId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EvaluationCriteriaClass_criteriaId_fkey" FOREIGN KEY ("criteriaId") REFERENCES "EvaluationCriteria" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EvaluationCriteria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subject" TEXT NOT NULL,
    "url" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_EvaluationCriteria" ("createdAt", "id", "order", "subject", "updatedAt", "url") SELECT "createdAt", "id", "order", "subject", "updatedAt", "url" FROM "EvaluationCriteria";
DROP TABLE "EvaluationCriteria";
ALTER TABLE "new_EvaluationCriteria" RENAME TO "EvaluationCriteria";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

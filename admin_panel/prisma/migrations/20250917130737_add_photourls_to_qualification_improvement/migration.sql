-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QualificationImprovement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "photoUrls" TEXT NOT NULL DEFAULT '[]',
    "text" TEXT,
    "link" TEXT,
    "linkText" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_QualificationImprovement" ("content", "createdAt", "id", "link", "linkText", "order", "text", "title", "updatedAt") SELECT "content", "createdAt", "id", "link", "linkText", "order", "text", "title", "updatedAt" FROM "QualificationImprovement";
DROP TABLE "QualificationImprovement";
ALTER TABLE "new_QualificationImprovement" RENAME TO "QualificationImprovement";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

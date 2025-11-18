-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FinancialReports" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "url" TEXT,
    "linkText" TEXT,
    "photoUrls" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_FinancialReports" ("content", "createdAt", "id", "title", "updatedAt", "url") SELECT "content", "createdAt", "id", "title", "updatedAt", "url" FROM "FinancialReports";
DROP TABLE "FinancialReports";
ALTER TABLE "new_FinancialReports" RENAME TO "FinancialReports";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

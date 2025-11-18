-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FinancialReports" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "url" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_FinancialReports" ("content", "createdAt", "id", "title", "updatedAt", "url") SELECT "content", "createdAt", "id", "title", "updatedAt", "url" FROM "FinancialReports";
DROP TABLE "FinancialReports";
ALTER TABLE "new_FinancialReports" RENAME TO "FinancialReports";
CREATE TABLE "new_PublicInformation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "url" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PublicInformation" ("content", "createdAt", "id", "title", "updatedAt", "url") SELECT "content", "createdAt", "id", "title", "updatedAt", "url" FROM "PublicInformation";
DROP TABLE "PublicInformation";
ALTER TABLE "new_PublicInformation" RENAME TO "PublicInformation";
CREATE TABLE "new_RegulatoryDocuments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT,
    "url" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_RegulatoryDocuments" ("content", "createdAt", "id", "title", "updatedAt", "url") SELECT "content", "createdAt", "id", "title", "updatedAt", "url" FROM "RegulatoryDocuments";
DROP TABLE "RegulatoryDocuments";
ALTER TABLE "new_RegulatoryDocuments" RENAME TO "RegulatoryDocuments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
